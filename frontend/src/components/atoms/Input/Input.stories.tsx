import type { Meta, StoryObj } from '@storybook/react'
import { Mail, Search, User } from 'lucide-react'
import { Input } from './Input'

const meta = {
  title: 'Atoms/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel'],
    },
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
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: 'Digite algo...',
  },
}

export const WithLabel: Story = {
  args: {
    label: 'Email',
    placeholder: 'seu@email.com',
    type: 'email',
  },
}

export const Required: Story = {
  args: {
    label: 'Nome completo',
    placeholder: 'João Silva',
    required: true,
  },
}

export const Password: Story = {
  args: {
    label: 'Senha',
    type: 'password',
    placeholder: '••••••••',
  },
}

export const WithError: Story = {
  args: {
    label: 'Email',
    placeholder: 'seu@email.com',
    error: 'Email inválido',
    defaultValue: 'email-invalido',
  },
}

export const WithIconLeft: Story = {
  args: {
    placeholder: 'Buscar...',
    iconLeft: <Search className="w-5 h-5" />,
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
      <Input label="Normal" placeholder="Digite aqui" />
      <Input label="Com ícone" placeholder="Buscar..." iconLeft={<Search className="w-5 h-5" />} />
      <Input label="Obrigatório" placeholder="Campo obrigatório" required />
      <Input label="Senha" type="password" placeholder="••••••••" />
      <Input label="Com erro" placeholder="Valor inválido" error="Este campo tem um erro" />
      <Input label="Desabilitado" placeholder="Não editável" disabled />
    </div>
  ),
}
