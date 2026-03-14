import type { Meta, StoryObj } from '@storybook/react'
import { TextArea } from './TextArea'

const meta = {
  title: 'Atoms/TextArea',
  component: TextArea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
    },
    error: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    rows: {
      control: 'number',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TextArea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: 'Digite sua mensagem...',
  },
}

export const WithValue: Story = {
  args: {
    defaultValue: 'Este é um texto de exemplo que foi digitado no campo de texto.',
  },
}

export const WithError: Story = {
  args: {
    placeholder: 'Campo com erro',
    error: true,
    defaultValue: 'Conteúdo inválido',
  },
}

export const Disabled: Story = {
  args: {
    placeholder: 'Campo desabilitado',
    disabled: true,
    defaultValue: 'Este campo não pode ser editado',
  },
}

export const CustomRows: Story = {
  args: {
    placeholder: 'Área de texto maior...',
    rows: 6,
  },
}

export const AllStates: Story = {
  args: { placeholder: 'Normal' },
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <TextArea placeholder="Normal" />
      <TextArea placeholder="Com valor" defaultValue="Texto preenchido" />
      <TextArea placeholder="Com erro" error defaultValue="Erro no campo" />
      <TextArea placeholder="Desabilitado" disabled />
    </div>
  ),
}
