import { z } from 'zod'

export const emailSchema = z.string().email('E-mail inválido')
export const passwordSchema = z.string().min(8, 'Senha deve ter no mínimo 8 caracteres')
