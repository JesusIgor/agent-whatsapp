import type { Meta, StoryObj } from '@storybook/react'
import { ChatBubble } from './ChatBubble'

const meta = {
  title: 'Molecules/ChatBubble',
  component: ChatBubble,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['sent', 'received'],
      description: 'Message direction',
    },
    isRead: {
      control: 'boolean',
      description: 'Read status (for sent messages)',
    },
    isAudio: {
      control: 'boolean',
      description: 'Audio message toggle',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-96 p-4 bg-[#F4F6F9] dark:bg-[#1A1D24] rounded-lg">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ChatBubble>

export default meta
type Story = StoryObj<typeof meta>

export const Received: Story = {
  args: {
    message: 'Olá! Gostaria de agendar um banho para o Rex.',
    time: '10:30',
    variant: 'received',
  },
}

export const Sent: Story = {
  args: {
    message: 'Claro! Temos horário disponível amanhã às 14h.',
    time: '10:32',
    variant: 'sent',
    isRead: false,
  },
}

export const SentRead: Story = {
  args: {
    message: 'Perfeito, confirmado para amanhã às 14h!',
    time: '10:35',
    variant: 'sent',
    isRead: true,
  },
}

export const LongMessage: Story = {
  args: {
    message: 'Gostaria de saber mais informações sobre os serviços de banho e tosa. O meu cachorro é um Golden Retriever e ele precisa de cuidados especiais com a pelagem. Vocês fazem hidratação também?',
    time: '10:40',
    variant: 'received',
  },
}

export const AudioMessage: Story = {
  args: {
    message: '',
    time: '10:45',
    variant: 'received',
    isAudio: true,
    audioDuration: '0:32',
  },
}

export const AudioSent: Story = {
  args: {
    message: '',
    time: '10:47',
    variant: 'sent',
    isAudio: true,
    audioDuration: '0:15',
    isRead: true,
  },
}

export const Conversation: Story = {
  args: {
    message: 'Olá! Gostaria de agendar um banho para o Rex.',
    time: '10:30',
    variant: 'received',
  },
  render: () => (
    <div className="flex flex-col gap-3 w-96">
      <ChatBubble
        message="Olá! Gostaria de agendar um banho para o Rex."
        time="10:30"
        variant="received"
      />
      <ChatBubble
        message="Olá! Claro, temos horário disponível amanhã às 14h. Seria bom para você?"
        time="10:32"
        variant="sent"
        isRead
      />
      <ChatBubble
        message="Perfeito! Pode confirmar."
        time="10:35"
        variant="received"
      />
      <ChatBubble
        message="Agendamento confirmado! Até amanhã às 14h."
        time="10:36"
        variant="sent"
        isRead
      />
    </div>
  ),
}
