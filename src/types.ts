// Shapes of data as the (remote) backend sends it
export interface RemoteTodo {
  id: number
  title: string
  completed: boolean
  list_id: string
  due_date: string | null // 'YYYY-MM-DD'
}

export interface RemoteList {
  id: string
  name: string
  icon: string
  kind: 'smart' | 'project'
}
