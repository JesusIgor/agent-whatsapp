import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import whatsappRoutes from './modules/whatsapp/whatsappRoutes'
import authRoutes from './modules/auth/authRoutes'

dotenv.config()

const app = express()

// ─────────────────────────────────────────
// Middlewares globais
// ─────────────────────────────────────────
app.use(cors({
  origin: (origin, callback) => callback(null, true),
  credentials: true,
}))
app.use(express.json())

// ─────────────────────────────────────────
// Rotas
// ─────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok' }))

app.use('/auth', authRoutes)
app.use('/whatsapp', whatsappRoutes)

// TODO: adicionar conforme crescer
// app.use('/clients', clientsRoutes)
// app.use('/conversations', conversationsRoutes)

export default app
