import { Router } from 'express'
import { login, register, me, refreshToken } from './authController'
import { verifyToken } from '../../middleware/authMiddleware'

const router = Router()

router.post('/login', login)
router.post('/register', register)
router.get('/me', verifyToken, me)
router.post('/refresh', verifyToken, refreshToken)

export default router
