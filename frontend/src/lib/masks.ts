// ── Phone ────────────────────────────────────────────────────────────────────
function shouldPreservePhoneIdentifier(value: string): boolean {
  return /@/.test(value) || /[a-z]/i.test(value)
}

function getPhoneDigitsForDisplay(value: string): string {
  const digits = value.replace(/\D/g, '')
  const localDigits =
    digits.startsWith('55') && digits.length > 11 ? digits.slice(2) : digits

  return localDigits.slice(0, 11)
}

export function maskPhone(value: string): string {
  const normalized = value.trim()
  if (!normalized || shouldPreservePhoneIdentifier(normalized)) {
    return normalized
  }

  const digits = getPhoneDigitsForDisplay(value)
  if (digits.length <= 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').trim()
  }
  return digits.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').trim()
}

export function normalizePhoneForStorage(value: string): string {
  const normalized = value.trim()

  if (!normalized) return ''
  if (shouldPreservePhoneIdentifier(normalized)) return normalized

  const localDigits = getPhoneDigitsForDisplay(value)

  if (!localDigits) return ''

  return `55${localDigits}`
}

export function formatPhoneForDisplay(value: string): string {
  const normalized = value.trim()

  if (!normalized || shouldPreservePhoneIdentifier(normalized)) {
    return normalized
  }

  return maskPhone(normalized)
}

// ── CEP ──────────────────────────────────────────────────────────────────────
export function maskCep(value: string): string {
  return value
    .replace(/\D/g, '')
    .slice(0, 8)
    .replace(/(\d{5})(\d{0,3})/, '$1-$2')
    .replace(/-$/, '')
}

// ── Date (DD/MM/YYYY) ─────────────────────────────────────────────────────────
export function maskDate(value: string): string {
  return value
    .replace(/\D/g, '')
    .slice(0, 8)
    .replace(/(\d{2})(\d{2})(\d{0,4})/, '$1/$2/$3')
    .replace(/\/+$/, '')
}

// ── Time (HH:MM) ──────────────────────────────────────────────────────────────
export function maskTime(value: string): string {
  return value
    .replace(/\D/g, '')
    .slice(0, 4)
    .replace(/(\d{2})(\d{0,2})/, '$1:$2')
    .replace(/:$/, '')
}

// ── Date helpers ──────────────────────────────────────────────────────────────
/** Converts DD/MM/YYYY → YYYY-MM-DD (ISO) */
export function dateToISO(date: string): string {
  const [day, month, year] = date.split('/')
  if (!day || !month || !year) return date
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
}

/** Converts YYYY-MM-DD (ISO) → DD/MM/YYYY */
export function dateFromISO(date: string): string {
  const [year, month, day] = date.split('-')
  if (!year || !month || !day) return date
  return `${day}/${month}/${year}`
}

// ── Credit card ───────────────────────────────────────────────────────────────
export function maskCardNumber(value: string): string {
  return value
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ')
    .trim()
}

export function maskCardExpiry(value: string): string {
  return value
    .replace(/\D/g, '')
    .slice(0, 4)
    .replace(/(\d{2})(\d{0,2})/, '$1/$2')
    .replace(/\/$/, '')
}

export function maskCvv(value: string): string {
  return value.replace(/\D/g, '').slice(0, 4)
}

// ── Currency (BRL) ────────────────────────────────────────────────────────────
export function maskCurrency(value: string | number): string {
  const numericString =
    typeof value === 'number'
      ? String(Math.round(value * 100))
      : value.replace(/\D/g, '')

  const cents = parseInt(numericString || '0', 10)
  return (cents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

export function unmaskCurrency(value: string): number {
  return parseFloat(value.replace(/[^\d,]/g, '').replace(',', '.')) || 0
}

// ── Digits only ───────────────────────────────────────────────────────────────
export function unmaskDigits(value: string): string {
  return value.replace(/\D/g, '')
}
