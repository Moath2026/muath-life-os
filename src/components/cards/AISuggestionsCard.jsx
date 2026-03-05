import { useApp } from '../../context/AppContext'
import { Sparkles } from 'lucide-react'

const BASE_SUGGESTIONS = [
  { type: 'health', icon: '🍽️', text: "Haven't logged lunch yet — snap a photo!", action: 'health' },
  { type: 'habit', icon: '🔥', text: "Workout streak! Don't break it today.", action: null },
  { type: 'focus', icon: '🎯', text: "Start a focus session — you're on 0 today.", action: 'focus' },
  { type: 'learning', icon: '📚', text: "Continue n8n Automation — you're 65% done!", action: 'learn' },
  { type: 'finance', icon: '💰', text: "Spending is 8% higher than last week.", action: 'finance' },
]

const TYPE_COLORS = {
  health: 'border-green-500/25 bg-green-500/8',
  habit: 'border-amber-500/25 bg-amber-500/8',
  focus: 'border-sky-500/25 bg-sky-500/8',
  learning: 'border-purple-500/25 bg-purple-500/8',
  finance: 'border-yellow-500/25 bg-yellow-500/8',
}

export default function AISuggestionsCard({ onNavigate }) {
  const { habits, pomodoro } = useApp()

  const workoutHabit = habits.find(h => h.name === 'Workout')
  const suggestions = BASE_SUGGESTIONS.map(s => {
    if (s.type === 'habit' && workoutHabit)
      return { ...s, text: `${workoutHabit.streak}-day workout streak! Don't break it today.` }
    if (s.type === 'focus')
      return { ...s, text: `You've done ${pomodoro.today} focus session${pomodoro.today !== 1 ? 's' : ''} today. ${pomodoro.today === 0 ? 'Start one?' : 'Keep going!'}` }
    return s
  })

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={15} className="text-accent-green" />
        <h3 className="font-heading font-semibold text-white text-sm">AI Suggestions</h3>
        <span className="text-xs text-slate-600 ml-auto">Personalized for you</span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
        {suggestions.map((s, i) => (
          <div
            key={i}
            onClick={() => s.action && onNavigate(s.action)}
            className={`flex-shrink-0 flex items-start gap-3 p-3 rounded-xl border ${TYPE_COLORS[s.type]} ${s.action ? 'cursor-pointer hover:scale-[1.02]' : ''} transition-all duration-150 max-w-[220px]`}
          >
            <span className="text-xl leading-none mt-0.5">{s.icon}</span>
            <div>
              <p className="text-xs text-slate-300 leading-relaxed">{s.text}</p>
              {s.action && (
                <button className="text-xs text-accent-green mt-1.5 font-medium hover:underline">
                  {s.action === 'health' ? 'Log now' : s.action === 'focus' ? 'Start →' : s.action === 'learn' ? 'Open →' : 'View →'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
