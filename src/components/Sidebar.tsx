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
        className="flex items-center gap-3 rounded-sm px-3 py-2 text-ink hover:bg-accent-soft aria-[current=page]:bg-accent-soft aria-[current=page]:font-semibold"
        aria-current={active ? 'page' : undefined}
        onClick={(e) => {
          e.preventDefault()
          onSelect(list.id)
        }}
      >
        <span aria-hidden="true">{list.icon}</span>
        {list.name}
        {count ? <span className="ml-auto text-meta text-muted">{count}</span> : null}
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
  <aside className="flex flex-col gap-6 border-b border-line bg-sidebar p-4 md:border-r md:border-b-0 md:px-3 md:py-6">
    <nav aria-label="리스트">
      <ul className="flex flex-col gap-0.5">
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
      <h2 className="mb-2 px-3 text-xs/tight font-semibold tracking-wider text-muted uppercase">프로젝트</h2>
      <ul className="flex flex-col gap-0.5">
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
