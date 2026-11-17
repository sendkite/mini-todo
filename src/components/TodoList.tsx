import { useState } from 'react'
import type { Todo } from '../models/Todo'
import { TodoItem } from './TodoItem'

interface TodoListProps {
  todos: Todo[]
  onToggle: (id: number) => void
  onDelete: (id: number) => void
}

export const TodoList = ({ todos, onToggle, onDelete }: TodoListProps) => {
  const [selectedId, setSelectedId] = useState<number | null>(null)

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          selected={todo.id === selectedId}
          onSelect={(id) => setSelectedId(id === selectedId ? null : id)}
        />
      ))}
    </ul>
  )
}
