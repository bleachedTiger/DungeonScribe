import { useState, useEffect } from 'react'
import { characterService } from '../api/characterService'
import { PlayerCharacter } from '../types'

interface AssignCharactersModalProps {
    campaignId: number;
    assignedCharacters: PlayerCharacter[];
    onAssign: (character: PlayerCharacter) => void;
    onClose: () => void;
}

function AssignCharacterModal({ campaignId, assignedCharacters, onAssign, onClose }: AssignCharactersModalProps) {
    const [characters, setCharacters] = useState<PlayerCharacter[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchMyCharacters();
    }, []);

    const fetchMyCharacters = async (): Promise<void> => {
        try {
            const response = await characterService.getAll();   
            setCharacters(response.data);
        } catch {
            setError('Failed to fetch characters');
        } finally {
            setLoading(false);
        }
    };

    const handleAssign = async (character: PlayerCharacter): Promise<void> => {
        try {
            await characterService.addToCampaign(campaignId, character.id);
            onAssign(character);
        } catch {
            setError('Failed to assign character to campaign');
        }       
    }
    // Filter out characters already assigned to this campaign
    const availableCharacters = characters.filter(
        c => !assignedCharacters.some(ac => ac.id === c.id)
    );

    return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Add Character to Campaign</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-gray-400 text-center py-8">Loading characters...</p>
        ) : availableCharacters.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-2">No characters available to add</p>
            <p className="text-gray-500 text-sm">
              All your characters are already in this campaign, or you haven't created any yet.
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {availableCharacters.map(character => (
              <div
                key={character.id}
                className="flex items-center justify-between bg-gray-700 rounded-lg p-3 hover:bg-gray-600 transition-colors"
              >
                <div>
                  <p className="text-white font-medium">{character.name}</p>
                  <p className="text-amber-500 text-sm">
                    {character.race} {character.characterClass} • Level {character.level}
                  </p>
                </div>
                <button
                  onClick={() => handleAssign(character)}
                  className="bg-amber-600 hover:bg-amber-500 text-white text-sm px-3 py-1 rounded transition-colors"
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full mt-4 bg-gray-700 hover:bg-gray-600 text-gray-300 py-2 rounded transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  )
}

export default AssignCharacterModal