import { useEffect, useState } from 'react'

const mascotHero = '/assets/mascot-hero.png'
const mascotNeutral = '/assets/mascot-neutral.png'
const mascotThinking = '/assets/mascot-thinking.png'

const BOOK_DEMO_URL = 'https://meetings.hubspot.com/hivo-dam/product-tour'
const HIVO_URL = 'https://hivo.co/'

interface ResultsProps {
  score: number // 0..100
  onRestart: () => void
}

interface Band {
  color: string
  headline: string
  description: string[]
  mascot: string
}

function getBand(score: number): Band {
  if (score <= 30) {
    return {
      color: '#ff5867',
      headline: 'Oh dear...',
      description: [
        'Your assets are all over the place! How do you even function???',
        'Start by bringing all your assets into one secure, centralised location: this alone will make a huge difference. From there, organise files with clear tags and categories so they’re easy to search and retrieve. Establish simple processes for uploading, naming, and managing assets to avoid future chaos, and consider introducing a DAM platform to regain control and visibility across your content.',
        'Well done. The first step is being aware! Now you know where you stand, you can take action.',
      ],
      mascot: mascotThinking,
    }
  }
  if (score <= 70) {
    return {
      color: '#faaa49',
      headline: 'Not bad...',
      description: [
        "You're actually doing better than 50% of Australian businesses. There is still some work to be done to get you to 100%!",
        'A great next step is to centralise your assets into a single, accessible platform and establish clear naming conventions and folder structures. Introduce basic workflows for approvals and version control to reduce duplication and confusion. From there, look at improving collaboration across your team so everyone knows where to find and how to use the right assets at the right time.',
        'Well done. The first step is being aware! Now you know where you stand, you can take action.',
      ],
      mascot: mascotNeutral,
    }
  }
  return {
    color: '#46c98c',
    headline: "You're a DAM hero.",
    description: [
      "It sounds like you're already DAM-proficient!",
      'To stay ahead, focus on refining your workflows and unlocking advanced efficiencies. Consider implementing automation for repetitive tasks, using AI-powered search to surface insights faster, and regularly auditing your asset library to maintain quality and consistency. You could also explore deeper integrations with your existing tools to ensure your DAM system becomes the central hub of your content operations.',
      'Now you know where you stand, you can take action.',
    ],
    mascot: mascotHero,
  }
}

const LEGEND = [
  { range: '0-30', color: '#ff5867', bg: '#feeaec', label: 'Data is scattered' },
  { range: '31-70', color: '#faaa49', bg: '#fef2e4', label: 'Data is partially structured' },
  { range: '71-100', color: '#46c98c', bg: '#e9f6eb', label: 'Ready for organised intelligence' },
]

