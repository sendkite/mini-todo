import type { List } from '../models/List'

export const ListHeader = ({ list }: { list: List }) => (
  <header className="-order-2 mb-6 flex items-center gap-3">
    <span aria-hidden="true">{list.icon}</span>
    <h1 className="text-[28px]/[1.2] font-semibold text-ink">{list.name}</h1>
  </header>
)
