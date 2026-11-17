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

  get canAdd() {
    return !this.isLogbook
  }

  contains(todo: Todo) {
    return this.isLogbook ? todo.done : todo.listId === this.id
  }

  openCount(todos: Todo[]) {
    if (this.isLogbook) return undefined
    return todos.filter((todo) => this.contains(todo) && !todo.done).length
  }
}
