import { Check } from 'lucide-react'
import { StepHeader, StepFooter } from '../components'

const CHECKLIST_ITEMS = [
  'Essência do seu império',
  'Seu diferencial imbatível',
  'A voz da sua IA',
  'Ativação do WhatsApp',
  'Seu nível de controle',
  'Momento da verdade',
  'Ignição final',
]

interface WelcomeStepProps {
  currentStep: number
  totalSteps: number
  onNext: () => void
}

export function WelcomeStep({ currentStep, totalSteps, onNext }: WelcomeStepProps) {
  return (
    <div className="flex w-full max-w-[426px] flex-col items-center gap-[41px]">
      <StepHeader
        title="Configure seu AuZap"
        subtitle="Em 12 minutos, você terá uma IA trabalhando para você 24h/7"
      />

      <div className="flex w-full flex-col gap-2">
        {CHECKLIST_ITEMS.map((item) => (
          <div key={item} className="flex items-center gap-[13px]">
            <div className="flex h-[18px] w-[18px] shrink-0 items-center justify-center">
              <Check className="h-[14px] w-[14px] text-[#1E62EC]" strokeWidth={2.5} />
            </div>
            <span className="font-sans text-sm leading-6 text-[#727B8E]">{item}</span>
          </div>
        ))}
      </div>

      <p className="text-center font-sans text-sm text-[#727B8E]">
        Cada resposta sua molda uma IA única para seu negócio
      </p>

      <StepFooter
        currentStep={currentStep}
        totalSteps={totalSteps}
        nextHint=""
        buttonLabel="Iniciar"
        onNext={onNext}
      />
    </div>
  )
}
