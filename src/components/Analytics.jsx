import { useApp } from '../context/AppContext'
import { formatSAR } from '../utils/helpers'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend,
  PieChart, Pie, Cell,
} from 'recharts'

const DARK_TOOLTIP = {
  contentStyle: { background: '#12121a', border: '1px solid #2a2a40', borderRadius: '10px', color: '#fff', fontSize: '12px' },
  cursor: { fill: 'rgba(59,130,246,0.05)' },
}

function SectionCard({ title, children, className = '' }) {
  return (
    <div className={`glass-card p-5 ${className}`}>
      <h3 className="font-heading font-semibold text-white mb-4">{title}</h3>
      {children}
    </div>
  )
}

export default function Analytics() {
  const { skills, goals, finance, pomodoro } = useApp()

  // Skills Radar data
  const radarData = skills.map(s => ({ skill: s.name.split('/')[0].trim(), progress: s.progress }))

  // Goals by category bar chart
  const CATS = ['AI', 'Finance', 'IELTS', 'Career', 'Habits']
  const goalsByCat = CATS.map(cat => ({
    cat,
    total: goals.filter(g => g.category === cat).length,
    done: goals.filter(g => g.category === cat && g.completed).length,
  }))

  // Debt paydown timeline (monthly simulation)
  const totalMonthlyDebtPayment = finance.debts.reduce((s, d) => s + d.monthlyPayment, 0)
  const debtTimeline = Array.from({ length: 9 }, (_, i) => {
    const month = new Date(2026, i, 1)
    const label = month.toLocaleString('en-US', { month: 'short' })
    const remaining = Math.max(0, finance.debts.reduce((s, d) => s + (d.total - d.paid), 0) - totalMonthlyDebtPayment * (i + 1))
    return { month: label, debt: Math.round(remaining) }
  })

  // Financial breakdown pie
  const totalExpenses = finance.expenses.reduce((s, e) => s + Number(e.amount), 0)
  const totalDebtPmt = finance.debts.reduce((s, d) => s + d.monthlyPayment, 0)
  const surplus = Math.max(0, finance.monthlyIncome - totalExpenses - totalDebtPmt)
  const financePie = [
    { name: 'Expenses', value: totalExpenses, color: '#ef4444' },
    { name: 'Debt Payments', value: totalDebtPmt, color: '#f59e0b' },
    { name: 'Surplus', value: surplus, color: '#10b981' },
  ].filter(d => d.value > 0)

  // IELTS progress
  const ieltsData = skills.filter(s => s.category === 'IELTS').map(s => ({
    name: s.name, score: Math.round(s.progress / 100 * 9 * 10) / 10, target: 7.5
  }))

  return (
    <div className="space-y-5 animate-slide-up">
      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Goals Completed', value: `${goals.filter(g => g.completed).length}/${goals.length}`, color: 'text-green-400' },
          { label: 'Avg AI Progress', value: `${Math.round(skills.filter(s => s.category === 'AI').reduce((s, x) => s + x.progress, 0) / skills.filter(s => s.category === 'AI').length)}%`, color: 'text-blue-400' },
          { label: 'Pomodoros Today', value: pomodoro.today, color: 'text-purple-400' },
          { label: 'Day Streak', value: `${pomodoro.streak} 🔥`, color: 'text-amber-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="glass-card p-4 text-center">
            <p className={`font-mono font-bold text-2xl ${color}`}>{value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Skills Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <SectionCard title="Skills Radar">
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
              <PolarGrid stroke="#2a2a40" />
              <PolarAngleAxis dataKey="skill" tick={{ fill: '#64748b', fontSize: 10 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} />
              <Radar name="Progress" dataKey="progress" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.25} />
            </RadarChart>
          </ResponsiveContainer>
        </SectionCard>

        {/* Goals by Category */}
        <SectionCard title="Goals by Category">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={goalsByCat} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a25" />
              <XAxis dataKey="cat" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip {...DARK_TOOLTIP} />
              <Bar dataKey="total" name="Total" fill="#2a2a40" radius={[4, 4, 0, 0]} />
              <Bar dataKey="done" name="Done" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      {/* Debt Paydown */}
      <SectionCard title="Debt Paydown Projection (2026)">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={debtTimeline} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a1a25" />
            <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
            <Tooltip {...DARK_TOOLTIP} formatter={(v) => formatSAR(v)} />
            <Line type="monotone" dataKey="debt" name="Remaining Debt" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b', strokeWidth: 0, r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </SectionCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Monthly Finance Pie */}
        <SectionCard title="Monthly Budget Split">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={financePie} cx="50%" cy="50%" outerRadius={80} innerRadius={45} paddingAngle={3} dataKey="value">
                {financePie.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip {...DARK_TOOLTIP} formatter={v => formatSAR(v)} />
              <Legend formatter={(v) => <span style={{ color: '#94a3b8', fontSize: '11px' }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </SectionCard>

        {/* IELTS Score Projection */}
        <SectionCard title="IELTS Band Score Projection">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ieltsData} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a25" />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis domain={[0, 9]} tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip {...DARK_TOOLTIP} />
              <Bar dataKey="score" name="Est. Score" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="target" name="Target" fill="#f59e0b" radius={[4, 4, 0, 0]} opacity={0.4} />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-slate-600 mt-2">Estimated based on current progress. Target: 7.5 band.</p>
        </SectionCard>
      </div>
    </div>
  )
}
