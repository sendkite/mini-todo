import { daysBetween, toDateKey } from './date'
import type { DateKey } from './date'

export class Todo {
  readonly id: number
  readonly title: string
  readonly done: boolean
  readonly listId: string
  readonly dueDate?: DateKey
  readonly completedAt?: number // epoch ms, set only while done

  constructor(
    id: number,
    title: string,
    done: boolean,
    listId: string,
    dueDate?: DateKey,
    completedAt?: number,
  ) {
    this.id = id
    this.title = title
    this.done = done
    this.listId = listId
    this.dueDate = dueDate
    this.completedAt = completedAt
  }

  isDueOn(date: DateKey) {
    return this.dueDate === date
  }

  // Past its due date and still open ('YYYY-MM-DD' compares correctly as text)
  isOverdue(today: DateKey) {
    return !this.done && this.dueDate !== undefined && this.dueDate < today
  }

  daysOverdue(today: DateKey) {
    return this.isOverdue(today) ? daysBetween(this.dueDate!, today) : 0
  }

  // Local calendar day the todo was completed on
  get completedOn(): DateKey | undefined {
    return this.completedAt === undefined
      ? undefined
      : toDateKey(new Date(this.completedAt))
  }

  renamed(title: string) {
    return this.with({ title })
  }

  // Completing stamps the time; reopening clears it
  toggled(now: number = Date.now()) {
    const done = !this.done
    return this.with({ done, completedAt: done ? now : undefined })
  }

  withDueDate(dueDate?: DateKey) {
    return this.with({ dueDate })
  }

  private with(changes: Partial<Todo>) {
    const t = { ...this, ...changes }
    return new Todo(t.id, t.title, t.done, t.listId, t.dueDate, t.completedAt)
  }
}
