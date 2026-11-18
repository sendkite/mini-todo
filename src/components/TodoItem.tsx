import { useEffect, useRef, useState } from 'react'
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

// 체크 후 목록에서 사라지기까지의 시간. App.css의 .todo-item.is-leaving 페이드와 맞춰야 함
const LEAVE_DELAY_MS = 500

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
  // 체크한 뒤 실제 토글되기 전까지 화면에 보여줄 체크 상태 (null이면 대기 중 아님)
  const [pendingDone, setPendingDone] = useState<boolean | null>(null)
  const leaveTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(leaveTimer.current), [])

  const handleCheck = () => {
    clearTimeout(leaveTimer.current)
    // 대기 중에 다시 누르면 취소하고 원래 상태로
    if (pendingDone !== null) {
      setPendingDone(null)
      return
    }
    setPendingDone(!todo.done)
    leaveTimer.current = setTimeout(() => {
      setPendingDone(null)
      onToggle(todo.id)
    }, LEAVE_DELAY_MS)
  }

  const itemClass = [
    'todo-item',
    selected && 'is-selected',
    pendingDone !== null && 'is-leaving',
  ]
    .filter(Boolean)
    .join(' ')

  const finishEditing = (title: string) => {
    setEditing(false)
    onRename(todo.id, title)
  }

  return (
    <li
      className={itemClass}
      onClick={(e) => {
        // 체크박스·삭제 버튼·입력창 클릭, 더블클릭의 두 번째 클릭은 선택으로 취급하지 않음
        if (e.detail > 1) return
        if ((e.target as HTMLElement).closest('input, button')) return
        onSelect(todo.id)
      }}
      // 클릭하면 행에 포커스가 가도록 해서 키보드로 바로 조작할 수 있게 함
      tabIndex={-1}
      onKeyDown={(e) => {
        // 행 자체에 포커스가 있을 때만 (제목·날짜 입력 중의 Backspace는 무시)
        if (e.target !== e.currentTarget || !selected) return
        if (e.key === 'Backspace' || e.key === 'Delete') {
          e.preventDefault()
          onDelete(todo.id)
        }
      }}
    >
      <input
        type="checkbox"
        checked={pendingDone ?? todo.done}
        aria-label={`${todo.title} 완료`}
        onChange={handleCheck}
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
