import type { Todo } from '../models/Todo'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: number) => void
  onDelete: (id: number) => void
  selected: boolean
  onSelect: (id: number) => void
}

export const TodoItem = ({
  todo,
  onToggle,
  onDelete,
  selected,
  onSelect,
}: TodoItemProps) => (
  <li
    className={selected ? 'todo-item is-selected' : 'todo-item'}
    onClick={(e) => {
      // 체크박스·삭제 버튼 클릭은 선택으로 취급하지 않음
      if ((e.target as HTMLElement).closest('input, button')) return
      onSelect(todo.id)
    }}
  >
    <input
      type="checkbox"
      checked={todo.done}
      aria-label={`${todo.title} 완료`}
      onChange={() => onToggle(todo.id)}
    />
    <span className="todo-title">{todo.title}</span>
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
