import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { StepHeader, StepFooter, ServiceCheckbox, AddServiceForm } from '../components'
import type { CustomService, ServiceStepData } from './ServiceStep'

const SERVICES = ['Treinamentos', 'Adestramento']

interface MiscServicesData extends ServiceStepData {
  personalizados: string
}

interface MiscServicesStepProps {
  currentStep: number
  totalSteps: number
  data: MiscServicesData
  onNext: (data: MiscServicesData) => void
}

export function MiscServicesStep({ currentStep, totalSteps, data, onNext }: MiscServicesStepProps) {
  const [selected, setSelected] = useState<string[]>(data.selected)
  const [custom, setCustom] = useState<CustomService[]>(data.custom)

  const { register, handleSubmit, formState: { errors } } = useForm<{ personalizados: string }>({
    defaultValues: { personalizados: data.personalizados },
  })

  const selectItem = (item: string) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [item]
    )
  }

  const handleNext = (formData: { personalizados: string }) => {
    onNext({ selected, custom, personalizados: formData.personalizados })
  }

  return (
    <div className="flex w-full max-w-[426px] flex-col items-center gap-[41px]">
      <StepHeader
        title="Serviços diversos"
        subtitle="Se não oferecer, pode pular esta etapa e ir para a próxima!"
      />

      <div className="flex w-full flex-col gap-4">
        <p className="font-be-vietnam-pro text-sm font-semibold text-[#434A57]">Diversos</p>

        <div className="grid grid-cols-2 gap-2">
          {SERVICES.map((item) => (
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
          namePlaceholder="ex: Adestramento avançado"
          pricePlaceholder="ex: R$ 200,00/mês"
          onAdd={(s) => setCustom((prev) => [...prev, s])}
        />

        <div className="flex w-full flex-col gap-3">
          <label
            htmlFor="personalizados"
            className="font-be-vietnam-pro text-base font-semibold leading-[23px] text-[#434A57]"
          >
            Quais são seus serviços personalizados?<span className="text-[#1E62EC]">*</span>
          </label>
          <textarea
            id="personalizados"
            placeholder="ex: 'TaxiDog – R$30,00 Hora', 'Banho Terapêutico', 'Consulta Holística' etc."
            className="flex min-h-[80px] w-full rounded-[4px] border border-[#727B8E]/10 bg-[#FAFAFA] px-[19px] py-[13px] font-be-vietnam-pro text-sm text-[#434A57] placeholder:text-[#727B8E]/50 outline-none transition-colors focus:border-[#1E62EC] focus:ring-1 focus:ring-[#1E62EC]/30 resize-none"
            {...register('personalizados', { required: 'Campo obrigatório' })}
          />
          {errors.personalizados?.message && (
            <p className="font-be-vietnam-pro text-xs text-red-500">{errors.personalizados.message}</p>
          )}
        </div>
      </div>

      <StepFooter
        currentStep={currentStep}
        totalSteps={totalSteps}
        nextHint="Na próxima etapa, iremos definir seus requisitos e produtos"
        onNext={handleSubmit(handleNext)}
      />
    </div>
  )
}
