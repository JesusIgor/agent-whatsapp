import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Info, Loader2 } from 'lucide-react'
import { StepHeader, StepFooter } from '../components'
import { FormField } from '@/components/molecules/FormField'
import { maskCep } from '@/lib/masks'

interface AddressData {
  cep: string
  rua: string
  numero: string
  complemento: string
  bairro: string
  cidade: string
  uf: string
}

interface ViaCepResponse {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  erro?: boolean
}

interface AddressStepProps {
  currentStep: number
  totalSteps: number
  data: Partial<AddressData>
  onNext: (data: AddressData) => void
}

type FilledFields = Record<string, boolean>

export function AddressStep({ currentStep, totalSteps, data, onNext }: AddressStepProps) {
  const [cepLoading, setCepLoading] = useState(false)
  const [cepError, setCepError] = useState('')
  const [cepFound, setCepFound] = useState(!!data.rua)
  const [filledByApi, setFilledByApi] = useState<FilledFields>({})

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AddressData>({ defaultValues: data })

  const onSubmit = (formData: AddressData) => onNext(formData)

  const fetchCep = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, '')
    if (cleanCep.length !== 8) {
      setCepError('CEP deve ter 8 dígitos')
      return
    }

    setCepLoading(true)
    setCepError('')

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
      const json: ViaCepResponse = await res.json()

      if (json.erro) {
        setCepError('CEP não encontrado')
        setCepFound(false)
        setFilledByApi({})
        return
      }

      const filled: FilledFields = {}

      if (json.logradouro) {
        setValue('rua', json.logradouro)
        filled.rua = true
      }
      if (json.bairro) {
        setValue('bairro', json.bairro)
        filled.bairro = true
      }
      if (json.localidade) {
        setValue('cidade', json.localidade)
        filled.cidade = true
      }
      if (json.uf) {
        setValue('uf', json.uf)
        filled.uf = true
      }
      if (json.complemento) {
        setValue('complemento', json.complemento)
        filled.complemento = true
      }

      setFilledByApi(filled)
      setCepFound(true)
    } catch {
      setCepError('Erro ao buscar CEP. Tente novamente.')
      setCepFound(false)
      setFilledByApi({})
    } finally {
      setCepLoading(false)
    }
  }

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '')
    const masked = maskCep(digits)
    setValue('cep', masked)
    if (digits.length === 8) {
      fetchCep(digits)
    } else {
      setCepFound(false)
      setFilledByApi({})
    }
  }

  const isDisabled = (field: string) => {
    if (filledByApi[field]) return true
    if (!cepFound) return true
    return false
  }

  return (
    <div className="flex w-full max-w-[426px] flex-col items-center gap-[41px]">
      <StepHeader
        title="Onde seu negócio funciona?"
        subtitle="Usai esse endereço pra levar seus clientes até o seu petshop"
      />

      <div className="flex w-full items-start gap-3 rounded-lg border border-[#1E62EC]/20 bg-[#1E62EC]/5 p-4">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#1E62EC]" />
        <div className="flex flex-col gap-1">
          <p className="font-be-vietnam-pro text-sm font-semibold text-[#1E62EC]">Como funciona:</p>
          <ul className="list-disc pl-4 font-be-vietnam-pro text-xs leading-5 text-[#434A57]">
            <li>Digite o CEP para preencher automaticamente.</li>
            <li>Complete com número e complemento.</li>
            <li>A IA usará esses dados para responder clientes.</li>
          </ul>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-5"
        noValidate
      >
        <div className="flex w-full flex-col gap-3">
          <label
            htmlFor="cep"
            className="font-be-vietnam-pro text-base font-semibold leading-[23px] text-[#434A57]"
          >
            CEP<span className="text-[#1E62EC]">*</span>
          </label>
          <div className="relative">
            <input
              id="cep"
              type="text"
              inputMode="numeric"
              placeholder="00000-000"
              maxLength={9}
              className="flex h-[47px] w-full rounded-[4px] border border-[#727B8E]/10 bg-[#FAFAFA] px-[19px] py-[13px] font-be-vietnam-pro text-sm text-[#434A57] placeholder:text-[#727B8E]/50 outline-none transition-colors focus:border-[#1E62EC] focus:ring-1 focus:ring-[#1E62EC]/30"
              {...register('cep', {
                required: 'Campo obrigatório',
                onChange: handleCepChange,
              })}
            />
            {cepLoading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-[#1E62EC]" />
              </div>
            )}
          </div>
          {(errors.cep?.message || cepError) && (
            <p className="font-be-vietnam-pro text-xs text-red-500">
              {errors.cep?.message || cepError}
            </p>
          )}
        </div>

        <FormField
          id="rua"
          label="Rua"
          required
          placeholder="ex: Petshop Patas Felizes"
          disabled={isDisabled('rua')}
          error={errors.rua?.message}
          {...register('rua', { required: 'Campo obrigatório' })}
        />

        <div className="flex w-full gap-4">
          <div className="flex-1">
            <FormField
              id="numero"
              label="Número"
              required
              placeholder="123"
              disabled={isDisabled('numero')}
              error={errors.numero?.message}
              {...register('numero', { required: 'Campo obrigatório' })}
            />
          </div>
          <div className="flex-1">
            <FormField
              id="complemento"
              label="Complemento"
              placeholder="Apt, Sala..."
              disabled={isDisabled('complemento')}
              {...register('complemento')}
            />
          </div>
        </div>

        <div className="flex w-full gap-4">
          <div className="flex-1">
            <FormField
              id="bairro"
              label="Bairro"
              required
              placeholder="Vila Mirim"
              disabled={isDisabled('bairro')}
              error={errors.bairro?.message}
              {...register('bairro', { required: 'Campo obrigatório' })}
            />
          </div>
          <div className="flex-1">
            <FormField
              id="cidade"
              label="Cidade"
              required
              placeholder="Praia Grande"
              disabled={isDisabled('cidade')}
              error={errors.cidade?.message}
              {...register('cidade', { required: 'Campo obrigatório' })}
            />
          </div>
          <div className="w-[80px] shrink-0">
            <FormField
              id="uf"
              label="UF"
              required
              placeholder="SP"
              disabled={isDisabled('uf')}
              error={errors.uf?.message}
              {...register('uf', { required: 'Campo obrigatório' })}
            />
          </div>
        </div>

        <StepFooter
          currentStep={currentStep}
          totalSteps={totalSteps}
          nextHint="Na próxima etapa, iremos definir seu público"
          onNext={handleSubmit(onSubmit)}
        />
      </form>
    </div>
  )
}
