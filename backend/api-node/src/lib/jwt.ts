import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET!
const EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '7d') as string

export interface JwtPayload {
  userId: number
  companyId: number
  role: string
  name: string
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN as any })
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, SECRET) as JwtPayload
}
