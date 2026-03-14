import type { Meta, StoryObj } from '@storybook/react'
import { ConversationItem } from './ConversationItem'

const meta = {
  title: 'Molecules/ConversationItem',
  component: ConversationItem,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isOnline: {
      control: 'boolean',
    },
    isSelected: {
      control: 'boolean',
    },
    unreadCount: {
      control: 'number',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[360px] bg-white dark:bg-[#1A1B1D]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ConversationItem>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    name: 'Maria Santos',
    pets: 'Rex, Luna',
    lastMessage: 'Olá, gostaria de agendar um banho para amanhã',
    time: '10:30',
  },
}

export const Online: Story = {
  args: {
    name: 'João Silva',
    pets: 'Bob',
    lastMessage: 'Perfeito, obrigado!',
    time: '11:45',
    isOnline: true,
  },
}

export const WithUnread: Story = {
  args: {
    name: 'Ana Paula',
    pets: 'Mel, Thor',
    lastMessage: 'Vocês fazem tosa na tesoura?',
    time: '09:15',
    unreadCount: 3,
    isOnline: true,
  },
}

export const ManyUnread: Story = {
  args: {
    name: 'Carlos Oliveira',
    pets: 'Max',
    lastMessage: 'Preciso remarcar o horário',
    time: 'Ontem',
    unreadCount: 150,
  },
}

export const Selected: Story = {
  args: {
    name: 'Fernanda Costa',
    pets: 'Nina',
    lastMessage: 'Quanto custa o banho e tosa?',
    time: '14:20',
    isSelected: true,
    isOnline: true,
  },
}

export const NoPets: Story = {
  args: {
    name: 'Pedro Souza',
    lastMessage: 'Olá, vocês atendem gatos também?',
    time: '08:00',
  },
}

export const ConversationList: Story = {
  args: {
    name: 'Maria Santos',
    pets: 'Rex, Luna',
    lastMessage: 'Olá, gostaria de agendar um banho',
    time: '10:30',
    isOnline: true,
    unreadCount: 2,
  },
  render: () => (
    <div className="flex flex-col divide-y divide-[#727B8E]/10 dark:divide-[#40485A]">
      <ConversationItem
        name="Maria Santos"
        pets="Rex, Luna"
        lastMessage="Olá, gostaria de agendar um banho"
        time="10:30"
        isOnline
        unreadCount={2}
      />
      <ConversationItem
        name="João Silva"
        pets="Bob"
        lastMessage="Perfeito, obrigado!"
        time="11:45"
        isSelected
      />
      <ConversationItem
        name="Ana Paula"
        pets="Mel"
        lastMessage="Até amanhã então!"
        time="Ontem"
        isOnline
      />
      <ConversationItem
        name="Carlos Oliveira"
        pets="Max, Bella"
        lastMessage="Vocês fazem delivery?"
        time="Seg"
      />
    </div>
  ),
}
