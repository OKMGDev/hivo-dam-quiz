import { useState, type FormEvent } from 'react'
import { questions } from '../questions'
import { isHubSpotConfigured, submitQuizLead } from '../lib/hubspot'

const hexOuter = '/assets/form-vector.svg'
const hexInner = '/assets/form-vector1.svg'

export interface ContactDetails {
  name: string
  email: string
}

interface ContactFormProps {
  onSubmit: (details: ContactDetails) => void
  onBackToQuiz: () => void
  score: number
  answers: Record<number, number>
}

function buildBreakdown(score: number, answers: Record<number, number>): string {
  const lines = questions.map((q, i) => `${q.category}: ${answers[i] ?? 0}/10`)
  return `Total maturity score: ${score}/100\n\n${lines.join('\n')}`
}

function HexBadge() {
  return (
    <div className="relative size-16">
      <div className="absolute inset-x-[4.76%] inset-y-0">
        <img src={hexOuter} alt="" className="block size-full" />
      </div>
      <div className="absolute inset-x-[27.38%] inset-y-1/4">
        <img src={hexInner} alt="" className="block size-full" />
      </div>
    </div>
  )
}

export default function ContactForm({ onSubmit, onBackToQuiz, score, answers }: ContactFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    const trimmedCompany = company.trim()
    if (!trimmedName || !trimmedEmail || !trimmedCompany || submitting) return

    // Send the lead to HubSpot before showing results. If HubSpot isn't
    // configured (e.g. local dev without env vars), skip straight to results.
    if (isHubSpotConfigured()) {
      setSubmitting(true)
      setError(null)
      try {
        await submitQuizLead({
          name: trimmedName,
          email: trimmedEmail,
          company: trimmedCompany,
          score,
          breakdown: buildBreakdown(score, answers),
        })
      } catch (err) {
        console.error(err)
        setSubmitting(false)
        setError('Something went wrong submitting your details. Please try again.')
        return
      }
    }

    onSubmit({ name: trimmedName, email: trimmedEmail })
  }

  return (
    <div className="mx-auto flex w-full max-w-[448px] flex-col items-center px-4 py-8">
      <HexBadge />

      <h2 className="mt-4 text-[30px] font-semibold leading-[36px] text-[#101828]">Almost There!</h2>

      <p className="mt-2 text-center text-[16px] font-normal leading-[24px] text-[#4a5565]">
        Enter your details to book your personalized demo
      </p>

      <form onSubmit={handleSubmit} className="mt-8 w-full">
        <div>
          <label htmlFor="name" className="mb-2 block text-[14px] font-medium text-[#364153]">
            Full Name *
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Smith"
            required
            className="h-[50px] w-full rounded-[10px] border border-[#d1d5dc] px-[17px] text-[16px] text-[#0a0a0a] outline-none transition-colors placeholder:text-[rgba(10,10,10,0.5)] focus:border-[#0427ff] focus:ring-2 focus:ring-brand/20"
          />
        </div>

        <div className="pt-5">
          <label htmlFor="email" className="mb-2 block text-[14px] font-medium text-[#364153]">
            Work Email *
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@company.com"
            required
            className="h-[50px] w-full rounded-[10px] border border-[#d1d5dc] px-[17px] text-[16px] text-[#0a0a0a] outline-none transition-colors placeholder:text-[rgba(10,10,10,0.5)] focus:border-[#0427ff] focus:ring-2 focus:ring-brand/20"
          />
        </div>

        <div className="py-5">
          <label htmlFor="company" className="mb-2 block text-[14px] font-medium text-[#364153]">
            Company *
          </label>
          <input
            id="company"
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Acme Inc."
            required
            className="h-[50px] w-full rounded-[10px] border border-[#d1d5dc] px-[17px] text-[16px] text-[#0a0a0a] outline-none transition-colors placeholder:text-[rgba(10,10,10,0.5)] focus:border-[#0427ff] focus:ring-2 focus:ring-brand/20"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="h-[60px] w-full rounded-[10px] bg-[#0427ff] text-[18px] font-semibold text-white shadow-[0px_10px_7.5px_rgba(0,0,0,0.1),0px_4px_3px_rgba(0,0,0,0.1)] transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? 'Submitting…' : 'Book My Demo'}
        </button>

        {error && <p className="mt-3 text-center text-[14px] font-medium text-[#e7000b]">{error}</p>}

        <button
          type="button"
          onClick={onBackToQuiz}
          className="mt-5 h-12 w-full text-[16px] font-medium text-[#4a5565] transition-colors hover:text-[#101828]"
        >
          ← Back to Quiz
        </button>

        <p className="mt-2 text-center text-[12px] font-normal leading-[16px] text-[#6a7282]">
          By submitting, you agree to our privacy policy
        </p>
      </form>
    </div>
  )
}
