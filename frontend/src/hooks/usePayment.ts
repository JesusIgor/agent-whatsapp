import { useState, useCallback, useEffect } from 'react'
import { paymentService } from '@/services/paymentService'
import type {
  PaymentPreference,
  PaymentPreferenceData,
  PaymentDetails,
  PaymentStats,
  PaymentFilters,
} from '@/types/payment'

declare global {
  interface Window {
    MercadoPago?: any
  }
}

export function usePayment() {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [currentPreference, setCurrentPreference] = useState<PaymentPreference>()
  const [currentAppointmentId, setCurrentAppointmentId] = useState<string>()
  const [paymentError, setPaymentError] = useState<string>()
  const [isCreatingPreference, setIsCreatingPreference] = useState(false)

  const initiatePayment = useCallback(async (data: PaymentPreferenceData) => {
    try {
      setPaymentError(undefined)
      setIsCreatingPreference(true)
      setCurrentAppointmentId(data.appointment_id)

      const preference = await paymentService.createPreference(data)
      setCurrentPreference(preference)
      setIsPaymentModalOpen(true)

      return preference
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.detail || error?.message || 'Erro ao criar preferência de pagamento'
      setPaymentError(errorMessage)
      throw error
    } finally {
      setIsCreatingPreference(false)
    }
  }, [])

  const closePaymentModal = useCallback(() => {
    setIsPaymentModalOpen(false)
  }, [])

  const resetPayment = useCallback(() => {
    setIsPaymentModalOpen(false)
    setCurrentPreference(undefined)
    setCurrentAppointmentId(undefined)
    setPaymentError(undefined)
    setIsCreatingPreference(false)
  }, [])

  const handlePaymentSuccess = useCallback(() => {
    setIsPaymentModalOpen(false)
  }, [])

  const handlePaymentError = useCallback((error: string) => {
    setPaymentError(error)
  }, [])

  return {
    
    isPaymentModalOpen,
    currentPreference,
    currentAppointmentId,
    paymentError,
    isCreatingPreference,

    initiatePayment,
    closePaymentModal,
    resetPayment,
    handlePaymentSuccess,
    handlePaymentError,
  }
}

export function usePaymentStatus(appointmentId: string | undefined, enabled = false) {
  const [status, setStatus] = useState<PaymentDetails | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled || !appointmentId) return

    let intervalId: NodeJS.Timeout

    const fetchStatus = async () => {
      try {
        setIsLoading(true)
        const data = await paymentService.getStatusByAppointment(appointmentId)
        setStatus(data)

        if (data.status === 'approved' || data.status === 'rejected') {
          clearInterval(intervalId)
        }
      } catch (err: any) {
        setError(err?.message || 'Erro ao verificar status')
      } finally {
        setIsLoading(false)
      }
    }

    fetchStatus()
    intervalId = setInterval(fetchStatus, 3000) 

    return () => clearInterval(intervalId)
  }, [appointmentId, enabled])

  return { status, isLoading, error }
}

export function usePaymentStats() {
  const [stats, setStats] = useState<PaymentStats | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await paymentService.getStats()
      setStats(data)
    } catch (err: any) {
      setError(err?.message || 'Erro ao carregar estatísticas')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return { stats, isLoading, error, refetch: fetchStats }
}

export function usePaymentList(filters?: PaymentFilters) {
  const [payments, setPayments] = useState<PaymentDetails[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPayments = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await paymentService.list(filters)
      setPayments(data.payments)
      setTotal(data.total)
    } catch (err: any) {
      setError(err?.message || 'Erro ao carregar pagamentos')
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchPayments()
  }, [fetchPayments])

  return { payments, total, isLoading, error, refetch: fetchPayments }
}

export function useMercadoPagoSDK() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string>()

  const loadSDK = useCallback(() => {
    
    if (window.MercadoPago) {
      setIsLoaded(true)
      return Promise.resolve()
    }

    const existingScript = document.getElementById('mercadopago-sdk')
    if (existingScript) {
      return new Promise<void>((resolve) => {
        existingScript.addEventListener('load', () => {
          setIsLoaded(true)
          resolve()
        })
      })
    }

    return new Promise<void>((resolve, reject) => {
      const script = document.createElement('script')
      script.id = 'mercadopago-sdk'
      script.src = 'https://sdk.mercadopago.com/js/v2'
      script.async = true

      script.onload = () => {
        setIsLoaded(true)
        resolve()
      }

      script.onerror = () => {
        const errorMsg = 'Falha ao carregar SDK do Mercado Pago'
        setError(errorMsg)
        reject(new Error(errorMsg))
      }

      document.body.appendChild(script)
    })
  }, [])

  return {
    isLoaded,
    error,
    loadSDK,
  }
}
