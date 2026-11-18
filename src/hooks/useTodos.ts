import { useEffect, useState } from 'react'
import { fetchTodos } from '../api/todoGateway'
import { Todo } from '../models/Todo'

const nextId = (todos: Todo[]) => Math.max(0, ...todos.map((t) => t.id)) + 1

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([])

  useEffect(() => {
    fetchTodos().then(setTodos)
  }, [])

  const add = (title: string, listId: string) => {
    const trimmed = title.trim()
    if (!trimmed) return
    setTodos((prev) => [...prev, new Todo(nextId(prev), trimmed, false, listId)])
  }

  const toggle = (id: number) =>
    setTodos((prev) => prev.map((t) => (t.id === id ? t.toggled() : t)))

  const rename = (id: number, title: string) => {
    const trimmed = title.trim()
    if (!trimmed) return
    setTodos((prev) =>
      prev.map((t) => (t.id === id && t.title !== trimmed ? t.renamed(trimmed) : t)),
    )
  }

  const remove = (id: number) =>
    setTodos((prev) => prev.filter((t) => t.id !== id))

  return { todos, add, toggle, rename, remove }
}
