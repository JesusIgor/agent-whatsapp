import { proto } from '@whiskeysockets/baileys'
import { prisma } from '../../lib/prisma'
import { sendTextMessage } from '../../services/baileysService'
import { runAgent } from '../../agent/AgentService'

// ─────────────────────────────────────────
// Processa mensagem recebida do Baileys
// ─────────────────────────────────────────
export async function handleIncomingMessage(
  companyId: number,
  socket: any,
  msg: proto.IWebMessageInfo
): Promise<void> {
  const jid = msg.key.remoteJid!
  const phone = jid.replace('@s.whatsapp.net', '').replace('@g.us', '')

  // Extrai texto da mensagem
  const text =
    msg.message?.conversation ||
    msg.message?.extendedTextMessage?.text ||
    msg.message?.imageMessage?.caption ||
    ''

  if (!text) {
    console.log(`[Handler][company:${companyId}] Mensagem sem texto, ignorando.`)
    return
  }

  console.log(`[Handler][company:${companyId}] Mensagem de ${phone}: ${text}`)

  // ── 1. Busca ou cria o cliente ───────────
  // Client tem @@unique([companyId, phone]) no novo schema
  let client = await prisma.client.findUnique({
    where: { companyId_phone: { companyId, phone } },
  })

  if (!client) {
    client = await prisma.client.create({
      data: {
        companyId,
        phone,
        conversationStage: 'initial',
        lastMessageAt: new Date(),
      },
    })
    console.log(`[Handler][company:${companyId}] Novo cliente criado: ${phone}`)
  } else {
    await prisma.client.update({
      where: { id: client.id },
      data: { lastMessageAt: new Date() },
    })
  }

  // ── 2. Busca ou cria conversa ────────────
  let conversation = await prisma.agentConversation.findFirst({
    where: { companyId, clientId: client.id },
    orderBy: { startedAt: 'desc' },
  })

  if (!conversation) {
    conversation = await prisma.agentConversation.create({
      data: {
        companyId,
        clientId: client.id,
        whatsappNumber: phone,
        lastMessageAt: new Date(),
      },
    })
  } else {
    await prisma.agentConversation.update({
      where: { id: conversation.id },
      data: { lastMessageAt: new Date() },
    })
  }

  // ── 3. Salva mensagem do usuário ─────────
  await prisma.agentMessage.create({
    data: {
      conversationId: conversation.id,
      companyId,
      role: 'user',
      content: text,
    },
  })

  // ── 4. Gera e envia resposta do agente ───
  if (!client.aiPaused) {
    const reply = await generateAgentReply(companyId, phone, text)

    if (reply) {
      await prisma.agentMessage.create({
        data: {
          conversationId: conversation.id,
          companyId,
          role: 'assistant',
          content: reply,
        },
      })

      await sendTextMessage(String(companyId), jid, reply)
      console.log(`[Handler][company:${companyId}] Resposta enviada para ${phone}`)
    }
  } else {
    console.log(`[Handler][company:${companyId}] IA pausada para ${phone}, mensagem salva sem resposta.`)
  }
}

// ─────────────────────────────────────────
// Chama o ai-service para gerar resposta
// ─────────────────────────────────────────
async function generateAgentReply(
  companyId: number,
  phone: string,
  userMessage: string
): Promise<string | null> {
  try {
    const response = await runAgent(companyId, phone, userMessage)
    return response.reply
  } catch (err) {
    console.error(`[Handler][company:${companyId}] Erro ao chamar AgentService:`, err)
    return 'Desculpe, estou com dificuldades técnicas no momento. Tente novamente em alguns instantes. 🐾'
  }
}