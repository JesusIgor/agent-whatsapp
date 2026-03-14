import { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { DashboardLayout } from '@/components/templates/DashboardLayout'
import { Modal } from '@/components/molecules/Modal'
import { Input } from '@/components/atoms/Input'
import { Select } from '@/components/atoms/Select'
import { TextArea } from '@/components/atoms/TextArea'
import {
  ChevronLeft,
  ChevronRight,
  Crown,
  PawPrint,
  Phone,
  Check,
  Clock,
  ChevronRight as ArrowRight,
  ChevronLeft as ArrowLeft,
  AlertTriangle,
  Plus,
  Calendar,
  UserPlus,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { maskPhone, maskDate, dateToISO, dateFromISO } from '@/lib/masks'
import { boardingService } from '@/services'
import { useAuthContext } from '@/contexts/AuthContext'
import type { BoardingStay } from '@/types'

type PetType = 'Hotel' | 'Creche'

interface PetItem {
  id: string
  petName: string
  initials: string
  ownerName: string
  type: PetType
  checkIn: string
  checkOut: string
  note?: string
}

interface ReservationItem {
  id: string
  petName: string
  initials: string
  ownerName: string
  phone: string
  exitDate: string
  statusPrimary: 'ativo' | 'checkin'
  type: PetType
}

type BoardingStayWithNames = BoardingStay & { client_name?: string; pet_name?: string; client_phone?: string }

const DEFAULT_CAPACITY = 8

function formatDateBR(iso: string): string {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`
}

function formatDateFullBR(iso: string): string {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '—'
}

function stayToPetItem(s: BoardingStayWithNames): PetItem {
  const petName = s.pet_name ?? `Pet ${s.pet_id.slice(0, 8)}`
  const ownerName = s.client_name ?? `Cliente ${s.client_id?.slice(0, 8) ?? ''}`
  return {
    id: s.id,
    petName,
    initials: getInitials(petName),
    ownerName,
    type: (s.service_type === 'creche' ? 'Creche' : 'Hotel') as PetType,
    checkIn: formatDateBR(s.check_in_at),
    checkOut: s.check_out_at ? formatDateBR(s.check_out_at) : '—',
    note: s.notes ?? undefined,
  }
}

function stayToReservationItem(s: BoardingStayWithNames): ReservationItem {
  const petName = s.pet_name ?? `Pet ${s.pet_id.slice(0, 8)}`
  const ownerName = s.client_name ?? `Cliente ${s.client_id?.slice(0, 8) ?? ''}`
  const exitDate = s.check_out_at ? formatDateFullBR(s.check_out_at) : '—'
  return {
    id: s.id,
    petName,
    initials: getInitials(petName),
    ownerName,
    phone: (s as BoardingStayWithNames).client_phone ?? '—',
    exitDate,
    statusPrimary: s.status === 'active' || s.status === 'ativo' ? 'ativo' : 'checkin',
    type: (s.service_type === 'creche' ? 'Creche' : 'Hotel') as PetType,
  }
}

interface MockCustomer {
  id: string
  name: string
  phone: string
  pets: { id: string; name: string; species: string }[]
}

const MOCK_CUSTOMERS_FALLBACK: MockCustomer[] = []

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

function SectionHeaderPets({
  title,
  subtitle,
  count,
  icon: Icon,
  iconColor,
}: {
  title: string
  subtitle: string
  count: number
  icon: typeof Check
  iconColor: string
}) {
  return (
    <div className="flex items-center gap-3 border-b border-[#727B8E]/10 dark:border-[#40485A] px-4 py-4">
      <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', iconColor)}>
        <Icon className="h-5 w-5" strokeWidth={2} />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold text-[#434A57] dark:text-[#f5f9fc]">{title}</h3>
        <p className="text-xs text-[#727B8E] dark:text-[#8a94a6]">{subtitle}</p>
      </div>
      <span className={cn('shrink-0 rounded-lg px-2.5 py-1 text-sm font-bold', iconColor)}>
        {count}
      </span>
    </div>
  )
}

function PetCard({ item }: { item: PetItem }) {
  const typeClass = item.type === 'Hotel' ? 'bg-[#8B5CF6]/10 text-[#8B5CF6]' : 'bg-[#F59E0B]/10 text-[#F59E0B]'
  return (
    <div className="flex items-start gap-3 border-b border-[#727B8E]/5 py-4 last:border-b-0">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F4F6F9]">
        <span className="text-sm font-semibold text-[#727B8E]">{item.initials}</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-bold text-[#434A57]">{item.petName}</span>
          <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold', typeClass)}>
            {item.type}
          </span>
        </div>
        <p className="text-xs text-[#727B8E] dark:text-[#8a94a6]">{item.ownerName}</p>
        <p className="text-xs text-[#727B8E] dark:text-[#8a94a6]">
          → {item.checkIn} | → {item.checkOut}
        </p>
        {item.note && (
          <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-[#F59E0B]">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            <span>{item.note}</span>
          </div>
        )}
      </div>
      <button
        type="button"
        className="flex shrink-0 items-center gap-1.5 rounded-lg border border-[#F59E0B]/30 bg-[#F59E0B]/5 px-3 py-1.5 text-xs font-medium text-[#F59E0B] transition-colors hover:bg-[#F59E0B]/10"
      >
        Checkout
        <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
      </button>
    </div>
  )
}

function ReservationCard({ item }: { item: ReservationItem }) {
  const typeClass = item.type === 'Hotel' ? 'bg-[#8B5CF6]/10 text-[#8B5CF6]' : 'bg-[#F59E0B]/10 text-[#F59E0B]'
  return (
    <div className="flex items-start gap-3 border-b border-[#727B8E]/5 py-4 last:border-b-0">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F4F6F9]">
        <span className="text-sm font-semibold text-[#727B8E]">{item.initials}</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-bold text-[#434A57]">{item.petName}</span>
          <span className="rounded-full bg-[#3DCA21]/10 px-2 py-0.5 text-[10px] font-semibold text-[#3DCA21]">
            {item.statusPrimary === 'ativo' ? 'ativo' : 'checkin'}
          </span>
          <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold', typeClass)}>
            {item.type}
          </span>
        </div>
        <p className="text-xs text-[#727B8E]">{item.ownerName}</p>
        <div className="flex items-center gap-1 text-xs text-[#727B8E] dark:text-[#8a94a6]">
          <Phone className="h-3 w-3 shrink-0" />
          <span>{item.phone}</span>
        </div>
        <div className="mt-1 flex items-center gap-1 text-xs text-[#727B8E] dark:text-[#8a94a6]">
          <Calendar className="h-3 w-3 shrink-0" />
          <span>Saída: {item.exitDate}</span>
        </div>
      </div>
    </div>
  )
}

export default function HotelCrechePage() {
  const { user } = useAuthContext()
  const petshopId = user?.petshop_id ?? 0

  const [currentDate, setCurrentDate] = useState(new Date())
  const [petsHospedados, setPetsHospedados] = useState<PetItem[]>([])
  const [reservas, setReservas] = useState<ReservationItem[]>([])
  const [customers, setCustomers] = useState<MockCustomer[]>(MOCK_CUSTOMERS_FALLBACK)
  const [ocupacaoAtual, setOcupacaoAtual] = useState(0)
  const [checkInsHoje, setCheckInsHoje] = useState(0)
  const [checkOutsHoje, setCheckOutsHoje] = useState(0)
  const [loading, setLoading] = useState(true)
  const [capacidadeTotal, setCapacidadeTotal] = useState(DEFAULT_CAPACITY)

  useEffect(() => {
    if (!petshopId) {
      setLoading(false)
      return
    }
    const fetchData = async () => {
      try {
        setLoading(true)
        const [stats, activeList] = await Promise.allSettled([
          boardingService.getStats(petshopId),
          boardingService.getActiveBoardings(petshopId),
        ])
        if (stats.status === 'fulfilled') {
          setOcupacaoAtual(stats.value.total_active ?? 0)
          const today = new Date().toISOString().slice(0, 10)
          setCheckInsHoje(0)
          setCheckOutsHoje(0)
        }
        if (activeList.status === 'fulfilled') {
          const stays = activeList.value as BoardingStayWithNames[]
          setPetsHospedados(stays.map(stayToPetItem))
          setReservas(stays.map(stayToReservationItem))
        }
      } catch (error) {
        console.error('Erro ao buscar dados Hotel/Creche:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [petshopId])

  const [reservaModalOpen, setReservaModalOpen] = useState(false)
  const [serviceType, setServiceType] = useState<PetType>('Hotel')
  const [customerId, setCustomerId] = useState('')
  const [petId, setPetId] = useState('')
  const [checkInDate, setCheckInDate] = useState('')
  const [checkOutDate, setCheckOutDate] = useState('')
  const [dailyRate, setDailyRate] = useState('80')
  const [notes, setNotes] = useState('')
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false)
  const [newCustomerName, setNewCustomerName] = useState('')
  const [newCustomerPhone, setNewCustomerPhone] = useState('')
  const [showNewPetForm, setShowNewPetForm] = useState(false)
  const [newPetName, setNewPetName] = useState('')
  const [newPetSpecies, setNewPetSpecies] = useState('cachorro')

  const selectedCustomer = customers.find((c) => c.id === customerId)
  const selectedPet = selectedCustomer?.pets.find((p) => p.id === petId)
  const availableSpots = capacidadeTotal - ocupacaoAtual

  useEffect(() => {
    if (!reservaModalOpen) {
      setCustomerId('')
      setPetId('')
      setCheckInDate('')
      setCheckOutDate('')
      setDailyRate('80')
      setNotes('')
      setServiceType('Hotel')
      setShowNewCustomerForm(false)
      setShowNewPetForm(false)
      setNewCustomerName('')
      setNewCustomerPhone('')
      setNewPetName('')
      setNewPetSpecies('cachorro')
    }
  }, [reservaModalOpen])

  const handleCreateCustomer = () => {
    if (!newCustomerName.trim() || !newCustomerPhone.trim()) return
    const newCustomer: MockCustomer = {
      id: `c_${Date.now()}`,
      name: newCustomerName.trim(),
      phone: newCustomerPhone.trim(),
      pets: [],
    }
    setCustomers((prev) => [...prev, newCustomer])
    setCustomerId(newCustomer.id)
    setPetId('')
    setShowNewCustomerForm(false)
    setNewCustomerName('')
    setNewCustomerPhone('')
  }

  const handleCreatePet = () => {
    if (!newPetName.trim() || !customerId) return
    const newPet = { id: `p_${Date.now()}`, name: newPetName.trim(), species: newPetSpecies }
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === customerId ? { ...c, pets: [...c.pets, newPet] } : c
      )
    )
    setPetId(newPet.id)
    setShowNewPetForm(false)
    setNewPetName('')
    setNewPetSpecies('cachorro')
  }

  const handleCreateReserva = () => {
    if (!selectedCustomer || !selectedPet || !checkInDate || !checkOutDate) return
    if (availableSpots <= 0) return
    const exitDate = checkOutDate
    const newReserva: ReservationItem = {
      id: `res-${Date.now()}`,
      petName: selectedPet.name,
      initials: getInitials(selectedPet.name),
      ownerName: selectedCustomer.name,
      phone: selectedCustomer.phone,
      exitDate,
      statusPrimary: 'ativo',
      type: serviceType,
    }
    setReservas((prev) => [...prev, newReserva])
    setReservaModalOpen(false)
  }

  const handlePrevMonth = useCallback(() => {
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))
  }, [])

  const handleNextMonth = useCallback(() => {
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))
  }, [])

  const handleToday = useCallback(() => {
    setCurrentDate(new Date())
  }, [])

  const ocupacaoPercent = Math.round((ocupacaoAtual / capacidadeTotal) * 100)

  const reservaValid = customerId && petId && checkInDate && checkOutDate

  return (
    <DashboardLayout>
      <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[#727B8E]/10 bg-white p-4 shadow-lg dark:border-[#40485A] dark:bg-[#1A1B1D] sm:p-6">
        <div className="flex min-h-0 flex-1 flex-col space-y-6 overflow-y-auto">
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <a
                href="/calendario"
                className="flex items-center gap-1.5 rounded-lg border border-transparent px-3 py-1.5 text-sm font-medium text-[#727B8E] dark:text-[#8a94a6] transition-colors hover:text-[#434A57] dark:hover:text-[#f5f9fc]"
              >
                <Crown className="h-4 w-4" />
                <span>Agenda</span>
              </a>
              <div className="h-5 w-px bg-[#727B8E]/10" />
              <span
                className={cn(
                  'rounded-lg border border-[#727B8E]/10 dark:border-[#40485A] bg-[#0e1629] dark:bg-[#2172e5] px-3 py-1.5 text-sm font-medium text-white'
                )}
              >
                Hotel/Creche
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h2 className="text-base font-semibold text-[#434A57] dark:text-[#f5f9fc] sm:text-lg">
                {MONTH_NAMES[currentDate.getMonth()]}, {currentDate.getFullYear()}
              </h2>
              <button
                type="button"
                onClick={handlePrevMonth}
                className="rounded-md p-1 text-[#727B8E] hover:bg-[#F4F6F9] dark:text-[#8a94a6] dark:hover:bg-[#212225]"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleToday}
                className="rounded-md border border-[#727B8E]/10 dark:border-[#40485A] px-3 py-1 text-sm text-[#434A57] dark:text-[#f5f9fc] hover:bg-[#F4F6F9] dark:hover:bg-[#212225]"
              >
                Hoje
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="rounded-md p-1 text-[#727B8E] hover:bg-[#F4F6F9] dark:text-[#8a94a6] dark:hover:bg-[#212225]"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0 }}
              whileHover={{ scale: 1.02 }}
              className="rounded-xl border border-[#727B8E]/10 bg-white dark:border-[#40485A] dark:bg-[#1A1B1D] p-4 shadow-sm transition-shadow duration-200 hover:shadow-md">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#727B8E]/10">
                  <PawPrint className="h-5 w-5 text-[#727B8E]" strokeWidth={1.5} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-[#727B8E] dark:text-[#8a94a6]">Ocupação Atual</p>
                  <p className="text-2xl font-bold text-[#434A57] dark:text-[#f5f9fc]">
                    {ocupacaoAtual} / {capacidadeTotal} pets
                  </p>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#F4F6F9]">
                    <div
                      className="h-full rounded-full bg-[#3DCA21]"
                      style={{ width: `${ocupacaoPercent}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-[#727B8E] dark:text-[#8a94a6]">
                    {capacidadeTotal - ocupacaoAtual} vagas disponíveis
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.075 }}
              whileHover={{ scale: 1.02 }}
              className="rounded-xl border border-[#727B8E]/10 bg-white dark:border-[#40485A] dark:bg-[#1A1B1D] p-4 shadow-sm transition-shadow duration-200 hover:shadow-md"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#3DCA21]/10">
                  <ArrowRight className="h-5 w-5 text-[#3DCA21]" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-xs font-medium text-[#727B8E] dark:text-[#8a94a6]">Check-ins Hoje</p>
                  <p className="text-2xl font-bold text-[#3DCA21]">{checkInsHoje}</p>
                  <p className="text-xs text-[#727B8E] dark:text-[#8a94a6]">Aguardando entrada</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              whileHover={{ scale: 1.02 }}
              className="rounded-xl border border-[#727B8E]/10 bg-white dark:border-[#40485A] dark:bg-[#1A1B1D] p-4 shadow-sm transition-shadow duration-200 hover:shadow-md"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F59E0B]/10">
                  <ArrowLeft className="h-5 w-5 text-[#F59E0B]" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-xs font-medium text-[#727B8E] dark:text-[#8a94a6]">Check-outs Hoje</p>
                  <p className="text-2xl font-bold text-[#F59E0B]">{checkOutsHoje}</p>
                  <p className="text-xs text-[#727B8E] dark:text-[#8a94a6]">Saídas previstas</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.225 }}
              whileHover={{ scale: 1.02 }}
              className="rounded-xl border border-[#727B8E]/10 bg-white dark:border-[#40485A] dark:bg-[#1A1B1D] p-4 shadow-sm transition-shadow duration-200 hover:shadow-md"
            >
              <p className="mb-3 text-xs font-medium text-[#727B8E] dark:text-[#8a94a6]">Ações Rápidas</p>
              <button
                type="button"
                onClick={() => setReservaModalOpen(true)}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0e1629] px-4 py-3 text-sm font-medium text-white transition-colors hover:opacity-90 dark:bg-[#2172e5]"
              >
                <Plus className="h-5 w-5" strokeWidth={2} />
                Nova Reserva
              </button>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex flex-col overflow-hidden rounded-2xl border border-[#727B8E]/10 bg-white transition-shadow duration-200 hover:shadow-md dark:border-[#40485A] dark:bg-[#1A1B1D]"
            >
              <SectionHeaderPets
                title="Pets Hospedados"
                subtitle={`${petsHospedados.length} hospedados`}
                count={petsHospedados.length}
                icon={Check}
                iconColor="bg-[#3DCA21]/10 text-[#3DCA21]"
              />
              <div className="min-h-0 flex-1 overflow-y-auto px-4">
                {loading ? (
                  <p className="py-4 text-sm text-[#727B8E] dark:text-[#8a94a6]">Carregando...</p>
                ) : (
                  petsHospedados.map((pet) => (
                    <PetCard key={pet.id} item={pet} />
                  ))
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.375 }}
              className="flex flex-col overflow-hidden rounded-2xl border border-[#727B8E]/10 bg-white transition-shadow duration-200 hover:shadow-md dark:border-[#40485A] dark:bg-[#1A1B1D]">
              <SectionHeaderPets
                title="Reservas & Check-ins"
                subtitle={`${reservas.length} reservas`}
                count={reservas.length}
                icon={Clock}
                iconColor="bg-[#1E62EC]/10 text-[#1E62EC]"
              />
              <div className="min-h-0 flex-1 overflow-y-auto px-4">
                {loading ? (
                  <p className="py-4 text-sm text-[#727B8E] dark:text-[#8a94a6]">Carregando...</p>
                ) : (
                  reservas.map((res) => (
                    <ReservationCard key={res.id} item={res} />
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      </div>

      <button
        type="button"
        onClick={() => setReservaModalOpen(true)}
        className="fixed right-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#0e1629] text-white shadow-xl transition-transform duration-200 hover:scale-105 sm:right-8 dark:bg-[#2172e5]"
        style={{ bottom: 'max(1.5rem, calc(1.5rem + env(safe-area-inset-bottom, 0px)))' }}
        aria-label="Nova reserva"
      >
        <PawPrint className="h-5 w-5" />
      </button>

      <Modal
        isOpen={reservaModalOpen}
        onClose={() => setReservaModalOpen(false)}
        title="Nova Reserva - Hotel/Creche"
        onSubmit={handleCreateReserva}
        submitText="Criar Reserva"
        cancelText="Cancelar"
      >
        <div className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto">
          {availableSpots <= 2 && (
            <div
              className={cn(
                'rounded-lg p-3 text-sm',
                availableSpots <= 0
                  ? 'bg-red-500/20 text-red-600 dark:text-red-400'
                  : 'bg-amber-500/20 text-amber-700 dark:text-amber-400'
              )}
            >
              {availableSpots <= 0
                ? 'Capacidade máxima atingida! Não é possível criar novas reservas.'
                : `Atenção: Apenas ${availableSpots} vaga(s) disponível(eis).`}
            </div>
          )}

          <div>
            <p className="mb-2 text-sm font-semibold text-[#434A57] dark:text-[#f5f9fc]">Tipo de Serviço</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setServiceType('Hotel')}
                className={cn(
                  'flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                  serviceType === 'Hotel'
                    ? 'border-[#1E62EC] bg-[#1E62EC]/10 text-[#1E62EC] dark:bg-[#2172e5]/20 dark:border-[#2172e5] dark:text-[#2172e5]'
                    : 'border-[#727B8E]/20 bg-transparent text-[#727B8E] hover:bg-[#F4F6F9] dark:border-[#40485A] dark:text-[#8a94a6] dark:hover:bg-[#212225]'
                )}
              >
                Hotel
              </button>
              <button
                type="button"
                onClick={() => setServiceType('Creche')}
                className={cn(
                  'flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                  serviceType === 'Creche'
                    ? 'border-[#1E62EC] bg-[#1E62EC]/10 text-[#1E62EC] dark:bg-[#2172e5]/20 dark:border-[#2172e5] dark:text-[#2172e5]'
                    : 'border-[#727B8E]/20 bg-transparent text-[#727B8E] hover:bg-[#F4F6F9] dark:border-[#40485A] dark:text-[#8a94a6] dark:hover:bg-[#212225]'
                )}
              >
                Creche
              </button>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold text-[#434A57] dark:text-[#f5f9fc]">Cliente</p>
              <button
                type="button"
                onClick={() => setShowNewCustomerForm(!showNewCustomerForm)}
                className="flex items-center gap-1 text-xs font-medium text-[#1E62EC] hover:underline dark:text-[#2172e5]"
              >
                <UserPlus className="h-3.5 w-3.5" />
                {showNewCustomerForm ? 'Cancelar' : 'Novo Cliente'}
              </button>
            </div>
            {showNewCustomerForm ? (
              <div className="space-y-3 rounded-lg border border-[#727B8E]/20 bg-[#F4F6F9] p-3 dark:border-[#40485A] dark:bg-[#212225]">
                <Input
                  label="Nome do Cliente"
                  placeholder="Nome completo"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                />
                <Input
                  label="Telefone"
                  placeholder="(11) 99999-9999"
                  value={newCustomerPhone}
                  onChange={(e) => setNewCustomerPhone(maskPhone(e.target.value))}
                />
                <button
                  type="button"
                  onClick={handleCreateCustomer}
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#0e1629] py-2 text-sm font-medium text-white hover:opacity-90 dark:bg-[#2172e5]"
                >
                  <Plus className="h-4 w-4" />
                  Criar Cliente
                </button>
              </div>
            ) : (
              <Select
                placeholder="Selecione o cliente"
                value={customerId}
                onChange={(e) => {
                  setCustomerId(e.target.value)
                  setPetId('')
                }}
                options={customers.map((c) => ({ value: c.id, label: c.name }))}
              />
            )}
          </div>

          {selectedCustomer && !showNewCustomerForm && (
            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold text-[#434A57] dark:text-[#f5f9fc]">Pet</p>
                <button
                  type="button"
                  onClick={() => setShowNewPetForm(!showNewPetForm)}
                  className="flex items-center gap-1 text-xs font-medium text-[#1E62EC] hover:underline dark:text-[#2172e5]"
                >
                  <PawPrint className="h-3.5 w-3.5" />
                  {showNewPetForm ? 'Cancelar' : 'Novo Pet'}
                </button>
              </div>
              {showNewPetForm ? (
                <div className="space-y-3 rounded-lg border border-[#727B8E]/20 bg-[#F4F6F9] p-3 dark:border-[#40485A] dark:bg-[#212225]">
                  <Input
                    label="Nome do Pet"
                    placeholder="Nome do pet"
                    value={newPetName}
                    onChange={(e) => setNewPetName(e.target.value)}
                  />
                  <Select
                    label="Espécie"
                    placeholder="Selecione"
                    value={newPetSpecies}
                    onChange={(e) => setNewPetSpecies(e.target.value)}
                    options={[
                      { value: 'cachorro', label: 'Cachorro' },
                      { value: 'gato', label: 'Gato' },
                      { value: 'ave', label: 'Ave' },
                      { value: 'roedor', label: 'Roedor' },
                      { value: 'outro', label: 'Outro' },
                    ]}
                  />
                  <button
                    type="button"
                    onClick={handleCreatePet}
                    className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#0e1629] py-2 text-sm font-medium text-white hover:opacity-90 dark:bg-[#2172e5]"
                  >
                    <Plus className="h-4 w-4" />
                    Criar Pet
                  </button>
                </div>
              ) : (
                <Select
                  placeholder="Selecione o pet"
                  value={petId}
                  onChange={(e) => setPetId(e.target.value)}
                  options={selectedCustomer.pets.map((p) => ({
                    value: p.id,
                    label: `${p.name} (${p.species})`,
                  }))}
                />
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Check-in"
              placeholder="DD/MM/AAAA"
              value={checkInDate}
              onChange={(e) => setCheckInDate(maskDate(e.target.value))}
              maxLength={10}
            />
            <Input
              label="Check-out"
              placeholder="DD/MM/AAAA"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(maskDate(e.target.value))}
              maxLength={10}
            />
          </div>

          <Input
            label="Diária (R$)"
            type="number"
            placeholder="80"
            value={dailyRate}
            onChange={(e) => setDailyRate(e.target.value)}
          />

          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-[#434A57] dark:text-[#f5f9fc]">Observações</p>
            <TextArea
              placeholder="Medicações, alimentação especial, comportamento..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  )
}
