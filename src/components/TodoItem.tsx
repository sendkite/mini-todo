import { useState } from 'react'
import type { Todo } from '../models/Todo'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: number) => void
  onRename: (id: number, title: string) => void
  onDelete: (id: number) => void
  selected: boolean
  onSelect: (id: number) => void
}

export const TodoItem = ({
  todo,
  onToggle,
  onRename,
  onDelete,
  selected,
  onSelect,
}: TodoItemProps) => {
  const [editing, setEditing] = useState(false)

  const finishEditing = (title: string) => {
    setEditing(false)
    onRename(todo.id, title)
  }

  return (
    <li
      className={selected ? 'todo-item is-selected' : 'todo-item'}
      onClick={(e) => {
        // 체크박스·삭제 버튼·입력창 클릭, 더블클릭의 두 번째 클릭은 선택으로 취급하지 않음
        if (e.detail > 1) return
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
      {editing ? (
        <input
          type="text"
          className="todo-title-input"
          autoFocus
          defaultValue={todo.title}
          aria-label={`${todo.title} 수정`}
          onFocus={(e) => e.currentTarget.select()}
          onBlur={(e) => finishEditing(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
              e.currentTarget.blur()
            } else if (e.key === 'Escape') {
              // 원래 제목으로 되돌린 뒤 blur → 변경 없음으로 처리됨
              e.currentTarget.value = todo.title
              e.currentTarget.blur()
            }
          }}
        />
      ) : (
        <span className="todo-title" onDoubleClick={() => setEditing(true)}>
          {todo.title}
        </span>
      )}
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
