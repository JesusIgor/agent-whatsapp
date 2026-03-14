import type { Meta, StoryObj } from '@storybook/react'
import { PipelineCard } from './PipelineCard'

const meta = {
  title: 'Molecules/PipelineCard',
  component: PipelineCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isDragging: {
      control: 'boolean',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[280px] p-4 bg-[#F4F6F9] dark:bg-[#1A1D24] rounded-lg">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PipelineCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    card: {
      id: '1',
      name: 'Maria Santos',
      initials: 'MS',
      pets: 'Rex, Luna',
      description: 'Olá, gostaria de agendar um banho para os meus dois cachorros.',
      time: '10:30',
      stage: 'welcome',
    },
  },
}

export const Dragging: Story = {
  args: {
    card: {
      id: '2',
      name: 'João Silva',
      initials: 'JS',
      pets: 'Bob',
      description: 'Preciso remarcar o horário de amanhã.',
      time: '11:45',
      stage: 'welcome',
    },
    isDragging: true,
  },
}

export const LongDescription: Story = {
  args: {
    card: {
      id: '3',
      name: 'Ana Paula Oliveira',
      initials: 'AP',
      pets: 'Mel, Thor, Nina',
      description: 'Olá! Tenho três cachorros e gostaria de agendar banho e tosa para todos. Vocês têm pacote com desconto para mais de um pet?',
      time: '09:15',
      stage: 'welcome',
    },
  },
}

export const WithClickHandler: Story = {
  args: {
    card: {
      id: '4',
      name: 'Carlos Costa',
      initials: 'CC',
      pets: 'Max',
      description: 'Quanto custa a consulta veterinária?',
      time: 'Ontem',
      stage: 'welcome',
    },
    onCardClick: (id) => alert(`Card clicked: ${id}`),
  },
}

export const Pipeline: Story = {
  args: {
    card: {
      id: '1',
      name: 'Maria Santos',
      initials: 'MS',
      pets: 'Rex',
      description: 'Gostaria de agendar um banho',
      time: '10:30',
      stage: 'welcome',
    },
  },
  render: () => (
    <div className="flex flex-col gap-3 w-[280px]">
      <PipelineCard
        card={{
          id: '1',
          name: 'Maria Santos',
          initials: 'MS',
          pets: 'Rex',
          description: 'Gostaria de agendar um banho',
          time: '10:30',
          stage: 'welcome',
        }}
      />
      <PipelineCard
        card={{
          id: '2',
          name: 'João Silva',
          initials: 'JS',
          pets: 'Luna',
          description: 'Preciso remarcar',
          time: '11:00',
          stage: 'situation',
        }}
      />
      <PipelineCard
        card={{
          id: '3',
          name: 'Ana Paula',
          initials: 'AP',
          pets: 'Bob, Mel',
          description: 'Vocês fazem tosa na tesoura?',
          time: '11:30',
          stage: 'problem',
        }}
      />
    </div>
  ),
}
