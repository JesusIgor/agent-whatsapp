import { useState } from 'react'
import { StepHeader, StepFooter, ServiceCheckbox, AddServiceForm } from '../components'

export interface CustomService {
  name: string
  price: string
}

export interface ServiceStepData {
  selected: string[]
  custom: CustomService[]
}

interface ServiceStepProps {
  title: string
  subtitle: string
  sectionLabel: string
  services: string[]
  currentStep: number
  totalSteps: number
  nextHint: string
  namePlaceholder?: string
  pricePlaceholder?: string
  data: ServiceStepData
  onNext: (data: ServiceStepData) => void
}

export function ServiceStep({
  title,
  subtitle,
  sectionLabel,
  services,
  currentStep,
  totalSteps,
  nextHint,
  namePlaceholder,
  pricePlaceholder,
  data,
  onNext,
}: ServiceStepProps) {
  const [selected, setSelected] = useState<string[]>(data.selected)
  const [custom, setCustom] = useState<CustomService[]>(data.custom)

  const selectItem = (item: string) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    )
  }

  const addCustomService = (service: CustomService) => {
    setCustom((prev) => [...prev, service])
  }

  return (
    <div className="flex w-full max-w-[426px] flex-col items-center gap-[41px]">
      <StepHeader title={title} subtitle={subtitle} />

      <div className="flex w-full flex-col gap-4">
        <p className="font-be-vietnam-pro text-sm font-semibold text-[#434A57]">
          {sectionLabel}
        </p>

        <div className="grid grid-cols-2 gap-2">
          {services.map((item) => (
            <ServiceCheckbox
              key={item}
              label={item}
              checked={selected.includes(item)}
              onChange={() => selectItem(item)}
            />
          ))}
        </div>

        {custom.length > 0 && (
          <div className="flex flex-col gap-2">
            {custom.map((s, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-[4px] border border-[#1E62EC]/30 bg-[#1E62EC]/5 px-4 py-3"
              >
                <span className="font-be-vietnam-pro text-sm text-[#434A57]">{s.name}</span>
                {s.price && (
                  <span className="font-be-vietnam-pro text-sm text-[#727B8E]">{s.price}</span>
                )}
              </div>
            ))}
          </div>
        )}

        <AddServiceForm
          namePlaceholder={namePlaceholder}
          pricePlaceholder={pricePlaceholder}
          onAdd={addCustomService}
        />
      </div>

      <StepFooter
        currentStep={currentStep}
        totalSteps={totalSteps}
        nextHint={nextHint}
        onNext={() => onNext({ selected, custom })}
      />
    </div>
  )
}
