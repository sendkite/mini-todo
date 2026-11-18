import { todayKey } from './date'
import type { DateKey } from './date'
import type { Todo } from './Todo'

// A run of todos shown together; `date` labels Logbook's per-day sections
export interface TodoGroup {
  date?: DateKey
  todos: Todo[]
}

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

  // Completed todos live only in Logbook; every other list shows open ones.
  // Today also gathers todos from any list that are due today or overdue.
  contains(todo: Todo, today: DateKey = todayKey()) {
    if (this.isLogbook) return todo.done
    if (todo.done) return false
    if (this.isToday && (todo.isDueOn(today) || todo.isOverdue(today))) {
      return true
    }
    return todo.listId === this.id
  }

  // What the list shows, in display order. Logbook: most recently completed
  // first, split into one group per completion day. Others: a single group.
  groups(todos: Todo[], today: DateKey = todayKey()): TodoGroup[] {
    const shown = todos.filter((todo) => this.contains(todo, today))
    if (!this.isLogbook) return [{ todos: shown }]

    const groups: TodoGroup[] = []
    const newestFirst = shown.toSorted(
      (a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0),
    )
    for (const todo of newestFirst) {
      const last = groups.at(-1)
      if (last && last.date === todo.completedOn) last.todos.push(todo)
      else groups.push({ date: todo.completedOn, todos: [todo] })
    }
    return groups
  }

  openCount(todos: Todo[], today: DateKey = todayKey()) {
    if (this.isLogbook) return undefined
    return todos.filter((todo) => this.contains(todo, today)).length
  }
}
