import { Todo } from '../models/Todo'
import type { RemoteTodo } from '../types'

// Placeholder for a real request; swap with fetch() when a backend exists.
const remoteTodos: RemoteTodo[] = [
  { id: 1, title: '예시 할 일 1', completed: false, list_id: 'inbox' },
  { id: 2, title: '예시 할 일 2', completed: false, list_id: 'inbox' },
  { id: 3, title: '완료된 할 일', completed: true, list_id: 'inbox' },
  { id: 4, title: '장보기', completed: false, list_id: 'today' },
  { id: 5, title: '운동하기', completed: false, list_id: 'today' },
  { id: 6, title: '치과 예약', completed: false, list_id: 'upcoming' },
  { id: 7, title: '《클린 코드》 읽기', completed: false, list_id: 'reading' },
  { id: 8, title: '프로토타입 만들기', completed: false, list_id: 'side-project' },
]

const convertTodo = ({ id, title, completed, list_id }: RemoteTodo) =>
  new Todo(id, title, completed, list_id)

export const fetchTodos = async (): Promise<Todo[]> =>
  remoteTodos.map(convertTodo)
