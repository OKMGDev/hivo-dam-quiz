import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { QuizLead } from './hubspot'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as
  | string
  | undefined

let client: SupabaseClient | null = null

function getClient(): SupabaseClient | null {
  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) return null
  if (!client) {
    client = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
  }
  return client
}

export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY)
}

export async function saveQuizLeadBackup(
  lead: QuizLead,
  options: { hubspotOk: boolean | null } = { hubspotOk: null },
): Promise<void> {
  const supabase = getClient()
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.',
    )
  }

  const { error } = await supabase.from('quiz_submissions').insert({
    name: lead.name,
    email: lead.email,
    company: lead.company,
    score: lead.score,
    breakdown: lead.breakdown,
    page_uri: typeof window !== 'undefined' ? window.location.href : null,
    page_name: typeof document !== 'undefined' ? document.title : null,
    hubspot_ok: options.hubspotOk,
    source: 'hivo-dam-quiz',
  })

  if (error) {
    throw new Error(`Supabase backup failed: ${error.message}`)
  }
}
