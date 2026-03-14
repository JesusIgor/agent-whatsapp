import { useForm } from 'react-hook-form'
import { StepHeader, StepFooter } from '../components'

interface RequirementsData {
  requisitos: string
  produtosServicos: string
  produtosVenda: string
}

interface RequirementsStepProps {
  currentStep: number
  totalSteps: number
  data: Partial<RequirementsData>
  onNext: (data: RequirementsData) => void
}

export function RequirementsStep({ currentStep, totalSteps, data, onNext }: RequirementsStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RequirementsData>({ defaultValues: data })

  const onSubmit = (formData: RequirementsData) => onNext(formData)

  return (
    <div className="flex w-full max-w-[426px] flex-col items-center gap-[41px]">
      <StepHeader
        title="Requisitos e Produtos"
        subtitle="Se não oferecer, pode pular esta etapa e ir para a próxima!"
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-5"
        noValidate
      >
        <div className="flex w-full flex-col gap-3">
          <label
            htmlFor="requisitos"
            className="font-be-vietnam-pro text-base font-semibold leading-[23px] text-[#434A57]"
          >
            Quais os requisitos o pet deve ter para ser atendido?<span className="text-[#1E62EC]">*</span>
          </label>
          <textarea
            id="requisitos"
            placeholder="ex: Ser castrado; Ser vacinado; Dócil..."
            className="flex min-h-[80px] w-full rounded-[4px] border border-[#727B8E]/10 bg-[#FAFAFA] px-[19px] py-[13px] font-be-vietnam-pro text-sm text-[#434A57] placeholder:text-[#727B8E]/50 outline-none transition-colors focus:border-[#1E62EC] focus:ring-1 focus:ring-[#1E62EC]/30 resize-none"
            {...register('requisitos', { required: 'Campo obrigatório' })}
          />
          {errors.requisitos?.message && (
            <p className="font-be-vietnam-pro text-xs text-red-500">{errors.requisitos.message}</p>
          )}
        </div>

        <div className="flex w-full flex-col gap-3">
          <label
            htmlFor="produtosServicos"
            className="font-be-vietnam-pro text-base font-semibold leading-[23px] text-[#434A57]"
          >
            Quais produtos você usa durante os serviços?<span className="text-[#1E62EC]">*</span>
          </label>
          <textarea
            id="produtosServicos"
            placeholder="ex: Shampoo hipoalergênico; Perfume sem álcool; Tesouras de precisão; Toalhas ecológicas..."
            className="flex min-h-[80px] w-full rounded-[4px] border border-[#727B8E]/10 bg-[#FAFAFA] px-[19px] py-[13px] font-be-vietnam-pro text-sm text-[#434A57] placeholder:text-[#727B8E]/50 outline-none transition-colors focus:border-[#1E62EC] focus:ring-1 focus:ring-[#1E62EC]/30 resize-none"
            {...register('produtosServicos', { required: 'Campo obrigatório' })}
          />
          {errors.produtosServicos?.message && (
            <p className="font-be-vietnam-pro text-xs text-red-500">{errors.produtosServicos.message}</p>
          )}
        </div>

        <div className="flex w-full flex-col gap-3">
          <label
            htmlFor="produtosVenda"
            className="font-be-vietnam-pro text-base font-semibold leading-[23px] text-[#434A57]"
          >
            Quais produtos você vende na loja?<span className="text-[#1E62EC]">*</span>
          </label>
          <textarea
            id="produtosVenda"
            placeholder="ex: Ração Premier; Brinquedos; Caminhas; Petiscos; Coleiras personalizadas..."
            className="flex min-h-[80px] w-full rounded-[4px] border border-[#727B8E]/10 bg-[#FAFAFA] px-[19px] py-[13px] font-be-vietnam-pro text-sm text-[#434A57] placeholder:text-[#727B8E]/50 outline-none transition-colors focus:border-[#1E62EC] focus:ring-1 focus:ring-[#1E62EC]/30 resize-none"
            {...register('produtosVenda', { required: 'Campo obrigatório' })}
          />
          {errors.produtosVenda?.message && (
            <p className="font-be-vietnam-pro text-xs text-red-500">{errors.produtosVenda.message}</p>
          )}
        </div>

        <StepFooter
          currentStep={currentStep}
          totalSteps={totalSteps}
          nextHint="Na próxima etapa, iremos definir sua IA"
          onNext={handleSubmit(onSubmit)}
        />
      </form>
    </div>
  )
}
