import type { Meta, StoryObj } from '@storybook/react'
import { Plus } from 'lucide-react'
import { EmptyState } from './EmptyState'

const meta = {
  title: 'Molecules/EmptyState',
  component: EmptyState,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    image: {
      control: 'select',
      options: ['bored', 'video_call', 'pets_not_found', 'not_found_clientes_ativos'],
    },
    title: {
      control: 'text',
    },
    description: {
      control: 'text',
    },
    buttonText: {
      control: 'text',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof EmptyState>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    image: 'bored',
    title: 'Nenhum resultado encontrado',
    description: 'Não encontramos nenhum item com os filtros selecionados.',
  },
}

export const WithButton: Story = {
  args: {
    image: 'pets_not_found',
    title: 'Nenhum pet cadastrado',
    description: 'Cadastre o primeiro pet para começar a gerenciar seus agendamentos.',
    buttonText: 'Cadastrar Pet',
    buttonIcon: <Plus className="w-4 h-4 mr-2" />,
    onButtonClick: () => alert('Cadastrar pet'),
  },
}

export const NoClients: Story = {
  args: {
    image: 'not_found_clientes_ativos',
    title: 'Sem clientes ativos',
    description: 'Você ainda não tem clientes ativos no momento. Comece a adicionar clientes para gerenciar sua agenda.',
    buttonText: 'Adicionar Cliente',
    onButtonClick: () => alert('Adicionar cliente'),
  },
}

export const VideoCall: Story = {
  args: {
    image: 'video_call',
    title: 'Sem consultas agendadas',
    description: 'Você não tem consultas por vídeo agendadas no momento.',
  },
}

export const AllVariants: Story = {
  args: {
    image: 'bored',
    title: 'Sem resultados',
    description: 'Tente ajustar os filtros.',
  },
  render: () => (
    <div className="grid grid-cols-2 gap-8">
      <EmptyState
        image="bored"
        title="Sem resultados"
        description="Tente ajustar os filtros."
      />
      <EmptyState
        image="pets_not_found"
        description="Nenhum pet encontrado."
      />
      <EmptyState
        image="not_found_clientes_ativos"
        title="Sem clientes"
        description="Adicione seu primeiro cliente."
        buttonText="Adicionar"
        onButtonClick={() => {}}
      />
      <EmptyState
        image="video_call"
        description="Sem consultas agendadas."
      />
    </div>
  ),
}
