import type { Meta, StoryObj } from '@storybook/react'
import { CtaCard } from './CtaCard'

const meta = {
  title: 'Molecules/CtaCard',
  component: CtaCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
    },
    buttonText: {
      control: 'text',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[600px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CtaCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const CustomTitle: Story = {
  args: {
    title: 'Automatize seu petshop com IA',
    buttonText: 'Começar agora',
  },
}

export const WithHandler: Story = {
  args: {
    title: 'Pronto para transformar seu negócio?',
    buttonText: 'Falar com consultor',
    onClick: () => alert('CTA clicked!'),
  },
}

export const ShortTitle: Story = {
  args: {
    title: 'Experimente grátis por 14 dias',
    buttonText: 'Criar conta grátis',
  },
}
