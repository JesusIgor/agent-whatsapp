import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import whatsappRoutes from './modules/whatsapp/whatsappRoutes'
import authRoutes from './modules/auth/authRoutes'
import agentRoutes from './modules/agent/agentRoutes'

dotenv.config()

const app = express()

// ─────────────────────────────────────────
// Middlewares globais
// ─────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())

// ─────────────────────────────────────────
// Rotas
// ─────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok' }))

app.use('/whatsapp', whatsappRoutes)
app.use('/auth', authRoutes)
app.use('/agent', agentRoutes)

export default app