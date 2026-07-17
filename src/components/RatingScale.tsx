interface RatingScaleProps {
  value?: number
  onSelect: (value: number) => void
}

const RATINGS = Array.from({ length: 10 }, (_, i) => i + 1)

export default function RatingScale({ value, onSelect }: RatingScaleProps) {
  return (
    <div className="mx-auto w-full max-w-[672px]">
      <div className="flex items-center justify-between px-2 text-[12px] font-normal text-[#6a7282]">
        <span>Not at all</span>
        <span className="hidden min-[561px]:inline">Completely</span>
      </div>

      <div className="mt-3 grid grid-cols-5 gap-2 min-[561px]:grid-cols-10 min-[561px]:gap-3">
        {RATINGS.map((n) => {
          const selected = value === n
          return (
            <button
              key={n}
              type="button"
              onClick={() => onSelect(n)}
              aria-pressed={selected}
              className={[
                'flex aspect-square w-full items-center justify-center rounded-[10px] border text-[18px] font-bold transition-all duration-200 min-[561px]:border-2',
                selected
                  ? 'scale-110 border-[#0427ff] bg-[#0427ff] text-white shadow-[0px_11px_8.25px_rgba(0,0,0,0.1),0px_4.4px_3.3px_rgba(0,0,0,0.1)]'
                  : 'border-[#e5e7eb] bg-white text-[#364153] hover:border-[#0427ff] hover:text-[#0427ff]',
              ].join(' ')}
            >
              {n}
            </button>
          )
        })}
      </div>

      <div className="mt-3 px-2 text-right text-[12px] font-normal text-[#6a7282] min-[561px]:hidden">
        Completely
      </div>
    </div>
  )
}
