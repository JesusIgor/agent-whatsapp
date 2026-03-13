import { Request, Response } from 'express'
import { prisma } from '../../lib/prisma'
import { signToken } from '../../lib/jwt'

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as { email?: string; password?: string }

  if (!email || !password) {
    res.status(400).json({ error: 'Email e senha são obrigatórios' })
    return
  }

  try {
    const user = await prisma.saasUser.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: {
        company: {
          include: { petshop: true },
        },
      },
    })

    if (!user || !user.isActive) {
      res.status(401).json({ error: 'Credenciais inválidas' })
      return
    }

    await prisma.saasUser.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    })

    const token = signToken({
      userId: user.id,
      companyId: user.companyId,
      role: user.role ?? 'staff',
      name: user.name,
    })

    const clientPhone =
      user.company.petshop?.ownerPhone ??
      user.company.petshop?.phone ??
      null

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
        companyName: user.company.name,
        clientPhone,
      },
    })
  } catch (err) {
    console.error('[Auth] Erro no login:', err)
    res.status(500).json({ error: 'Erro interno ao realizar login' })
  }
}
