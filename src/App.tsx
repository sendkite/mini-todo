import './App.css'
import { AddTodo } from './components/AddTodo'
import { ListHeader } from './components/ListHeader'
import { Sidebar } from './components/Sidebar'
import { TodoList } from './components/TodoList'
import { useLists } from './hooks/useLists'
import { useTodos } from './hooks/useTodos'

function App() {
  const { smartLists, projects, activeList, selectList } = useLists()
  const { todos, add, toggle, rename, setDueDate, remove } = useTodos()

  const groups = activeList ? activeList.groups(todos) : []

  return (
    <div className="app">
      <Sidebar
        smartLists={smartLists}
        projects={projects}
        todos={todos}
        activeId={activeList?.id}
        onSelect={selectList}
      />

      <main className="content">
        {activeList && <ListHeader list={activeList} />}
        <TodoList
          groups={groups}
          onToggle={toggle}
          onRename={rename}
          onDueDateChange={setDueDate}
          onDelete={remove}
        />
        {activeList?.canAdd && (
          <AddTodo onAdd={(title) => add(title, activeList.id)} />
        )}
      </main>
    </div>
  )
}

export default App
