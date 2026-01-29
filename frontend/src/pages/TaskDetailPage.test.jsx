import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { render, screen, waitFor } from '@testing-library/react'
import TaskDetailPage from './TaskDetailPage.jsx'

vi.mock('../api/tasks.js', () => ({
  fetchTask: vi.fn().mockResolvedValue({
    id: 1,
    title: 'Detalhe tarefa',
    description: 'Descrição detalhe',
    status: 'pendente',
    image_url: '/uploads/task_1.png',
  }),
  updateTask: vi.fn().mockResolvedValue({
    id: 1,
    title: 'Detalhe tarefa',
    description: 'Atualizada',
    status: 'em andamento',
  }),
  deleteTask: vi.fn().mockResolvedValue(undefined),
  uploadTaskImage: vi.fn().mockResolvedValue({
    id: 1,
    title: 'Detalhe tarefa',
    description: 'Descrição detalhe',
    status: 'pendente',
    image_url: '/uploads/task_1.png',
  }),
}))

describe('TaskDetailPage', () => {
  it('exibe detalhes da tarefa e a imagem quando presente', async () => {
    render(
      <MemoryRouter initialEntries={['/tasks/1']}>
        <Routes>
          <Route path="/tasks/:id" element={<TaskDetailPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(
      screen.getByText(/Carregando atividade/i),
    ).toBeInTheDocument()

    await waitFor(() =>
      expect(
        screen.getByText('Detalhe tarefa'),
      ).toBeInTheDocument(),
    )

    expect(
      screen.getByText(/Descrição detalhe/i),
    ).toBeInTheDocument()

    const img = screen.getByRole('img', {
      name: /Anexo da atividade Detalhe tarefa/i,
    })
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'http://127.0.0.1:8000/uploads/task_1.png')
  })
})

