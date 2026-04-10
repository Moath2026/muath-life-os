// ── Mock Data for all 6 Dimensions ──────────────────────────────────────────
// Realistic, 30-day historical data for Muath's Life Dashboard

const today = new Date()
const daysAgo = (n) => {
  const d = new Date(today)
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}
const daysFromNow = (n) => {
  const d = new Date(today)
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}

// ── BOOKS ─────────────────────────────────────────────────────────────────────
export const DEFAULT_BOOKS = [
  // Currently Reading
  {
    id: 'b1', title: 'Atomic Habits', author: 'James Clear', emoji: '⚛️',
    genre: 'Self-Help', currentPage: 186, totalPages: 320,
    status: 'reading', rating: null,
    startDate: daysAgo(18), completionDate: null,
    notes: 'The 1% better every day concept is life-changing. Habit stacking chapter blew my mind.',
  },
  {
    id: 'b2', title: 'The Lean Startup', author: 'Eric Ries', emoji: '🚀',
    genre: 'Business', currentPage: 94, totalPages: 336,
    status: 'reading', rating: null,
    startDate: daysAgo(7), completionDate: null,
    notes: 'Validated learning concept applies directly to my AI consulting idea.',
  },
  {
    id: 'b3', title: 'Deep Work', author: 'Cal Newport', emoji: '🧠',
    genre: 'Productivity', currentPage: 41, totalPages: 296,
    status: 'reading', rating: null,
    startDate: daysAgo(3), completionDate: null,
    notes: '',
  },
  // Reading List
  {
    id: 'b4', title: 'Zero to One', author: 'Peter Thiel', emoji: '1️⃣',
    genre: 'Business', currentPage: 0, totalPages: 224,
    status: 'want-to-read', rating: null,
    startDate: null, completionDate: null, notes: 'Recommended by multiple successful entrepreneurs.',
  },
  {
    id: 'b5', title: 'The Psychology of Money', author: 'Morgan Housel', emoji: '💰',
    genre: 'Finance', currentPage: 0, totalPages: 256,
    status: 'want-to-read', rating: null,
    startDate: null, completionDate: null, notes: 'Must read before investing.',
  },
  {
    id: 'b6', title: 'Never Split the Difference', author: 'Chris Voss', emoji: '🤝',
    genre: 'Business', currentPage: 0, totalPages: 288,
    status: 'want-to-read', rating: null,
    startDate: null, completionDate: null, notes: 'Negotiation skills for client deals.',
  },
  {
    id: 'b7', title: 'Sapiens', author: 'Yuval Noah Harari', emoji: '🦴',
    genre: 'History', currentPage: 0, totalPages: 512,
    status: 'want-to-read', rating: null,
    startDate: null, completionDate: null, notes: '',
  },
  {
    id: 'b8', title: 'The Almanack of Naval Ravikant', author: 'Eric Jorgenson', emoji: '🧭',
    genre: 'Philosophy', currentPage: 0, totalPages: 242,
    status: 'want-to-read', rating: null,
    startDate: null, completionDate: null, notes: 'Free PDF available. Wealth & happiness.',
  },
  // Completed
  {
    id: 'b9', title: 'Rich Dad Poor Dad', author: 'Robert Kiyosaki', emoji: '💵',
    genre: 'Finance', currentPage: 336, totalPages: 336,
    status: 'completed', rating: 4,
    startDate: daysAgo(90), completionDate: daysAgo(72),
    notes: 'Shifted my mindset on assets vs liabilities. Changed how I think about money.',
  },
  {
    id: 'b10', title: '48 Laws of Power', author: 'Robert Greene', emoji: '♟️',
    genre: 'Strategy', currentPage: 480, totalPages: 480,
    status: 'completed', rating: 4,
    startDate: daysAgo(150), completionDate: daysAgo(120),
    notes: 'Dense but insightful. Took months but worth it.',
  },
  {
    id: 'b11', title: 'The 4-Hour Workweek', author: 'Tim Ferriss', emoji: '⏰',
    genre: 'Business', currentPage: 416, totalPages: 416,
    status: 'completed', rating: 5,
    startDate: daysAgo(60), completionDate: daysAgo(42),
    notes: 'This book is the reason I started pursuing remote work. 10/10 must-read.',
  },
  {
    id: 'b12', title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', emoji: '🔮',
    genre: 'Psychology', currentPage: 499, totalPages: 499,
    status: 'completed', rating: 5,
    startDate: daysAgo(200), completionDate: daysAgo(170),
    notes: 'System 1 vs System 2 thinking is something I apply every day now.',
  },
  {
    id: 'b13', title: 'Start With Why', author: 'Simon Sinek', emoji: '🎯',
    genre: 'Leadership', currentPage: 256, totalPages: 256,
    status: 'completed', rating: 3,
    startDate: daysAgo(45), completionDate: daysAgo(30),
    notes: 'Good concept but gets repetitive. The TED talk covers the main idea.',
  },
  {
    id: 'b14', title: 'The E-Myth Revisited', author: 'Michael Gerber', emoji: '🏗️',
    genre: 'Business', currentPage: 288, totalPages: 288,
    status: 'completed', rating: 4,
    startDate: daysAgo(110), completionDate: daysAgo(95),
    notes: 'Entrepreneur vs Technician vs Manager framework is gold for my consulting plans.',
  },
]

