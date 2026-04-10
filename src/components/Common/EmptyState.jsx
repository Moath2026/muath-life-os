import { Plus } from 'lucide-react'

export default function EmptyState({ icon = '📭', title, subtitle, action, onAction }) {
  return (
    <div className="glass-card p-12 flex flex-col items-center text-center gap-3">
      <span className="text-4xl">{icon}</span>
      <h3 className="font-heading font-semibold text-white text-base">{title}</h3>
      {subtitle && <p className="text-sm text-slate-500 max-w-xs">{subtitle}</p>}
      {action && (
        <button onClick={onAction} className="btn-primary mt-2 flex items-center gap-2">
          <Plus size={15} /> {action}
        </button>
      )}
    </div>
  )
}
