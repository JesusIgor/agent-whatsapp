import { Router } from 'express'
import { verifyToken } from '../../middleware/authMiddleware'
import { generateSlotsManual } from './settingsController'
import { getAgenda, saveAgenda, blockSlot, toggleRule } from './agendaController'

const router = Router()

router.use(verifyToken)

// POST /settings/generate-slots
router.post('/generate-slots', generateSlotsManual)

// GET /settings/agenda
router.get('/agenda', getAgenda)

// PUT /settings/agenda
router.put('/agenda', saveAgenda)

// PATCH /settings/agenda/slot/:slotId/block
router.patch('/agenda/slot/:slotId/block', blockSlot)

// PATCH /settings/agenda/rule/:ruleId/toggle
router.patch('/agenda/rule/:ruleId/toggle', toggleRule)

export default router
