import { todayKey } from './date'
import type { DateKey } from './date'
import type { Todo } from './Todo'

export class List {
  readonly id: string
  readonly name: string
  readonly icon: string
  readonly kind: 'smart' | 'project'

  constructor(
    id: string,
    name: string,
    icon: string,
    kind: 'smart' | 'project',
  ) {
    this.id = id
    this.name = name
    this.icon = icon
    this.kind = kind
  }

  // Logbook is a view over finished todos, not a place to put new ones
  get isLogbook() {
    return this.id === 'logbook'
  }

  get isToday() {
    return this.id === 'today'
  }

  get canAdd() {
    return !this.isLogbook
  }

  // Today also gathers todos from any list that are due today or overdue
  contains(todo: Todo, today: DateKey = todayKey()) {
    if (this.isLogbook) return todo.done
    if (this.isToday && (todo.isDueOn(today) || todo.isOverdue(today))) {
      return true
    }
    return todo.listId === this.id
  }

  openCount(todos: Todo[], today: DateKey = todayKey()) {
    if (this.isLogbook) return undefined
    return todos.filter((todo) => this.contains(todo, today) && !todo.done)
      .length
  }
}
