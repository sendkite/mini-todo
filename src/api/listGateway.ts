import { List } from '../models/List'
import type { RemoteList } from '../types'

// Placeholder for a real request; swap with fetch() when a backend exists.
const remoteLists: RemoteList[] = [
  { id: 'inbox', name: 'Inbox', icon: '📥', kind: 'smart' },
  { id: 'today', name: 'Today', icon: '⭐', kind: 'smart' },
  { id: 'upcoming', name: 'Upcoming', icon: '📅', kind: 'smart' },
  { id: 'anytime', name: 'Anytime', icon: '🗂️', kind: 'smart' },
  { id: 'someday', name: 'Someday', icon: '📦', kind: 'smart' },
  { id: 'logbook', name: 'Logbook', icon: '✅', kind: 'smart' },
  { id: 'side-project', name: '사이드 프로젝트', icon: '🚀', kind: 'project' },
  { id: 'reading', name: '독서', icon: '📚', kind: 'project' },
]

const convertList = ({ id, name, icon, kind }: RemoteList) =>
  new List(id, name, icon, kind)

export const fetchLists = async (): Promise<List[]> =>
  remoteLists.map(convertList)
