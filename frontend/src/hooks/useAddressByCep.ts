import { useState, useCallback } from 'react'
import { maskCep } from '@/lib/masks'

export interface AddressFields {
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

type FilledByApi = Record<keyof Omit<AddressFields, 'cep' | 'numero'>, boolean>

const emptyAddress: AddressFields = {
  cep: '',
  rua: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  uf: '',
}

export function useAddressByCep(initialValues?: Partial<AddressFields>) {
  const [address, setAddress] = useState<AddressFields>({
    ...emptyAddress,
    ...initialValues,
  })
  const [cepLoading, setCepLoading] = useState(false)
  const [cepError, setCepError] = useState('')
  const [cepFound, setCepFound] = useState(false)
  const [filledByApi, setFilledByApi] = useState<FilledByApi>({
    rua: false,
    complemento: false,
    bairro: false,
    cidade: false,
    uf: false,
  })

  const fetchCep = useCallback(async (cepDigits: string) => {
    if (cepDigits.length !== 8) {
      setCepError('CEP deve ter 8 dígitos')
      return
    }
    setCepLoading(true)
    setCepError('')
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepDigits}/json/`)
      const json: ViaCepResponse = await res.json()

      if (json.erro) {
        setCepError('CEP não encontrado')
        setCepFound(false)
        setFilledByApi({ rua: false, complemento: false, bairro: false, cidade: false, uf: false })
        return
      }

      const filled: FilledByApi = {
        rua: false,
        complemento: false,
        bairro: false,
        cidade: false,
        uf: false,
      }

      setAddress((prev) => {
        const next = { ...prev }
        if (json.logradouro) {
          next.rua = json.logradouro
          filled.rua = true
        }
        if (json.bairro) {
          next.bairro = json.bairro
          filled.bairro = true
        }
        if (json.localidade) {
          next.cidade = json.localidade
          filled.cidade = true
        }
        if (json.uf) {
          next.uf = json.uf
          filled.uf = true
        }
        if (json.complemento) {
          next.complemento = json.complemento
          filled.complemento = true
        }
        return next
      })

      setFilledByApi(filled)
      setCepFound(true)
    } catch {
      setCepError('Erro ao buscar CEP. Tente novamente.')
      setCepFound(false)
      setFilledByApi({ rua: false, complemento: false, bairro: false, cidade: false, uf: false })
    } finally {
      setCepLoading(false)
    }
  }, [])

  const handleCepChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, '')
      const masked = maskCep(raw)
      setAddress((prev) => ({ ...prev, cep: masked }))
      if (raw.length === 8) {
        fetchCep(raw)
      } else {
        setCepFound(false)
        setCepError('')
        setFilledByApi({ rua: false, complemento: false, bairro: false, cidade: false, uf: false })
      }
    },
    [fetchCep]
  )

  const setField = useCallback(<K extends keyof AddressFields>(field: K, value: AddressFields[K]) => {
    setAddress((prev) => ({ ...prev, [field]: value }))
  }, [])

  const isFieldDisabled = useCallback(
    (field: keyof AddressFields): boolean => {
      if (field === 'cep' || field === 'numero') return false
      if (!cepFound) return true
      return !!filledByApi[field as keyof FilledByApi]
    },
    [cepFound, filledByApi]
  )

  const reset = useCallback((values?: Partial<AddressFields>) => {
    setAddress({ ...emptyAddress, ...values })
    setCepError('')
    setCepFound(false)
    setFilledByApi({ rua: false, complemento: false, bairro: false, cidade: false, uf: false })
  }, [])

  return {
    address,
    setAddress,
    setField,
    cepLoading,
    cepError,
    cepFound,
    handleCepChange,
    isFieldDisabled,
    reset,
  }
}
