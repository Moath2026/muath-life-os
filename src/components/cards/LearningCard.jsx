import { useApp } from '../../context/AppContext'
import { BookOpen, Play, Timer } from 'lucide-react'

const COURSE_COLORS = {
  'n8n Automation': '#22c55e',
  'Python Basics': '#a78bfa',
  'AI & APIs': '#38bdf8',
  'LangChain / AI Agents': '#f59e0b',
}

function CourseBar({ name, progress, color }) {
  return (
    <div>
      <div className="flex justify-between items-center text-xs mb-1.5">
        <span className="text-slate-300 font-medium truncate mr-2">{name}</span>
        <span className="font-bold tabular-nums flex-shrink-0" style={{ color }}>{progress}%</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${color}, ${color}bb)`,
            boxShadow: `0 0 8px ${color}40`,
          }}
        />
      </div>
    </div>
  )
}

export default function LearningCard({ onNavigate }) {
  const { skills, pomodoro } = useApp()
  const aiCourses = skills.filter(s => s.category === 'AI').slice(0, 3)

  return (
    <div className="glass-card p-5 flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.12)' }}>
            <BookOpen size={13} className="text-accent-purple" />
          </div>
          <h3 className="font-heading font-semibold text-white text-sm">Learning</h3>
        </div>
        <div
          className="flex items-center gap-1.5 text-xs text-slate-500 px-2 py-1 rounded-lg"
          style={{ background: 'rgba(255,255,255,0.04)' }}
        >
          <Timer size={11} className="text-slate-600" />
          <span>{pomodoro.week} sessions this week</span>
        </div>
      </div>

      <div className="space-y-3.5 flex-1">
        {aiCourses.map(skill => (
          <CourseBar
            key={skill.id}
            name={skill.name}
            progress={skill.progress}
            color={COURSE_COLORS[skill.name] || '#8b5cf6'}
          />
        ))}
      </div>

      <button
        onClick={onNavigate}
        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-accent-purple text-sm font-semibold transition-all duration-150 active:scale-95"
        style={{
          background: 'rgba(139,92,246,0.1)',
          border: '1px solid rgba(139,92,246,0.2)',
        }}
      >
        <Play size={13} />
        Continue Learning
      </button>
    </div>
  )
}
