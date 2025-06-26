import React, { useState } from 'react'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts'

export type Task = {
  id: string
  title: string
  type: string
  description: string
  traits: string[]
}

const TASKS: Record<string, Task> = {
  's1-msg': {
    id: 's1-msg',
    title: 'İlk Mesaj',
    type: 'info',
    description: 'QR koddan gelen ilk mektubu oku.',
    traits: ['curiosity'],
  },
  's2-trace': {
    id: 's2-trace',
    title: 'Kayıp Oda',
    type: 'real_world',
    description: 'Mekansal içindeki objeyi bul.',
    traits: ['attention', 'exploration'],
  },
  's3-connection': {
    id: 's3-connection',
    title: 'Ortak Görev',
    type: 'social',
    description: 'Başka biriyle görev çöz.',
    traits: ['empathy', 'teamwork'],
  },
  's4-reflection': {
    id: 's4-reflection',
    title: 'Yansıtma',
    type: 'creative',
    description: 'Bir içgörü üret ve paylaş.',
    traits: ['creativity', 'self-awareness'],
  },
}

const INITIAL_TRAITS: Record<string, number> = {
  empathy: 0.1,
  leadership: 0.1,
  exploration: 0.1,
  attention: 0.1,
  creativity: 0.1,
  decision_quality: 0.1,
  curiosity: 0.1,
  teamwork: 0.1,
  self_awareness: 0.1,
}

export default function App() {
  const [signal, setSignal] = useState({ type: '', location: '', keyword: '' })
  const [assignedTask, setAssignedTask] = useState<Task | null>(null)
  const [traits, setTraits] = useState(INITIAL_TRAITS)

  const handleSignal = () => {
    const { type, location, keyword } = signal
    const hour = new Date().getHours()

    let task: Task | null = null
    if (location.toLowerCase().includes('mekansal') && hour >= 9 && hour <= 17) {
      task = TASKS['s2-trace']
    } else if (keyword.toLowerCase() === 'ayna') {
      task = TASKS['s4-reflection']
    } else if (type.toLowerCase() === 'qr') {
      task = TASKS['s1-msg']
    }

    setAssignedTask(task)

    if (task) {
      const newTraits = { ...traits }
      task.traits.forEach((t) => {
        if (newTraits[t] !== undefined) {
          newTraits[t] += 0.1
        }
      })
      setTraits(newTraits)
    }
  }

  const chartData = Object.keys(traits).map((key) => ({
    trait: key,
    value: traits[key],
  }))

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 space-y-6">
      <h1 className="text-3xl font-bold text-green-400">SAL: Initiation Protocol</h1>

      <div className="flex flex-col space-y-2 w-full max-w-md">
        <input
          className="bg-gray-800 border border-gray-600 p-2 rounded"
          placeholder="Sinyal Türü (örnek: qr)"
          onChange={(e) => setSignal({ ...signal, type: e.target.value })}
        />
        <input
          className="bg-gray-800 border border-gray-600 p-2 rounded"
          placeholder="Konum (örnek: mekansal)"
          onChange={(e) => setSignal({ ...signal, location: e.target.value })}
        />
        <input
          className="bg-gray-800 border border-gray-600 p-2 rounded"
          placeholder="Anahtar kelime (örnek: ayna)"
          onChange={(e) => setSignal({ ...signal, keyword: e.target.value })}
        />
        <button
          onClick={handleSignal}
          className="bg-green-600 hover:bg-green-500 text-white p-2 rounded mt-2"
        >
          Sinyali Gönder
        </button>
      </div>

      {assignedTask && (
        <div className="p-4 border border-green-500 rounded bg-gray-900 w-full max-w-md">
          <h2 className="text-xl font-semibold text-green-300">🎯 Görev Atandı:</h2>
          <p className="text-lg">{assignedTask.title}</p>
          <p className="text-sm text-gray-400">{assignedTask.description}</p>
        </div>
      )}

      <div className="mt-6">
        <h2 className="text-lg mb-2">🧠 Trait Profili</h2>
        <RadarChart outerRadius={90} width={350} height={300} data={chartData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="trait" stroke="#ccc" />
          <PolarRadiusAxis angle={30} domain={[0, 1]} />
          <Radar name="Agent" dataKey="value" stroke="#0f0" fill="#0f0" fillOpacity={0.4} />
        </RadarChart>
      </div>
    </div>
  )
}
