import type { Question } from '../questions'
import RatingScale from './RatingScale'
import { ArrowLeftIcon } from './icons'

const restartIcon = '/assets/restart-icon.svg'

interface QuestionScreenProps {
  question: Question
  index: number
  value?: number
  onSelect: (value: number) => void
  onBack: () => void
  onStartOver: () => void
}

export default function QuestionScreen({
  question,
  index,
  value,
  onSelect,
  onBack,
  onStartOver,
}: QuestionScreenProps) {
  return (
    <div key={index} className="mx-auto flex w-full max-w-[768px] flex-col items-center px-4 py-8 text-center">
      <span className="rounded-full bg-[rgba(4,39,255,0.1)] px-4 py-2 text-[14px] font-bold text-[#0427ff]">
        {question.category}
      </span>

      <h1 className="mt-4 max-w-[330px] px-4 text-[24px] font-semibold leading-[30px] text-[#101828] animate-fade-in-up sm:max-w-[736px] sm:text-[36px] sm:leading-[45px]">
        {question.text}
      </h1>

      <p className="mt-4 text-[14px] font-normal text-[#6a7282]">
        Rate from 1 (Not at all) to 10 (Completely)
      </p>

      <div className="mt-8 w-full">
        <RatingScale value={value} onSelect={onSelect} />
      </div>

      <div className="mt-8 flex items-center justify-center gap-6">
        {index > 0 && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-2 text-[16px] font-medium text-[#4a5565] transition-colors hover:text-[#101828]"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back
          </button>
        )}
        <button
          onClick={onStartOver}
          className="flex items-center gap-2 px-6 py-2 text-[16px] font-medium text-[#4a5565] transition-colors hover:text-[#101828]"
        >
          <img src={restartIcon} alt="" className="size-4" />
          Start Over
        </button>
      </div>
    </div>
  )
}
