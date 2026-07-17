const mascotHero = '/assets/mascot-hero.png'

interface StartScreenProps {
  total: number
  onStart: () => void
}

export default function StartScreen({ total, onStart }: StartScreenProps) {
  return (
    <div className="flex w-full flex-1 items-center justify-center bg-white">
      <div className="mx-auto flex w-full max-w-[620px] flex-col items-center px-6 py-8 text-center">
        <img
          src={mascotHero}
          alt="Vector, the HIVO mascot"
          className="h-[146px] w-auto animate-pop-in object-contain drop-shadow-[0px_18px_28px_rgba(4,39,255,0.16)] sm:h-[176px]"
        />

        <h1
          className="mt-6 max-w-[560px] animate-fade-in-up text-[30px] font-semibold leading-[1.08] text-[#101828] sm:text-[46px]"
          style={{ animationDelay: '0.05s', animationFillMode: 'backwards' }}
        >
          How mature is your data management?
        </h1>

        <p
          className="mt-4 max-w-[460px] animate-fade-in-up text-[15px] font-normal leading-[1.55] text-[#4a5565] sm:text-[17px]"
          style={{ animationDelay: '0.12s', animationFillMode: 'backwards' }}
        >
          Answer {total} quick questions to get your instant data maturity score.
        </p>

        <button
          onClick={onStart}
          className="group mt-8 flex animate-fade-in-up items-center gap-2 rounded-[53px] bg-[#0427ff] px-[46px] py-4 text-[16px] font-bold tracking-[0.4px] text-white shadow-[0px_14px_36px_rgba(4,39,255,0.4)] transition-transform hover:scale-105 sm:text-[18px]"
          style={{ animationDelay: '0.2s', animationFillMode: 'backwards' }}
        >
          Start the Quiz
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="transition-transform group-hover:translate-x-1">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}
