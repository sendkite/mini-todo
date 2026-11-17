import type { List } from '../models/List'
import type { Todo } from '../models/Todo'

interface SidebarProps {
  smartLists: List[]
  projects: List[]
  todos: Todo[]
  activeId?: string
  onSelect: (id: string) => void
}

interface SidebarLinkProps {
  list: List
  todos: Todo[]
  active: boolean
  onSelect: (id: string) => void
}

const SidebarLink = ({ list, todos, active, onSelect }: SidebarLinkProps) => {
  const count = list.openCount(todos)

  return (
    <li>
      <a
        href="#"
        aria-current={active ? 'page' : undefined}
        onClick={(e) => {
          e.preventDefault()
          onSelect(list.id)
        }}
      >
        <span aria-hidden="true">{list.icon}</span>
        {list.name}
        {count ? <span className="count">{count}</span> : null}
      </a>
    </li>
  )
}

export const Sidebar = ({
  smartLists,
  projects,
  todos,
  activeId,
  onSelect,
}: SidebarProps) => (
  <aside className="sidebar">
    <nav aria-label="리스트">
      <ul>
        {smartLists.map((list) => (
          <SidebarLink
            key={list.id}
            list={list}
            todos={todos}
            active={list.id === activeId}
            onSelect={onSelect}
          />
        ))}
      </ul>
    </nav>

    <nav aria-label="프로젝트">
      <h2 className="sidebar-section-title">프로젝트</h2>
      <ul>
        {projects.map((list) => (
          <SidebarLink
            key={list.id}
            list={list}
            todos={todos}
            active={list.id === activeId}
            onSelect={onSelect}
          />
        ))}
      </ul>
    </nav>
  </aside>
)