const RADIUS = 90
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function ScoreRing({ score, color }: { score: number; color: string }) {
  const [progress, setProgress] = useState(0)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const raf = requestAnimationFrame(() => setProgress(score))

    const duration = 1300
    const start = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(Math.round(eased * score))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      cancelAnimationFrame(frame)
    }
  }, [score])

  const offset = CIRCUMFERENCE * (1 - progress / 100)

  return (
    <div className="relative size-[150px] shrink-0 sm:size-[220px]">
      <svg viewBox="0 0 200 200" className="size-full -rotate-90">
        <circle cx="100" cy="100" r={RADIUS} fill="none" stroke="#eceef2" strokeWidth="12" />
        <circle
          cx="100"
          cy="100"
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.3s cubic-bezier(0.22, 1, 0.36, 1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[44px] font-medium leading-none text-[#161517] sm:text-[64px]">{display}</span>
        <span className="mt-1.5 h-px w-8 bg-[#161517]/30 sm:mt-2 sm:w-10" />
        <span className="mt-1 text-[13px] font-normal text-[#161517] sm:text-[16px]">/100</span>
      </div>
    </div>
  )
}

export default function Results({ score, onRestart }: ResultsProps) {
  const band = getBand(score)

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-b from-white via-[#eef1ff]/40 to-[#e6ebff]/60">
      {/* Mascot — identical box per breakpoint; shown on mobile and on xl (hidden in the mid range to avoid overlapping centred text) */}
      <img
        src={band.mascot}
        alt=""
        className="pointer-events-none absolute bottom-0 right-0 block h-[300px] w-[180px] object-cover object-right-bottom sm:hidden xl:block xl:h-[600px] xl:w-[440px]"
      />

      <div className="relative mx-auto flex w-full max-w-[900px] flex-col px-4 py-10 sm:items-center sm:py-14 xl:ml-auto xl:mr-[380px]">
        {/* Results card */}
        <div className="w-full max-w-[830px] animate-fade-in-up rounded-[20px] border-[12px] border-[#f8f8f8] bg-white p-5 shadow-[0px_20px_60px_rgba(4,39,255,0.08)] sm:border-[22px] sm:p-8">
          <div className="flex flex-col items-center gap-6 md:flex-row md:justify-center md:gap-12">
            <ScoreRing score={score} color={band.color} />

            <div className="w-full max-w-[360px]">
              <h3 className="mb-4 text-center text-[20px] font-semibold text-[#161517] sm:text-[26px] md:text-left">
                Your Results:
              </h3>
              <div className="flex flex-col gap-2 sm:gap-3">
                {LEGEND.map((row) => (
                  <div
                    key={row.range}
                    className="flex items-center gap-3 rounded-[7px] p-[5px] sm:gap-4 sm:rounded-[10px] sm:p-[7px]"
                    style={{ backgroundColor: row.bg }}
                  >
                    <span
                      className="flex h-[31px] w-[55px] shrink-0 items-center justify-center rounded-[7px] bg-white text-[12px] font-bold sm:h-[43px] sm:w-[77px] sm:rounded-[10px] sm:text-[16px]"
                      style={{ color: row.color }}
                    >
                      {row.range}
                    </span>
                    <span className="text-[12px] font-medium text-[#161517]/80 sm:text-[16px]">{row.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Headline + description + actions — left-aligned on mobile, centred on larger screens */}
        <div className="flex w-full flex-col items-start text-left sm:items-center sm:text-center">
          <div className="mt-8 flex min-h-[56px] max-w-[calc(100%-180px)] items-end sm:h-[56px] sm:max-w-none sm:items-center sm:justify-center">
            <h2
              className="animate-fade-in-up text-[22px] font-bold leading-[1.1] text-[#161517] sm:text-[44px] sm:leading-none"
              style={{ animationDelay: '0.15s', animationFillMode: 'backwards' }}
            >
              {band.headline}
            </h2>
          </div>

          <div
            className="mt-4 flex max-w-[calc(100%-180px)] animate-fade-in-up flex-col justify-start space-y-3 text-[15px] font-normal leading-[1.45] text-[#161517] sm:mt-5 sm:max-w-[655px] sm:justify-center sm:space-y-4 sm:text-[16px] sm:leading-[1.5]"
            style={{ animationDelay: '0.25s', animationFillMode: 'backwards' }}
          >
            {band.description.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>

          <div
            className="mt-6 flex max-w-[calc(100%-180px)] animate-fade-in-up flex-col items-start gap-3 sm:mt-8 sm:max-w-none sm:items-center"
            style={{ animationDelay: '0.35s', animationFillMode: 'backwards' }}
          >
            <a
              href={BOOK_DEMO_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-[53px] bg-[#2846ff] px-[40px] py-3 text-[14px] font-bold tracking-[0.56px] text-white shadow-[0px_10px_30px_rgba(40,70,255,0.35)] transition-transform hover:scale-105 sm:px-[50px] sm:py-4 sm:text-[18px] sm:tracking-[0.72px]"
            >
              Book A Demo
            </a>
            <a
              href={HIVO_URL}
              target="_blank"
              rel="noreferrer"
              className="text-[14px] font-semibold text-[#2846ff] underline-offset-2 transition-colors hover:underline"
            >
              Visit hivo.co
            </a>
            <button
              onClick={onRestart}
              className="text-[13px] font-medium text-[#6a7282] transition-colors hover:text-[#161517]"
            >
              Take the quiz again
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
