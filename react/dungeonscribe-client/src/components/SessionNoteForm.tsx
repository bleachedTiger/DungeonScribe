import { useState, useEffect } from 'react'
import { SessionNote, SessionNoteRequest } from '../types'

interface SessionNoteFormProps {
  session?: SessionNote
  onSubmit: (data: SessionNoteRequest) => Promise<void>
  onCancel: () => void
}

function SessionNoteForm({ session, onSubmit, onCancel }: SessionNoteFormProps) {
  const isEditing = !!session
  const [title, setTitle] = useState<string>('')
  const [sessionDate, setSessionDate] = useState<string>('')
  const [summary, setSummary] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (session) {
      setTitle(session.title)
      // Convert ISO string to datetime-local format
      setSessionDate(session.sessionDate.slice(0, 16))
      setSummary(session.summary || '')
    }
  }, [session])

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await onSubmit({
        title,
        sessionDate: new Date(sessionDate).toISOString(),
        summary,
      })
    } catch {
      setError('Failed to save session')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-lg w-full mx-4 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            {isEditing ? 'Edit Session' : 'New Session'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 font-medium mb-2">
              Session Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. The Dragon's Lair"
              className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600 focus:border-amber-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 font-medium mb-2">
              Session Date & Time
            </label>
            <input
              type="datetime-local"
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
              className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600 focus:border-amber-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 font-medium mb-2">
              Session Summary
            </label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={5}
              placeholder="What happened this session?"
              className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600 focus:border-amber-500 focus:outline-none resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-amber-600 hover:bg-amber-500 text-white font-semibold py-2 rounded transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Session'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 font-semibold py-2 rounded transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SessionNoteForm