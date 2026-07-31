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

  // #region agent log
  fetch('http://127.0.0.1:7895/ingest/d549c8b4-3ba7-4925-8533-a30ca1f5f0b5',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'210e23'},body:JSON.stringify({sessionId:'210e23',runId:'repro-1',hypothesisId:'C,D,E',location:'src/lib/leads.ts:20',message:'captureQuizLead entry',data:{hubspotEnabled,supabaseEnabled,origin:window.location.origin,bundle:(document.querySelector('script[type=module]') as HTMLScriptElement|null)?.src?.split('/').pop()||'unknown',score:lead.score,breakdownLen:lead.breakdown.length},timestamp:Date.now()})}).catch(()=>{});
  // #endregion

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

  // #region agent log
  fetch('http://127.0.0.1:7895/ingest/d549c8b4-3ba7-4925-8533-a30ca1f5f0b5',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'210e23'},body:JSON.stringify({sessionId:'210e23',runId:'repro-1',hypothesisId:'C',location:'src/lib/leads.ts:54',message:'captureQuizLead outcome',data:{hubspotOk,hubspotFailed,supabaseFailed,hubspotErrMsg:hubspotError?String((hubspotError as Error).message).slice(0,200):null,supabaseErrMsg:supabaseError?String((supabaseError as Error).message).slice(0,200):null,willThrowToUser:(hubspotFailed&&(!supabaseEnabled||supabaseFailed))||(!hubspotEnabled&&supabaseFailed)},timestamp:Date.now()})}).catch(()=>{});
  // #endregion

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
