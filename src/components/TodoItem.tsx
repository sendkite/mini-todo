import { useState } from 'react'
import { todayKey } from '../models/date'
import type { DateKey } from '../models/date'
import type { Todo } from '../models/Todo'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: number) => void
  onRename: (id: number, title: string) => void
  onDueDateChange: (id: number, dueDate?: DateKey) => void
  onDelete: (id: number) => void
  selected: boolean
  onSelect: (id: number) => void
}

const formatDueDate = (todo: Todo, today: DateKey) => {
  if (todo.isDueOn(today)) return '오늘'
  if (todo.isOverdue(today)) return `${todo.daysOverdue(today)}일 지남`
  const [, month, day] = (todo.dueDate ?? '').split('-').map(Number)
  return `${month}월 ${day}일`
}

const dueDateClass = (todo: Todo, today: DateKey) => {
  if (todo.isOverdue(today)) return 'due-date is-overdue'
  if (todo.isDueOn(today)) return 'due-date is-today'
  return 'due-date'
}

export const TodoItem = ({
  todo,
  onToggle,
  onRename,
  onDueDateChange,
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
      {selected ? (
        <input
          type="date"
          className="due-date-input"
          value={todo.dueDate ?? ''}
          aria-label={`${todo.title} 목표 날짜`}
          onChange={(e) =>
            onDueDateChange(todo.id, e.target.value || undefined)
          }
        />
      ) : (
        todo.dueDate && (
          <span
            className={dueDateClass(todo, todayKey())}
            title={todo.dueDate}
          >
            {formatDueDate(todo, todayKey())}
          </span>
        )
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
