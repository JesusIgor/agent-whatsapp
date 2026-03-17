import { Request, Response } from 'express'
import { prisma } from '../../lib/prisma'

type BusinessHourEntry =
  | string
  | {
      open?: string
      close?: string
      closed?: boolean
    }
  | null
  | undefined

type CustomCapacityHours = {
  hourly?: Record<string, Record<string, number>>
} | null

const DAY_MAP: Record<string, number> = {
  domingo: 0,
  segunda: 1,
  monday: 1,
  terca: 2,
  'terça': 2,
  tuesday: 2,
  quarta: 3,
  wednesday: 3,
  quinta: 4,
  thursday: 4,
  sexta: 5,
  friday: 5,
  sabado: 6,
  'sábado': 6,
  saturday: 6,
  sunday: 0,
}

async function syncBusinessHoursToSchedules(
  companyId: number,
  businessHours: Record<string, any>,
  capacity: number,
  customCapacityHours?: CustomCapacityHours
): Promise<void> {
  const pad = (n: number) => String(n).padStart(2, '0')

  const parseTimeToMinutes = (value: unknown): number | null => {
    if (typeof value !== 'string') return null

    const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim())
    if (!match) return null

    const hours = Number(match[1])
    const minutes = Number(match[2])
    if (
      !Number.isInteger(hours) ||
      !Number.isInteger(minutes) ||
      hours < 0 ||
      hours > 23 ||
      minutes < 0 ||
      minutes > 59
    ) {
      return null
    }

    return hours * 60 + minutes
  }

  const formatTimeKey = (minutesFromMidnight: number) => {
    const hours = Math.floor(minutesFromMidnight / 60)
    const minutes = minutesFromMidnight % 60
    return `${pad(hours)}:${pad(minutes)}`
  }

  const normalizeTimeKey = (value: unknown): string | null => {
    if (typeof value === 'number') {
      return formatTimeKey(value)
    }

    const minutes = parseTimeToMinutes(value)
    if (minutes === null) return null

    return formatTimeKey(minutes)
  }

  const buildUtcTime = (minutesFromMidnight: number) => {
    const hours = Math.floor(minutesFromMidnight / 60)
    const minutes = minutesFromMidnight % 60
    return new Date(Date.UTC(1970, 0, 1, hours, minutes, 0))
  }

  const defaultSlotCapacity = (() => {
    const parsedCapacity = Number(capacity)
    if (!Number.isFinite(parsedCapacity) || parsedCapacity < 1) {
      return 1
    }

    return Math.trunc(parsedCapacity)
  })()

  const normalizedHourlyOverrides = Object.entries(customCapacityHours?.hourly ?? {}).reduce<
    Record<string, Record<string, number>>
  >((acc, [day, hours]) => {
    if (!hours || typeof hours !== 'object') return acc

    const normalizedDay = day.toLowerCase()
    const normalizedHours = Object.entries(hours as Record<string, number>).reduce<Record<string, number>>(
      (hourAcc, [hour, slotCapacity]) => {
        const normalizedHour = normalizeTimeKey(hour)
        const parsedCapacity = Number(slotCapacity)

        if (!normalizedHour || !Number.isFinite(parsedCapacity) || parsedCapacity < 1) {
          return hourAcc
        }

        hourAcc[normalizedHour] = Math.trunc(parsedCapacity)
        return hourAcc
      },
      {}
    )

    if (Object.keys(normalizedHours).length > 0) {
      acc[normalizedDay] = normalizedHours
    }

    return acc
  }, {})

  const getTimeRange = (
    entry: BusinessHourEntry
  ): { openMinutes: number; closeMinutes: number } | null => {
    if (!entry) return null

    if (typeof entry === 'string' && entry.includes('-')) {
      const [openValue, closeValue] = entry.split('-') as [string, string]
      const openMinutes = parseTimeToMinutes(openValue)
      const closeMinutes = parseTimeToMinutes(closeValue)

      if (openMinutes === null || closeMinutes === null || openMinutes >= closeMinutes) {
        return null
      }

      return { openMinutes, closeMinutes }
    }

    if (typeof entry === 'object') {
      if (entry.closed) return null

      const openMinutes = parseTimeToMinutes(entry.open)
      const closeMinutes = parseTimeToMinutes(entry.close)

      if (openMinutes === null || closeMinutes === null || openMinutes >= closeMinutes) {
        return null
      }

      return { openMinutes, closeMinutes }
    }

    return null
  }

  for (const [day, entry] of Object.entries(businessHours)) {
    const normalizedDay = day.toLowerCase()
    const weekday = DAY_MAP[normalizedDay]
    if (weekday === undefined) continue

    // Remove existing slots for this weekday
    await prisma.petshopSchedule.deleteMany({ where: { companyId, weekday } })

    const timeRange = getTimeRange(entry)
    if (!timeRange) continue

    const hourlyOverrides = normalizedHourlyOverrides[normalizedDay] ?? {}
    const slots = []

    for (
      let startMinutes = timeRange.openMinutes;
      startMinutes < timeRange.closeMinutes;
      startMinutes += 60
    ) {
      const endMinutes = Math.min(startMinutes + 60, timeRange.closeMinutes)
      if (endMinutes <= startMinutes) continue

      const overrideKey = formatTimeKey(startMinutes)
      const slotCapacity = hourlyOverrides[overrideKey] ?? defaultSlotCapacity

      slots.push({
        companyId,
        weekday,
        startTime: buildUtcTime(startMinutes),
        endTime: buildUtcTime(endMinutes),
        capacity: slotCapacity,
        isActive: true,
      })
    }

    if (slots.length > 0) {
      await prisma.petshopSchedule.createMany({ data: slots })
    }
  }
}

