// Shapes of data as the (remote) backend sends it
export interface RemoteTodo {
  id: number
  title: string
  completed: boolean
  list_id: string
  due_date: string | null // 'YYYY-MM-DD'
  completed_at: string | null // ISO 8601 timestamp
}

export interface RemoteList {
  id: string
  name: string
  icon: string
  kind: 'smart' | 'project'
}
