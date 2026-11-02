const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

export function formatINR(value: number) {
  return inr.format(value)
}

export function formatFeeRange(min: number, max: number) {
  return `${formatINR(min)} – ${formatINR(max)}`
}

export function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function daysUntil(iso: string) {
  const target = new Date(`${iso}T23:59:59`).getTime()
  return Math.ceil((target - Date.now()) / 86_400_000)
}

export function deadlineLabel(iso: string) {
  const days = daysUntil(iso)
  if (days < 0) return 'Applications closed'
  if (days === 0) return 'Closes today'
  if (days === 1) return 'Closes tomorrow'
  return `Closes in ${days} days`
}

export function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}
