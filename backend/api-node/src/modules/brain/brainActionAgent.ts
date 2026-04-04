import { getBrainDateContextPromptLine } from '../../secondBrain/clockContext'
import { sanitizeAssistantHistoryContent, sanitizeUserFacingReply } from '../../secondBrain/sanitize'
import { BRAIN_ACTION_HISTORY_LIMIT } from './brainPlanConstants'
import { ACTION_BRAIN_TOOLS, executeActionBrainTool } from './brainActionTools'
import type { BrainMessage } from './brain.types'

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions'

const MAX_TOOL_STEPS = 12

type OpenAiToolCall = {
  id: string
  type: 'function'
  function: { name: string; arguments: string }
}

type OpenAiAssistantMessage = {
  role: 'assistant'
  content: string | null
  tool_calls?: OpenAiToolCall[]
}

function tryParseStructuredUiPayload(toolOutput: string): string | null {
  const trimmed = toolOutput.trim()
  if (!trimmed.startsWith('{')) return null
  try {
    const p = JSON.parse(trimmed) as { type?: string }
    if (p.type === 'campaign_draft' || p.type === 'appointment_created' || p.type === 'appointment_draft') {
      return JSON.stringify(p)
    }
  } catch {
    return null
  }
  return null
}

function buildHistoryMessages(history: BrainMessage[], max: number): Array<{ role: 'user' | 'assistant'; content: string }> {
  return history
    .filter((m) => m && typeof m.content === 'string')
    .slice(-max)
    .map((m): { role: 'user' | 'assistant'; content: string } => {
      const role: 'user' | 'assistant' = m.role === 'assistant' ? 'assistant' : 'user'
      const content = role === 'assistant' ? sanitizeAssistantHistoryContent(m.content) : m.content
      return { role, content }
    })
    .filter((m) => m.content.length > 0)
}

