import { Request, Response } from 'express'
import { AuthRequest } from '../../middleware/auth'
import { runAgent } from '../../agent/AgentService'
import { prisma } from '../../lib/prisma'

export async function chat(req: Request, res: Response): Promise<void> {
  const { companyId } = (req as AuthRequest).user!
  const { message, clientPhone } = req.body as { message?: string; clientPhone?: string }

  if (!message?.trim() || !clientPhone?.trim()) {
    res.status(400).json({ error: 'message e clientPhone são obrigatórios' })
    return
  }

  try {
    const result = await runAgent(companyId, clientPhone, message.trim())

    // Persiste no DB de forma assíncrona para não bloquear a resposta
    persistMessages(companyId, clientPhone, message.trim(), result.reply).catch((err) =>
      console.warn('[AgentController] Erro ao salvar no DB:', err)
    )

    res.json(result)
  } catch (err: any) {
    res.status(502).json({ error: err.message || 'Erro ao processar mensagem no agente' })
  }
}

export async function getHistory(req: Request, res: Response): Promise<void> {
  const { companyId } = (req as AuthRequest).user!
  const { phone } = req.query as { phone?: string }

  if (!phone) {
    res.status(400).json({ error: 'phone é obrigatório' })
    return
  }

  try {
    const client = await prisma.client.findUnique({
      where: { companyId_phone: { companyId, phone } },
    })

    if (!client) {
      res.json([])
      return
    }

    const conversation = await prisma.agentConversation.findFirst({
      where: { companyId, clientId: client.id },
      orderBy: { startedAt: 'desc' },
    })

    if (!conversation) {
      res.json([])
      return
    }

    const messages = await prisma.agentMessage.findMany({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: 'asc' },
      select: { id: true, role: true, content: true, createdAt: true },
    })

    res.json(messages)
  } catch (err) {
    console.error('[AgentController] Erro ao buscar histórico:', err)
    res.status(500).json({ error: 'Erro ao carregar histórico' })
  }
}

async function persistMessages(
  companyId: number,
  clientPhone: string,
  userMessage: string,
  agentReply: string
): Promise<void> {
  let client = await prisma.client.findUnique({
    where: { companyId_phone: { companyId, phone: clientPhone } },
  })

  if (!client) {
    client = await prisma.client.create({
      data: { companyId, phone: clientPhone, lastMessageAt: new Date() },
    })
  } else {
    await prisma.client.update({
      where: { id: client.id },
      data: { lastMessageAt: new Date() },
    })
  }

  let conversation = await prisma.agentConversation.findFirst({
    where: { companyId, clientId: client.id },
    orderBy: { startedAt: 'desc' },
  })

  if (!conversation) {
    conversation = await prisma.agentConversation.create({
      data: {
        companyId,
        clientId: client.id,
        whatsappNumber: clientPhone,
        lastMessageAt: new Date(),
      },
    })
  } else {
    await prisma.agentConversation.update({
      where: { id: conversation.id },
      data: { lastMessageAt: new Date() },
    })
  }

  await prisma.agentMessage.createMany({
    data: [
      { conversationId: conversation.id, companyId, role: 'user', content: userMessage },
      { conversationId: conversation.id, companyId, role: 'assistant', content: agentReply },
    ],
  })
}
