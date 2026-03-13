import { Router } from 'express'
import { authMiddleware } from '../../middleware/auth'
import { chat, getHistory } from './agentController'

const router = Router()

router.use(authMiddleware as any)

router.post('/run', chat)
router.get('/history', getHistory)

export default router
