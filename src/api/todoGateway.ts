import { toDateKey, todayKey } from '../models/date'
import { Todo } from '../models/Todo'
import type { RemoteTodo } from '../types'

const daysAgo = (n: number) => {
  const date = new Date()
  date.setDate(date.getDate() - n)
  return toDateKey(date)
}

const hoursAgo = (n: number) =>
  new Date(Date.now() - n * 3_600_000).toISOString()

// Placeholder for a real request; swap with fetch() when a backend exists.
const remoteTodos: RemoteTodo[] = [
  { id: 1, title: '예시 할 일 1', completed: false, list_id: 'inbox', due_date: null, completed_at: null },
  // Due today, so it also shows up in Today
  { id: 2, title: '예시 할 일 2', completed: false, list_id: 'inbox', due_date: todayKey(), completed_at: null },
  // Completed samples spread over a few days to show Logbook's day groups
  { id: 3, title: '완료된 할 일', completed: true, list_id: 'inbox', due_date: null, completed_at: hoursAgo(26) },
  { id: 4, title: '장보기', completed: false, list_id: 'today', due_date: null, completed_at: null },
  { id: 5, title: '운동하기', completed: false, list_id: 'today', due_date: null, completed_at: null },
  // Two days overdue, so it shows up in Today marked as overdue
  { id: 6, title: '치과 예약', completed: false, list_id: 'upcoming', due_date: daysAgo(2), completed_at: null },
  { id: 7, title: '《클린 코드》 읽기', completed: false, list_id: 'reading', due_date: null, completed_at: null },
  { id: 8, title: '프로토타입 만들기', completed: false, list_id: 'side-project', due_date: null, completed_at: null },
  { id: 9, title: '도서관 책 반납', completed: true, list_id: 'reading', due_date: null, completed_at: hoursAgo(1) },
  { id: 10, title: '아이디어 정리', completed: true, list_id: 'side-project', due_date: null, completed_at: hoursAgo(24 * 5) },
]

const convertTodo = ({
  id,
  title,
  completed,
  list_id,
  due_date,
  completed_at,
}: RemoteTodo) =>
  new Todo(
    id,
    title,
    completed,
    list_id,
    due_date ?? undefined,
    completed && completed_at ? Date.parse(completed_at) : undefined,
  )

export const fetchTodos = async (): Promise<Todo[]> =>
  remoteTodos.map(convertTodo)
