const priorityStyles = {
  low: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200',
  medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200',
  high: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200',
};

export default function TaskList({ tasks, busyId, onToggleStatus, onEdit, onDelete }) {
  if (!tasks.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-10 text-center text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400">
        No tasks yet. Create your first task above.
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {tasks.map((task) => (
        <li
          key={task.id}
          className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3
                className={`truncate font-semibold ${
                  task.status === 'completed'
                    ? 'text-slate-400 line-through dark:text-slate-500'
                    : 'text-slate-900 dark:text-white'
                }`}
              >
                {task.title}
              </h3>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${priorityStyles[task.priority]}`}
              >
                {task.priority}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  task.status === 'completed'
                    ? 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
                    : 'bg-brand-100 text-brand-800 dark:bg-brand-900/50 dark:text-brand-200'
                }`}
              >
                {task.status}
              </span>
            </div>
            {task.description && (
              <p className="mt-1 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
                {task.description}
              </p>
            )}
            {task.dueDate && (
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Due {new Date(task.dueDate).toLocaleDateString()}
              </p>
            )}
          </div>
          <div className="flex flex-shrink-0 flex-wrap gap-2">
            <button
              type="button"
              disabled={busyId === task.id}
              onClick={() => onToggleStatus(task)}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-800 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              {task.status === 'completed' ? 'Mark pending' : 'Complete'}
            </button>
            <button
              type="button"
              onClick={() => onEdit(task)}
              className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600"
            >
              Edit
            </button>
            <button
              type="button"
              disabled={busyId === task.id}
              onClick={() => onDelete(task)}
              className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-50 dark:border-rose-900 dark:text-rose-300 dark:hover:bg-rose-950/40"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
