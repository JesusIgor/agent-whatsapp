import { useState, useCallback, useEffect } from 'react'
import { useAuthBack } from '@/components/templates/AuthLayout'
import {
  WelcomeStep,
  BusinessInfoStep,
  AddressStep,
  DifferentialsStep,
  ServiceStep,
  MiscServicesStep,
  RequirementsStep,
} from './steps'
import type { ServiceStepData } from './steps'

const TOTAL_STEPS = 9

const EMPTY_SERVICE_DATA: ServiceStepData = { selected: [], custom: [] }

interface OnboardingState {
  business: {
    nomeEstabelecimento: string
    porqueEscolhem: string
    quemSaoClientes: string
    porteAnimais: string
  }
  address: {
    cep: string
    rua: string
    numero: string
    complemento: string
    bairro: string
    cidade: string
    uf: string
  }
  differentials: string[]
  estetica: ServiceStepData
  saude: ServiceStepData
  hospedagem: ServiceStepData
  diversos: ServiceStepData & { personalizados: string }
  requirements: {
    requisitos: string
    produtosServicos: string
    produtosVenda: string
  }
}

const INITIAL_STATE: OnboardingState = {
  business: { nomeEstabelecimento: '', porqueEscolhem: '', quemSaoClientes: '', porteAnimais: '' },
  address: { cep: '', rua: '', numero: '', complemento: '', bairro: '', cidade: '', uf: '' },
  differentials: [],
  estetica: EMPTY_SERVICE_DATA,
  saude: EMPTY_SERVICE_DATA,
  hospedagem: EMPTY_SERVICE_DATA,
  diversos: { ...EMPTY_SERVICE_DATA, personalizados: '' },
  requirements: { requisitos: '', produtosServicos: '', produtosVenda: '' },
}

export function OnboardingFlow() {
  const [step, setStep] = useState(0)
  const [data, setData] = useState<OnboardingState>(INITIAL_STATE)
  const { setOnBack } = useAuthBack()

  const prev = useCallback(() => setStep((s) => Math.max(s - 1, 0)), [])
  const next = useCallback(() => setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1)), [])

  useEffect(() => {
    if (step > 0) {
      setOnBack(() => prev())
    } else {
      setOnBack(null)
    }
    return () => setOnBack(null)
  }, [step, prev, setOnBack])

  const updateAndNext = useCallback(
    <K extends keyof OnboardingState>(key: K, value: OnboardingState[K]) => {
      setData((prev) => ({ ...prev, [key]: value }))
      next()
    },
    [next]
  )

  const handleComplete = useCallback(() => {}, [data])

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <WelcomeStep
          currentStep={1}
          totalSteps={TOTAL_STEPS}
          onNext={next}
        />
        )
      case 1:
      return (
        <BusinessInfoStep
          currentStep={2}
          totalSteps={TOTAL_STEPS}
          data={data.business}
          onNext={(d) => updateAndNext('business', d)}
        />
        )
      case 2:
      return (
        <AddressStep
          currentStep={3}
          totalSteps={TOTAL_STEPS}
          data={data.address}
          onNext={(d) => updateAndNext('address', d)}
        />
        )
      case 3:
      return (
        <DifferentialsStep
          currentStep={4}
          totalSteps={TOTAL_STEPS}
          data={data.differentials}
          onNext={(d) => updateAndNext('differentials', d)}
        />
        )
      case 4:
      return (
        <ServiceStep
          title="Serviços de estética"
          subtitle="Se não oferecer, pode pular esta etapa e ir para a próxima!"
          sectionLabel="Estética"
          services={['Banho', 'Tosa', 'Banho e Hidratação', 'Corte de unha', 'Limpeza de ouvido', 'Escovação dentária']}
          currentStep={5}
          totalSteps={TOTAL_STEPS}
          nextHint="Na próxima etapa, iremos definir seus serviços de saúde"
          namePlaceholder="ex: Banho terapêutico"
          pricePlaceholder="ex: R$ 80,00"
          data={data.estetica}
          onNext={(d) => updateAndNext('estetica', d)}
        />
        )
      case 5:
      return (
        <ServiceStep
          title="Serviços de saúde"
          subtitle="Se não oferecer, pode pular esta etapa e ir para a próxima!"
          sectionLabel="Saúde"
          services={['Consulta veterinária', 'Exames laboratoriais', 'Vermifugação', 'Internação', 'Cirurgias', 'Vacinação']}
          currentStep={6}
          totalSteps={TOTAL_STEPS}
          nextHint="Na próxima etapa, iremos definir seus serviços de hospedagem"
          namePlaceholder="ex: Consulta de retorno"
          pricePlaceholder="ex: R$ 120,00"
          data={data.saude}
          onNext={(d) => updateAndNext('saude', d)}
        />
        )
      case 6:
      return (
        <ServiceStep
          title="Serviços de hospedagem"
          subtitle="Se não oferecer, pode pular esta etapa e ir para a próxima!"
          sectionLabel="Hospedagem"
          services={['Creche', 'Hotel']}
          currentStep={7}
          totalSteps={TOTAL_STEPS}
          nextHint="Na próxima etapa, iremos definir seus serviços diversos"
          namePlaceholder="ex: Day care premium"
          pricePlaceholder="ex: R$ 60,00/dia"
          data={data.hospedagem}
          onNext={(d) => updateAndNext('hospedagem', d)}
        />
        )
      case 7:
      return (
        <MiscServicesStep
          currentStep={8}
          totalSteps={TOTAL_STEPS}
          data={data.diversos}
          onNext={(d) => updateAndNext('diversos', d)}
        />
        )
      case 8:
      return (
        <RequirementsStep
          currentStep={9}
          totalSteps={TOTAL_STEPS}
          data={data.requirements}
          onNext={(d) => {
            setData((prev) => ({ ...prev, requirements: d }))
            handleComplete()
          }}
        />
        )
      default:
        return null
    }
  }

  return (
    <div key={step} className="animate-fade-in">
      {renderStep()}
    </div>
  )
}