export async function runBrainActionAgent(params: {
  apiKey: string
  model: string
  companyId: number
  petshopName: string
  assistantName: string
  message: string
  history: BrainMessage[]
}): Promise<{ reply: string }> {
  const hist = buildHistoryMessages(params.history, BRAIN_ACTION_HISTORY_LIMIT)

  const system = `Você é ${params.assistantName}, assistente do petshop ${params.petshopName} no painel do dono.
${getBrainDateContextPromptLine()}

Você ajuda com operações: agendamento manual (buscar cliente, pets, serviços, horários livres, confirmar e criar), listar/cancelar/remarcar agendamentos (incluindo em lote), cadastro de cliente, e rascunho de campanha de reativação.

Regras:
- Use as ferramentas; não invente UUIDs. Cliente: search_clients. Pets: get_client_pets_for_scheduling devolve JSON type pets_catalog com pets[{id,name,...}] — em toda chamada seguinte envie pet_id desse JSON e pet_name igual ao name (o servidor corrige UUID errado pelo nome+cliente). Serviços: list_active_services → services_catalog; id + service_name nos próximos passos.
- Telefone com DDI em dígitos (ex.: 5511999999999).
- Fluxo de agendamento: list_active_services → get_available_times (client_id + pet_id + pet_name + service_id + service_name quando possível) → create_appointment_draft com os mesmos campos; ao fechar data/hora, prefira o cartão com botão de confirmar. Só use create_manual_appointment se ele pedir para gravar na hora sem cartão.
- Vários agendamentos: create_manual_appointments_batch (itens com os mesmos campos do create manual). Para cancelar/remarcar vários: search_appointments (filtros opcionais) → appointment_ids do JSON → cancel_appointments_batch ou reschedule_appointments_batch (new_slot_id ou new_scheduled_date+new_time por item). Remarcação em lote não cobre par de dois horários (G/GG): nesses casos cancele o par e recrie.
- Cancelamento unitário: cancel_appointment. IDs de agendamento: search_appointments ou SQL — não invente UUID.
- O histórico do chat não guarda slot_id: se o dono disser só "às 10" ou "confirmo", use create_manual_appointment ou create_appointment_draft com scheduled_date + time (HH:MM) + service_id + pet_id — o servidor resolve o slot. Se tiver o slot_id da última chamada get_available_times na mesma conversa, pode enviá-lo.
- Para campanha: use search_clients se precisar; create_campaign_draft pode listar até vários UUIDs no rascunho (o painel mostra todos para o dono escolher); o envio respeita o limite do plano (indicado no JSON).
- Responda ao dono em português brasileiro, caloroso e objetivo. Não cite nomes internos das ferramentas.
- Listagens de clientes: use apenas o campo manual_phone para mostrar telefone; se vier vazio, diga «Numero nao identificado»; nunca repasse o campo phone ao usuário como número de exibição.
- Quando create_campaign_draft, create_appointment_draft ou create_manual_appointment retornarem JSON com "type" campaign_draft, appointment_draft ou appointment_created, copie esse objeto JSON inteiro (uma linha, sem markdown) ao final da sua mensagem, depois do texto amigável, para o painel exibir o cartão.`

  const messages: Array<
    | { role: 'system'; content: string }
    | { role: 'user' | 'assistant'; content: string }
    | { role: 'assistant'; content: string | null; tool_calls: OpenAiToolCall[] }
    | { role: 'tool'; tool_call_id: string; content: string }
  > = [
    { role: 'system', content: system },
    ...hist.map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: params.message },
  ]

  let lastStructuredLine: string | null = null
  let steps = 0

  while (steps < MAX_TOOL_STEPS) {
    steps += 1

    const res = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${params.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: params.model,
        temperature: 0.2,
        max_completion_tokens: 1200,
        tools: ACTION_BRAIN_TOOLS,
        tool_choice: 'auto',
        messages,
      }),
    })

    if (!res.ok) {
      const t = await res.text()
      console.error('[BrainActionAgent] OpenAI error:', t.slice(0, 500))
      return {
        reply: `Não consegui usar as ferramentas agora. Tente de novo em instantes ou reformule o pedido (agendamento ou campanha).`,
      }
    }

    const data = (await res.json()) as {
      choices?: Array<{ message?: OpenAiAssistantMessage }>
    }
    const msg = data.choices?.[0]?.message
    if (!msg || msg.role !== 'assistant') {
      return { reply: 'Não obtive resposta do assistente. Tente novamente.' }
    }

    if (msg.tool_calls && msg.tool_calls.length > 0) {
      messages.push({
        role: 'assistant',
        content: msg.content,
        tool_calls: msg.tool_calls,
      })
    } else {
      messages.push({
        role: 'assistant',
        content: msg.content ?? '',
      })
    }

    if (!msg.tool_calls?.length) {
      let reply = (msg.content ?? '').trim()
      if (!reply) {
        reply = 'Pronto! Se precisar de mais algum agendamento ou campanha, é só falar.'
      }
      if (lastStructuredLine && !reply.includes(lastStructuredLine)) {
        reply = `${reply}\n\n${lastStructuredLine}`
      }
      return { reply: sanitizeUserFacingReply(reply) }
    }

    for (const tc of msg.tool_calls) {
      const name = tc.function?.name ?? ''
      let args: Record<string, unknown> = {}
      try {
        args = JSON.parse(tc.function?.arguments || '{}') as Record<string, unknown>
      } catch {
        args = {}
      }

      let output: string
      try {
        output = await executeActionBrainTool(name, args, params.companyId)
      } catch (e) {
        output = e instanceof Error ? e.message : String(e)
      }

      const structured = tryParseStructuredUiPayload(output)
      if (structured) lastStructuredLine = structured

      messages.push({
        role: 'tool',
        tool_call_id: tc.id,
        content: output.length > 12000 ? output.slice(0, 12000) + '… [truncado]' : output,
      })
    }
  }

  return {
    reply: `A conversa com as ferramentas ficou longa demais. Tente dividir em um pedido por vez (ex.: primeiro buscar o cliente, depois escolher horário).`,
  }
}
