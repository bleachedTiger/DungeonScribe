import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import SearchInput from '../../components/SearchInput'
import StatBlock from '../../components/StatBlock'
import ErrorMessage from '../../components/ErrorMessage'
import LoadingSpinner from '../../components/LoadingSpinner'
import { dndService } from '../../api/dndService'
import { formatSourceLabel, formatSourceUrl } from "../../utils/sourceUtils";
import { MagicItemDto } from '../../types';

function Items() {
  const [search, setSearch] = useState<string>('')
  const [items, setItems] = useState<MagicItemDto[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [total, setTotal] = useState<number>(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchItems()
    }, 500)
    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  useEffect(() => {
    document.title = 'DungeonScribe | Magic Items'
  }, [])

  const fetchItems = async (): Promise<void> => {
    setLoading(true)
    setError('')
    try {
      const response = await dndService.searchItems(search)
      setItems(response.data.results)
      setTotal(response.data.count)
    } catch {
      setError('Failed to load magic items')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Magic Items</h1>
        <p className="text-gray-400">Search the D&D 5e magic item compendium</p>
      </div>

      <div className="mb-6">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search magic items... e.g. Sword of"
        />
      </div>

      {error && (
        <ErrorMessage
          message={error}
          onRetry={fetchItems}
        />
      )}

      {loading ? (
          <LoadingSpinner message="Loading your search results..." />
      ) : (
          <div className="text-gray-400 text-sm mb-4">
          {`${total} items found`}
      </div>
      )}

      <div className="space-y-3">
        {items.map((item, index) => (
          <StatBlock
            key={index}
            title={item.name}
            subtitle={item.type}
            badge={item.rarity}
            source={`${formatSourceLabel(item.documentTitle, 'items')}`}
            fields={[
              { label: 'Type', value: item.type },
              { label: 'Rarity', value: item.rarity },
              { label: 'Description', value: item.desc },
              { 
                label: 'Source', 
                value: formatSourceLabel(item.documentTitle, 'items'), 
                link: formatSourceUrl(item.documentUrl, item.documentTitle, 'items') 
              },
            ]}
          />
        ))}
      </div>
    </Layout>
  )
}

export default Items