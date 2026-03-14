import type { Meta, StoryObj } from '@storybook/react'
import { AppointmentItem } from './AppointmentItem'

const meta = {
  title: 'Molecules/AppointmentItem',
  component: AppointmentItem,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['concluido', 'confirmado', 'pendente', 'cancelado'],
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[500px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AppointmentItem>

export default meta
type Story = StoryObj<typeof meta>

export const Confirmed: Story = {
  args: {
    petName: 'Rex',
    service: 'Banho e Tosa',
    date: '15/01/2024',
    time: '14:00',
    price: 'R$ 80,00',
    status: 'confirmado',
  },
}

export const Pending: Story = {
  args: {
    petName: 'Luna',
    service: 'Banho',
    date: '16/01/2024',
    time: '10:30',
    price: 'R$ 50,00',
    status: 'pendente',
  },
}

export const Completed: Story = {
  args: {
    petName: 'Bob',
    service: 'Tosa na Tesoura',
    date: '14/01/2024',
    time: '09:00',
    price: 'R$ 120,00',
    status: 'concluido',
  },
}

export const Cancelled: Story = {
  args: {
    petName: 'Max',
    service: 'Consulta Veterinária',
    date: '13/01/2024',
    time: '16:00',
    price: 'R$ 150,00',
    status: 'cancelado',
  },
}

export const CustomInitials: Story = {
  args: {
    petName: 'Thor',
    petInitials: 'TH',
    service: 'Banho e Hidratação',
    date: '17/01/2024',
    time: '11:00',
    price: 'R$ 95,00',
    status: 'confirmado',
  },
}

export const AllStatuses: Story = {
  args: {
    petName: 'Rex',
    service: 'Banho e Tosa',
    date: '15/01',
    time: '14:00',
    price: 'R$ 80,00',
    status: 'confirmado',
  },
  render: () => (
    <div className="flex flex-col gap-3 w-[500px]">
      <AppointmentItem
        petName="Rex"
        service="Banho e Tosa"
        date="15/01"
        time="14:00"
        price="R$ 80,00"
        status="confirmado"
      />
      <AppointmentItem
        petName="Luna"
        service="Banho"
        date="15/01"
        time="15:00"
        price="R$ 50,00"
        status="pendente"
      />
      <AppointmentItem
        petName="Bob"
        service="Tosa"
        date="15/01"
        time="16:00"
        price="R$ 60,00"
        status="concluido"
      />
      <AppointmentItem
        petName="Max"
        service="Consulta"
        date="15/01"
        time="17:00"
        price="R$ 150,00"
        status="cancelado"
      />
    </div>
  ),
}
