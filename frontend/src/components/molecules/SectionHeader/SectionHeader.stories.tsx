import type { Meta, StoryObj } from '@storybook/react'
import { SectionHeader } from './SectionHeader'

const meta = {
  title: 'Molecules/SectionHeader',
  component: SectionHeader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    align: {
      control: 'select',
      options: ['left', 'center'],
    },
    titleColor: {
      control: 'select',
      options: ['dark', 'white'],
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[700px] p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SectionHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Funcionalidades',
    title: 'Tudo que você precisa para gerenciar seu petshop',
    description: 'Automatize tarefas, organize agendamentos e encante seus clientes com o Auzap.',
  },
}

export const Centered: Story = {
  args: {
    label: 'Depoimentos',
    title: 'O que nossos clientes dizem',
    description: 'Veja como o Auzap está transformando petshops em todo o Brasil.',
    align: 'center',
  },
}

export const WhiteText: Story = {
  decorators: [
    (Story) => (
      <div className="w-[700px] p-8 bg-[#0D0D0E] rounded-lg">
        <Story />
      </div>
    ),
  ],
  args: {
    label: 'Planos',
    title: 'Escolha o plano ideal para você',
    description: 'Comece gratuitamente e escale conforme seu negócio cresce.',
    titleColor: 'white',
    align: 'center',
  },
}

export const NoDescription: Story = {
  args: {
    label: 'FAQ',
    title: 'Perguntas frequentes',
  },
}

export const WithMaxWidth: Story = {
  args: {
    label: 'Sobre',
    title: 'A plataforma completa para petshops modernos',
    description: 'Criamos o Auzap para resolver os maiores problemas dos donos de petshops: falta de tempo, clientes esquecendo de confirmar e agenda desorganizada.',
    titleMaxWidth: '500px',
  },
}
