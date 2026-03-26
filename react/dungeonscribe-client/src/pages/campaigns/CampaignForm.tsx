import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../components/Layout';
import ErrorMessage from '../../components/ErrorMessage'
import { campaignService } from '../../api/campaignService';

function CampaignForm() {
    const {id} = useParams<{id: string}>();
    const isEditing = !!id;
    const navigate = useNavigate();

    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [setting, setSetting] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    //If Editing, load existing Campaign Data
    useEffect(() => {
        if(isEditing && id){
            campaignService.getOne(Number(id))
                .then(res => {
                    setName(res.data.name);
                    setDescription(res.data.description);
                    setSetting(res.data.setting);
                })
                .catch(() => setError("Failed to load Campaign"));
            document.title = `DungeonScribe | ${name}`;
        } else {
            document.title = 'DungeonScribe | New Campaign';
        }
    }, [id, isEditing, name])

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try{
            if(isEditing && id){
                await campaignService.update(Number(id), { name, description, setting});
            }else{
                await campaignService.create({name, description, setting});
            }
            navigate('/campaigns');
        }catch{
            setError("Failed to save campaign");
        }finally{
            setLoading(false);
        }
    }

    return(
        <Layout>
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">
                    {isEditing ? "Edit Campaign" : "New Campaign"}
                </h1>

                {error && (
                    <ErrorMessage message={error}/>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-300 font-medium mb-2">
                            Campaign Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600 focus:border-amber-500 focus:outline-none"
                            required
                            />                    
                    </div>

                    <div>
                        <label className="block text-gray-300 font-medium mb-2">
                            Campaign Setting
                        </label>
                        <input
                            type="text"
                            value={setting}
                            onChange={(e) => setSetting(e.target.value)}
                            placeholder="e.g. Forgotten Realms, Eberron, Homebrew"
                            className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600 focus:border-amber-500 focus:outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 font-medium mb-2">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
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
                            {loading ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Campaign'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/campaigns')}
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

export default CampaignForm