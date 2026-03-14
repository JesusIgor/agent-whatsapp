import type { Meta, StoryObj } from '@storybook/react'
import { StatCards } from './StatCards'

const meta = {
  title: 'Molecules/StatCards',
  component: StatCards,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof StatCards>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const CustomStats: Story = {
  args: {
    stats: [
      { label: 'Clientes', value: '128' },
      { label: 'Agendamentos', value: '45' },
      { label: 'Faturamento', value: 'R$ 5.430', hasChart: true },
      { label: 'Novos clientes', value: '12', hasChart: true },
    ],
  },
}

export const PetshopStats: Story = {
  args: {
    stats: [
      { label: 'Banhos hoje', value: '8' },
      { label: 'Tosas hoje', value: '5' },
      { label: 'Hospedagem', value: '3' },
      { label: 'Consultas', value: '2' },
      { label: 'Receita', value: 'R$ 1.850', hasChart: true },
    ],
  },
}

export const ThreeStats: Story = {
  args: {
    stats: [
      { label: 'Total', value: '156' },
      { label: 'Ativos', value: '89' },
      { label: 'Crescimento', value: '+15%', hasChart: true },
    ],
  },
}
