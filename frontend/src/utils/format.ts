export function formatDate(date: Date | string, locale = 'pt-BR'): string {
  return new Intl.DateTimeFormat(locale).format(new Date(date))
}

export function formatCurrency(value: number, locale = 'pt-BR', currency = 'BRL'): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value)
}
