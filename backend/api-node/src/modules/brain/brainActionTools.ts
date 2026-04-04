/**
 * Ferramentas de ação (agendamento manual, campanha, cadastro).
 * Usadas por `brainActionAgent.ts` no chat do painel (modo action).
 */
import { prisma } from '../../lib/prisma'
import { BRAIN_MANUAL_PHONE_EMPTY_LABEL } from './brainManualPhoneLabel'
import {
  BRAIN_BATCH_APPOINTMENTS_MAX,
  BRAIN_SEARCH_APPOINTMENTS_MAX,
  resolveSecondBrainPlanLimits,
  SECOND_BRAIN_CAMPAIGN_DRAFT_MAX_TARGETS,
} from './brainPlanConstants'
import { isUuidString, parseOptionalUuid } from '../../lib/uuidValidation'
import { cancelPetshopAppointment } from '../appointments/appointmentCancelCore'
import { computeAvailableSlotsResponse } from '../appointments/availableSlotsQuery'
import {
  normalizeHhMm,
  resolveSlotIdFromDateTimeServicePet,
} from '../appointments/appointmentSlotResolve'
import { rescheduleManualAppointment } from '../appointments/appointmentRescheduleCore'
import { createManualScheduleAppointment } from '../appointments/manualScheduleCore'

export { normalizeHhMm }

/** Resolve id numérico do serviço: valida id ou, se inválido, casa por nome (evita rascunho com id inventado). */
async function resolveActionBrainServiceId(
  companyId: number,
  serviceIdRaw: unknown,
  serviceNameRaw: unknown,
): Promise<{ id: number; name: string } | { error: string }> {
  const sidNum = typeof serviceIdRaw === 'number' ? serviceIdRaw : Number(serviceIdRaw)
  const nameCandidate =
    serviceNameRaw != null && String(serviceNameRaw).trim() !== '' ? String(serviceNameRaw).trim() : ''

  if (Number.isFinite(sidNum)) {
    const byId = await prisma.petshopService.findFirst({
      where: { id: sidNum, companyId, isActive: true },
      select: { id: true, name: true },
    })
    if (byId) return { id: byId.id, name: byId.name }
  }

  if (nameCandidate) {
    const exact = await prisma.petshopService.findMany({
      where: {
        companyId,
        isActive: true,
        name: { equals: nameCandidate, mode: 'insensitive' },
      },
      select: { id: true, name: true },
      take: 2,
    })
    if (exact.length === 1) return { id: exact[0]!.id, name: exact[0]!.name }

    const partial = await prisma.petshopService.findMany({
      where: {
        companyId,
        isActive: true,
        name: { contains: nameCandidate, mode: 'insensitive' },
      },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
      take: 8,
    })
    if (partial.length === 1) return { id: partial[0]!.id, name: partial[0]!.name }
    if (partial.length > 1) {
      return {
        error: `Vários serviços combinam com «${nameCandidate}». Use list_active_services e o id exato: ${partial.map((p) => `${p.id}=${p.name}`).join('; ')}.`,
      }
    }
  }

  return {
    error:
      'Serviço não identificado. Chame list_active_services e use o campo id do JSON (número inteiro) do serviço escolhido.',
  }
}

