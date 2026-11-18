// Dates are handled as local calendar days in 'YYYY-MM-DD' form
// (the same format <input type="date"> uses), so no timezone shifts.
export type DateKey = string

export const toDateKey = (date: Date): DateKey => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export const todayKey = (): DateKey => toDateKey(new Date())

const toUtcDays = (key: DateKey) => {
  const [y, m, d] = key.split('-').map(Number)
  return Date.UTC(y, m - 1, d) / 86_400_000
}

// Whole calendar days from `from` to `to` (positive when `to` is later)
export const daysBetween = (from: DateKey, to: DateKey) =>
  toUtcDays(to) - toUtcDays(from)
