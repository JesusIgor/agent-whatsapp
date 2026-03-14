import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { WhatsAppInput } from './WhatsAppInput'

const meta = {
  title: 'Molecules/WhatsAppInput',
  component: WhatsAppInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof WhatsAppInput>

export default meta
type Story = StoryObj<typeof meta>

const WhatsAppInputDemo = (props: Partial<React.ComponentProps<typeof WhatsAppInput>>) => {
  const [value, setValue] = useState('')

  return (
    <WhatsAppInput
      value={value}
      onChange={setValue}
      onSend={() => {
        alert(`Mensagem enviada: ${value}`)
        setValue('')
      }}
      onAttach={() => alert('Anexar arquivo')}
      onEmojiClick={() => alert('Emoji picker')}
      onMicClick={() => alert('Gravar áudio')}
      {...props}
    />
  )
}

export const Default: Story = {
  args: {
    value: '',
    onChange: () => {},
    onSend: () => {},
  },
  render: () => <WhatsAppInputDemo />,
}

export const CustomPlaceholder: Story = {
  args: {
    value: '',
    onChange: () => {},
    onSend: () => {},
    placeholder: 'Escreva sua mensagem...',
  },
  render: () => <WhatsAppInputDemo placeholder="Escreva sua mensagem..." />,
}

export const Disabled: Story = {
  args: {
    value: '',
    onChange: () => {},
    onSend: () => {},
    disabled: true,
  },
  render: () => <WhatsAppInputDemo disabled />,
}

export const WithMessage: Story = {
  args: {
    value: 'Olá, gostaria de agendar um horário',
    onChange: () => {},
    onSend: () => {},
  },
  render: () => {
    const [value, setValue] = useState('Olá, gostaria de agendar um horário')

    return (
      <WhatsAppInput
        value={value}
        onChange={setValue}
        onSend={() => {
          alert(`Enviado: ${value}`)
          setValue('')
        }}
      />
    )
  },
}
