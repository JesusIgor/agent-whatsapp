import type { Meta, StoryObj } from '@storybook/react'
import { RealtimeNotifications } from './RealtimeNotifications'

const meta = {
  title: 'Molecules/RealtimeNotifications',
  component: RealtimeNotifications,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="p-8 flex justify-end w-[500px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RealtimeNotifications>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const WithHandler: Story = {
  args: {
    onNotificationClick: (notification) => alert(`Clicked: ${notification.title}`),
  },
}
