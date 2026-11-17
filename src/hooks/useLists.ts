import { useEffect, useState } from 'react'
import { fetchLists } from '../api/listGateway'
import type { List } from '../models/List'

export const useLists = () => {
  const [lists, setLists] = useState<List[]>([])
  const [activeId, setActiveId] = useState<string>()

  useEffect(() => {
    fetchLists().then(setLists)
  }, [])

  const smartLists = lists.filter((list) => list.kind === 'smart')
  const projects = lists.filter((list) => list.kind === 'project')
  const activeList = lists.find((list) => list.id === activeId) ?? smartLists[0]

  return { smartLists, projects, activeList, selectList: setActiveId }
}
