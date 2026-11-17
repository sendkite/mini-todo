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
      <div className="toolbar">
        <button
          type="button"
          className="add-button"
          aria-label="새 할 일"
          onClick={() => setOpen(true)}
        >
          +
        </button>
      </div>
    )
  }

  return (
    <div className="add-bar">
      <form
        className="add-form"
        onSubmit={(e) => {
          e.preventDefault()
          onAdd(title)
          setTitle('')
        }}
      >
        <input
          type="text"
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
