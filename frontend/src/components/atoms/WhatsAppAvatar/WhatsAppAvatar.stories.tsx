import type { Meta, StoryObj } from '@storybook/react'
import { WhatsAppAvatar } from './WhatsAppAvatar'

const meta = {
  title: 'Atoms/WhatsAppAvatar',
  component: WhatsAppAvatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Size of the avatar',
    },
    status: {
      control: 'select',
      options: [undefined, 'online', 'offline'],
      description: 'Online status indicator',
    },
    name: {
      control: 'text',
      description: 'Name for initials generation',
    },
    src: {
      control: 'text',
      description: 'Image URL',
    },
  },
} satisfies Meta<typeof WhatsAppAvatar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    name: 'João Silva',
  },
}

export const Online: Story = {
  args: {
    name: 'Maria Santos',
    status: 'online',
  },
}

export const Offline: Story = {
  args: {
    name: 'Pedro Costa',
    status: 'offline',
  },
}

export const WithImage: Story = {
  args: {
    name: 'Ana Paula',
    src: 'https://i.pravatar.cc/150?img=5',
    status: 'online',
  },
}

export const Sizes: Story = {
  args: { name: 'SM', size: 'sm', status: 'online' },
  render: () => (
    <div className="flex items-end gap-4">
      <WhatsAppAvatar name="SM" size="sm" status="online" />
      <WhatsAppAvatar name="MD" size="md" status="online" />
      <WhatsAppAvatar name="LG" size="lg" status="online" />
      <WhatsAppAvatar name="XL" size="xl" status="online" />
    </div>
  ),
}

export const NoName: Story = {
  args: {},
}

export const AllVariants: Story = {
  args: { name: 'Com Nome', status: 'online' },
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <WhatsAppAvatar name="Com Nome" status="online" />
        <WhatsAppAvatar src="https://i.pravatar.cc/150?img=3" status="online" />
        <WhatsAppAvatar status="offline" />
      </div>
      <div className="flex items-end gap-4">
        <WhatsAppAvatar name="P" size="sm" />
        <WhatsAppAvatar name="M" size="md" />
        <WhatsAppAvatar name="G" size="lg" />
        <WhatsAppAvatar name="GG" size="xl" />
      </div>
    </div>
  ),
}
