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

  // #region agent log
  fetch('http://127.0.0.1:7895/ingest/d549c8b4-3ba7-4925-8533-a30ca1f5f0b5',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'210e23'},body:JSON.stringify({sessionId:'210e23',runId:'repro-1',hypothesisId:'B,D',location:'src/lib/hubspot.ts:56',message:'HubSpot submit: about to fetch',data:{origin:window.location.origin,portalIdLen:(PORTAL_ID||'').length,formGuidLen:(FORM_GUID||'').length,fieldCount:fields.length,bodyBytes:JSON.stringify(body).length,online:navigator.onLine},timestamp:Date.now()})}).catch(()=>{});
  // #endregion

  let res: Response
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch (networkErr) {
    // #region agent log
    fetch('http://127.0.0.1:7895/ingest/d549c8b4-3ba7-4925-8533-a30ca1f5f0b5',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'210e23'},body:JSON.stringify({sessionId:'210e23',runId:'repro-1',hypothesisId:'A',location:'src/lib/hubspot.ts:62',message:'HubSpot fetch THREW (no response received)',data:{errName:(networkErr as Error)?.name,errMsg:String((networkErr as Error)?.message).slice(0,200),online:navigator.onLine},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    throw networkErr
  }

  // #region agent log
  fetch('http://127.0.0.1:7895/ingest/d549c8b4-3ba7-4925-8533-a30ca1f5f0b5',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'210e23'},body:JSON.stringify({sessionId:'210e23',runId:'repro-1',hypothesisId:'B,F',location:'src/lib/hubspot.ts:70',message:'HubSpot response received',data:{status:res.status,ok:res.ok},timestamp:Date.now()})}).catch(()=>{});
  // #endregion

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    // #region agent log
    fetch('http://127.0.0.1:7895/ingest/d549c8b4-3ba7-4925-8533-a30ca1f5f0b5',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'210e23'},body:JSON.stringify({sessionId:'210e23',runId:'repro-1',hypothesisId:'B',location:'src/lib/hubspot.ts:76',message:'HubSpot non-OK response body',data:{status:res.status,detail:detail.slice(0,300)},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    throw new Error(`HubSpot submission failed (${res.status}): ${detail}`)
  }
}
