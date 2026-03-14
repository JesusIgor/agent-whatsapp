import type { Meta, StoryObj } from '@storybook/react'
import { FeedbackCard } from './FeedbackCard'

const meta = {
  title: 'Molecules/FeedbackCard',
  component: FeedbackCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FeedbackCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    quote: 'O Auzap transformou a forma como gerencio meu petshop. Agora meus clientes agendam sozinhos pelo WhatsApp e eu tenho mais tempo para focar no que realmente importa.',
    author: {
      name: 'Maria Santos',
      role: 'Dona do Petshop Amor Animal',
    },
  },
}

export const Short: Story = {
  args: {
    quote: 'Simplesmente incrível! Recomendo para todos os petshops.',
    author: {
      name: 'João Silva',
      role: 'Veterinário',
    },
  },
}

export const PartiallyVisible: Story = {
  args: {
    quote: 'O Auzap me ajudou a organizar minha agenda e reduzir faltas em mais de 50%. Os lembretes automáticos são perfeitos!',
    author: {
      name: 'Ana Paula',
      role: 'Dona do PetCare',
    },
    isPartiallyVisible: true,
  },
}

export const Video: Story = {
  args: {
    variant: 'video',
    author: {
      name: 'Carlos Costa',
      role: 'Fundador do Mundo Pet',
    },
  },
}

export const FeedbackGrid: Story = {
  args: {
    quote: 'O Auzap transformou a forma como gerencio meu petshop. Recomendo muito!',
    author: { name: 'Maria Santos', role: 'Petshop Amor Animal' },
  },
  render: () => (
    <div className="flex gap-4">
      <FeedbackCard
        quote="O Auzap transformou a forma como gerencio meu petshop. Recomendo muito!"
        author={{
          name: 'Maria Santos',
          role: 'Petshop Amor Animal',
        }}
      />
      <FeedbackCard
        variant="video"
        author={{
          name: 'Carlos Costa',
          role: 'Mundo Pet',
        }}
      />
      <FeedbackCard
        quote="Simplesmente incrível!"
        author={{
          name: 'Ana Paula',
          role: 'PetCare',
        }}
        isPartiallyVisible
      />
    </div>
  ),
}
