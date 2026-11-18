import { toDateKey, todayKey } from '../models/date'
import { Todo } from '../models/Todo'
import type { RemoteTodo } from '../types'

const daysAgo = (n: number) => {
  const date = new Date()
  date.setDate(date.getDate() - n)
  return toDateKey(date)
}

// Placeholder for a real request; swap with fetch() when a backend exists.
const remoteTodos: RemoteTodo[] = [
  { id: 1, title: '예시 할 일 1', completed: false, list_id: 'inbox', due_date: null },
  // Due today, so it also shows up in Today
  { id: 2, title: '예시 할 일 2', completed: false, list_id: 'inbox', due_date: todayKey() },
  { id: 3, title: '완료된 할 일', completed: true, list_id: 'inbox', due_date: null },
  { id: 4, title: '장보기', completed: false, list_id: 'today', due_date: null },
  { id: 5, title: '운동하기', completed: false, list_id: 'today', due_date: null },
  // Two days overdue, so it shows up in Today marked as overdue
  { id: 6, title: '치과 예약', completed: false, list_id: 'upcoming', due_date: daysAgo(2) },
  { id: 7, title: '《클린 코드》 읽기', completed: false, list_id: 'reading', due_date: null },
  { id: 8, title: '프로토타입 만들기', completed: false, list_id: 'side-project', due_date: null },
]

const convertTodo = ({ id, title, completed, list_id, due_date }: RemoteTodo) =>
  new Todo(id, title, completed, list_id, due_date ?? undefined)

export const fetchTodos = async (): Promise<Todo[]> =>
  remoteTodos.map(convertTodo)
