import type { Todo } from '../models/Todo'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: number) => void
  onDelete: (id: number) => void
}

export const TodoItem = ({ todo, onToggle, onDelete }: TodoItemProps) => {
  const id = `todo-${todo.id}`

  return (
    <li className="todo-item">
      <input
        type="checkbox"
        id={id}
        checked={todo.done}
        onChange={() => onToggle(todo.id)}
      />
      <label htmlFor={id}>{todo.title}</label>
      <button
        type="button"
        className="delete-button"
        aria-label={`${todo.title} 삭제`}
        onClick={() => onDelete(todo.id)}
      >
        ×
      </button>
    </li>
  )
}
