export class Todo {
  readonly id: number
  readonly title: string
  readonly done: boolean
  readonly listId: string

  constructor(id: number, title: string, done: boolean, listId: string) {
    this.id = id
    this.title = title
    this.done = done
    this.listId = listId
  }

  toggled() {
    return new Todo(this.id, this.title, !this.done, this.listId)
  }
}
