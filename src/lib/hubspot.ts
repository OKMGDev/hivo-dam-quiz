// Lead capture via the HubSpot Forms API (v3 submit endpoint).
// Portal ID + Form GUID are NOT secrets — the submit endpoint is designed to be
// called from the browser, so they're safe to expose in the client bundle.
//
// Set these in a `.env` file locally and in the Vercel project settings:
//   VITE_HUBSPOT_PORTAL_ID=xxxxxxxx
//   VITE_HUBSPOT_FORM_GUID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
//
// Internal email notifications (e.g. dev@okmg.com) are configured on the HubSpot
// form itself: Form editor → Options → "Send form notification emails to" →
// add dev@okmg.com. HubSpot then emails that address on every submission.

const PORTAL_ID = import.meta.env.VITE_HUBSPOT_PORTAL_ID as string | undefined
const FORM_GUID = import.meta.env.VITE_HUBSPOT_FORM_GUID as string | undefined

export interface QuizLead {
  name: string
  email: string
  company: string
  score: number
  breakdown: string
}

export function isHubSpotConfigured(): boolean {
  return Boolean(PORTAL_ID && FORM_GUID)
}

export async function submitQuizLead({ name, email, company, score, breakdown }: QuizLead): Promise<void> {
  if (!PORTAL_ID || !FORM_GUID) {
    throw new Error(
      'HubSpot is not configured. Set VITE_HUBSPOT_PORTAL_ID and VITE_HUBSPOT_FORM_GUID.',
    )
  }

  const url = `https://api.hsforms.com/submissions/v3/integration/submit/${PORTAL_ID}/${FORM_GUID}`

  const fields = [
    { name: 'email', value: email },
    { name: 'firstname', value: name },
    { name: 'dam_maturity_score', value: String(score) },
    { name: 'dam_maturity_breakdown', value: breakdown },
  ]

  if (company) {
    fields.push({ name: 'company', value: company })
  }

  const body = {
    fields,
    context: {
      pageUri: window.location.href,
      pageName: document.title,
    },
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`HubSpot submission failed (${res.status}): ${detail}`)
  }
}
