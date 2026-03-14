import type { Meta, StoryObj } from '@storybook/react'
import { WhatsAppStatusCard } from './WhatsAppStatusCard'

const meta = {
  title: 'Molecules/WhatsAppStatusCard',
  component: WhatsAppStatusCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['connected', 'disconnected', 'connecting', 'error'],
    },
    phoneNumber: {
      control: 'text',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof WhatsAppStatusCard>

export default meta
type Story = StoryObj<typeof meta>

export const Connected: Story = {
  args: {
    status: 'connected',
    phoneNumber: '5511999999999',
  },
}

export const Disconnected: Story = {
  args: {
    status: 'disconnected',
    phoneNumber: '5511999999999',
    lastSync: '2024-01-15T10:30:00',
    onReconnect: () => alert('Reconectando...'),
  },
}

export const Connecting: Story = {
  args: {
    status: 'connecting',
    phoneNumber: '5511999999999',
  },
}

export const Error: Story = {
  args: {
    status: 'error',
    phoneNumber: '5511999999999',
    lastSync: '2024-01-15T08:00:00',
    onReconnect: () => alert('Tentando reconectar...'),
  },
}

export const NoPhoneNumber: Story = {
  args: {
    status: 'disconnected',
  },
}

export const AllStatuses: Story = {
  args: {
    status: 'connected',
    phoneNumber: '5511999999999',
  },
  render: () => (
    <div className="flex flex-col gap-4 w-[400px]">
      <WhatsAppStatusCard
        status="connected"
        phoneNumber="5511999999999"
      />
      <WhatsAppStatusCard
        status="connecting"
        phoneNumber="5511988888888"
      />
      <WhatsAppStatusCard
        status="disconnected"
        phoneNumber="5511977777777"
        lastSync="2024-01-15T10:30:00"
        onReconnect={() => {}}
      />
      <WhatsAppStatusCard
        status="error"
        phoneNumber="5511966666666"
        lastSync="2024-01-15T08:00:00"
        onReconnect={() => {}}
      />
    </div>
  ),
}
