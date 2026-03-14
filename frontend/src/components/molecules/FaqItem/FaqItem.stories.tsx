import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { FaqItem } from './FaqItem'

const meta = {
  title: 'Molecules/FaqItem',
  component: FaqItem,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isExpanded: {
      control: 'boolean',
    },
    isExpandable: {
      control: 'boolean',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[500px] p-4 bg-[#0D0D0E]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FaqItem>

export default meta
type Story = StoryObj<typeof meta>

export const Collapsed: Story = {
  args: {
    question: 'Como funciona o agendamento automático?',
    answer: 'O agendamento automático permite que seus clientes agendem serviços diretamente pelo WhatsApp, sem precisar de intervenção manual. A IA entende a solicitação e sugere horários disponíveis.',
    isExpanded: false,
  },
}

export const Expanded: Story = {
  args: {
    question: 'Posso personalizar as mensagens automáticas?',
    answer: 'Sim! Você pode personalizar todas as mensagens que o Auzap envia, incluindo confirmações de agendamento, lembretes e mensagens de boas-vindas.',
    isExpanded: true,
  },
}

export const NotExpandable: Story = {
  args: {
    question: 'Esta é uma pergunta sem resposta expansível',
    isExpandable: false,
  },
}

export const Interactive: Story = {
  args: {
    question: 'Quanto custa o Auzap?',
    answer: 'O Auzap oferece planos a partir de R$ 99/mês.',
    isExpanded: false,
  },
  render: () => {
    const [expanded, setExpanded] = useState<number | null>(null)

    const faqs = [
      {
        question: 'Quanto custa o Auzap?',
        answer: 'O Auzap oferece planos a partir de R$ 99/mês. Temos planos para diferentes tamanhos de negócio.',
      },
      {
        question: 'Preciso de conhecimento técnico?',
        answer: 'Não! O Auzap foi feito para ser simples. Você conecta seu WhatsApp e começa a usar em minutos.',
      },
      {
        question: 'Posso testar antes de assinar?',
        answer: 'Sim! Oferecemos 14 dias de teste grátis, sem compromisso e sem cartão de crédito.',
      },
    ]

    return (
      <div className="flex flex-col gap-3">
        {faqs.map((faq, index) => (
          <FaqItem
            key={index}
            question={faq.question}
            answer={faq.answer}
            isExpanded={expanded === index}
            onClick={() => setExpanded(expanded === index ? null : index)}
          />
        ))}
      </div>
    )
  },
}
