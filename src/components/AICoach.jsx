import { useState, useRef, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { Bot, Send, User, Sparkles } from 'lucide-react'

const QUICK_PROMPTS = [
  { label: '🎯 What to focus on today?', key: 'focus' },
  { label: '📊 Analyze my week', key: 'analyze' },
  { label: '🏋️ Give me a workout', key: 'workout' },
  { label: '🍽️ What should I eat?', key: 'eat' },
]

function buildResponse(key, { health, habits, pomodoro, skills, finance }) {
  const workoutHabit = habits.find(h => h.name === 'Workout')
  const topSkill = [...skills].sort((a, b) => b.progress - a.progress)[0]
  const donePct = habits.length > 0 ? Math.round((habits.filter(h => h.doneToday).length / habits.length) * 100) : 0

  switch (key) {
    case 'focus':
      return `Based on your data today, here's your focus order:\n\n` +
        `1️⃣ **Health** — You're at ${health.calories}/${health.caloriesTarget} kcal. Log your meals and hit your protein target (${health.protein}/${health.proteinTarget}g).\n\n` +
        `2️⃣ **Learning** — ${topSkill?.name} is at ${topSkill?.progress}%. Even 30 min today helps.\n\n` +
        `3️⃣ **Focus sessions** — You've done ${pomodoro.today} today. Aim for at least 3.\n\n` +
        `4️⃣ **Habits** — ${donePct}% complete. ${habits.filter(h => !h.doneToday).map(h => h.name).join(', ')} are still pending.\n\n` +
        `You've got this, Muath! 💪`

    case 'analyze':
      return `**Weekly Review — ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}**\n\n` +
        `📊 **Habits**: ${donePct}% completion rate today\n` +
        `🍅 **Focus**: ${pomodoro.week} Pomodoro sessions this week\n` +
        `⚖️ **Weight**: ${health.weight}kg → Target: ${health.weightTarget}kg (${(health.weight - health.weightTarget).toFixed(1)}kg to go)\n` +
        `📚 **Learning**: ${skills.filter(s => s.category === 'AI').map(s => `${s.name} ${s.progress}%`).join(', ')}\n\n` +
        `💡 **Insight**: Your strongest area is Habits. Keep the ${workoutHabit?.streak}-day workout streak alive!\n\n` +
        `🎯 **Next week focus**: Push protein intake to 120g+ daily and complete 3 learning sessions.`

    case 'workout':
      return `**Home Workout Plan — 45 min** 🏋️\n\n` +
        `**Warm-up** (5 min):\n• Jumping jacks × 30\n• Hip circles × 10 each side\n\n` +
        `**Main** (35 min):\n• Push-ups: 4 × 15\n• Squats: 4 × 20\n• Plank: 3 × 60s\n• Mountain climbers: 3 × 20\n• Dumbbell rows: 3 × 12 (if available)\n• Burpees: 3 × 10\n\n` +
        `**Cool-down** (5 min): stretch quads, chest, shoulders\n\n` +
        `This hits ${Math.round(350 + Math.random() * 50)} kcal est. High protein meal after! 🥩\n\nLog it in Habits when done ✅`

    case 'eat':
      const remainingCal = health.caloriesTarget - health.calories
      const remainingProt = health.proteinTarget - health.protein
      return `**Halal Meal Suggestion** 🍽️\n\n` +
        `You have **${remainingCal} kcal** and **${remainingProt}g protein** left today.\n\n` +
        `**Option 1** — Grilled chicken breast (200g) + rice (1 cup) + salad\n→ ~480 kcal | 45g protein\n\n` +
        `**Option 2** — Eggs (3) + whole grain bread + avocado\n→ ~380 kcal | 22g protein\n\n` +
        `**Option 3** — Tuna with brown rice + vegetables\n→ ~350 kcal | 38g protein\n\n` +
        `💧 Don't forget to drink water! You're at ${health.water}/${health.waterTarget} glasses.\n\n` +
        `All options are Halal ✅`

    default:
      return `I can help you with:\n• Your daily focus plan\n• Weekly analysis\n• Workout suggestions\n• Meal ideas\n\nWhat would you like to know? 😊`
  }
}

function ChatBubble({ message }) {
  const isUser = message.role === 'user'
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center ${
        isUser ? 'bg-accent-green/20' : 'bg-accent-purple/20'
      }`}>
        {isUser ? <User size={14} className="text-accent-green" /> : <Bot size={14} className="text-accent-purple" />}
      </div>
      <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
        isUser
          ? 'bg-green-500/15 border border-green-500/20 text-slate-100 rounded-tr-sm'
          : 'bg-bg-tertiary border border-white/5 text-slate-200 rounded-tl-sm'
      }`}>
        {message.content}
      </div>
    </div>
  )
}

export default function AICoach() {
  const { health, habits, pomodoro, skills, finance } = useApp()
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `مرحبا Muath! 👋 I'm your AI Life Coach.\n\nI have context from all your data — health, habits, learning, and finance. Ask me anything or pick a quick prompt below.`
    }
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const sendMessage = (text, key = null) => {
    if (!text.trim()) return

    const userMsg = { role: 'user', content: text }
    setMessages(m => [...m, userMsg])
    setInput('')
    setTyping(true)

    const delay = 800 + Math.random() * 700
    setTimeout(() => {
      const ctx = { health, habits, pomodoro, skills, finance }
      const responseKey = key || (
        text.toLowerCase().includes('focus') || text.toLowerCase().includes('today') ? 'focus' :
        text.toLowerCase().includes('week') || text.toLowerCase().includes('analyz') ? 'analyze' :
        text.toLowerCase().includes('workout') || text.toLowerCase().includes('exercise') ? 'workout' :
        text.toLowerCase().includes('eat') || text.toLowerCase().includes('food') || text.toLowerCase().includes('meal') ? 'eat' :
        'default'
      )
      const response = buildResponse(responseKey, ctx)
      setTyping(false)
      setMessages(m => [...m, { role: 'assistant', content: response }])
    }, delay)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    sendMessage(input)
  }

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto animate-slide-up" style={{ height: 'calc(100vh - 120px)' }}>
      {/* Header */}
      <div className="glass-card p-4 mb-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
          <Sparkles size={18} className="text-white" />
        </div>
        <div>
          <h2 className="font-heading font-semibold text-white text-sm">AI Life Coach</h2>
          <p className="text-xs text-slate-500">Context-aware · Personalized · Always on</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
          <span className="text-xs text-slate-500">Online</span>
        </div>
      </div>

      {/* Quick prompts */}
      <div className="flex gap-2 flex-wrap mb-4">
        {QUICK_PROMPTS.map(({ label, key }) => (
          <button
            key={key}
            onClick={() => sendMessage(label, key)}
            className="text-xs px-3 py-1.5 rounded-full bg-bg-tertiary border border-white/[0.08] text-slate-400 hover:text-white hover:border-white/20 transition-all duration-150"
          >
            {label}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.map((msg, i) => (
          <ChatBubble key={i} message={msg} />
        ))}
        {typing && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-xl bg-accent-purple/20 flex-shrink-0 flex items-center justify-center">
              <Bot size={14} className="text-accent-purple" />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-bg-tertiary border border-white/5">
              <div className="flex gap-1 items-center h-4">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask your AI coach anything..."
          className="input-field flex-1"
          disabled={typing}
        />
        <button
          type="submit"
          disabled={!input.trim() || typing}
          className="w-10 h-10 rounded-xl bg-accent-green hover:bg-green-400 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-bg-primary transition-all active:scale-95"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  )
}