// GET /petshops - List all petshops
export async function listPetshops(req: Request, res: Response) {
  try {
    const { skip = 0, limit = 50, is_active } = req.query

    const where: any = {}

    if (is_active !== undefined) {
      where.isActive = is_active === 'true'
    }

    const petshops = await prisma.saasPetshop.findMany({
      where,
      skip: parseInt(skip as string),
      take: parseInt(limit as string),
      include: {
        company: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    res.json(petshops)
  } catch (error) {
    console.error('Error listing petshops:', error)
    res.status(500).json({ error: 'Failed to list petshops' })
  }
}

// GET /petshops/:petshopId - Get petshop details (aba empresa)
export async function getPetshop(req: Request, res: Response) {
  try {
    const { petshopId } = req.params

    const petshop = await prisma.saasPetshop.findUnique({
      where: { id: parseInt(petshopId as any) },
      include: {
        company: true,
      },
    })

    if (!petshop) {
      return res.status(404).json({ error: 'Petshop not found' })
    }

    res.json(petshop)
  } catch (error) {
    console.error('Error getting petshop:', error)
    res.status(500).json({ error: 'Failed to get petshop' })
  }
}

// POST /petshops - Create a new petshop
export async function createPetshop(req: Request, res: Response) {
  try {
    const {
      company_id,
      address,
      cep,
      phone,
      latitude,
      longitude,
      owner_phone,
      emergency_contact,
      assistant_name,
      default_capacity_per_hour,
      business_hours,
      custom_capacity_hours,
    } = req.body

    if (!company_id || !phone) {
      return res.status(400).json({ error: 'company_id and phone are required' })
    }

    // Check if petshop already exists for this company
    const existing = await prisma.saasPetshop.findUnique({
      where: { companyId: company_id },
    })

    if (existing) {
      return res.status(409).json({ error: 'Petshop already exists for this company' })
    }

    const petshop = await prisma.saasPetshop.create({
      data: {
        companyId: company_id,
        address,
        cep,
        phone,
        latitude,
        longitude,
        ownerPhone: owner_phone,
        emergencyContact: emergency_contact,
        assistantName: assistant_name,
        defaultCapacityPerHour: default_capacity_per_hour || 3,
        businessHours: business_hours,
        customCapacityHours: custom_capacity_hours,
        isActive: true,
      },
    })

    if (business_hours) {
      await syncBusinessHoursToSchedules(
        company_id,
        business_hours,
        default_capacity_per_hour || 3,
        custom_capacity_hours
      ).catch((err) =>
        console.error('[createPetshop] Failed to sync business hours:', err)
      )
    }

    res.status(201).json(petshop)
  } catch (error) {
    console.error('Error creating petshop:', error)
    res.status(500).json({ error: 'Failed to create petshop' })
  }
}

// PATCH /petshops/:petshopId - Update petshop
export async function updatePetshop(req: Request, res: Response) {
  try {
    const { petshopId } = req.params
    const {
      address,
      cep,
      phone,
      latitude,
      longitude,
      owner_phone,
      emergency_contact,
      assistant_name,
      default_capacity_per_hour,
      business_hours,
      custom_capacity_hours,
      company_name,
      is_active,
    } = req.body

    const existing = await prisma.saasPetshop.findUnique({
      where: { id: parseInt(petshopId as any) },
    })

    if (!existing) {
      return res.status(404).json({ error: 'Petshop not found' })
    }

    // Update company name if provided
    if (company_name !== undefined) {
      await prisma.saasCompany.update({
        where: { id: existing.companyId },
        data: { name: company_name },
      })
    }

    const updateData: any = {}
    if (address !== undefined) updateData.address = address
    if (cep !== undefined) updateData.cep = cep
    if (phone !== undefined) updateData.phone = phone
    if (latitude !== undefined) updateData.latitude = latitude
    if (longitude !== undefined) updateData.longitude = longitude
    if (owner_phone !== undefined) updateData.ownerPhone = owner_phone
    if (emergency_contact !== undefined) updateData.emergencyContact = emergency_contact
    if (assistant_name !== undefined) updateData.assistantName = assistant_name
    if (default_capacity_per_hour !== undefined) updateData.defaultCapacityPerHour = default_capacity_per_hour
    if (business_hours !== undefined) updateData.businessHours = business_hours
    if (custom_capacity_hours !== undefined) updateData.customCapacityHours = custom_capacity_hours
    if (is_active !== undefined) updateData.isActive = is_active

    const petshop = await prisma.saasPetshop.update({
      where: { id: parseInt(petshopId as any) },
      data: updateData,
      include: { company: true },
    })

    // Sync business hours to petshop_schedules table
    if (
      business_hours !== undefined ||
      default_capacity_per_hour !== undefined ||
      custom_capacity_hours !== undefined
    ) {
      const effectiveBusinessHours =
        business_hours ?? (petshop.businessHours as Record<string, any> | null)
      const capacityPerHour = petshop.defaultCapacityPerHour ?? 3
      const effectiveCustomCapacityHours =
        custom_capacity_hours ?? (petshop.customCapacityHours as CustomCapacityHours)

      if (effectiveBusinessHours) {
        await syncBusinessHoursToSchedules(
          existing.companyId,
          effectiveBusinessHours,
          capacityPerHour,
          effectiveCustomCapacityHours
        ).catch((err) =>
          console.error('[updatePetshop] Failed to sync business hours:', err)
        )
      }
    }

    res.json(petshop)
  } catch (error) {
    console.error('Error updating petshop:', error)
    res.status(500).json({ error: 'Failed to update petshop' })
  }
}

// GET /petshops/info/company - Get authenticated company's petshop info
export async function getPetshopInfo(req: Request, res: Response) {
  try {
    const companyId = req.user!.companyId

    const petshop = await prisma.saasPetshop.findUnique({
      where: { companyId },
      include: {
        company: true,
      },
    })

    if (!petshop) {
      return res.status(404).json({ error: 'Petshop not found' })
    }

    res.json(petshop)
  } catch (error) {
    console.error('Error getting petshop info:', error)
    res.status(500).json({ error: 'Failed to get petshop info' })
  }
}
