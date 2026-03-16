import { Request, Response } from 'express'
import { prisma } from '../../lib/prisma'

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
        isActive: true,
      },
    })

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
