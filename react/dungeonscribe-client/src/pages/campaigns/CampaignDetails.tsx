import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import ErrorMessage from "../../components/ErrorMessage"
import EmptyState from "../../components/EmptyState"
import ConfirmDialog from "../../components/ConfirmDialog"
import LoadingSpinner from "../../components/LoadingSpinner";
import { campaignService } from "../../api/campaignService";
import { characterService } from "../../api/characterService"
import AssignCharacterModal from "../../components/AssignCharacterModal";
import { Campaign, PlayerCharacter, ConfirmDialogState } from "../../types";

function CampaignDetails() {
    const {id} = useParams<{id: string}>();
    const navigate = useNavigate();

    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [characters, setCharacters] = useState<PlayerCharacter[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState | null>(null);
    const [error, setError] = useState<string>('');
    const [showAssignModal, setShowAssignModal] = useState<boolean>(false)

    useEffect(() => {
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[id])

    useEffect(() => {
        if (campaign) document.title = `DungeonScribe | ${campaign.name}`;
    }, [campaign])

    const fetchData = async ():Promise<void> => {
        try{
            const[campaignRes, charactersRes] = await Promise.all([
                campaignService.getOne(Number(id)),
                characterService.getByCampaignCharacters(Number(id))
            ])
            setCampaign(campaignRes.data);
            setCharacters(charactersRes.data);
        }catch{
            setError("Failed to load Campaign");
        }finally{
            setLoading(false);
        }
    }

    const handleRemoveCharacter = (characterId: number): void => {
        setConfirmDialog({
            message: 'Remove this character from this campaign? The character will not be deleted.',
            confirmLabel: 'Remove',
            onConfirm: async () => {
                setConfirmDialog(null)
                try{    
                await characterService.removeFromCampaign(Number(id), characterId)
                setCharacters(characters.filter(c => c.id !== characterId))
                }catch{
                    setError("Failed to remove character")
                }
            },
            onCancel: () => setConfirmDialog(null)
        })
    }

    // Handle character assigned from modal
    const handleCharacterAssigned = (character: PlayerCharacter): void => {
        setCharacters([...characters, character])
        setShowAssignModal(false)
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
            {/* Campaign Header */}
            <div className="mb-8">
            {/* Breadcrumb - full width on its own line */}
            <button
                onClick={() => navigate('/campaigns')}
                className="text-gray-400 hover:text-white text-sm mb-4 flex items-center gap-1"
            >
                ← Back to Campaigns
            </button>

            {/* Title row - stacks on mobile, side by side on desktop */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                <h1 className="text-3xl font-bold text-white">{campaign.name}</h1>
                <p className="text-amber-500 mt-1">{campaign.setting}</p>
                </div>
                <button
                onClick={() => navigate(`/campaigns/${id}/edit`)}
                className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-4 py-2 rounded transition-colors self-start"
                >
                Edit Campaign
                </button>
            </div>

            {campaign.description && (
                <p className="text-gray-400 mt-4 max-w-2xl">{campaign.description}</p>
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
                    onClick={() => setShowAssignModal(true)}
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
                        onAction={() => setShowAssignModal(true)}
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
                        {character.race} - {character.characterClass}
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
                            onClick={() => navigate(`/characters/${character.id}/edit`)}
                            className="text-gray-400 hover:text-white text-sm px-3 py-1 rounded border border-gray-600 hover:border-gray-400 transition-colors"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleRemoveCharacter(character.id)}
                            className="text-gray-400 hover:text-red-400 text-sm px-3 py-1 rounded border border-gray-600 hover:border-red-400 transition-colors"
                        >
                            Remove
                        </button>
                        </div>
                    </div>
                    ))}
                </div>
                )}
            </div>

            
            {/* Modals */}
            {showAssignModal && campaign && (
            <AssignCharacterModal
                campaignId={campaign.id}
                assignedCharacters={characters}
                onAssign={handleCharacterAssigned}
                onClose={() => setShowAssignModal(false)}
            />
            )}

            {confirmDialog && (
            <ConfirmDialog
                message={confirmDialog.message}
                confirmLabel={confirmDialog.confirmLabel}
                onConfirm={confirmDialog.onConfirm}
                onCancel={confirmDialog.onCancel}
            />
            )}
        </Layout>
    )
}

export default CampaignDetails