// ── WORKOUTS ──────────────────────────────────────────────────────────────────
const WORKOUT_TYPES = ['Running', 'Gym', 'Cycling', 'Yoga', 'HIIT', 'Swimming', 'Walking']

const workoutTemplate = (daysBack, type, duration, intensity, calories = null, distance = null, notes = '') => ({
  id: `w${daysBack}`,
  date: daysAgo(daysBack),
  type,
  duration, // minutes
  intensity, // Low | Medium | High
  calories,
  distance, // km
  notes,
})

export const DEFAULT_WORKOUTS = [
  workoutTemplate(0, 'Gym', 60, 'High', 420, null, 'Chest & triceps. New PB on bench: 80kg'),
  workoutTemplate(1, 'Running', 35, 'Medium', 280, 5.2, 'Morning run around the park'),
  workoutTemplate(2, 'Yoga', 45, 'Low', 180, null, 'Evening stretch session'),
  workoutTemplate(3, 'Gym', 70, 'High', 480, null, 'Back & biceps. Felt strong'),
  workoutTemplate(5, 'HIIT', 30, 'High', 350, null, '20 min Tabata + 10 min core'),
  workoutTemplate(6, 'Cycling', 50, 'Medium', 320, 18, 'Indoor bike session'),
  workoutTemplate(7, 'Gym', 65, 'High', 450, null, 'Legs day. Squats felt good'),
  workoutTemplate(8, 'Running', 40, 'Medium', 310, 6.1, 'Trying to build base mileage'),
  workoutTemplate(9, 'Walking', 60, 'Low', 200, 6.5, 'Evening walk after dinner'),
  workoutTemplate(10, 'Gym', 55, 'High', 410, null, 'Shoulders & arms'),
  workoutTemplate(12, 'Yoga', 30, 'Low', 120, null, 'Recovery day stretching'),
  workoutTemplate(13, 'Running', 30, 'Medium', 240, 4.8, 'Short tempo run'),
  workoutTemplate(14, 'Gym', 75, 'High', 520, null, 'Full body compound movements'),
  workoutTemplate(15, 'HIIT', 25, 'High', 330, null, 'Quick morning session'),
  workoutTemplate(16, 'Cycling', 45, 'Medium', 290, 16, ''),
  workoutTemplate(17, 'Gym', 60, 'Medium', 390, null, 'Deload week — lighter weights'),
  workoutTemplate(19, 'Running', 45, 'Medium', 360, 7.2, 'Longest run this month!'),
  workoutTemplate(20, 'Yoga', 60, 'Low', 200, null, 'Sunday recovery + meditation'),
  workoutTemplate(21, 'Gym', 65, 'High', 440, null, 'Chest, back superset'),
  workoutTemplate(22, 'HIIT', 20, 'High', 280, null, ''),
  workoutTemplate(24, 'Gym', 70, 'High', 460, null, 'Leg press PR: 180kg'),
  workoutTemplate(25, 'Walking', 45, 'Low', 160, 5.0, 'Active recovery'),
  workoutTemplate(26, 'Running', 35, 'Medium', 270, 5.5, ''),
  workoutTemplate(27, 'Gym', 60, 'High', 420, null, ''),
  workoutTemplate(28, 'Yoga', 30, 'Low', 110, null, 'Pre-sleep yoga'),
  workoutTemplate(29, 'Cycling', 40, 'Medium', 260, 14, ''),
]

