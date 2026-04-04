const UI_TYPES = new Set(['campaign_draft', 'appointment_created', 'appointment_draft'])

export type CampaignDraftPayload = {
  type: 'campaign_draft'
  clients: { id: string; name: string; manual_phone?: string; phone?: string }[]
  message: string
  total?: number
  /** Limite do plano para quantos destinatários podem ser marcados no envio. */
  max_recipients_per_send?: number
}

export type AppointmentCreatedPayload = {
  type: 'appointment_created'
  appointment_id: string
  scheduled_date: string
  service_id?: number
  pet_id?: string
  client_id?: string
}

export type AppointmentDraftPayload = {
  type: 'appointment_draft'
  client_id: string
  client_name?: string
  pet_id: string
  pet_name?: string
  service_id: number
  service_name?: string
  slot_id: string
  scheduled_date: string
  time: string
  notes?: string | null
  uses_consecutive_slots?: boolean
  paired_slot_time?: string
}

export type BrainStructuredUi = CampaignDraftPayload | AppointmentCreatedPayload | AppointmentDraftPayload

/**
 * Extrai o primeiro JSON com `type` reconhecido para UI (campanha / agendamento criado).
 */
export function splitAssistantReply(reply: string): {
  displayText: string
  structured: BrainStructuredUi | null
} {
  const text = reply ?? ''
  let start = 0
  while (start < text.length) {
    const i = text.indexOf('{', start)
    if (i < 0) break
    for (let j = text.length; j > i; j--) {
      try {
        const slice = text.slice(i, j)
        const parsed = JSON.parse(slice) as { type?: string }
        if (parsed?.type && UI_TYPES.has(parsed.type)) {
          const displayText = (text.slice(0, i) + text.slice(j)).replace(/\n{3,}/g, '\n\n').trim()
          return { displayText, structured: parsed as BrainStructuredUi }
        }
      } catch {
        /* continuar */
      }
    }
    start = i + 1
  }
  return { displayText: text.trim(), structured: null }
}
