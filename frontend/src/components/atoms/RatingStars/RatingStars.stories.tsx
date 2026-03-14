import type { Meta, StoryObj } from '@storybook/react'
import { RatingStars } from './RatingStars'

const meta = {
  title: 'Atoms/RatingStars',
  component: RatingStars,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    count: {
      control: { type: 'range', min: 1, max: 5, step: 1 },
      description: 'Number of stars to display',
    },
  },
} satisfies Meta<typeof RatingStars>

export default meta
type Story = StoryObj<typeof meta>

export const FiveStars: Story = {
  args: {
    count: 5,
  },
}

export const FourStars: Story = {
  args: {
    count: 4,
  },
}

export const ThreeStars: Story = {
  args: {
    count: 3,
  },
}

export const TwoStars: Story = {
  args: {
    count: 2,
  },
}

export const OneStar: Story = {
  args: {
    count: 1,
  },
}

export const AllRatings: Story = {
  args: { count: 5 },
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <RatingStars count={5} />
        <span className="text-sm text-gray-600 dark:text-gray-400">5 estrelas</span>
      </div>
      <div className="flex items-center gap-3">
        <RatingStars count={4} />
        <span className="text-sm text-gray-600 dark:text-gray-400">4 estrelas</span>
      </div>
      <div className="flex items-center gap-3">
        <RatingStars count={3} />
        <span className="text-sm text-gray-600 dark:text-gray-400">3 estrelas</span>
      </div>
      <div className="flex items-center gap-3">
        <RatingStars count={2} />
        <span className="text-sm text-gray-600 dark:text-gray-400">2 estrelas</span>
      </div>
      <div className="flex items-center gap-3">
        <RatingStars count={1} />
        <span className="text-sm text-gray-600 dark:text-gray-400">1 estrela</span>
      </div>
    </div>
  ),
}