// ── GAMES ─────────────────────────────────────────────────────────────────────
export const DEFAULT_GAMES = [
  // Currently Playing
  { id: 'g1', title: 'Baldur\'s Gate 3', platform: 'PC', genre: 'RPG', emoji: '⚔️', status: 'playing', hoursPlayed: 87, totalHours: null, rating: null, startDate: daysAgo(45), completionDate: null, notes: 'Act 2. Incredible storytelling.' },
  { id: 'g2', title: 'Hollow Knight', platform: 'PC', genre: 'Metroidvania', emoji: '🦋', status: 'playing', hoursPlayed: 22, totalHours: null, rating: null, startDate: daysAgo(14), completionDate: null, notes: 'Very challenging but satisfying.' },
  { id: 'g3', title: 'FIFA 25', platform: 'PS5', genre: 'Sports', emoji: '⚽', status: 'playing', hoursPlayed: 34, totalHours: null, rating: null, startDate: daysAgo(60), completionDate: null, notes: 'Ultimate Team grind.' },
  // Completed
  { id: 'g4', title: 'God of War Ragnarök', platform: 'PS5', genre: 'Action', emoji: '🪓', status: 'completed', hoursPlayed: 42, totalHours: 42, rating: 5, startDate: daysAgo(120), completionDate: daysAgo(100), notes: 'One of the best games I\'ve ever played. Story was phenomenal.' },
  { id: 'g5', title: 'Cyberpunk 2077', platform: 'PC', genre: 'RPG', emoji: '🤖', status: 'completed', hoursPlayed: 95, totalHours: 95, rating: 4, startDate: daysAgo(200), completionDate: daysAgo(160), notes: 'After all the patches, truly a masterpiece.' },
  { id: 'g6', title: 'Red Dead Redemption 2', platform: 'PC', genre: 'Open World', emoji: '🤠', status: 'completed', hoursPlayed: 110, totalHours: 110, rating: 5, startDate: daysAgo(300), completionDate: daysAgo(250), notes: 'Arthur Morgan is the best video game character ever written.' },
  { id: 'g7', title: 'The Witcher 3', platform: 'PC', genre: 'RPG', emoji: '🐺', status: 'completed', hoursPlayed: 130, totalHours: 130, rating: 5, startDate: daysAgo(400), completionDate: daysAgo(360), notes: 'With all DLC. A legend.' },
  { id: 'g8', title: 'Elden Ring', platform: 'PC', genre: 'Souls-like', emoji: '💀', status: 'completed', hoursPlayed: 78, totalHours: 78, rating: 5, startDate: daysAgo(180), completionDate: daysAgo(140), notes: 'Hard but incredibly rewarding. Melenia took me 3 days.' },
  // Want to Play
  { id: 'g9', title: 'Alan Wake 2', platform: 'PC', genre: 'Thriller', emoji: '🔦', status: 'want-to-play', hoursPlayed: 0, totalHours: null, rating: null, startDate: null, completionDate: null, notes: 'Everyone says it\'s incredible.' },
  { id: 'g10', title: 'Starfield', platform: 'PC', genre: 'RPG', emoji: '🌌', status: 'want-to-play', hoursPlayed: 0, totalHours: null, rating: null, startDate: null, completionDate: null, notes: 'On Game Pass. Will try eventually.' },
  { id: 'g11', title: 'Spider-Man 2', platform: 'PS5', genre: 'Action', emoji: '🕷️', status: 'want-to-play', hoursPlayed: 0, totalHours: null, rating: null, startDate: null, completionDate: null, notes: '' },
  { id: 'g12', title: 'Hades II', platform: 'PC', genre: 'Roguelike', emoji: '⚡', status: 'want-to-play', hoursPlayed: 0, totalHours: null, rating: null, startDate: null, completionDate: null, notes: 'Early access. Loved the first one.' },
  { id: 'g13', title: 'Final Fantasy VII Rebirth', platform: 'PS5', genre: 'JRPG', emoji: '🌿', status: 'want-to-play', hoursPlayed: 0, totalHours: null, rating: null, startDate: null, completionDate: null, notes: '' },
  { id: 'g14', title: 'Indiana Jones', platform: 'PC', genre: 'Adventure', emoji: '🎩', status: 'want-to-play', hoursPlayed: 0, totalHours: null, rating: null, startDate: null, completionDate: null, notes: '' },
  { id: 'g15', title: 'Dragon Age: The Veilguard', platform: 'PC', genre: 'RPG', emoji: '🐉', status: 'dropped', hoursPlayed: 8, totalHours: null, rating: 2, startDate: daysAgo(90), completionDate: null, notes: 'Not for me. Too simplified compared to Origins.' },
]

