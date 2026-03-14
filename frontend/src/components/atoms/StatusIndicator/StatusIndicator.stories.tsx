import type { Meta, StoryObj } from '@storybook/react'
import { StatusIndicator } from './StatusIndicator'

const meta = {
  title: 'Atoms/StatusIndicator',
  component: StatusIndicator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['online', 'offline'],
      description: 'Status indicator color',
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
      description: 'Size of the indicator',
    },
  },
} satisfies Meta<typeof StatusIndicator>

export default meta
type Story = StoryObj<typeof meta>

export const Online: Story = {
  args: {
    status: 'online',
  },
}

export const Offline: Story = {
  args: {
    status: 'offline',
  },
}

export const SmallOnline: Story = {
  args: {
    status: 'online',
    size: 'sm',
  },
}

export const SmallOffline: Story = {
  args: {
    status: 'offline',
    size: 'sm',
  },
}

export const Sizes: Story = {
  args: { status: 'online', size: 'sm' },
  render: () => (
    <div className="flex items-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <StatusIndicator status="online" size="sm" />
        <span className="text-xs text-gray-500">SM</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <StatusIndicator status="online" size="md" />
        <span className="text-xs text-gray-500">MD</span>
      </div>
    </div>
  ),
}

export const AllVariants: Story = {
  args: { status: 'online', size: 'md' },
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <StatusIndicator status="online" size="sm" />
        <StatusIndicator status="online" size="md" />
        <span className="text-sm text-gray-600 dark:text-gray-400">Online</span>
      </div>
      <div className="flex items-center gap-4">
        <StatusIndicator status="offline" size="sm" />
        <StatusIndicator status="offline" size="md" />
        <span className="text-sm text-gray-600 dark:text-gray-400">Offline</span>
      </div>
    </div>
  ),
}

export const WithLabel: Story = {
  args: { status: 'online' },
  render: () => (
    <div className="flex items-center gap-2">
      <StatusIndicator status="online" />
      <span className="text-sm text-gray-700 dark:text-gray-300">Conectado</span>
    </div>
  ),
}
