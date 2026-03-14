import type { Meta, StoryObj } from '@storybook/react'
import { AuthLink } from './AuthLink'

const meta = {
  title: 'Atoms/AuthLink',
  component: AuthLink,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: 'text',
      description: 'Text before the link',
    },
    linkText: {
      control: 'text',
      description: 'Clickable link text',
    },
    href: {
      control: 'text',
      description: 'Link destination',
    },
  },
} satisfies Meta<typeof AuthLink>

export default meta
type Story = StoryObj<typeof meta>

export const SignUp: Story = {
  args: {
    text: 'Não tem uma conta?',
    linkText: 'Cadastre-se',
    href: '/cadastro',
  },
}

export const SignIn: Story = {
  args: {
    text: 'Já tem uma conta?',
    linkText: 'Faça login',
    href: '/login',
  },
}

export const ForgotPassword: Story = {
  args: {
    text: 'Esqueceu sua senha?',
    linkText: 'Recuperar senha',
    href: '/recuperar-senha',
  },
}

export const Terms: Story = {
  args: {
    text: 'Ao continuar, você aceita nossos',
    linkText: 'Termos de uso',
    href: '/termos',
  },
}

export const AllVariants: Story = {
  args: {
    text: 'Não tem uma conta?',
    linkText: 'Cadastre-se',
    href: '/cadastro',
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <AuthLink text="Não tem uma conta?" linkText="Cadastre-se" href="/cadastro" />
      <AuthLink text="Já tem uma conta?" linkText="Faça login" href="/login" />
      <AuthLink text="Esqueceu sua senha?" linkText="Recuperar senha" href="/recuperar-senha" />
      <AuthLink text="Ao continuar, você aceita nossos" linkText="Termos de uso" href="/termos" />
    </div>
  ),
}
