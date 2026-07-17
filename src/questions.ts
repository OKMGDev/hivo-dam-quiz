export interface Question {
  category: string
  text: string
}

export const questions: Question[] = [
  {
    category: 'Findability',
    text: 'Can staff find approved assets, files or records in under 60 seconds without relying on folder hunting or asking another team member ?',
  },
  {
    category: 'Metadata quality',
    text: 'Are assets consistently tagged with useful metadata such as campaign, department, location, usage rights, expiry date, consent status and content type ?',
  },
  {
    category: 'Governance',
    text: 'Do you know which files have expired consent, restricted usage rights, outdated branding or compliance conditions attached ?',
  },
  {
    category: 'Retention & disposal',
    text: 'Can your team apply, review and evidence disposal and retention schedules for digital assets, images, videos and related records ?',
  },
  {
    category: 'Approval workflows',
    text: 'Are content approvals, review comments, version changes and final sign - offs tracked in a clear and auditable workflow ?',
  },
  {
    category: 'Access control',
    text: 'Can you control who can view, edit, approve, download, share or archive assets based on role, team, department or sensitivity ?',
  },
  {
    category: 'Audit readiness',
    text: 'Can you prove who accessed, downloaded, edited, approved, shared or deleted an asset if asked by compliance, legal or records teams ?',
  },
  {
    category: 'AI readiness',
    text: 'Is your asset data structured enough for AI search, automated tagging, summarisation, RAG workflows or command - line style querying ?',
  },
  {
    category: 'Workflow automation',
    text: 'Can repetitive tasks such as tagging, resizing, approvals, consent checks, review reminders and retention reviews be automated ?',
  },
  {
    category: 'Single source of truth',
    text: 'Does your organisation have one trusted source for approved, current and compliant assets, rather than scattered files across SharePoint, drives, inboxes and desktops ?',
  },
]