// ── TRIPS ─────────────────────────────────────────────────────────────────────
export const DEFAULT_TRIPS = [
  // Upcoming
  {
    id: 't1', destination: 'Istanbul', country: 'Turkey', flag: '🇹🇷',
    type: 'upcoming', status: 'booked',
    startDate: daysFromNow(45), endDate: daysFromNow(52),
    budget: 4500, notes: 'Layover turned into a 7-day vacation!',
    highlights: '',
    rating: null,
    checklist: [
      { id: 'tc1', item: 'Book hotel in Sultanahmet', done: true },
      { id: 'tc2', item: 'Get travel insurance', done: true },
      { id: 'tc3', item: 'Exchange currency', done: false },
      { id: 'tc4', item: 'Download offline maps', done: false },
      { id: 'tc5', item: 'Book Bosphorus cruise', done: false },
      { id: 'tc6', item: 'Pack light — carry-on only', done: false },
    ],
  },
  {
    id: 't2', destination: 'Dubai', country: 'UAE', flag: '🇦🇪',
    type: 'upcoming', status: 'planning',
    startDate: daysFromNow(90), endDate: daysFromNow(94),
    budget: 3000, notes: 'Short trip for an aviation networking event.',
    highlights: '',
    rating: null,
    checklist: [
      { id: 'tc7', item: 'Register for event', done: true },
      { id: 'tc8', item: 'Book flights (staff travel)', done: false },
      { id: 'tc9', item: 'Find hotel near DIFC', done: false },
    ],
  },
  // Past Trips
  {
    id: 't3', destination: 'London', country: 'UK', flag: '🇬🇧',
    type: 'past', status: 'completed',
    startDate: daysAgo(120), endDate: daysAgo(114),
    budget: 6000, notes: '',
    highlights: 'Visited the British Museum, walked through Hyde Park, explored Camden Market. The city is expensive but incredibly vibrant.',
    rating: 5,
    checklist: [],
  },
  {
    id: 't4', destination: 'Tokyo', country: 'Japan', flag: '🇯🇵',
    type: 'past', status: 'completed',
    startDate: daysAgo(200), endDate: daysAgo(192),
    budget: 8000, notes: '',
    highlights: 'Cherry blossom season was magical. Shinjuku at night is unlike anything. Tried real ramen in a tiny shop.',
    rating: 5,
    checklist: [],
  },
  {
    id: 't5', destination: 'Barcelona', country: 'Spain', flag: '🇪🇸',
    type: 'past', status: 'completed',
    startDate: daysAgo(350), endDate: daysAgo(344),
    budget: 5500, notes: '',
    highlights: 'Sagrada Família is breathtaking. Tapas and wine culture is amazing. Beach + city combo is perfect.',
    rating: 4,
    checklist: [],
  },
  {
    id: 't6', destination: 'Cairo', country: 'Egypt', flag: '🇪🇬',
    type: 'past', status: 'completed',
    startDate: daysAgo(500), endDate: daysAgo(496),
    budget: 2000, notes: '',
    highlights: 'The Pyramids at sunset was surreal. Khan el-Khalili market is chaotic but amazing.',
    rating: 4,
    checklist: [],
  },
  {
    id: 't7', destination: 'Paris', country: 'France', flag: '🇫🇷',
    type: 'past', status: 'completed',
    startDate: daysAgo(600), endDate: daysAgo(594),
    budget: 7000, notes: '',
    highlights: 'Eiffel Tower at night, Louvre in a day (exhausting but worth it), best croissant of my life.',
    rating: 5,
    checklist: [],
  },
  // Bucket List
  {
    id: 't8', destination: 'Kyoto', country: 'Japan', flag: '🇯🇵', type: 'bucket-list', status: 'planning', startDate: null, endDate: null, budget: 7000, notes: 'Temples, bamboo forest, geisha district', highlights: '', rating: null, checklist: [] },
  { id: 't9', destination: 'Maldives', country: 'Maldives', flag: '🇲🇻', type: 'bucket-list', status: 'planning', startDate: null, endDate: null, budget: 12000, notes: 'Overwater bungalow. Honeymoon destination', highlights: '', rating: null, checklist: [] },
  { id: 't10', destination: 'New York', country: 'USA', flag: '🇺🇸', type: 'bucket-list', status: 'planning', startDate: null, endDate: null, budget: 9000, notes: 'Times Square, Central Park, Brooklyn', highlights: '', rating: null, checklist: [] },
  { id: 't11', destination: 'Singapore', country: 'Singapore', flag: '🇸🇬', type: 'bucket-list', status: 'planning', startDate: null, endDate: null, budget: 6000, notes: 'Gardens by the Bay, food heaven', highlights: '', rating: null, checklist: [] },
  { id: 't12', destination: 'Rome', country: 'Italy', flag: '🇮🇹', type: 'bucket-list', status: 'planning', startDate: null, endDate: null, budget: 5500, notes: 'Colosseum, Vatican, pasta', highlights: '', rating: null, checklist: [] },
  { id: 't13', destination: 'Seoul', country: 'South Korea', flag: '🇰🇷', type: 'bucket-list', status: 'planning', startDate: null, endDate: null, budget: 5000, notes: 'K-culture, amazing food scene', highlights: '', rating: null, checklist: [] },
  { id: 't14', destination: 'Amsterdam', country: 'Netherlands', flag: '🇳🇱', type: 'bucket-list', status: 'planning', startDate: null, endDate: null, budget: 5000, notes: 'Canals, museums, cycling', highlights: '', rating: null, checklist: [] },
  { id: 't15', destination: 'Lisbon', country: 'Portugal', flag: '🇵🇹', type: 'bucket-list', status: 'planning', startDate: null, endDate: null, budget: 4000, notes: 'Best value capital in Europe', highlights: '', rating: null, checklist: [] },
]

