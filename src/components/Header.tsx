const hivoLogo = '/assets/hivo-logo.png'
const isoIcon = '/assets/iso-icon.svg'

interface HeaderProps {
  variant?: 'quiz' | 'minimal'
  progress?: number // 0..1 fraction complete
  step?: string // e.g. "1 of 10"
  onBookNow?: () => void
}

function IsoBadge() {
  return (
    <div className="hidden items-center gap-2 rounded-[10px] border border-[#e5e7eb] bg-[#f9fafb] px-[13px] py-[7px] sm:flex">
      <img src={isoIcon} alt="" className="size-6 shrink-0" />
      <span className="leading-tight">
        <span className="block text-[10px] font-bold leading-[10px] text-[#0427ff]">ISO 27001</span>
        <span className="mt-[2px] block text-[9px] font-normal leading-[9px] text-[#6a7282]">Certified</span>
      </span>
    </div>
  )
}

export default function Header({ variant = 'quiz', progress = 0, step, onBookNow }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 bg-white">
      <div className="border-b border-[#f3f4f6]">
        <div className="flex items-center justify-between px-4 pb-[17px] pt-4">
          <img src={hivoLogo} alt="HIVO" className="h-7 w-auto sm:h-9" />

          <div className="flex items-center gap-4">
            <IsoBadge />
            {variant === 'quiz' && (
              <>
                {step && <span className="hidden text-[14px] font-normal text-[#6a7282] sm:inline">{step}</span>}
                <button
                  onClick={onBookNow}
                  className="rounded-[10px] bg-[#0427ff] px-4 py-2 text-[14px] font-medium text-white shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.1)] transition-colors hover:bg-brand-dark sm:px-6 sm:py-[10px] sm:text-[16px]"
                >
                  Book Now
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {variant === 'quiz' && (
        <div className="h-1 w-full bg-[#f3f4f6]">
          <div
            className="h-full bg-[#0427ff] transition-all duration-500 ease-out"
            style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
          />
        </div>
      )}
    </header>
  )
}
