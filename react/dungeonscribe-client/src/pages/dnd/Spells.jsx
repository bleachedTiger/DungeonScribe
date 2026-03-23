import { useState, useEffect } from "react";
import Layout from '../../components/Layout'
import SearchInput from "../../components/SearchInput";
import StatBlock from "../../components/StatBlock";
import ErrorMessage from '../../components/ErrorMessage'
import LoadingSpinner from '../../components/LoadingSpinner'
import { dndService } from '../../api/dndService'
import { formatSourceLabel, formatSourceUrl } from "../../utils/sourceUtils";

function Spells() {
    const [search, setSearch] = useState('');
    const [spells, setSpells] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [total, setTotal] = useState(0);

    //Debouncer - fires search after 500ms
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchSpells()
        }, 500);
        
        //Cleanup - kills the timer if user types again before 500ms
        return() => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search])

    useEffect(() => {
        document.title = 'DungeonScribe | Spells'
    }, [])

    const fetchSpells = async () => {
        setLoading(true);
        setError('');
        try{
            const response = await dndService.searchSpells(search);
            setSpells(response.data.results);
            setTotal(response.data.count);
        }catch{
            setError("Failed to load spells")
        }finally{
            setLoading(false);
        }
    }

    return(
        <Layout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Spells</h1>
                <p className="text-gray-400">Search the D&D 5e spell library</p>
            </div>

            <div className="mb-6">
                <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search spells... e.g. Fireball"
                />
            </div>

            {error && (
                <ErrorMessage
                message={error}
                onRetry={fetchSpells}
                />
            )}

            
            {loading ? (
                <LoadingSpinner message="Loading your search results..." />
            ) : (
                <div className="text-gray-400 text-sm mb-4">
                {`${total} spells found`}
            </div>
            )}

            <div className="space-y-3">
                {spells.map((spell, index) => (
                <StatBlock
                    key={index}
                    title={spell.name}
                    subtitle={`${spell.level} • ${spell.school}`}
                    badge={spell.level}
                    source={`${formatSourceLabel(spell.documentTitle, 'spells')}`}
                    fields={[
                    { label: 'Casting Time', value: spell.castingTime },
                    { label: 'Range', value: spell.range },
                    { label: 'Components', value: spell.components },
                    { label: 'Duration', value: spell.duration },
                    { label: 'Description', value: spell.desc },
                    { 
                        label: 'Source', 
                        value: formatSourceLabel(spell.documentTitle, 'spells'), 
                        link: formatSourceUrl(spell.documentUrl, spell.documentTitle, 'spells') },
                    ]}
                />
                ))}
            </div>
        </Layout>
    )
}

export default Spells