import { BrowserRouter, Routes, Route } from 'react-router-dom'
import TaskBoardPage from './pages/TaskBoardPage.jsx'
import TaskDetailPage from './pages/TaskDetailPage.jsx'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-100">
        <header className="bg-slate-900 text-white shadow">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <h1 className="text-xl font-semibold">Task Manager</h1>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6">
          <Routes>
            <Route path="/" element={<TaskBoardPage />} />
            <Route path="/tasks/:id" element={<TaskDetailPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
