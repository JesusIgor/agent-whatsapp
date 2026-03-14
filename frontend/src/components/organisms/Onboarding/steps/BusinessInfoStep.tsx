import { useForm } from 'react-hook-form'

import { FormField } from '@/components/molecules/FormField'
import { TextAreaField } from '@/components/molecules/TextAreaField'
import { StepHeader, StepFooter } from '../components'

interface BusinessInfoData {
  nomeEstabelecimento: string
  porqueEscolhem: string
  quemSaoClientes: string
  porteAnimais: string
}

interface BusinessInfoStepProps {
  currentStep: number
  totalSteps: number
  data: Partial<BusinessInfoData>
  onNext: (data: BusinessInfoData) => void
}

export function BusinessInfoStep({ currentStep, totalSteps, data, onNext }: BusinessInfoStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BusinessInfoData>({ defaultValues: data })

  const onSubmit = (formData: BusinessInfoData) => onNext(formData)

  return (
    <div className="flex w-full max-w-[426px] flex-col items-center gap-[41px]">
      <StepHeader
        title="Me conte sobre seu negócio"
        subtitle="Diga-nos o nome do seu petshop e o que te destacam."
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-5"
        noValidate
      >
        <FormField
          id="nomeEstabelecimento"
          label="Nome do estabelecimento"
          required
          placeholder="ex: Petshop Patas Felizes"
          error={errors.nomeEstabelecimento?.message}
          {...register('nomeEstabelecimento', { required: 'Campo obrigatório' })}
        />

        <TextAreaField
          id="porqueEscolhem"
          label="Por que os clientes escolhem você?"
          required
          placeholder="ex: Única clínica veterinária 24h"
          error={errors.porqueEscolhem?.message}
          {...register('porqueEscolhem', { required: 'Campo obrigatório' })}
        />

        <TextAreaField
          id="quemSaoClientes"
          label="Quem são seus clientes?"
          required
          placeholder="ex: Famílias com pets pequenos, Tutores de primeira viagem"
          error={errors.quemSaoClientes?.message}
          {...register('quemSaoClientes', { required: 'Campo obrigatório' })}
        />

        <TextAreaField
          id="porteAnimais"
          label="Qual o porte dos animais de atendimento?"
          required
          placeholder="ex: Famílias com pets pequenos, Tutores de primeira viagem"
          error={errors.porteAnimais?.message}
          {...register('porteAnimais', { required: 'Campo obrigatório' })}
        />

        <StepFooter
          currentStep={currentStep}
          totalSteps={totalSteps}
          nextHint="Na próxima etapa, iremos definir seu endereço"
          onNext={handleSubmit(onSubmit)}
        />
      </form>
    </div>
  )
}
