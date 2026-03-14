import type { Meta, StoryObj } from '@storybook/react'
import { Select } from './Select'

const sampleOptions = [
  { value: 'banho', label: 'Banho' },
  { value: 'tosa', label: 'Tosa' },
  { value: 'banho-tosa', label: 'Banho e Tosa' },
  { value: 'consulta', label: 'Consulta Veterinária' },
  { value: 'vacina', label: 'Vacinação' },
]

const meta = {
  title: 'Atoms/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
    },
    error: {
      control: 'text',
    },
    required: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    placeholder: {
      control: 'text',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    options: sampleOptions,
    placeholder: 'Selecione um serviço',
  },
}

export const WithLabel: Story = {
  args: {
    label: 'Serviço',
    options: sampleOptions,
    placeholder: 'Selecione um serviço',
  },
}

export const Required: Story = {
  args: {
    label: 'Serviço',
    options: sampleOptions,
    placeholder: 'Selecione um serviço',
    required: true,
  },
}

export const WithError: Story = {
  args: {
    label: 'Serviço',
    options: sampleOptions,
    placeholder: 'Selecione um serviço',
    error: 'Selecione um serviço',
  },
}

export const Disabled: Story = {
  args: {
    label: 'Serviço',
    options: sampleOptions,
    placeholder: 'Selecione um serviço',
    disabled: true,
  },
}

export const WithSelectedValue: Story = {
  args: {
    label: 'Serviço',
    options: sampleOptions,
    defaultValue: 'banho-tosa',
  },
}

export const AllStates: Story = {
  args: { label: 'Normal', options: sampleOptions, placeholder: 'Selecione...' },
  render: () => (
    <div className="flex flex-col gap-6 w-80">
      <Select label="Normal" options={sampleOptions} placeholder="Selecione..." />
      <Select label="Obrigatório" options={sampleOptions} placeholder="Selecione..." required />
      <Select label="Com valor" options={sampleOptions} defaultValue="banho" />
      <Select label="Com erro" options={sampleOptions} placeholder="Selecione..." error="Campo obrigatório" />
      <Select label="Desabilitado" options={sampleOptions} placeholder="Selecione..." disabled />
    </div>
  ),
}
