import { useEffect, useState } from 'react'

const SHORTCUTS: { keys: string[]; description: string }[] = [
  { keys: ['N'], description: '새 할 일 열기' },
  { keys: ['Enter'], description: '입력/수정 확정' },
  { keys: ['Esc'], description: '입력/수정 취소, 닫기' },
  { keys: ['Backspace'], description: '선택한 할 일 삭제' },
  { keys: ['Ctrl', '?'], description: '단축키 보기/닫기' },
]

// Ctrl + ? (= Ctrl + Shift + /) 로 열고 닫는 하단 토스트. 입력 중에도 동작함
export const ShortcutHelp = () => {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // 물리 키(code)로 판별: 한글 입력기 등에서는 key 값이 '?'가 아니게 됨
      if (e.ctrlKey && e.shiftKey && e.code === 'Slash') {
        e.preventDefault()
        setOpen((prev) => !prev)
      } else if (e.code === 'Escape') {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  if (!open) return null

  return (
    <div
      role="status"
      aria-label="단축키"
      className="fixed inset-x-4 bottom-6 z-10 mx-auto flex max-w-sm flex-col gap-2 rounded-sm bg-ink p-4 text-meta text-surface shadow-lg"
    >
      <h2 className="font-semibold">단축키</h2>
      <ul className="flex flex-col gap-1.5">
        {SHORTCUTS.map(({ keys, description }) => (
          <li key={description} className="flex items-center gap-2">
            <span className="flex gap-1">
              {keys.map((key) => (
                <kbd
                  key={key}
                  className="rounded-sm border border-surface/40 px-1.5 py-0.5 font-mono"
                >
                  {key}
                </kbd>
              ))}
            </span>
            <span className="ml-auto">{description}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
