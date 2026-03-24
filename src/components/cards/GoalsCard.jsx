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
          <Target size={16} className="text-amber-400" />
          <h3 className="font-heading font-semibold text-white text-sm">Goals</h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500">{completedCount}/{totalCount} done</span>
          <button onClick={onNavigate} className="text-xs text-slate-500 hover:text-accent-green transition-colors">
            View all →
          </button>
        </div>
      </div>

      {displayGoals.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-4">
          <p className="text-xs text-slate-500">No active goals.</p>
          <button onClick={onNavigate} className="text-xs text-accent-green mt-1 hover:underline">Add a goal →</button>
        </div>
      ) : (
        <div className="space-y-2.5 flex-1">
          {displayGoals.map(goal => (
            <div
              key={goal.id}
              className="flex items-start gap-3 p-2.5 rounded-xl bg-bg-primary/40 border border-white/5 hover:border-white/10 transition-colors"
            >
              <button
                onClick={(e) => { e.stopPropagation(); toggleGoal(goal.id) }}
                className="mt-0.5 flex-shrink-0 text-slate-500 hover:text-accent-green transition-colors"
              >
                {goal.completed ? <CheckCircle2 size={15} className="text-accent-green" /> : <Circle size={15} />}
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-200 leading-snug truncate">{goal.title}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${PRIORITY_COLORS[goal.priority]}`}>
                    {goal.priority}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[goal.category]}`}>
                    {goal.category}
                  </span>
                  {goal.dueDate && (
                    <span className="text-[10px] text-slate-600">
                      Due {new Date(goal.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeGoals.length > 4 && (
        <button onClick={onNavigate} className="text-xs text-slate-500 hover:text-accent-green transition-colors text-center">
          +{activeGoals.length - 4} more active goals
        </button>
      )}
    </div>
  )
}
