import { useApp } from '../../context/AppContext'
import { Target, CheckCircle2, Circle } from 'lucide-react'
import { PRIORITY_COLORS, CATEGORY_COLORS } from '../../utils/helpers'

export default function GoalsCard({ onNavigate }) {
  const { goals, toggleGoal } = useApp()

  const activeGoals = goals.filter(g => !g.completed)
  const highPriority = activeGoals.filter(g => g.priority === 'High')
  const displayGoals = (highPriority.length > 0 ? highPriority : activeGoals).slice(0, 4)

  const completedCount = goals.filter(g => g.completed).length
  const totalCount = goals.length

  return (
    <div className="glass-card p-5 flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'rgba(251,191,36,0.12)' }}>
            <Target size={13} className="text-amber-400" />
          </div>
          <h3 className="font-heading font-semibold text-white text-sm">Goals</h3>
        </div>
        <div className="flex items-center gap-3">
          <span
            className="text-xs font-semibold tabular-nums px-2 py-0.5 rounded-lg"
            style={{ color: '#fbbf24', background: 'rgba(251,191,36,0.08)' }}
          >
            {completedCount}/{totalCount}
          </span>
          <button
            onClick={onNavigate}
            className="text-xs text-slate-500 hover:text-accent-green transition-colors font-medium"
            style={{ minHeight: 'unset' }}
          >
            View all →
          </button>
        </div>
      </div>

      {displayGoals.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-4">
          <p className="text-xs text-slate-500">No active goals.</p>
          <button
            onClick={onNavigate}
            className="text-xs text-accent-green mt-1 hover:underline"
            style={{ minHeight: 'unset' }}
          >
            Add a goal →
          </button>
        </div>
      ) : (
        <div className="space-y-2 flex-1">
          {displayGoals.map(goal => (
            <div
              key={goal.id}
              className="flex items-start gap-3 px-3 py-2.5 rounded-xl transition-all duration-150"
              style={{
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <button
                onClick={(e) => { e.stopPropagation(); toggleGoal(goal.id) }}
                className="mt-0.5 flex-shrink-0 text-slate-600 hover:text-accent-green transition-colors"
                style={{ minHeight: 'unset' }}
              >
                {goal.completed
                  ? <CheckCircle2 size={14} className="text-accent-green" />
                  : <Circle size={14} />}
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-200 leading-snug truncate font-medium">{goal.title}</p>
                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${PRIORITY_COLORS[goal.priority]}`}>
                    {goal.priority}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${CATEGORY_COLORS[goal.category]}`}>
                    {goal.category}
                  </span>
                  {goal.dueDate && (
                    <span className="text-[10px] text-slate-600">
                      {new Date(goal.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeGoals.length > 4 && (
        <button
          onClick={onNavigate}
          className="text-xs text-slate-500 hover:text-accent-green transition-colors text-center font-medium"
          style={{ minHeight: 'unset' }}
        >
          +{activeGoals.length - 4} more active goals
        </button>
      )}
    </div>
  )
}
