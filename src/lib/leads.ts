import { isHubSpotConfigured, submitQuizLead, type QuizLead } from './hubspot'
import { isSupabaseConfigured, saveQuizLeadBackup } from './supabase'

export type { QuizLead }

/** True when at least one lead destination is configured. */
export function isLeadCaptureConfigured(): boolean {
  return isHubSpotConfigured() || isSupabaseConfigured()
}

/**
 * Persist the quiz lead:
 * 1. HubSpot (if configured)
 * 2. Supabase backup (if configured) — always attempted after HubSpot so we
 *    keep a durable copy even when HubSpot succeeds or fails.
 *
 * Blocks the user only when every configured destination fails.
 */
export async function captureQuizLead(lead: QuizLead): Promise<void> {
  const hubspotEnabled = isHubSpotConfigured()
  const supabaseEnabled = isSupabaseConfigured()

  if (!hubspotEnabled && !supabaseEnabled) {
    return
  }

  let hubspotOk: boolean | null = null
  let hubspotError: unknown = null
  let supabaseError: unknown = null

  if (hubspotEnabled) {
    try {
      await submitQuizLead(lead)
      hubspotOk = true
    } catch (err) {
      hubspotOk = false
      hubspotError = err
      console.error(err)
    }
  }

  if (supabaseEnabled) {
    try {
      await saveQuizLeadBackup(lead, { hubspotOk })
    } catch (err) {
      supabaseError = err
      console.error(err)
    }
  }

  const hubspotFailed = hubspotEnabled && hubspotOk === false
  const supabaseFailed = supabaseEnabled && Boolean(supabaseError)

  if (hubspotFailed && (!supabaseEnabled || supabaseFailed)) {
    throw hubspotError instanceof Error
      ? hubspotError
      : new Error('Lead capture failed')
  }

  if (!hubspotEnabled && supabaseFailed) {
    throw supabaseError instanceof Error
      ? supabaseError
      : new Error('Supabase backup failed')
  }
}
