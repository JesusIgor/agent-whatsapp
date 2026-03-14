import { Button } from '@/components/atoms/Button'
import { ProgressBar } from './ProgressBar'

interface StepFooterProps {
  currentStep: number
  totalSteps: number
  nextHint: string
  buttonLabel?: string
  loading?: boolean
  onNext: () => void
}

export function StepFooter({
  currentStep,
  totalSteps,
  nextHint,
  buttonLabel = 'Continuar',
  loading,
  onNext,
}: StepFooterProps) {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <p className="text-center font-be-vietnam-pro text-sm text-[#727B8E] dark:text-[#8a94a6]">
        {nextHint}
      </p>
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      <Button
        type="button"
        className="w-full font-be-vietnam-pro text-base font-bold"
        loading={loading}
        onClick={onNext}
      >
        {buttonLabel}
      </Button>
    </div>
  )
}
