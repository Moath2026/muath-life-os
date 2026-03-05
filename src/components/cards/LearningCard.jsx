import { useApp } from '../../context/AppContext'
import { BookOpen, Play } from 'lucide-react'

const COURSE_COLORS = {
  'n8n Automation': '#22c55e',
  'Python Basics': '#a78bfa',
  'AI & APIs': '#38bdf8',
  'LangChain / AI Agents': '#f59e0b',
}

function CourseBar({ name, progress, color }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-slate-300 font-medium">{name}</span>
        <span style={{ color }}>{progress}%</span>
      </div>
      <div className="h-2 bg-bg-primary rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${color}, ${color}aa)` }}
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
          <BookOpen size={16} className="text-accent-purple" />
          <h3 className="font-heading font-semibold text-white text-sm">Learning</h3>
        </div>
        <div className="text-xs text-slate-500">
          🍅 {pomodoro.week} sessions this week
        </div>
      </div>

      <div className="space-y-3 flex-1">
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
        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-accent-purple text-sm font-medium hover:bg-purple-500/20 transition-all duration-150 active:scale-95"
      >
        <Play size={14} />
        Continue Learning
      </button>
    </div>
  )
}
