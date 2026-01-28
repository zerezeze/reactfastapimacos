import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import TaskBoardPage from './TaskBoardPage.jsx'

vi.mock('../api/tasks.js', () => ({
  fetchTasks: vi.fn().mockResolvedValue([
    {
      id: 1,
      title: 'Pendente 1',
      description: 'Desc 1',
      status: 'pendente',
    },
    {
      id: 2,
      title: 'Em andamento 1',
      description: 'Desc 2',
      status: 'em andamento',
    },
    {
      id: 3,
      title: 'Concluída 1',
      description: 'Desc 3',
      status: 'concluído',
    },
  ]),
  createTask: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
}))

describe('TaskBoardPage', () => {
  it('renderiza colunas agrupadas por status e contador', async () => {
    render(
      <MemoryRouter>
        <TaskBoardPage />
      </MemoryRouter>,
    )

    expect(
      screen.getByText(/Nova atividade/i),
    ).toBeInTheDocument()

    // Espera carregar as tarefas mockadas
    expect(
      await screen.findByText('Pendente 1'),
    ).toBeInTheDocument()
    expect(
      await screen.findByText('Em andamento 1'),
    ).toBeInTheDocument()
    expect(
      await screen.findByText('Concluída 1'),
    ).toBeInTheDocument()
  })
})

