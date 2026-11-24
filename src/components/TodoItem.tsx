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

const dueDateColor = (todo: Todo, today: DateKey) => {
  if (todo.isOverdue(today)) return 'font-semibold text-danger'
  if (todo.isDueOn(today)) return 'font-semibold text-accent'
  return 'text-muted'
}

// 체크 후 목록에서 사라지기까지의 시간. 아래 leaving 클래스의 페이드(delay-300 + 200ms)와 맞춰야 함
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
    // group: 행에 hover/포커스가 있을 때 삭제 버튼을 보여주기 위함
    // 클릭으로 받는 포커스는 선택 배경으로 이미 표시되므로 outline은 숨김
    'group flex cursor-default items-center gap-3 rounded-sm border-b border-line px-2 py-3 focus:outline-none',
    selected && 'bg-accent-soft',
    // 체크 직후: 체크 표시를 잠깐 보여준 뒤 페이드아웃 (총 0.5s = LEAVE_DELAY_MS)
    pendingDone !== null
      ? 'opacity-0 transition-opacity delay-300 motion-reduce:opacity-100 motion-reduce:transition-none'
      : 'transition-colors',
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
        className="peer m-0 size-5 flex-none cursor-pointer appearance-none rounded-full border-[1.5px] border-muted bg-contain bg-center bg-no-repeat transition-colors checked:border-accent checked:bg-accent checked:bg-check hover:border-accent"
        checked={pendingDone ?? todo.done}
        aria-label={`${todo.title} 완료`}
        onChange={handleCheck}
      />
      {editing ? (
        <input
          type="text"
          className="field min-w-0 flex-1"
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
        <span
          className="flex-1 text-ink select-none peer-checked:line-through peer-checked:opacity-50"
          onDoubleClick={() => setEditing(true)}>
          {todo.title}
        </span>
      )}
      {selected ? (
        <input
          type="date"
          className="flex-none rounded-sm border border-line bg-transparent px-2 py-1 text-meta focus:border-accent"
          value={todo.dueDate ?? ''}
          aria-label={`${todo.title} 목표 날짜`}
          onChange={(e) =>
            onDueDateChange(todo.id, e.target.value || undefined)
          }
        />
      ) : (
        todo.dueDate && (
          <span
            className={`flex-none text-meta ${dueDateColor(todo, todayKey())}`}
            title={todo.dueDate}
          >
            {formatDueDate(todo, todayKey())}
          </span>
        )
      )}
      <button
        type="button"
        className="px-2 text-xl leading-none text-muted opacity-0 group-focus-within:opacity-100 group-hover:opacity-100 hover:text-danger hover-none:opacity-100"
        aria-label={`${todo.title} 삭제`}
        onClick={() => onDelete(todo.id)}
      >
        ×
      </button>
    </li>
  )
}
