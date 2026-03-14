import type { Meta, StoryObj } from '@storybook/react'
import { AuthHeader } from './AuthHeader'

const meta = {
  title: 'Molecules/AuthHeader',
  component: AuthHeader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
    },
    subtitle: {
      control: 'text',
    },
  },
} satisfies Meta<typeof AuthHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Login: Story = {
  args: {
    title: 'Bem-vindo de volta',
    subtitle: 'Entre com suas credenciais para acessar sua conta',
  },
}

export const Register: Story = {
  args: {
    title: 'Crie sua conta',
    subtitle: 'Preencha os dados abaixo para começar',
  },
}

export const ForgotPassword: Story = {
  args: {
    title: 'Esqueceu sua senha?',
    subtitle: 'Digite seu email e enviaremos um link de recuperação',
  },
}

export const ResetPassword: Story = {
  args: {
    title: 'Redefinir senha',
    subtitle: 'Digite sua nova senha abaixo',
  },
}

export const Verification: Story = {
  args: {
    title: 'Verificar email',
    subtitle: 'Digite o código enviado para seu email',
  },
}
