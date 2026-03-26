import { useNavigate } from 'react-router-dom'

function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center gap-6">
      <span className="text-8xl">🐉</span>
      <h1 className="text-4xl font-bold text-white">A Wild 404 Appeared</h1>
      <p className="text-gray-400">This page rolled a natural 1 and vanished.</p>
      <button
        onClick={() => navigate('/campaigns')}
        className="bg-amber-600 hover:bg-amber-500 text-white font-semibold px-6 py-3 rounded transition-colors"
      >
        Return to Safety
      </button>
    </div>
  )
}

export default NotFound