// ── WELLNESS ──────────────────────────────────────────────────────────────────
const moodData = (daysBack, mood, energy, notes = '') => ({
  id: `mood${daysBack}`,
  date: daysAgo(daysBack),
  mood, // 1-10
  energy, // 1-10
  notes,
})

export const DEFAULT_MOOD = [
  moodData(0, 8, 9, 'Felt very productive today. Gym + study session.'),
  moodData(1, 7, 7, ''),
  moodData(2, 6, 6, 'A bit tired. Long flight duty.'),
  moodData(3, 8, 8, 'Great day. Finished chapter on n8n automations.'),
  moodData(4, 9, 9, 'Excellent! Completed first AI workflow.'),
  moodData(5, 7, 6, ''),
  moodData(6, 5, 5, 'Stressed about finances.'),
  moodData(7, 7, 8, 'Morning workout helped a lot.'),
  moodData(8, 8, 7, 'Good progress on Python.'),
  moodData(9, 6, 5, 'Tired. Back-to-back flights.'),
  moodData(10, 7, 7, ''),
  moodData(11, 9, 9, 'Rest day. Recharged completely.'),
  moodData(12, 8, 8, ''),
  moodData(13, 7, 7, ''),
  moodData(14, 6, 6, 'Monday blues.'),
  moodData(15, 8, 8, 'Good focus session.'),
  moodData(16, 7, 7, ''),
  moodData(17, 5, 4, 'Didn\'t sleep well.'),
  moodData(18, 6, 6, ''),
  moodData(19, 8, 9, 'Epic workout. Felt unstoppable.'),
  moodData(20, 9, 8, 'Beautiful day off. Read & relaxed.'),
  moodData(21, 7, 7, ''),
  moodData(22, 7, 8, ''),
  moodData(23, 8, 7, ''),
  moodData(24, 6, 5, 'Low energy all day.'),
  moodData(25, 7, 7, ''),
  moodData(26, 8, 8, ''),
  moodData(27, 9, 9, 'Best week so far this month.'),
  moodData(28, 7, 6, ''),
  moodData(29, 6, 6, ''),
]

