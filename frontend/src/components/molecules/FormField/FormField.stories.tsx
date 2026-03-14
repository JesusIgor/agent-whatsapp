import type { Meta, StoryObj } from '@storybook/react'
import { FormField } from './FormField'

const meta = {
  title: 'Molecules/FormField',
  component: FormField,
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
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel'],
    },
    required: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FormField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Nome completo',
    placeholder: 'Digite seu nome',
  },
}

export const Email: Story = {
  args: {
    label: 'Email',
    type: 'email',
    placeholder: 'seu@email.com',
  },
}

export const Password: Story = {
  args: {
    label: 'Senha',
    type: 'password',
    placeholder: '••••••••',
  },
}

export const Required: Story = {
  args: {
    label: 'Campo obrigatório',
    placeholder: 'Este campo é obrigatório',
    required: true,
  },
}

export const WithError: Story = {
  args: {
    label: 'Email',
    type: 'email',
    placeholder: 'seu@email.com',
    defaultValue: 'email-invalido',
    error: 'Por favor, insira um email válido',
  },
}

export const Disabled: Story = {
  args: {
    label: 'Campo desabilitado',
    placeholder: 'Não editável',
    disabled: true,
  },
}

export const AllStates: Story = {
  args: { label: 'Normal', placeholder: 'Digite aqui' },
  render: () => (
    <div className="flex flex-col gap-6 w-80">
      <FormField label="Normal" placeholder="Digite aqui" />
      <FormField label="Obrigatório" placeholder="Campo obrigatório" required />
      <FormField label="Com erro" placeholder="Valor inválido" error="Este campo tem um erro" />
      <FormField label="Desabilitado" placeholder="Não editável" disabled />
    </div>
  ),
}
