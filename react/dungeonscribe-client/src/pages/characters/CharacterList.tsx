import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import ErrorMessage from "../../components/ErrorMessage";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyState from "../../components/EmptyState";
import ConfirmDialog from "../../components/ConfirmDialog";
import { characterService } from "../../api/characterService";
import { PlayerCharacter, ConfirmDialogState } from "../../types";

function CharacterList() {
    const [characters, setCharacters] = useState<PlayerCharacter[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCharacters();
        document.title = "My Characters - DungeonScribe";
    }, []);

    const fetchCharacters = async ():Promise<void> => {
        try {
            const response = await characterService.getAll();
            setCharacters(response.data);
        } catch (err) {
            setError("Failed to load characters");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (characterId: number, e: React.MouseEvent): void => {
        e.stopPropagation();
        setConfirmDialog({
            message: "Are you sure you want to delete this character? They will be removed from all active campaigns.",
            onConfirm: async () => {
                setConfirmDialog(null);
                try {
                    await characterService.delete(characterId);
                    setCharacters(prev => prev.filter(c => c.id !== characterId));
                } catch {
                    setError("Failed to delete character");
                }
            },
            onCancel: () => setConfirmDialog(null)
        })
    }

    if (loading) return(
        <Layout>
            <LoadingSpinner message="Loading your Characters..." />
        </Layout>
    )

    return(
        <Layout>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">My Characters</h1>
                <button
                onClick={() => navigate("/characters/new")}
                className="bg-amber-600 hover:bg-amber-500 text-white font-semibold px-4 py-2 rounded transition-colors"
                >
                    + New Character
                </button>
            </div>
            {error && <ErrorMessage message={error} />}

            {characters.length === 0 ? (
                <EmptyState
                icon="🧙"
                message="No characters yet — create your first adventurer"
                actionLabel="Create a character"
                onAction={() => navigate('/characters/new')}
                />
            ):(
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {characters.map(character => (
                        <div
                        key={character.id}
                        onClick={() => navigate(`/characters/${character.id}/edit`)}
                        className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-amber-500 cursor-pointer transition-colors"
                        >
                        <h2 className="text-xl font-semibold text-white mb-1">
                            {character.name}
                        </h2>
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
                            onClick={(e) => {
                                e.stopPropagation()
                                navigate(`/characters/${character.id}/edit`)
                            }}
                            className="text-gray-400 hover:text-white text-sm px-3 py-1 rounded border border-gray-600 hover:border-gray-400 transition-colors"
                            >
                            Edit
                            </button>
                            <button
                            onClick={(e) => handleDelete(character.id, e)}
                            className="text-gray-400 hover:text-red-400 text-sm px-3 py-1 rounded border border-gray-600 hover:border-red-400 transition-colors"
                            >
                            Delete
                            </button>
                        </div>
                        </div>
                    ))}
                </div>
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

export default CharacterList
