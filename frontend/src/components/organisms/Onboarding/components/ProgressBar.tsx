interface ProgressBarProps {
  currentStep: number
  totalSteps: number
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  return (
    <div className="flex w-full items-center gap-1">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div
          key={i}
          className={`h-[5px] flex-1 rounded-full transition-colors ${
            i < currentStep ? 'bg-[#1E62EC]' : 'bg-[#E8E8E8] dark:bg-[#40485A]'
          }`}
        />
      ))}
    </div>
  )
}