/** Valida UUID do pet do cliente ou resolve por nome (evita UUID inventado pelo modelo). */
async function resolveActionBrainPetId(
  companyId: number,
  clientIdUuid: string,
  petIdRaw: unknown,
  petNameRaw: unknown,
): Promise<{ id: string; name: string } | { error: string }> {
  const nameCandidate =
    petNameRaw != null && String(petNameRaw).trim() !== '' ? String(petNameRaw).trim() : ''
  const petRaw = petIdRaw != null && String(petIdRaw).trim() !== '' ? String(petIdRaw).trim() : ''
  const petUuid = parseOptionalUuid(petRaw)

  if (petUuid) {
    const byId = await prisma.petshopPet.findFirst({
      where: { id: petUuid, companyId, clientId: clientIdUuid, isActive: true },
      select: { id: true, name: true },
    })
    if (byId) return { id: byId.id, name: byId.name }
  }

  if (nameCandidate) {
    const exact = await prisma.petshopPet.findMany({
      where: {
        companyId,
        clientId: clientIdUuid,
        isActive: true,
        name: { equals: nameCandidate, mode: 'insensitive' },
      },
      select: { id: true, name: true },
      take: 2,
    })
    if (exact.length === 1) return { id: exact[0]!.id, name: exact[0]!.name }

    const partial = await prisma.petshopPet.findMany({
      where: {
        companyId,
        clientId: clientIdUuid,
        isActive: true,
        name: { contains: nameCandidate, mode: 'insensitive' },
      },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
      take: 8,
    })
    if (partial.length === 1) return { id: partial[0]!.id, name: partial[0]!.name }
    if (partial.length > 1) {
      return {
        error: `Vários pets combinam com «${nameCandidate}» neste cliente: ${partial.map((p) => `${p.name} (id ${p.id})`).join('; ')}. Use o id exato do JSON pets_catalog.`,
      }
    }
  }

  return {
    error:
      'Pet não identificado para este cliente. Chame get_client_pets_for_scheduling e use o id (UUID) do array pets; inclua pet_name igual ao campo name.',
  }
}

async function resolveSlotIdFromAvailable(
  companyId: number,
  scheduledDateYmd: string,
  serviceId: number,
  petIdUuid: string | undefined,
  timeRaw: string,
): Promise<string | null> {
  return resolveSlotIdFromDateTimeServicePet(companyId, scheduledDateYmd, serviceId, petIdUuid, timeRaw)
}

function formatUtcHhMm(d: Date): string {
  return `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`
}

async function brainCreateManualOne(
  companyId: number,
  raw: Record<string, unknown>,
): Promise<{ ok: true; appointment_id: string; scheduled_date: string } | { ok: false; message: string }> {
  const scheduled_date = String(raw.scheduled_date ?? '').trim()
  const clientRawManual = String(raw.client_id ?? '').trim()
  const timeRaw = raw.time != null ? String(raw.time).trim() : ''

  if (!isUuidString(clientRawManual)) {
    return { ok: false, message: 'client_id inválido.' }
  }

  const resolvedPetManual = await resolveActionBrainPetId(companyId, clientRawManual, raw.pet_id, raw.pet_name)
  if ('error' in resolvedPetManual) return { ok: false, message: resolvedPetManual.error }

  const resolvedSvc = await resolveActionBrainServiceId(companyId, raw.service_id, raw.service_name)
  if ('error' in resolvedSvc) return { ok: false, message: resolvedSvc.error }
  const service_id = resolvedSvc.id

  let slotId = String(raw.slot_id ?? '').trim()
  if ((!slotId || !isUuidString(slotId)) && timeRaw && /^\d{4}-\d{2}-\d{2}$/.test(scheduled_date)) {
    const resolved = await resolveSlotIdFromAvailable(
      companyId,
      scheduled_date,
      service_id,
      resolvedPetManual.id,
      timeRaw,
    )
    if (resolved) slotId = resolved
  }

  if (!isUuidString(slotId)) {
    return { ok: false, message: 'Informe slot_id (UUID) ou time (HH:MM) com scheduled_date.' }
  }

  return createManualScheduleAppointment(companyId, {
    client_id: clientRawManual,
    pet_id: resolvedPetManual.id,
    service_id,
    slot_id: slotId,
    scheduled_date,
    notes: raw.notes == null || raw.notes === '' ? null : String(raw.notes),
  })
}

