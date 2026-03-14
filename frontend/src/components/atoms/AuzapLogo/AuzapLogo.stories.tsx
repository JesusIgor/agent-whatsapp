import type { Meta, StoryObj } from '@storybook/react'
import { AuzapLogo } from './AuzapLogo'

const meta = {
  title: 'Atoms/AuzapLogo',
  component: AuzapLogo,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AuzapLogo>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const OnDarkBackground: Story = {
  decorators: [
    (Story) => (
      <div className="bg-gray-900 p-8 rounded-lg">
        <Story />
      </div>
    ),
  ],
}

export const WithText: Story = {
  args: {},
  render: () => (
    <div className="flex items-center gap-4">
      <AuzapLogo />
      <span className="text-2xl font-bold text-gray-800 dark:text-white">Auzap</span>
    </div>
  ),
}
