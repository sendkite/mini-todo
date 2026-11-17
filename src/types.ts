// Shapes of data as the (remote) backend sends it
export interface RemoteTodo {
  id: number
  title: string
  completed: boolean
  list_id: string
}

export interface RemoteList {
  id: string
  name: string
  icon: string
  kind: 'smart' | 'project'
}
