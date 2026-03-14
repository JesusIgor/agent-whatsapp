import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Modal } from './Modal'
import { Button } from '@/components/atoms/Button'

const meta = {
  title: 'Molecules/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
    },
    submitText: {
      control: 'text',
    },
    cancelText: {
      control: 'text',
    },
    isLoading: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

const ModalDemo = ({ title, submitText, cancelText, isLoading, hasSubmit = true }: {
  title: string
  submitText?: string
  cancelText?: string
  isLoading?: boolean
  hasSubmit?: boolean
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Abrir Modal</Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={title}
        onSubmit={hasSubmit ? () => alert('Submit!') : undefined}
        submitText={submitText}
        cancelText={cancelText}
        isLoading={isLoading}
      >
        <p className="text-sm text-[#727B8E] dark:text-[#8a94a6]">
          Este é o conteúdo do modal. Você pode adicionar qualquer conteúdo aqui.
        </p>
      </Modal>
    </>
  )
}

export const Default: Story = {
  args: {
    isOpen: false,
    onClose: () => {},
    title: 'Título do Modal',
    children: null,
  },
  render: () => <ModalDemo title="Título do Modal" />,
}

export const WithCustomButtons: Story = {
  args: {
    isOpen: false,
    onClose: () => {},
    title: 'Confirmar Ação',
    children: null,
    submitText: 'Confirmar',
    cancelText: 'Voltar',
  },
  render: () => (
    <ModalDemo
      title="Confirmar Ação"
      submitText="Confirmar"
      cancelText="Voltar"
    />
  ),
}

export const Loading: Story = {
  args: {
    isOpen: false,
    onClose: () => {},
    title: 'Processando...',
    children: null,
    submitText: 'Salvar',
    isLoading: true,
  },
  render: () => (
    <ModalDemo
      title="Processando..."
      submitText="Salvar"
      isLoading
    />
  ),
}

export const NoSubmitButton: Story = {
  args: {
    isOpen: false,
    onClose: () => {},
    title: 'Informações',
    children: null,
  },
  render: () => (
    <ModalDemo
      title="Informações"
      hasSubmit={false}
    />
  ),
}

export const WithForm: Story = {
  args: {
    isOpen: false,
    onClose: () => {},
    title: 'Novo Cliente',
    children: null,
    submitText: 'Cadastrar',
  },
  render: () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Cadastrar Cliente</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Novo Cliente"
          onSubmit={() => alert('Cliente cadastrado!')}
          submitText="Cadastrar"
          className="sm:w-[450px]"
        >
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-[#434A57] dark:text-[#f5f9fc] mb-1">Nome</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-[#727B8E]/10 dark:border-[#40485A] rounded-md bg-[#FAFAFA] dark:bg-[#212225] text-[#434A57] dark:text-[#f5f9fc]"
                placeholder="Nome completo"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#434A57] dark:text-[#f5f9fc] mb-1">Telefone</label>
              <input
                type="tel"
                className="w-full px-3 py-2 border border-[#727B8E]/10 dark:border-[#40485A] rounded-md bg-[#FAFAFA] dark:bg-[#212225] text-[#434A57] dark:text-[#f5f9fc]"
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>
        </Modal>
      </>
    )
  },
}
