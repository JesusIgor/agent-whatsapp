import type { Meta, StoryObj } from '@storybook/react'
import { Checkbox } from './Checkbox'

const meta = {
  title: 'Atoms/Checkbox',
  component: Checkbox,
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
    checked: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Aceito os termos de uso',
  },
}

export const Checked: Story = {
  args: {
    label: 'Opção selecionada',
    defaultChecked: true,
  },
}

export const WithoutLabel: Story = {
  args: {},
}

export const WithError: Story = {
  args: {
    label: 'Aceito os termos de uso',
    error: 'Este campo é obrigatório',
  },
}

export const Disabled: Story = {
  args: {
    label: 'Opção desabilitada',
    disabled: true,
  },
}

export const DisabledChecked: Story = {
  args: {
    label: 'Opção selecionada e desabilitada',
    disabled: true,
    defaultChecked: true,
  },
}

export const AllStates: Story = {
  args: { label: 'Normal' },
  render: () => (
    <div className="flex flex-col gap-4">
      <Checkbox label="Normal" />
      <Checkbox label="Selecionado" defaultChecked />
      <Checkbox label="Com erro" error="Este campo é obrigatório" />
      <Checkbox label="Desabilitado" disabled />
      <Checkbox label="Desabilitado e selecionado" disabled defaultChecked />
    </div>
  ),
}
