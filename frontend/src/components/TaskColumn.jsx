import { useState } from 'react'
import { Link } from 'react-router-dom'

const STATUS_LABELS = {
  pendente: 'Pendente',
  'em andamento': 'Em andamento',
  concluído: 'Concluída',
}

const STATUS_COLORS = {
  pendente: 'border-amber-400 bg-amber-50',
  'em andamento': 'border-sky-400 bg-sky-50',
  concluído: 'border-emerald-400 bg-emerald-50',
}

export default function TaskColumn({ status, tasks, onEdit, onDelete }) {
  const label = STATUS_LABELS[status] ?? status
  const color = STATUS_COLORS[status] ?? 'border-slate-300 bg-slate-50'
  const [selectedImage, setSelectedImage] = useState(null)

  function getImageUrl(imageUrl) {
    return imageUrl?.startsWith('http')
      ? imageUrl
      : `http://127.0.0.1:8000${imageUrl}`
  }

  return (
    <section className="flex-1 space-y-3">
      <header className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-800">
          {label}
        </h2>
        <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-medium text-slate-700">
          {tasks.length} atividade{tasks.length !== 1 && 's'}
        </span>
      </header>

      <div className="space-y-3">
        {tasks.map((task) => (
          <article
            key={task.id}
            className={`rounded-lg border ${color} p-3 text-sm shadow-sm transition hover:-translate-y-0.5 hover:shadow-md`}
          >
            <header className="mb-1 flex items-start justify-between gap-2">
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">
                  <Link
                    to={`/tasks/${task.id}`}
                    className="hover:underline"
                  >
                    {task.title}
                  </Link>
                </h3>
              </div>
            </header>

            {/* Miniatura da imagem, se existir */}
            {task.image_url && (
              <div className="mb-2">
                <img
                  src={getImageUrl(task.image_url)}
                  alt={`Miniatura de ${task.title}`}
                  onClick={() => setSelectedImage(getImageUrl(task.image_url))}
                  className="h-20 w-full cursor-pointer rounded border border-slate-200 bg-white object-contain transition hover:opacity-80"
                  title="Clique para ver imagem completa"
                />
              </div>
            )}

            {task.description && (
              <p className="mb-3 text-xs text-slate-700 line-clamp-3">
                {task.description}
              </p>
            )}

            <footer className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => onEdit(task)}
                className="rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Editar
              </button>
              <button
                type="button"
                onClick={() => onDelete(task)}
                className="rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
              >
                Excluir
              </button>
            </footer>
          </article>
        ))}

        {tasks.length === 0 && (
          <p className="text-xs text-slate-500">
            Nenhuma atividade neste status.
          </p>
        )}
      </div>

      {/* Modal para visualizar imagem completa */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-h-full max-w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -right-2 -top-2 rounded-full bg-white p-2 text-slate-800 shadow-lg hover:bg-slate-100"
              aria-label="Fechar"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <img
              src={selectedImage}
              alt="Imagem completa"
              className="max-h-[90vh] max-w-full rounded-lg object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </section>
  )
}

