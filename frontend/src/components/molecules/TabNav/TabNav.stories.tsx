import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { TabNav } from './TabNav'

const meta = {
  title: 'Molecules/TabNav',
  component: TabNav,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="p-4 bg-[#F4F6F9] dark:bg-[#1A1D24] rounded-lg">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TabNav>

export default meta
type Story = StoryObj<typeof meta>

const TabNavDemo = ({ tabs, initialTab }: { tabs: { id: string; label: string; count?: number }[]; initialTab?: string }) => {
  const [activeTab, setActiveTab] = useState(initialTab || tabs[0].id)

  return (
    <TabNav
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    />
  )
}

export const Default: Story = {
  args: {
    tabs: [
      { id: 'all', label: 'Todos' },
      { id: 'active', label: 'Ativos' },
      { id: 'inactive', label: 'Inativos' },
    ],
    activeTab: 'all',
    onTabChange: () => {},
  },
  render: () => (
    <TabNavDemo
      tabs={[
        { id: 'all', label: 'Todos' },
        { id: 'active', label: 'Ativos' },
        { id: 'inactive', label: 'Inativos' },
      ]}
    />
  ),
}

export const WithCounts: Story = {
  args: {
    tabs: [
      { id: 'all', label: 'Todos', count: 156 },
      { id: 'pending', label: 'Pendentes', count: 12 },
      { id: 'confirmed', label: 'Confirmados', count: 89 },
      { id: 'cancelled', label: 'Cancelados', count: 5 },
    ],
    activeTab: 'all',
    onTabChange: () => {},
  },
  render: () => (
    <TabNavDemo
      tabs={[
        { id: 'all', label: 'Todos', count: 156 },
        { id: 'pending', label: 'Pendentes', count: 12 },
        { id: 'confirmed', label: 'Confirmados', count: 89 },
        { id: 'cancelled', label: 'Cancelados', count: 5 },
      ]}
    />
  ),
}

export const TwoTabs: Story = {
  args: {
    tabs: [
      { id: 'day', label: 'Dia' },
      { id: 'week', label: 'Semana' },
    ],
    activeTab: 'day',
    onTabChange: () => {},
  },
  render: () => (
    <TabNavDemo
      tabs={[
        { id: 'day', label: 'Dia' },
        { id: 'week', label: 'Semana' },
      ]}
    />
  ),
}

export const PipelineTabs: Story = {
  args: {
    tabs: [
      { id: 'new', label: 'Novos', count: 8 },
      { id: 'contacted', label: 'Contactados', count: 15 },
      { id: 'scheduled', label: 'Agendados', count: 23 },
      { id: 'completed', label: 'Concluídos', count: 145 },
    ],
    activeTab: 'new',
    onTabChange: () => {},
  },
  render: () => (
    <TabNavDemo
      tabs={[
        { id: 'new', label: 'Novos', count: 8 },
        { id: 'contacted', label: 'Contactados', count: 15 },
        { id: 'scheduled', label: 'Agendados', count: 23 },
        { id: 'completed', label: 'Concluídos', count: 145 },
      ]}
    />
  ),
}
