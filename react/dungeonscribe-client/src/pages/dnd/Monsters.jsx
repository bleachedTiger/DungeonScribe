import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import SearchInput from '../../components/SearchInput'
import ErrorMessage from '../../components/ErrorMessage'
import LoadingSpinner from '../../components/LoadingSpinner'
import { dndService } from '../../api/dndService'
import { formatSourceLabel, formatSourceUrl } from "../../utils/sourceUtils";

function MonsterCard({ monster }) {
  const [expanded, setExpanded] = useState(false)

  // Format ability score with modifier
  const abilityMod = (score) => {
    const mod = Math.floor((score - 10) / 2)
    return `${score} (${mod >= 0 ? '+' : ''}${mod})`
  }

  // Format speed object into readable string
const formatSpeed = (speed) => {
  if (!speed) return '—'
  return Object.entries(speed)
    .map(([type, value]) => {
      if (typeof value === 'boolean') {
        return value ? type : null  // "hover: true" becomes "hover"
      }
      return `${type} ${value}ft`   // "walk: 30" becomes "walk 30ft"
    })
    .filter(Boolean)
    .join(', ')
}

  // Format actions array into readable list
  const formatList = (items) => {
    if (!items || items.length === 0) return null
    return items.map((item, i) => (
      <div key={i} className="mb-2">
        <span className="text-white font-medium">{item.name}: </span>
        <span className="text-gray-300">{item.desc}</span>
      </div>
    ))
  }

  const savingThrows = {
    'STR': monster.strength_save,
    'DEX': monster.dexterity_save,
    'CON': monster.constitution_save,
    'INT': monster.intelligence_save,
    'WIS': monster.wisdom_save,
    'CHA': monster.charisma_save,
  }

  const hasSaves = Object.entries(savingThrows).some(([, v]) => v !== null)

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 hover:border-amber-500 transition-colors">
      {/* Header - always visible */}
      <div
        className="p-4 cursor-pointer flex items-start justify-between"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start w-full justify-between">
          {/* Left side - title and subtitle */}
          <div>
            <h3 className="text-white font-semibold text-lg">{monster.name}</h3>
            <p className="text-gray-400 text-sm mt-1">
              {monster.size} {monster.type}
              {monster.subtype ? ` (${monster.subtype})` : ''} • {monster.alignment}
            </p>
          </div>

           {/* Right side - badge, chevron, then source below */}
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-3">
              <span className="bg-amber-600 text-white text-xs px-2 py-1 rounded">
                CR {monster.challenge_rating}
              </span>
              <span className="text-gray-400 text-sm">
                {expanded ? '▲' : '▼'}
              </span>
            </div>
            <span className="text-gray-500 text-xs mt-2 italic">
              {formatSourceLabel(monster.documentTitle, 'monsters')}
            </span>
          </div>
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-700 pt-4 space-y-4">

          {/* Core stats */}
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div>
              <span className="text-amber-500 font-medium">AC: </span>
              <span className="text-gray-300">
                {monster.armor_class}
                {monster.armor_desc ? ` (${monster.armor_desc})` : ''}
              </span>
            </div>
            <div>
              <span className="text-amber-500 font-medium">HP: </span>
              <span className="text-gray-300">
                {monster.hit_points} ({monster.hit_dice})
              </span>
            </div>
            <div>
              <span className="text-amber-500 font-medium">Speed: </span>
              <span className="text-gray-300">{formatSpeed(monster.speed)}</span>
            </div>
          </div>

          {/* Ability scores */}
          <div>
            <h4 className="text-amber-500 font-medium text-sm mb-2">
              Ability Scores
            </h4>
            <div className="grid grid-cols-6 gap-1 text-center">
              {[
                { label: 'STR', value: monster.strength },
                { label: 'DEX', value: monster.dexterity },
                { label: 'CON', value: monster.constitution },
                { label: 'INT', value: monster.intelligence },
                { label: 'WIS', value: monster.wisdom },
                { label: 'CHA', value: monster.charisma },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="bg-gray-700 rounded p-2"
                >
                  <div className="text-amber-500 text-xs font-bold">{label}</div>
                  <div className="text-white text-xs">{abilityMod(value)}</div>
                </div>
              ))}
            </div>
          </div>

          {hasSaves && (
            <div className="text-sm">
              <span className="text-amber-500 font-medium">Saving Throws: </span>
              <span className="text-gray-300">
                {Object.entries(savingThrows)
                  .filter(([, v]) => v !== null)
                  .map(([k, v]) => `${k} +${v}`)
                  .join(', ')}
              </span>
            </div>
          )}

          {/* Resistances/Immunities */}
          {monster.damageResistances && (
            <div className="text-sm">
              <span className="text-amber-500 font-medium">Resistances: </span>
              <span className="text-gray-300">{monster.damageResistances}</span>
            </div>
          )}
          {monster.damageImmunities && (
            <div className="text-sm">
              <span className="text-amber-500 font-medium">Immunities: </span>
              <span className="text-gray-300">{monster.damageImmunities}</span>
            </div>
          )}
          {monster.conditionImmunities && (
            <div className="text-sm">
              <span className="text-amber-500 font-medium">
                Condition Immunities:{' '}
              </span>
              <span className="text-gray-300">{monster.conditionImmunities}</span>
            </div>
          )}

          {/* Senses + Languages */}
          {monster.senses && (
            <div className="text-sm">
              <span className="text-amber-500 font-medium">Senses: </span>
              <span className="text-gray-300">{monster.senses}</span>
            </div>
          )}
          {monster.languages && (
            <div className="text-sm">
              <span className="text-amber-500 font-medium">Languages: </span>
              <span className="text-gray-300">{monster.languages}</span>
            </div>
          )}

          {/* Description */}
          {monster.desc && (
            <div className="text-sm">
              <h4 className="text-amber-500 font-medium mb-1">Description</h4>
              <p className="text-gray-300">{monster.desc}</p>
            </div>
          )}

          {/* Special Abilities */}
          {monster.specialAbilities && monster.specialAbilities.length > 0 && (
            <div className="text-sm">
              <h4 className="text-amber-500 font-medium mb-2">
                Special Abilities
              </h4>
              {formatList(monster.specialAbilities)}
            </div>
          )}

          {/* Actions */}
          {monster.actions && monster.actions.length > 0 && (
            <div className="text-sm">
              <h4 className="text-amber-500 font-medium mb-2">Actions</h4>
              {formatList(monster.actions)}
            </div>
          )}

          {/* Legendary Actions */}
          {monster.legendaryActions && monster.legendaryActions.length > 0 && (
            <div className="text-sm">
              <h4 className="text-amber-500 font-medium mb-2">
                Legendary Actions
              </h4>
              {formatList(monster.legendaryActions)}
            </div>
          )}

          {/* Content Origin*/}
          {monster.documentTitle && (
            <div className="text-sm text-gray-500 mt-2 pt-2 border-t border-gray-700">
              <span className="text-amber-500 font-medium">Source: </span>
              <a
                href={formatSourceUrl(monster.documentUrl, monster.documentTitle, 'monsters')}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-amber-400 transition-colors"
              >
                {formatSourceLabel(monster.documentTitle, 'monsters')}
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function Monsters() {
  const [search, setSearch] = useState('')
  const [monsters, setMonsters] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMonsters()
    }, 500)
    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  useEffect(() => {
    document.title = 'DungeonScribe | Monsters'
  }, [])

  const fetchMonsters = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await dndService.searchMonsters(search)
      setMonsters(response.data.results)
      setTotal(response.data.count)
    } catch {
      setError('Failed to load monsters')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Monsters</h1>
        <p className="text-gray-400">Search the D&D 5e monster manual</p>
      </div>

      <div className="mb-6">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search monsters... e.g. Dragon"
        />
      </div>

      {error && (
        <ErrorMessage
          message={error}
          onRetry={fetchMonsters}
        />
      )}


      {loading ? (
          <LoadingSpinner message="Loading your search results..." />
      ) : (
          <div className="text-gray-400 text-sm mb-4">
          {`${total} monsters found`}
      </div>
      )}

      <div className="space-y-3">
        {monsters.map((monster, index) => (
          <MonsterCard key={index} monster={monster} />
        ))}
      </div>
    </Layout>
  )
}

export default Monsters