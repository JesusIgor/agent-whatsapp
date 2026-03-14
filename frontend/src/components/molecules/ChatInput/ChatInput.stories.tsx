import type { Meta, StoryObj } from '@storybook/react'
import { ChatInput } from './ChatInput'

const meta = {
  title: 'Molecules/ChatInput',
  component: ChatInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[400px] bg-white dark:bg-[#1A1B1D] p-4 rounded-lg">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ChatInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: 'Digite uma mensagem...',
  },
}

export const CustomPlaceholder: Story = {
  args: {
    placeholder: 'Responder ao cliente...',
  },
}

export const Disabled: Story = {
  args: {
    placeholder: 'Digite uma mensagem...',
    disabled: true,
  },
}

export const WithHandlers: Story = {
  args: {
    placeholder: 'Digite uma mensagem...',
    onSend: (message) => alert(`Mensagem enviada: ${message}`),
    onAttach: () => alert('Anexar arquivo'),
    onVoice: () => alert('Gravar áudio'),
  },
}
