import type { List } from '../models/List'

export const ListHeader = ({ list }: { list: List }) => (
  <header className="content-header">
    <span aria-hidden="true">{list.icon}</span>
    <h1>{list.name}</h1>
  </header>
)
