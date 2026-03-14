import type { Meta, StoryObj } from '@storybook/react'
import { SectionLabel } from './SectionLabel'

const meta = {
  title: 'Atoms/SectionLabel',
  component: SectionLabel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: 'Label text content',
    },
  },
} satisfies Meta<typeof SectionLabel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Seção',
  },
}

export const Testimonials: Story = {
  args: {
    children: 'Depoimentos',
  },
}

export const Features: Story = {
  args: {
    children: 'Funcionalidades',
  },
}

export const Pricing: Story = {
  args: {
    children: 'Planos e Preços',
  },
}

export const AllLabels: Story = {
  args: { children: 'Início' },
  render: () => (
    <div className="flex flex-col gap-4">
      <SectionLabel>Início</SectionLabel>
      <SectionLabel>Funcionalidades</SectionLabel>
      <SectionLabel>Depoimentos</SectionLabel>
      <SectionLabel>Planos</SectionLabel>
      <SectionLabel>Contato</SectionLabel>
    </div>
  ),
}
