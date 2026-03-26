import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import ErrorMessage from '../../components/ErrorMessage'
import EmptyState from '../../components/EmptyState'
import ConfirmDialog from '../../components/ConfirmDialog'
import LoadingSpinner from "../../components/LoadingSpinner";
import { campaignService } from "../../api/campaignService";
import { characterService } from "../../api/characterService"

function CampaignDetails() {
    const {id} = useParams();
    const navigate = useNavigate();

    const [campaign, setCampaign] = useState(null);
    const [characters, setCharacters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [confirmDialog, setConfirmDialog] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[id])

    useEffect(() => {
        if (campaign) document.title = `DungeonScribe | ${campaign.name}`;
    }, [campaign])

    const fetchData = async () => {
        try{
            const[campaignRes, charactersRes] = await Promise.all([
                campaignService.getOne(id),
                characterService.getAll(id),
            ])
            setCampaign(campaignRes.data);
            setCharacters(charactersRes.data);
        }catch{
            setError("Failed to load Campaign");
        }finally{
            setLoading(false);
        }
    }

    const handleDeleteCharacter = async (characterId, e) => {
        e.stopPropagation();
        setConfirmDialog({
            message: 'Are you sure you want to delete this character? This cannot be undone.',
            onConfirm: async () => {
            setConfirmDialog(null)
            await campaignService.delete(characterId)
            setCharacters(characters.filter(c => c.characterId !== characterId))
            },
            onCancel: () => setConfirmDialog(null)
        })
    }

    if(loading) return(
        <Layout>
            <LoadingSpinner message="Loading campaigns..." />
        </Layout>
    )

    if(!campaign) return(
        <Layout>
            <div className="text-center text-gray-400 mt-20"> Campaign not found</div>
        </Layout>
    )

    return(
        <Layout>
            <div className="mb-8">
                <div className="flex items-start justify-between">
                    <div>
                        <button
                            onClick={() => navigate("/campaigns")}
                            className="text-gray-400 hover:text-white text-sm mb-4 flex items-center gap-1"
                        >
                            ← Back to Campaigns
                        </button>
                        <h1 className="text-3xl font-bold text-white">{campaign.name}</h1>
                        <p className="text-amber-500 mt-1">{campaign.setting}</p>
                    </div>
                    <button
                        onClick={() => navigate(`/campaigns/${id}/edit`)}
                        className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-4 py-2 rounded transition-colors"
                    >
                    Edit Campaign
                    </button>
                </div>
                {campaign.description && (
                    <p className="text-gray-400 mt-4 max-w w-2xl">{campaign.description}</p>
                )}
            </div>

            {error && (
                <ErrorMessage
                    message={error}
                    onRetry={fetchData}
                />
            )}

            {/* Characters Section */}
            <div>
                <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Characters</h2>
                <button
                    onClick={() => navigate(`/campaigns/${id}/characters/new`)}
                    className="bg-amber-600 hover:bg-amber-500 text-white font-semibold px-4 py-2 rounded transition-colors"
                >
                    + Add Character
                </button>
                </div>

                {characters.length === 0 ? (
                    <EmptyState
                        icon="⚔️"
                        message="No characters yet — your adventure awaits"
                        actionLabel="Create your first character"
                        onAction={() => navigate(`/campaigns/${id}/characters/new`)}
                    />
                ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {characters.map(character => (
                    <div
                        key={character.id}
                        className="bg-gray-800 rounded-lg p-5 border border-gray-700 hover:border-amber-500 transition-colors"
                    >
                        <h3 className="text-lg font-semibold text-white mb-1">
                        {character.name}
                        </h3>
                        <p className="text-amber-500 text-sm mb-1">
                        {character.race} {character.characterClass}
                        </p>
                        <p className="text-gray-400 text-sm mb-3">
                        Level {character.level}
                        </p>
                        {character.backstory && (
                        <p className="text-gray-500 text-sm line-clamp-2">
                            {character.backstory}
                        </p>
                        )}
                        <div className="flex justify-end gap-2 mt-4">
                        <button
                            onClick={() => navigate(`/campaigns/${id}/characters/${character.id}/edit`)}
                            className="text-gray-400 hover:text-white text-sm px-3 py-1 rounded border border-gray-600 hover:border-gray-400 transition-colors"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleDeleteCharacter(character.id)}
                            className="text-gray-400 hover:text-red-400 text-sm px-3 py-1 rounded border border-gray-600 hover:border-red-400 transition-colors"
                        >
                            Delete
                        </button>
                        </div>
                    </div>
                    ))}
                </div>
                )}
            </div>

            
            {confirmDialog && (
            <ConfirmDialog
                message={confirmDialog.message}
                onConfirm={confirmDialog.onConfirm}
                onCancel={confirmDialog.onCancel}
            />
            )}
        </Layout>
    )
}

export default CampaignDetails