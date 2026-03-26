import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import SearchInput from '../../components/SearchInput'
import ErrorMessage from '../../components/ErrorMessage'
import LoadingSpinner from '../../components/LoadingSpinner'
import { dndService } from '../../api/dndService'
import { formatSourceLabel, formatSourceUrl } from '../../utils/sourceUtils'
import { MonsterDto } from '../../types'

interface SavingThrows {
  STR: number | null
  DEX: number | null
  CON: number | null
  INT: number | null
  WIS: number | null
  CHA: number | null
}

// ✅ 1. CollapsibleText - defined first, outside everything else
function CollapsibleText({ text, label }: { text: string; label: string }) {
  const [showFull, setShowFull] = useState<boolean>(false)
  const isLong = text.length > 200

  return (
    <div className="text-sm">
      <h4 className="text-amber-500 font-medium mb-1">{label}</h4>
      <p className="text-gray-300">
        {isLong && !showFull ? `${text.slice(0, 200)}...` : text}
      </p>
      {isLong && (
        <button
          onClick={() => setShowFull(!showFull)}
          className="text-amber-500 hover:text-amber-400 text-xs mt-1 transition-colors"
        >
          {showFull ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  )
}

function MonsterCard({ monster }: { monster: MonsterDto }) {
  const [expanded, setExpanded] = useState<boolean>(false)

  // Format ability score with modifier
  const abilityMod = (score: number): string => {
    const mod = Math.floor((score - 10) / 2)
    return `${score} (${mod >= 0 ? '+' : ''}${mod})`
  }

  const formatSpeed = (speed: Record<string, number | boolean> | undefined): string => {
    if (!speed) return '—'
    return Object.entries(speed)
      .map(([type, value]) => {
        if (typeof value === 'boolean') {
          return value ? type : null
        }
        return `${type} ${value}ft`
      })
      .filter(Boolean)
      .join(', ')
  }

  const savingThrows: SavingThrows = {
    STR: monster.strengthSave ?? null,
    DEX: monster.dexteritySave ?? null,
    CON: monster.constitutionSave ?? null,
    INT: monster.intelligenceSave ?? null,
    WIS: monster.wisdomSave ?? null,
    CHA: monster.charismaSave ?? null,
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
                {monster.armorDesc ? ` (${monster.armorDesc})` : ''}
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
            <h4 className="text-amber-500 font-medium text-sm mb-2">Ability Scores</h4>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 text-center">
              {[
                { label: 'STR', value: monster.strength },
                { label: 'DEX', value: monster.dexterity },
                { label: 'CON', value: monster.constitution },
                { label: 'INT', value: monster.intelligence },
                { label: 'WIS', value: monster.wisdom },
                { label: 'CHA', value: monster.charisma },
              ].map(({ label, value }) => (
                <div key={label} className="bg-gray-700 rounded p-2">
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
              <span className="text-amber-500 font-medium">Condition Immunities: </span>
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
            <CollapsibleText text={monster.desc} label="Description" />
          )}

          {/* Special Abilities */}
          {monster.specialAbilities && monster.specialAbilities.length > 0 && (
            <div className="text-sm">
              <h4 className="text-amber-500 font-medium mb-2">Special Abilities</h4>
              {monster.specialAbilities.map((ability, i) => (
                <CollapsibleText key={i} text={ability.desc} label={ability.name} />
              ))}
            </div>
          )}

          {/* Actions */}
          {monster.actions && monster.actions.length > 0 && (
            <div className="text-sm">
              <h4 className="text-amber-500 font-medium mb-2">Actions</h4>
              {monster.actions.map((action, i) => (
                <CollapsibleText key={i} text={action.desc} label={action.name} />
              ))}
            </div>
          )}

          {/* Legendary Actions */}
          {monster.legendaryActions && monster.legendaryActions.length > 0 && (
            <div className="text-sm">
              <h4 className="text-amber-500 font-medium mb-2">Legendary Actions</h4>
              {monster.legendaryActions.map((action, i) => (
                <CollapsibleText key={i} text={action.desc} label={action.name} />
              ))}
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
  const [search, setSearch] = useState<string>('')
  const [monsters, setMonsters] = useState<MonsterDto[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [total, setTotal] = useState<number>(0)

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

  const fetchMonsters = async (): Promise<void> => {
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

      {error && <ErrorMessage message={error} onRetry={fetchMonsters} />}

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