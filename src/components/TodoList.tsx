import { useState } from 'react'
import { daysBetween, todayKey } from '../models/date'
import type { DateKey } from '../models/date'
import type { TodoGroup } from '../models/List'
import { TodoItem } from './TodoItem'

interface TodoListProps {
  groups: TodoGroup[]
  onToggle: (id: number) => void
  onRename: (id: number, title: string) => void
  onDueDateChange: (id: number, dueDate?: DateKey) => void
  onDelete: (id: number) => void
}

const formatGroupDate = (date: DateKey, today: DateKey) => {
  const daysAgo = daysBetween(date, today)
  if (daysAgo === 0) return '오늘'
  if (daysAgo === 1) return '어제'
  const [year, month, day] = date.split('-').map(Number)
  const sameYear = date.slice(0, 4) === today.slice(0, 4)
  return sameYear ? `${month}월 ${day}일` : `${year}년 ${month}월 ${day}일`
}

export const TodoList = ({
  groups,
  onToggle,
  onRename,
  onDueDateChange,
  onDelete,
}: TodoListProps) => {
  const [selectedId, setSelectedId] = useState<number | null>(null)

  return (
    <div className="flex-1">
      {groups.map((group) => (
        <section key={group.date ?? 'all'} className="not-first:mt-6">
          {group.date && (
            <h2 className="border-b border-line px-2 pb-2 text-meta/tight font-semibold text-muted">
              {formatGroupDate(group.date, todayKey())}
            </h2>
          )}
          <ul>
            {group.todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={onToggle}
                onRename={onRename}
                onDueDateChange={onDueDateChange}
                onDelete={onDelete}
                selected={todo.id === selectedId}
                onSelect={(id) =>
                  setSelectedId(id === selectedId ? null : id)
                }
              />
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
