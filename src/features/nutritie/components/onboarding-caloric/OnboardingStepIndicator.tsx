interface OnboardingStepIndicatorProps {
  currentStep: number
  totalSteps: number
}

export function OnboardingStepIndicator({ currentStep, totalSteps }: OnboardingStepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
        <div
          key={s}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            s === currentStep ? 'w-6 bg-orange-500' : s < currentStep ? 'w-2 bg-orange-500/50' : 'w-2 bg-gray-700'
          }`}
        />
      ))}
    </div>
  )
}
