import type { Meta, StoryObj } from '@storybook/react'
import { FeatureCard } from './FeatureCard'

const meta = {
  title: 'Molecules/FeatureCard',
  component: FeatureCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
    },
    description: {
      control: 'text',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[300px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FeatureCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Agendamento Automático',
    description: 'Seus clientes agendam diretamente pelo WhatsApp, sem você precisar fazer nada.',
  },
}

export const ShortDescription: Story = {
  args: {
    title: 'IA Inteligente',
    description: 'Respostas automáticas 24/7.',
  },
}

export const LongDescription: Story = {
  args: {
    title: 'Gestão Completa',
    description: 'Gerencie todos os aspectos do seu petshop em um só lugar: clientes, pets, agendamentos, financeiro e muito mais. Tudo integrado e fácil de usar.',
  },
}

export const FeatureGrid: Story = {
  args: {
    title: 'Agendamento',
    description: 'Clientes agendam pelo WhatsApp automaticamente.',
  },
  render: () => (
    <div className="grid grid-cols-3 gap-4 w-[900px]">
      <FeatureCard
        title="Agendamento"
        description="Clientes agendam pelo WhatsApp automaticamente."
      />
      <FeatureCard
        title="Lembretes"
        description="Envio automático de lembretes para reduzir faltas."
      />
      <FeatureCard
        title="Relatórios"
        description="Acompanhe o desempenho do seu negócio em tempo real."
      />
    </div>
  ),
}
