import { useState } from 'react'

function StatBlock({ title, subtitle, badge, source, fields }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 hover:border-amber-500 transition-colors">
      <div
        className="p-4 cursor-pointer flex items-start justify-between"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start w-full justify-between">
          {/* Left side - title and subtitle */}
          <div>
            <h3 className="text-white font-semibold text-lg">{title}</h3>
            {subtitle && (
              <p className="text-gray-400 text-sm mt-1">{subtitle}</p>
            )}
          </div>

          {/* Right side - badge, chevron, then source below */}
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-3">
              {badge && (
                <span className="bg-amber-600 text-white text-xs px-2 py-1 rounded">
                  {badge}
                </span>
              )}
              <span className="text-gray-400 text-sm">
                {expanded ? '▲' : '▼'}
              </span>
            </div>
            {source && (
              <span className="text-gray-500 text-xs mt-2 italic">
                {source}
              </span>
            )}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-700 pt-4 space-y-3">
          {fields.map(({ label, value, link  }) => value ? (
            <div key={label}>
              <span className="text-amber-500 text-sm font-medium">
                {label}:{' '}
              </span>
              {link ? (
                <a href={link} target="_blank" rel="noopener noreferrer" className="text-gray-300 text-sm underline">
                  {value}
                </a>
              ) : (
                <span className="text-gray-300 text-sm">{value}</span>
              )}
            </div>
          ) : null)}
        </div>
      )}
    </div>
  )
}

export default StatBlock