const meditationData = (daysBack, duration, type, notes = '') => ({
  id: `med${daysBack}`,
  date: daysAgo(daysBack),
  duration, // minutes
  type, // Mindfulness | Breathing | Body Scan | Guided | Sleep
  notes,
})

export const DEFAULT_MEDITATION = [
  meditationData(0, 15, 'Mindfulness', 'Morning session. Very focused.'),
  meditationData(1, 10, 'Breathing', '4-7-8 breathing technique'),
  meditationData(2, 20, 'Guided', 'Headspace session on stress'),
  meditationData(4, 15, 'Mindfulness', ''),
  meditationData(5, 10, 'Body Scan', 'Before sleep'),
  meditationData(6, 25, 'Guided', 'Deep relaxation session'),
  meditationData(7, 15, 'Mindfulness', 'Difficult to focus today'),
  meditationData(9, 10, 'Breathing', ''),
  meditationData(11, 20, 'Mindfulness', 'Rest day meditation — amazing calm'),
  meditationData(12, 15, 'Body Scan', ''),
  meditationData(14, 10, 'Breathing', 'Pre-flight routine'),
  meditationData(15, 20, 'Guided', ''),
  meditationData(16, 15, 'Mindfulness', ''),
  meditationData(18, 10, 'Sleep', 'Helped with insomnia'),
  meditationData(19, 15, 'Mindfulness', ''),
  meditationData(20, 30, 'Guided', 'Sunday long session. Very peaceful.'),
  meditationData(21, 15, 'Mindfulness', ''),
  meditationData(23, 10, 'Breathing', ''),
  meditationData(25, 20, 'Body Scan', ''),
  meditationData(27, 15, 'Mindfulness', ''),
]

const sleepData = (daysBack, bedtime, wakeTime, duration, quality) => ({
  id: `sl${daysBack}`,
  date: daysAgo(daysBack),
  bedtime, // "23:30"
  wakeTime, // "07:00"
  duration, // hours
  quality, // 1-5
})

export const DEFAULT_SLEEP = [
  sleepData(0, '23:00', '07:00', 8.0, 5),
  sleepData(1, '23:30', '07:30', 8.0, 4),
  sleepData(2, '00:30', '08:00', 7.5, 3),
  sleepData(3, '22:45', '07:00', 8.25, 5),
  sleepData(4, '23:00', '06:30', 7.5, 4),
  sleepData(5, '00:00', '08:00', 8.0, 4),
  sleepData(6, '01:00', '09:00', 8.0, 3),
  sleepData(7, '22:30', '06:30', 8.0, 5),
  sleepData(8, '23:00', '07:00', 8.0, 4),
  sleepData(9, '00:00', '06:00', 6.0, 2),
  sleepData(10, '23:30', '07:30', 8.0, 4),
  sleepData(11, '22:00', '08:00', 10.0, 5),
  sleepData(12, '23:00', '07:00', 8.0, 4),
  sleepData(13, '23:15', '07:15', 8.0, 4),
  sleepData(14, '00:00', '07:00', 7.0, 3),
  sleepData(15, '23:00', '07:00', 8.0, 5),
  sleepData(16, '23:30', '07:30', 8.0, 4),
  sleepData(17, '01:30', '07:30', 6.0, 2),
  sleepData(18, '23:00', '07:00', 8.0, 3),
  sleepData(19, '22:30', '06:30', 8.0, 5),
  sleepData(20, '22:00', '08:00', 10.0, 5),
  sleepData(21, '23:00', '07:00', 8.0, 4),
  sleepData(22, '23:30', '07:00', 7.5, 4),
  sleepData(23, '23:00', '07:00', 8.0, 4),
  sleepData(24, '00:30', '07:00', 6.5, 3),
  sleepData(25, '23:00', '07:30', 8.5, 4),
  sleepData(26, '23:00', '07:00', 8.0, 4),
  sleepData(27, '22:30', '06:30', 8.0, 5),
  sleepData(28, '23:00', '07:00', 8.0, 4),
  sleepData(29, '00:00', '07:00', 7.0, 3),
]
