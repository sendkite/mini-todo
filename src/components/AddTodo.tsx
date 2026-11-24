import { useState } from 'react'

export const AddTodo = ({ onAdd }: { onAdd: (title: string) => void }) => {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')

  const close = () => {
    setOpen(false)
    setTitle('')
  }

  if (!open) {
    return (
      <div className="sticky bottom-0 flex items-center bg-surface py-3">
        <button
          type="button"
          className="flex size-9 items-center justify-center rounded-full bg-accent text-[22px] leading-none text-white hover:brightness-110"
          aria-label="새 할 일"
          onClick={() => setOpen(true)}
        >
          +
        </button>
      </div>
    )
  }

  return (
    <div className="-order-1 flex border-b border-line pt-2 pb-3">
      <form
        className="flex flex-1"
        onSubmit={(e) => {
          e.preventDefault()
          onAdd(title)
          setTitle('')
        }}
      >
        <input
          type="text"
          className="field min-w-0 flex-1"
          autoFocus
          value={title}
          placeholder="새 할 일 (Enter로 추가, Esc로 닫기)"
          aria-label="새 할 일"
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => !title.trim() && close()}
          onKeyDown={(e) => e.key === 'Escape' && close()}
        />
      </form>
    </div>
  )
}
