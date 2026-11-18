import { daysBetween } from './date'
import type { DateKey } from './date'

export class Todo {
  readonly id: number
  readonly title: string
  readonly done: boolean
  readonly listId: string
  readonly dueDate?: DateKey

  constructor(
    id: number,
    title: string,
    done: boolean,
    listId: string,
    dueDate?: DateKey,
  ) {
    this.id = id
    this.title = title
    this.done = done
    this.listId = listId
    this.dueDate = dueDate
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

  renamed(title: string) {
    return new Todo(this.id, title, this.done, this.listId, this.dueDate)
  }

  toggled() {
    return new Todo(this.id, this.title, !this.done, this.listId, this.dueDate)
  }

  withDueDate(dueDate?: DateKey) {
    return new Todo(this.id, this.title, this.done, this.listId, dueDate)
  }
}
