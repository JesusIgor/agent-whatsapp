import type { Meta, StoryObj } from '@storybook/react'
import { Icon } from './Icon'

const meta = {
  title: 'Atoms/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'select',
      options: ['cat', 'star', 'google', 'twitter', 'facebook', 'linkedin', 'instagram', 'check_circle', 'close_circle', 'footprint_left', 'footprint_right'],
      description: 'Icon name from assets',
    },
    width: {
      control: { type: 'range', min: 16, max: 64, step: 4 },
      description: 'Icon width in pixels',
    },
    height: {
      control: { type: 'range', min: 16, max: 64, step: 4 },
      description: 'Icon height in pixels',
    },
  },
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

export const Cat: Story = {
  args: {
    name: 'cat',
  },
}

export const Star: Story = {
  args: {
    name: 'star',
  },
}

export const CheckCircle: Story = {
  args: {
    name: 'check_circle',
  },
}

export const CloseCircle: Story = {
  args: {
    name: 'close_circle',
  },
}

export const Large: Story = {
  args: {
    name: 'cat',
    width: 48,
    height: 48,
  },
}

export const Small: Story = {
  args: {
    name: 'cat',
    width: 16,
    height: 16,
  },
}

export const SocialIcons: Story = {
  args: { name: 'google' },
  render: () => (
    <div className="flex items-center gap-4">
      <Icon name="google" />
      <Icon name="facebook" />
      <Icon name="twitter" />
      <Icon name="linkedin" />
      <Icon name="instagram" />
    </div>
  ),
}

export const Footprints: Story = {
  args: { name: 'footprint_left', width: 32, height: 32 },
  render: () => (
    <div className="flex items-center gap-4">
      <Icon name="footprint_left" width={32} height={32} />
      <Icon name="footprint_right" width={32} height={32} />
    </div>
  ),
}

export const AllIcons: Story = {
  args: { name: 'cat' },
  render: () => (
    <div className="grid grid-cols-4 gap-6">
      <div className="flex flex-col items-center gap-2">
        <Icon name="cat" />
        <span className="text-xs text-gray-500">cat</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon name="star" />
        <span className="text-xs text-gray-500">star</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon name="google" />
        <span className="text-xs text-gray-500">google</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon name="twitter" />
        <span className="text-xs text-gray-500">twitter</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon name="facebook" />
        <span className="text-xs text-gray-500">facebook</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon name="linkedin" />
        <span className="text-xs text-gray-500">linkedin</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon name="instagram" />
        <span className="text-xs text-gray-500">instagram</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon name="check_circle" />
        <span className="text-xs text-gray-500">check_circle</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon name="close_circle" />
        <span className="text-xs text-gray-500">close_circle</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon name="footprint_left" />
        <span className="text-xs text-gray-500">footprint_left</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon name="footprint_right" />
        <span className="text-xs text-gray-500">footprint_right</span>
      </div>
    </div>
  ),
}
