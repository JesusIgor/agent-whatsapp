import { useRef, useEffect, useCallback } from 'react'
import { useTheme } from '@/contexts/ThemeContext'

export interface SpeechVisualizationProps {
  
  audioLevel?: number
  
  isSpeaking?: boolean
  
  idlePulse?: boolean
  
  size?: number
  
  label?: string
  className?: string
}

function noise2D(x: number, y: number): number {
  const sin1 = Math.sin(x * 1.2 + y * 3.4) * 0.5
  const sin2 = Math.sin(x * 2.8 - y * 1.7) * 0.3
  const sin3 = Math.sin(x * 0.7 + y * 2.1) * 0.2
  return sin1 + sin2 + sin3
}

function noise3D(x: number, y: number, z: number): number {
  return (
    noise2D(x + z * 0.7, y + z * 1.3) * 0.6 +
    noise2D(x * 2.1 + z * 0.3, y * 1.8 - z * 0.9) * 0.3 +
    noise2D(x * 4.3 - z * 1.1, y * 3.7 + z * 0.5) * 0.1
  )
}

export function SpeechVisualization({
  audioLevel = 0,
  isSpeaking = false,
  idlePulse = true,
  size = 120,
  label,
  className = '',
}: SpeechVisualizationProps) {
  const { theme } = useTheme()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const timeRef = useRef(0)
  const smoothLevelRef = useRef(0)
  const isDark = theme === 'dark'

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const dpr = window.devicePixelRatio || 1
    const w = canvas.width / dpr
    const h = canvas.height / dpr
    timeRef.current += 0.008
    const t = timeRef.current

    const idleLevel = idlePulse ? 0.06 + 0.14 * Math.sin(t * 0.6) : 0
    const inputLevel = idlePulse ? idleLevel : audioLevel
    const target = isSpeaking ? Math.max(inputLevel, 0.15) : inputLevel * 0.4
    smoothLevelRef.current += (target - smoothLevelRef.current) * 0.08
    const level = smoothLevelRef.current

    ctx.clearRect(0, 0, w, h)
    const cx = w / 2
    const cy = h / 2
    const baseRadius = Math.min(w, h) * 0.32

    const layers = isDark
      ? [
          { offset: 0.0, alpha: 0.06, scale: 1.15, color: '180, 180, 190' },
          { offset: 0.3, alpha: 0.1, scale: 1.08, color: '200, 200, 210' },
          { offset: 0.6, alpha: 0.15, scale: 1.0, color: '210, 210, 218' },
        ]
      : [
          { offset: 0.0, alpha: 0.08, scale: 1.15, color: '220, 230, 255' },
          { offset: 0.3, alpha: 0.12, scale: 1.08, color: '200, 218, 255' },
          { offset: 0.6, alpha: 0.18, scale: 1.0, color: '185, 208, 252' },
        ]

    for (const layer of layers) {
      const points: [number, number][] = []
      const segments = 120
      const noiseScale = 0.8 + level * 1.5
      const deform = 0.08 + level * 0.18
      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2
        const nx = Math.cos(angle) * noiseScale
        const ny = Math.sin(angle) * noiseScale
        const n = noise3D(nx, ny, t * 1.2 + layer.offset)
        const r = baseRadius * layer.scale * (1 + n * deform)
        points.push([cx + Math.cos(angle) * r, cy + Math.sin(angle) * r])
      }
      ctx.beginPath()
      ctx.moveTo(points[0][0], points[0][1])
      for (let i = 0; i < points.length - 1; i++) {
        const curr = points[i]
        const next = points[i + 1]
        const mx = (curr[0] + next[0]) / 2
        const my = (curr[1] + next[1]) / 2
        ctx.quadraticCurveTo(curr[0], curr[1], mx, my)
      }
      ctx.closePath()
      const grad = ctx.createRadialGradient(
        cx - baseRadius * 0.2,
        cy - baseRadius * 0.25,
        baseRadius * 0.05,
        cx,
        cy,
        baseRadius * layer.scale * 1.2
      )
      if (isDark) {
        grad.addColorStop(0, `rgba(255, 255, 255, ${layer.alpha * 2.5})`)
        grad.addColorStop(0.4, `rgba(${layer.color}, ${layer.alpha * 1.8})`)
        grad.addColorStop(0.7, `rgba(${layer.color}, ${layer.alpha})`)
        grad.addColorStop(1, `rgba(140, 140, 155, ${layer.alpha * 0.5})`)
      } else {
        grad.addColorStop(0, `rgba(255, 255, 255, ${layer.alpha * 2.2})`)
        grad.addColorStop(0.4, `rgba(${layer.color}, ${layer.alpha * 1.6})`)
        grad.addColorStop(0.7, `rgba(${layer.color}, ${layer.alpha * 1.2})`)
        grad.addColorStop(1, `rgba(30, 98, 236, ${layer.alpha * 0.4})`)
      }
      ctx.fillStyle = grad
      ctx.fill()
    }

    {
      const points: [number, number][] = []
      const segments = 150
      const noiseScale = 0.9 + level * 1.8
      const deform = 0.1 + level * 0.22
      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2
        const nx = Math.cos(angle) * noiseScale
        const ny = Math.sin(angle) * noiseScale
        const n = noise3D(nx, ny, t * 1.5 + 1.0)
        const r = baseRadius * (1 + n * deform)
        points.push([cx + Math.cos(angle) * r, cy + Math.sin(angle) * r])
      }
      ctx.beginPath()
      ctx.moveTo(points[0][0], points[0][1])
      for (let i = 0; i < points.length - 1; i++) {
        const curr = points[i]
        const next = points[i + 1]
        const mx = (curr[0] + next[0]) / 2
        const my = (curr[1] + next[1]) / 2
        ctx.quadraticCurveTo(curr[0], curr[1], mx, my)
      }
      ctx.closePath()
      const grad = ctx.createRadialGradient(
        cx - baseRadius * 0.25,
        cy - baseRadius * 0.3,
        baseRadius * 0.02,
        cx + baseRadius * 0.1,
        cy + baseRadius * 0.15,
        baseRadius * 1.3
      )
      if (isDark) {
        grad.addColorStop(0, 'rgba(250, 250, 252, 0.95)')
        grad.addColorStop(0.25, 'rgba(230, 230, 238, 0.9)')
        grad.addColorStop(0.5, 'rgba(200, 200, 212, 0.85)')
        grad.addColorStop(0.75, 'rgba(170, 172, 185, 0.8)')
        grad.addColorStop(1, 'rgba(130, 132, 148, 0.75)')
      } else {
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.98)')
        grad.addColorStop(0.2, 'rgba(248, 250, 255, 0.95)')
        grad.addColorStop(0.45, 'rgba(228, 236, 255, 0.9)')
        grad.addColorStop(0.7, 'rgba(200, 218, 252, 0.85)')
        grad.addColorStop(1, 'rgba(30, 98, 236, 0.35)')
      }
      ctx.fillStyle = grad
      ctx.fill()
      const highlight = ctx.createRadialGradient(
        cx - baseRadius * 0.15,
        cy - baseRadius * 0.2,
        0,
        cx - baseRadius * 0.15,
        cy - baseRadius * 0.2,
        baseRadius * 0.6
      )
      highlight.addColorStop(0, isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.6)')
      highlight.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)')
      highlight.addColorStop(1, 'rgba(255, 255, 255, 0)')
      ctx.fillStyle = highlight
      ctx.fill()
    }

    animRef.current = requestAnimationFrame(draw)
  }, [audioLevel, isSpeaking, idlePulse, isDark])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`
    const ctx = canvas.getContext('2d')
    if (ctx) ctx.scale(dpr, dpr)
    animRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animRef.current)
  }, [size, draw])

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <canvas ref={canvasRef} className="block" aria-hidden />
      {label && (
        <p className="text-sm text-[#727B8E] dark:text-[#8a94a6] tracking-wide">
          {label}
        </p>
      )}
    </div>
  )
}