export const ACTION_BRAIN_TOOLS = [
  {
    type: 'function',
    function: {
      name: 'create_campaign_draft',
      description:
        `Monta draft de campanha: JSON type campaign_draft para o painel. Inclua até ${SECOND_BRAIN_CAMPAIGN_DRAFT_MAX_TARGETS} UUIDs para o dono escolher destinatários; o envio real respeita o limite do plano (campo max_recipients_per_send no JSON).`,
      parameters: {
        type: 'object',
        properties: {
          client_ids: {
            type: 'array',
            items: { type: 'string' },
            description: `UUIDs dos clientes — até ${SECOND_BRAIN_CAMPAIGN_DRAFT_MAX_TARGETS} na lista do rascunho.`,
          },
          message_template: { type: 'string', description: 'Texto sugerido da mensagem.' },
        },
        required: ['client_ids', 'message_template'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'search_clients',
      description: 'Busca clientes pelo nome (agendamento manual).',
      parameters: {
        type: 'object',
        properties: { name: { type: 'string', description: 'Nome parcial ou completo.' } },
        required: ['name'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'create_client',
      description:
        'Cria cliente novo. Telefone em dígitos (ex.: 5511999999999). Email opcional.',
      parameters: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          phone: { type: 'string' },
          email: { type: 'string' },
        },
        required: ['name', 'phone'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_client_pets_for_scheduling',
      description:
        'Lista pets ativos: JSON type pets_catalog com array pets {id, name, species, breed, size}. Use sempre o id desse array; repasse também name em create_appointment_draft (pet_name).',
      parameters: {
        type: 'object',
        properties: { client_id: { type: 'string', description: 'UUID do cliente.' } },
        required: ['client_id'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'list_active_services',
      description:
        'Lista serviços ativos: retorna JSON com type services_catalog e array services {id, name}. Sempre use o id desse JSON em get_available_times e nos rascunhos — não chute números.',
      parameters: { type: 'object', properties: {}, required: [] },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_available_times',
      description:
        'Horários livres em uma data (YYYY-MM-DD). Serviço: service_id ou service_name (catálogo). Pet: pet_id do pets_catalog e pet_name (nome do animal); se o UUID estiver errado, passe client_id + pet_name para o servidor localizar.',
      parameters: {
        type: 'object',
        properties: {
          target_date: { type: 'string', description: 'Data YYYY-MM-DD.' },
          service_id: { type: 'number', description: 'ID numérico do catálogo (list_active_services).' },
          service_name: {
            type: 'string',
            description: 'Nome exato do serviço no catálogo, se precisar resolver o id (ex.: após o dono escolher por nome).',
          },
          client_id: { type: 'string', description: 'UUID do cliente (ajuda a corrigir pet_id errado).' },
          pet_id: { type: 'string', description: 'UUID do pet (pets_catalog).' },
          pet_name: { type: 'string', description: 'Nome do pet como no pets_catalog (obrigatório se pet_id puder estar errado).' },
        },
        required: ['target_date'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'create_appointment_draft',
      description:
        'Cartão de confirmação no painel. Sempre inclua pet_name (nome do animal como no pets_catalog) junto de pet_id — o servidor corrige UUID inventado pelo nome+cliente. Idem service_id + service_name.',
      parameters: {
        type: 'object',
        properties: {
          client_id: { type: 'string' },
          client_name: { type: 'string', description: 'Nome para exibição (opcional).' },
          pet_id: { type: 'string', description: 'UUID do pets_catalog (pode ser corrigido com pet_name).' },
          pet_name: { type: 'string', description: 'Nome do pet como no pets_catalog (obrigatório).' },
          service_id: { type: 'number', description: 'Preferir o id do list_active_services; pode omitir se só tiver service_name.' },
          service_name: { type: 'string', description: 'Nome do serviço como no catálogo (obrigatório se não tiver service_id válido).' },
          scheduled_date: { type: 'string', description: 'YYYY-MM-DD.' },
          time: { type: 'string', description: 'Horário como na grade (ex.: 09:00 ou 14:30).' },
          slot_id: {
            type: 'string',
            description: 'UUID do slot de get_available_times; se omitido ou inválido, resolve por data+serviço+time.',
          },
          notes: { type: 'string' },
          uses_consecutive_slots: { type: 'boolean' },
          paired_slot_time: { type: 'string' },
        },
        required: ['client_id', 'pet_id', 'pet_name', 'scheduled_date', 'time'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'create_manual_appointment',
      description:
        'Cria agendamento na hora (sem cartão). Preferir create_appointment_draft para o dono revisar. Se não tiver slot_id na conversa, passe time (HH:MM) com scheduled_date e service_id para o backend resolver o slot.',
      parameters: {
        type: 'object',
        properties: {
          client_id: { type: 'string' },
          pet_id: { type: 'string' },
          pet_name: { type: 'string', description: 'Nome do pet (pets_catalog); corrige UUID errado.' },
          service_id: { type: 'number', description: 'Do catálogo; se duvidar, use service_name.' },
          service_name: { type: 'string', description: 'Nome do serviço como no catálogo (ajuda se o id estiver errado).' },
          slot_id: { type: 'string', description: 'UUID de get_available_times, se souber.' },
          time: { type: 'string', description: 'HH:MM — use se o dono escolheu um horário da lista e você não tem o slot_id.' },
          scheduled_date: { type: 'string', description: 'YYYY-MM-DD (deve bater com a data do slot).' },
          notes: { type: 'string' },
        },
        required: ['client_id', 'pet_id', 'pet_name', 'scheduled_date'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'search_appointments',
      description: `Lista agendamentos da empresa (até ${BRAIN_SEARCH_APPOINTMENTS_MAX}) com UUIDs para cancelar/remarcar. Filtros opcionais.`,
      parameters: {
        type: 'object',
        properties: {
          client_id: { type: 'string', description: 'UUID do cliente.' },
          pet_id: { type: 'string', description: 'UUID do pet.' },
          from_date: { type: 'string', description: 'YYYY-MM-DD (scheduledDate >=).' },
          to_date: { type: 'string', description: 'YYYY-MM-DD (scheduledDate <=).' },
          include_cancelled: {
            type: 'boolean',
            description: 'Se true, inclui cancelados e no_show; padrão só ativos (pending, confirmed, …).',
          },
        },
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'create_manual_appointments_batch',
      description: `Cria vários agendamentos de uma vez (máx. ${BRAIN_BATCH_APPOINTMENTS_MAX}). Cada item: mesmo formato que create_manual_appointment (client_id, pet_id, pet_name, scheduled_date, service_id ou service_name, time ou slot_id).`,
      parameters: {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            description: 'Lista de agendamentos.',
            maxItems: BRAIN_BATCH_APPOINTMENTS_MAX,
            items: {
              type: 'object',
              properties: {
                client_id: { type: 'string' },
                pet_id: { type: 'string' },
                pet_name: { type: 'string' },
                service_id: { type: 'number' },
                service_name: { type: 'string' },
                scheduled_date: { type: 'string' },
                time: { type: 'string' },
                slot_id: { type: 'string' },
                notes: { type: 'string' },
              },
              required: ['client_id', 'pet_id', 'pet_name', 'scheduled_date'],
            },
          },
        },
        required: ['items'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'reschedule_appointments_batch',
      description: `Remarca vários agendamentos (máx. ${BRAIN_BATCH_APPOINTMENTS_MAX}) para novos horários na grade. Cada item: appointment_id + (new_slot_id OU new_scheduled_date + new_time). Não suporta par G/GG de dois slots — use cancel e recrie.`,
      parameters: {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            maxItems: BRAIN_BATCH_APPOINTMENTS_MAX,
            items: {
              type: 'object',
              properties: {
                appointment_id: { type: 'string' },
                new_slot_id: { type: 'string' },
                new_scheduled_date: { type: 'string', description: 'YYYY-MM-DD com new_time.' },
                new_time: { type: 'string', description: 'HH:MM' },
              },
              required: ['appointment_id'],
            },
          },
        },
        required: ['items'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'cancel_appointments_batch',
      description: `Cancela vários agendamentos (máx. ${BRAIN_BATCH_APPOINTMENTS_MAX}) pelos UUIDs. Cada um cancela par G/GG se aplicável (mesma regra de cancel_appointment).`,
      parameters: {
        type: 'object',
        properties: {
          appointment_ids: {
            type: 'array',
            items: { type: 'string' },
            maxItems: BRAIN_BATCH_APPOINTMENTS_MAX,
          },
          cancel_reason: { type: 'string', description: 'Motivo comum (opcional).' },
        },
        required: ['appointment_ids'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'cancel_appointment',
      description:
        'Cancela um agendamento pelo UUID. Se for par de dois horários (pet G/GG), cancela o vínculo. Use appointment_id vindo da agenda do painel ou de consulta SQL — não invente UUID.',
      parameters: {
        type: 'object',
        properties: {
          appointment_id: { type: 'string', description: 'UUID do agendamento.' },
          cancel_reason: { type: 'string', description: 'Motivo (opcional).' },
        },
        required: ['appointment_id'],
      },
    },
  },
]

export async function executeActionBrainTool(name: string, args: Record<string, unknown>, companyId: number): Promise<string> {
  switch (name) {
    case 'create_campaign_draft': {
      const planRow = await prisma.saasCompany.findUnique({
        where: { id: companyId },
        select: { plan: true },
      })
      const planLimits = resolveSecondBrainPlanLimits(planRow?.plan)
      const maxRecipientsPerSend = planLimits.campaignSendMaxRecipients

      const rawIds = Array.isArray(args.client_ids) ? (args.client_ids as string[]) : []
      const client_ids = rawIds.slice(0, SECOND_BRAIN_CAMPAIGN_DRAFT_MAX_TARGETS)
      const message_template = String(args.message_template ?? '')
      if (!client_ids.length) return 'Nenhum cliente selecionado para a campanha.'

      const found = await prisma.client.findMany({
        where: { companyId, id: { in: client_ids } },
        select: { id: true, name: true, phone: true, manualPhone: true },
      })

      if (!found.length) return 'Nenhum cliente encontrado com os IDs fornecidos.'

      return JSON.stringify({
        type: 'campaign_draft',
        clients: found.map((c) => ({
          id: c.id,
          name: c.name ?? 'Cliente',
          manual_phone: (c.manualPhone ?? '').trim() || BRAIN_MANUAL_PHONE_EMPTY_LABEL,
          /** Canal WhatsApp (painel usa no envio; não exibir ao dono). */
          phone: c.phone,
        })),
        message: message_template,
        total: found.length,
        max_recipients_per_send: maxRecipientsPerSend,
        ...(rawIds.length > SECOND_BRAIN_CAMPAIGN_DRAFT_MAX_TARGETS
          ? {
              note: `Apenas os ${SECOND_BRAIN_CAMPAIGN_DRAFT_MAX_TARGETS} primeiros client_ids entraram no rascunho.`,
            }
          : {}),
      })
    }

    case 'search_clients': {
      const q = String(args.name ?? '').trim()
      if (!q) return JSON.stringify({ type: 'clients_not_found', name: args.name })

      const data = await prisma.client.findMany({
        where: {
          companyId,
          name: { contains: q, mode: 'insensitive' },
        },
        select: { id: true, name: true, manualPhone: true },
        take: 5,
      })

      if (!data.length) return JSON.stringify({ type: 'clients_not_found', name: q })

      return JSON.stringify({
        type: 'clients_found',
        clients: data.map((c) => ({
          id: c.id,
          name: c.name ?? '',
          manual_phone: (c.manualPhone ?? '').trim() || BRAIN_MANUAL_PHONE_EMPTY_LABEL,
        })),
      })
    }

    case 'create_client': {
      const phone = String(args.phone).replace(/\D/g, '')
      if (!phone) return 'Telefone inválido após normalização.'

      try {
        const data = await prisma.client.create({
          data: {
            companyId,
            name: String(args.name ?? ''),
            phone,
            manualPhone: phone,
            email: (typeof args.email === 'string' ? args.email.trim() : null) || null,
            source: 'manual',
            conversationStage: 'initial',
          },
          select: { id: true, name: true, manualPhone: true },
        })

        return JSON.stringify({
          type: 'client_created',
          client: {
            id: data.id,
            name: data.name,
            manual_phone: (data.manualPhone ?? '').trim() || BRAIN_MANUAL_PHONE_EMPTY_LABEL,
          },
        })
      } catch (e: unknown) {
        const code = e && typeof e === 'object' && 'code' in e ? (e as { code?: string }).code : undefined
        if (code === 'P2002') {
          return 'Já existe cliente com este telefone nesta empresa. Use search_clients para localizar.'
        }
        const msg = e instanceof Error ? e.message : String(e)
        return `Erro ao criar cliente: ${msg}`
      }
    }

    case 'get_client_pets_for_scheduling': {
      const clientIdRaw = String(args.client_id ?? '').trim()
      if (!isUuidString(clientIdRaw)) {
        return JSON.stringify({
          type: 'invalid_client_id',
          message:
            'client_id deve ser o UUID do cliente (campo id retornado por search_clients), não o nome nem o telefone.',
        })
      }
      const pets = await prisma.petshopPet.findMany({
        where: {
          companyId,
          clientId: clientIdRaw,
          isActive: true,
        },
        select: { id: true, name: true, species: true, breed: true, size: true },
      })

      if (!pets.length) return JSON.stringify({ type: 'no_pets', client_id: clientIdRaw })

      return JSON.stringify({
        type: 'pets_catalog',
        pets: pets.map((p) => ({
          id: p.id,
          name: p.name,
          species: p.species,
          breed: p.breed,
          size: p.size,
        })),
      })
    }

    case 'list_active_services': {
      const rows = await prisma.petshopService.findMany({
        where: { companyId, isActive: true },
        select: { id: true, name: true },
        orderBy: { name: 'asc' },
      })
      if (!rows.length) return 'Nenhum serviço ativo cadastrado.'
      return JSON.stringify({
        type: 'services_catalog',
        services: rows.map((s) => ({ id: s.id, name: s.name })),
      })
    }

    case 'get_available_times': {
      const target_date = String(args.target_date ?? '')
      const clientForPet = String(args.client_id ?? '').trim()
      const petNameHint = String(args.pet_name ?? '').trim()
      const petArg =
        args.pet_id != null && String(args.pet_id).trim() !== '' ? String(args.pet_id).trim() : undefined

      const hasName = String(args.service_name ?? '').trim() !== ''
      const sidArg = args.service_id
      if (!Number.isFinite(Number(sidArg)) && !hasName) {
        return 'Informe service_id (número do JSON services_catalog) ou service_name exatamente como no catálogo.'
      }

      let pet_id: string | undefined
      if (isUuidString(clientForPet) && (petArg || petNameHint)) {
        const pr = await resolveActionBrainPetId(companyId, clientForPet, petArg, petNameHint || undefined)
        if ('error' in pr) return pr.error
        pet_id = pr.id
      } else if (petArg) {
        const u = parseOptionalUuid(petArg)
        if (!u) {
          return 'pet_id inválido: use o UUID do JSON pets_catalog. Se necessário, passe client_id e pet_name para localizar o pet.'
        }
        const ex = await prisma.petshopPet.findFirst({
          where: { id: u, companyId, isActive: true },
          select: { id: true },
        })
        if (!ex) {
          return 'pet_id não encontrado. Passe client_id (UUID) e pet_name como no pets_catalog.'
        }
        pet_id = u
      } else if (petNameHint && !isUuidString(clientForPet)) {
        return 'Para usar pet_name na grade, informe também client_id (UUID do cliente).'
      }

      const resolvedSvc = await resolveActionBrainServiceId(companyId, sidArg, args.service_name)
      if ('error' in resolvedSvc) return resolvedSvc.error
      const service_id = resolvedSvc.id

      const result = await computeAvailableSlotsResponse(companyId, target_date, service_id, pet_id)
      if ('error' in result) return `Erro: ${result.error}`
      return JSON.stringify({
        type: 'available_times',
        date: result.date,
        available_times: result.available_slots,
        total_available: result.total_available,
      })
    }

    case 'create_appointment_draft': {
      const scheduled_date = String(args.scheduled_date ?? '').trim()
      const timeRaw = String(args.time ?? '').trim()
      const clientRaw = String(args.client_id ?? '').trim()

      if (!isUuidString(clientRaw)) {
        return 'client_id inválido: use o UUID de search_clients.'
      }

      const resolvedPet = await resolveActionBrainPetId(companyId, clientRaw, args.pet_id, args.pet_name)
      if ('error' in resolvedPet) return resolvedPet.error
      const petCanonicalId = resolvedPet.id

      const resolvedSvc = await resolveActionBrainServiceId(companyId, args.service_id, args.service_name)
      if ('error' in resolvedSvc) return resolvedSvc.error
      const service_id = resolvedSvc.id
      const serviceNameCanonical = resolvedSvc.name
      if (!/^\d{4}-\d{2}-\d{2}$/.test(scheduled_date)) {
        return 'scheduled_date deve ser YYYY-MM-DD.'
      }
      const timeNorm = normalizeHhMm(timeRaw)
      if (!timeNorm) {
        return 'Informe time no formato HH:MM (ex.: 14:30).'
      }

      let slotId = String(args.slot_id ?? '').trim()
      if (!isUuidString(slotId)) {
        const resolved = await resolveSlotIdFromAvailable(
          companyId,
          scheduled_date,
          service_id,
          petCanonicalId,
          timeRaw,
        )
        if (!resolved) {
          return 'Não encontrei esse horário livre na grade para essa data/serviço/pet. Chame get_available_times de novo e use um horário listado.'
        }
        slotId = resolved
      }

      const slotProbe = await prisma.petshopSlot.findUnique({
        where: { id: slotId },
        select: { companyId: true, slotDate: true },
      })
      if (!slotProbe || slotProbe.companyId !== companyId) {
        return 'Slot inválido para esta empresa.'
      }

      const petDisplayName =
        args.pet_name != null && String(args.pet_name).trim() !== '' ? String(args.pet_name).trim() : resolvedPet.name

      return JSON.stringify({
        type: 'appointment_draft',
        client_id: clientRaw,
        client_name: args.client_name != null ? String(args.client_name) : undefined,
        pet_id: petCanonicalId,
        pet_name: petDisplayName,
        service_id,
        service_name:
          args.service_name != null && String(args.service_name).trim() !== ''
            ? String(args.service_name)
            : serviceNameCanonical,
        slot_id: slotId,
        scheduled_date,
        time: timeNorm,
        notes: args.notes == null || args.notes === '' ? null : String(args.notes),
        uses_consecutive_slots: args.uses_consecutive_slots === true ? true : undefined,
        paired_slot_time:
          args.paired_slot_time != null && String(args.paired_slot_time).trim() !== ''
            ? String(args.paired_slot_time).trim()
            : undefined,
      })
    }

    case 'create_manual_appointment': {
      const out = await brainCreateManualOne(companyId, args)
      if (!out.ok) {
        return `Erro ao criar agendamento: ${out.message}`
      }
      return JSON.stringify({
        type: 'appointment_created',
        appointment_id: out.appointment_id,
        scheduled_date: out.scheduled_date,
        service_id: args.service_id,
        pet_id: args.pet_id,
        client_id: args.client_id,
      })
    }

    case 'search_appointments': {
      const includeCancelled = args.include_cancelled === true
      const where: {
        companyId: number
        clientId?: string
        petId?: string
        status?: { notIn: string[] }
        scheduledDate?: { gte?: Date; lte?: Date }
      } = { companyId }
      const scid = String(args.client_id ?? '').trim()
      if (scid && isUuidString(scid)) where.clientId = scid
      const spid = String(args.pet_id ?? '').trim()
      if (spid && isUuidString(spid)) where.petId = spid
      if (!includeCancelled) {
        where.status = { notIn: ['cancelled', 'no_show'] }
      }
      const fd = String(args.from_date ?? '').trim()
      const td = String(args.to_date ?? '').trim()
      const scheduledFilter: { gte?: Date; lte?: Date } = {}
      if (/^\d{4}-\d{2}-\d{2}$/.test(fd)) {
        const y = Number(fd.slice(0, 4))
        const m = Number(fd.slice(5, 7))
        const d = Number(fd.slice(8, 10))
        scheduledFilter.gte = new Date(Date.UTC(y, m - 1, d))
      }
      if (/^\d{4}-\d{2}-\d{2}$/.test(td)) {
        const y = Number(td.slice(0, 4))
        const m = Number(td.slice(5, 7))
        const d = Number(td.slice(8, 10))
        scheduledFilter.lte = new Date(Date.UTC(y, m - 1, d))
      }
      if (scheduledFilter.gte != null || scheduledFilter.lte != null) {
        where.scheduledDate = scheduledFilter
      }

      const rows = await prisma.petshopAppointment.findMany({
        where,
        take: BRAIN_SEARCH_APPOINTMENTS_MAX,
        orderBy: { scheduledDate: 'desc' },
        select: {
          id: true,
          clientId: true,
          petId: true,
          serviceId: true,
          slotId: true,
          status: true,
          scheduledDate: true,
          client: { select: { name: true } },
          pet: { select: { name: true } },
          service: { select: { name: true } },
          slot: { select: { slotDate: true, slotTime: true } },
        },
      })

      return JSON.stringify({
        type: 'appointments_found',
        total_returned: rows.length,
        appointments: rows.map((r) => ({
          appointment_id: r.id,
          client_id: r.clientId,
          client_name: r.client?.name ?? null,
          pet_id: r.petId,
          pet_name: r.pet?.name ?? null,
          service_id: r.serviceId,
          service_name: r.service?.name ?? null,
          slot_id: r.slotId,
          status: r.status,
          scheduled_date: r.scheduledDate ? r.scheduledDate.toISOString().slice(0, 10) : null,
          time: r.slot?.slotTime ? formatUtcHhMm(r.slot.slotTime) : null,
        })),
      })
    }

    case 'create_manual_appointments_batch': {
      const rawItems = Array.isArray(args.items) ? args.items : []
      const items = rawItems.slice(0, BRAIN_BATCH_APPOINTMENTS_MAX) as Record<string, unknown>[]
      if (!items.length) return 'Informe items (array não vazio).'
      const succeeded: { index: number; appointment_id: string; scheduled_date: string }[] = []
      const failed: { index: number; message: string }[] = []
      for (let i = 0; i < items.length; i++) {
        const o = await brainCreateManualOne(companyId, items[i]!)
        if (o.ok) {
          succeeded.push({
            index: i,
            appointment_id: o.appointment_id,
            scheduled_date: o.scheduled_date,
          })
        } else {
          failed.push({ index: i, message: o.message })
        }
      }
      return JSON.stringify({
        type: 'appointments_batch_created',
        succeeded,
        failed,
      })
    }

    case 'reschedule_appointments_batch': {
      const rawRe = Array.isArray(args.items) ? args.items : []
      const reItems = rawRe.slice(0, BRAIN_BATCH_APPOINTMENTS_MAX) as Record<string, unknown>[]
      if (!reItems.length) return 'Informe items (array não vazio).'
      const succeeded: { index: number; appointment_id: string; scheduled_date: string }[] = []
      const failed: { index: number; message: string }[] = []
      for (let i = 0; i < reItems.length; i++) {
        const it = reItems[i]!
        const r = await rescheduleManualAppointment(companyId, {
          appointment_id: String(it.appointment_id ?? ''),
          new_slot_id: it.new_slot_id != null ? String(it.new_slot_id) : undefined,
          new_scheduled_date: it.new_scheduled_date != null ? String(it.new_scheduled_date) : undefined,
          new_time: it.new_time != null ? String(it.new_time) : undefined,
        })
        if (r.ok) {
          succeeded.push({
            index: i,
            appointment_id: r.appointment_id,
            scheduled_date: r.scheduled_date,
          })
        } else {
          failed.push({ index: i, message: r.message })
        }
      }
      return JSON.stringify({
        type: 'appointments_batch_rescheduled',
        succeeded,
        failed,
      })
    }

    case 'cancel_appointments_batch': {
      const rawIds = Array.isArray(args.appointment_ids) ? args.appointment_ids : []
      const ids = rawIds.slice(0, BRAIN_BATCH_APPOINTMENTS_MAX).map((x) => String(x).trim())
      if (!ids.length) return 'Informe appointment_ids (array não vazio).'
      const reason =
        args.cancel_reason != null && String(args.cancel_reason).trim() !== ''
          ? String(args.cancel_reason).trim()
          : null
      const succeeded: { appointment_id: string; cancelled_at: string }[] = []
      const failed: { appointment_id: string; message: string }[] = []
      for (const id of ids) {
        const out = await cancelPetshopAppointment(companyId, id, reason)
        if (out.ok) {
          succeeded.push({ appointment_id: out.appointment_id, cancelled_at: out.cancelled_at })
        } else {
          failed.push({ appointment_id: id, message: out.message })
        }
      }
      return JSON.stringify({
        type: 'appointments_batch_cancelled',
        succeeded,
        failed,
      })
    }

    case 'cancel_appointment': {
      const aid = String(args.appointment_id ?? '').trim()
      const reasonRaw = args.cancel_reason
      const cancel_reason =
        reasonRaw != null && String(reasonRaw).trim() !== '' ? String(reasonRaw).trim() : null
      const out = await cancelPetshopAppointment(companyId, aid, cancel_reason)
      if (!out.ok) return out.message
      return JSON.stringify({
        type: 'appointment_cancelled',
        appointment_id: out.appointment_id,
        cancelled_at: out.cancelled_at,
      })
    }

    default:
      return 'Ferramenta não encontrada.'
  }
}
