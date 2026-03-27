import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from '../../components/Layout'
import ErrorMessage from '../../components/ErrorMessage'
import { characterService } from '../../api/characterService'

function CharacterForm() {
    const {id} = useParams<{ id: string }>()
    const isEditing = !!id;
    const navigate = useNavigate();

    const [name, setName] = useState<string>('');
    const [characterClass, setCharacterClass] = useState<string>('');
    const [race, setRace] = useState<string>('');
    const [level, setLevel] = useState<number>(1);
    const [backstory, setBackstory] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        document.title = isEditing ? "Edit Character - DungeonScribe" : "New Character - DungeonScribe";

        if (isEditing && id) {
            characterService.getOne(Number(id))
            .then(res => {
                setName(res.data.name);
                setCharacterClass(res.data.characterClass);
                setRace(res.data.race);
                setLevel(res.data.level);
                setBackstory(res.data.backstory || '');
            })
            .catch(() => setError("Failed to load character"));
        }
    }, [id, isEditing]);   

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault()
        setLoading(true);
        setError('');

        try {
            if(isEditing && id) {
                await characterService.update(Number(id), { 
                    name, characterClass, race, level, backstory
                });
            } else {
            console.log('About to call characterService.create')
            await characterService.create({ 
                name, characterClass, race, level, backstory
            })
            }
            navigate('/characters');
        } catch (err) {
            setError('Failed to save character');
        } finally {
            setLoading(false);
        }
    }

    return (
        <Layout>
            <div className="max-w-2xl mx-auto">
                <button
                    onClick={() => navigate('/characters')}
                    className="text-gray-400 hover:text-white text-sm mb-6 flex items-center gap-1"
                    >
                        ← Back to Characters
                </button>   
                
                <h1 className='text-3xl font-bold text-white mb-8'>
                    {isEditing ? "Edit Character" : "New Character"}
                </h1>

                {error && <ErrorMessage message={error} />}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-300 font-medium mb-2">
                        Character Name
                        </label>
                        <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600 focus:border-amber-500 focus:outline-none"
                        required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                        <label className="block text-gray-300 font-medium mb-2">
                            Class
                        </label>
                        <input
                            type="text"
                            value={characterClass}
                            onChange={(e) => setCharacterClass(e.target.value)}
                            placeholder="e.g. Rogue, Wizard"
                            className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600 focus:border-amber-500 focus:outline-none"
                            required
                        />
                        </div>
                        <div>
                        <label className="block text-gray-300 font-medium mb-2">
                            Race
                        </label>
                        <input
                            type="text"
                            value={race}
                            onChange={(e) => setRace(e.target.value)}
                            placeholder="e.g. Elf, Human"
                            className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600 focus:border-amber-500 focus:outline-none"
                            required
                        />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-300 font-medium mb-2">
                        Level
                        </label>
                        <input
                        type="number"
                        value={level}
                        onChange={(e) => setLevel(parseInt(e.target.value))}
                        min={1}
                        max={20}
                        className="w-32 bg-gray-700 text-white rounded px-3 py-2 border border-gray-600 focus:border-amber-500 focus:outline-none"
                        required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 font-medium mb-2">
                        Backstory
                        </label>
                        <textarea
                        value={backstory}
                        onChange={(e) => setBackstory(e.target.value)}
                        rows={4}
                        className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600 focus:border-amber-500 focus:outline-none resize-none"
                        />
                    </div>

                    <div className="flex gap-4">
                        <button
                        type="submit"
                        disabled={loading}
                        className="bg-amber-600 hover:bg-amber-500 text-white font-semibold px-6 py-2 rounded transition-colors disabled:opacity-50"
                        >
                        {loading ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Character'}
                        </button>
                        <button
                        type="button"
                        onClick={() => navigate('/characters')}
                        className="bg-gray-700 hover:bg-gray-600 text-gray-300 font-semibold px-6 py-2 rounded transition-colors"
                        >
                        Cancel
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    )
}

export default CharacterForm