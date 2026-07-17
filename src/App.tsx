import { useState } from 'react'
import Header from './components/Header'
import StartScreen from './components/StartScreen'
import QuestionScreen from './components/QuestionScreen'
import ContactForm, { type ContactDetails } from './components/ContactForm'
import Results from './components/Results'
import { questions } from './questions'

type Stage = 'start' | 'quiz' | 'form' | 'results'

export default function App() {
  const [stage, setStage] = useState<Stage>('start')
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [, setContact] = useState<ContactDetails>({ name: '', email: '' })

  const total = questions.length

  function resetAll() {
    setStage('start')
    setCurrent(0)
    setAnswers({})
    setContact({ name: '', email: '' })
  }

  function startQuiz() {
    setCurrent(0)
    setAnswers({})
    setStage('quiz')
  }

  function handleSelect(value: number) {
    setAnswers((prev) => ({ ...prev, [current]: value }))
    // Auto-advance after a short beat so the selection animation is visible.
    window.setTimeout(() => {
      if (current < total - 1) {
        setCurrent((c) => c + 1)
      } else {
        setStage('form')
      }
    }, 260)
  }

  function handleBack() {
    if (current > 0) setCurrent((c) => c - 1)
  }

  function handleSubmit(details: ContactDetails) {
    setContact(details)
    setStage('results')
  }

  // Score: sum of all 1–10 answers across 10 questions → 0–100 scale.
  const score = Object.values(answers).reduce((sum, v) => sum + v, 0)

  const progress = stage === 'quiz' ? (current + 1) / total : 1

  const step = stage === 'quiz' ? `${current + 1} of ${total}` : undefined

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header
        variant={stage === 'quiz' ? 'quiz' : 'minimal'}
        progress={progress}
        step={step}
        onBookNow={() => setStage('form')}
      />

      <main className="flex flex-1 flex-col">
        {stage === 'start' && <StartScreen total={total} onStart={startQuiz} />}

        {stage === 'quiz' && (
          <div className="flex flex-1 items-center justify-center">
            <QuestionScreen
              question={questions[current]}
              index={current}
              value={answers[current]}
              onSelect={handleSelect}
              onBack={handleBack}
              onStartOver={resetAll}
            />
          </div>
        )}

        {stage === 'form' && (
          <div className="flex flex-1 items-center justify-center">
            <ContactForm onSubmit={handleSubmit} onBackToQuiz={() => setStage('quiz')} />
          </div>
        )}

        {stage === 'results' && <Results score={score} onRestart={resetAll} />}
      </main>

      {(stage === 'start' || stage === 'quiz') && (
        <footer className="border-t border-[#f3f4f6] px-4 pb-6 pt-[25px] text-center">
          <p className="text-[14px] font-normal text-[#6a7282]">
            Powered by hivo.co - AI-enabled data intelligence
          </p>
        </footer>
      )}
    </div>
  )
}
