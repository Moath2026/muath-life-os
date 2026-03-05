import { useState, useEffect, useRef, useCallback } from 'react'
import { useApp } from '../context/AppContext'
import { Play, Pause, RotateCcw, Coffee, Brain, Zap } from 'lucide-react'

const MODES = {
  work:       { label: 'Focus',      duration: 25 * 60, color: '#3b82f6', icon: Brain },
  shortBreak: { label: 'Short Break',duration:  5 * 60, color: '#10b981', icon: Coffee },
  longBreak:  { label: 'Long Break', duration: 15 * 60, color: '#8b5cf6', icon: Coffee },
}

export default function Pomodoro() {
  const { pomodoro, incrementPomodoro } = useApp()
  const [mode, setMode] = useState('work')
  const [timeLeft, setTimeLeft] = useState(MODES.work.duration)
  const [running, setRunning] = useState(false)
  const [sessionsThisCycle, setSessionsThisCycle] = useState(0)
  const intervalRef = useRef(null)
  const currentMode = MODES[mode]

  // Keyboard shortcut
  useEffect(() => {
    const handler = () => setRunning(r => !r)
    document.addEventListener('shortcut:pomodoro', handler)
    return () => document.removeEventListener('shortcut:pomodoro', handler)
  }, [])

  // Timer tick
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(intervalRef.current)
            setRunning(false)
            handleComplete()
            return 0
          }
          return t - 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [running])

  const handleComplete = useCallback(() => {
    if (mode === 'work') {
      incrementPomodoro()
      const newCount = sessionsThisCycle + 1
      setSessionsThisCycle(newCount)
      // Auto-switch to break
      const nextMode = newCount % 4 === 0 ? 'longBreak' : 'shortBreak'
      switchMode(nextMode)
      // Browser notification
      if (Notification.permission === 'granted') {
        new Notification('Pomodoro complete! 🎉', { body: 'Time for a break.' })
      }
    } else {
      switchMode('work')
    }
  }, [mode, sessionsThisCycle, incrementPomodoro])

  const switchMode = (m) => {
    setMode(m)
    setTimeLeft(MODES[m].duration)
    setRunning(false)
  }

  const reset = () => {
    setRunning(false)
    setTimeLeft(currentMode.duration)
  }

  const requestNotificationPermission = () => {
    if ('Notification' in window) Notification.requestPermission()
  }

  const total = currentMode.duration
  const progress = ((total - timeLeft) / total) * 100
  const radius = 90
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference - (progress / 100) * circumference
  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0')
  const secs = String(timeLeft % 60).padStart(2, '0')

  const Icon = currentMode.icon

  return (
    <div className="space-y-6 animate-slide-up max-w-lg mx-auto">
      {/* Mode tabs */}
      <div className="glass-card p-1 flex gap-1">
        {Object.entries(MODES).map(([k, m]) => (
          <button key={k} onClick={() => switchMode(k)}
            className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all ${mode === k ? 'bg-bg-tertiary text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}>
            {m.label}
          </button>
        ))}
      </div>

      {/* Timer */}
      <div className="glass-card p-8 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-6 text-slate-400">
          <Icon size={16} style={{ color: currentMode.color }} />
          <span className="text-sm">{currentMode.label} Session</span>
        </div>

        {/* SVG Ring */}
        <div className="relative w-52 h-52 mb-6">
          <svg width="208" height="208" className="timer-ring">
            <circle cx="104" cy="104" r={radius} fill="none" stroke="#1a1a25" strokeWidth="8" />
            <circle
              cx="104" cy="104" r={radius} fill="none"
              stroke={currentMode.color} strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              className="timer-ring-fill"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono font-bold text-5xl text-white">{mins}:{secs}</span>
            <span className="text-xs text-slate-500 mt-1">{running ? 'Focusing...' : 'Ready'}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <button onClick={reset} className="w-12 h-12 rounded-full bg-bg-tertiary hover:bg-slate-700 flex items-center justify-center text-slate-400 transition-colors">
            <RotateCcw size={18} />
          </button>
          <button
            onClick={() => { setRunning(r => !r); requestNotificationPermission() }}
            className="w-16 h-16 rounded-full flex items-center justify-center text-white transition-all active:scale-95 shadow-lg"
            style={{ background: currentMode.color }}
          >
            {running ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
          </button>
          <button onClick={() => switchMode(mode === 'work' ? 'shortBreak' : 'work')} className="w-12 h-12 rounded-full bg-bg-tertiary hover:bg-slate-700 flex items-center justify-center text-slate-400 transition-colors">
            <Zap size={18} />
          </button>
        </div>

        <p className="text-xs text-slate-600 mt-4">Space = play/pause (Ctrl+P)</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Today', value: pomodoro.today, color: 'text-blue-400' },
          { label: 'This Week', value: pomodoro.week, color: 'text-purple-400' },
          { label: 'Day Streak', value: `${pomodoro.streak} 🔥`, color: 'text-amber-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="glass-card p-4 text-center">
            <p className={`font-mono font-bold text-2xl ${color}`}>{value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Session progress */}
      <div className="glass-card p-4">
        <p className="text-xs text-slate-500 mb-3">Cycle progress ({sessionsThisCycle % 4}/4 until long break)</p>
        <div className="flex gap-2">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={`flex-1 h-2 rounded-full transition-colors ${i < sessionsThisCycle % 4 ? 'bg-blue-500' : 'bg-bg-tertiary'}`} />
          ))}
        </div>
      </div>
    </div>
  )
}
