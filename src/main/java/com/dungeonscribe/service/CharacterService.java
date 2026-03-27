package com.dungeonscribe.service;

import com.dungeonscribe.dto.CharacterRequest;
import com.dungeonscribe.dto.CharacterResponse;
import com.dungeonscribe.entity.Campaign;
import com.dungeonscribe.entity.PlayerCharacter;
import com.dungeonscribe.entity.User;
import com.dungeonscribe.repository.CampaignRepository;
import com.dungeonscribe.repository.CharacterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CharacterService {

    private final CharacterRepository characterRepository;
    private final CampaignRepository campaignRepository;
    private final AuthService authService;

    private CharacterResponse toResponse(PlayerCharacter character) {
        CharacterResponse response = new CharacterResponse();
        response.setId(character.getId());
        response.setName(character.getName());
        response.setCharacterClass(character.getCharacterClass());
        response.setRace(character.getRace());
        response.setLevel(character.getLevel());
        response.setBackstory(character.getBackstory());
        response.setOwnerUsername(character.getOwner().getUsername());
        return response;
    }

    // Get all characters owned by current user
    public List<CharacterResponse> getMyCharacters() {
        User currentUser = authService.getCurrentUser();
        return characterRepository.findByOwner(currentUser)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // Get a single character - owner or campaign member can view
    public CharacterResponse getCharacter(Long id) {
        User currentUser = authService.getCurrentUser();
        PlayerCharacter character = characterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Character not found"));

        // Check if user is owner OR is on a campaign with this character
        boolean isOwner = character.getOwner().getId().equals(currentUser.getId());;
        boolean isOnCampaign = character.getCampaigns().stream()
                .anyMatch(c -> c.getOwner().getId().equals(currentUser.getId()));

        if (!isOwner && !isOnCampaign) {
            throw new RuntimeException("Not authorized to view this character");
        }

        return toResponse(character);
    }

    // Create a character - independent of any campaign
    public CharacterResponse createCharacter(CharacterRequest request) {
        User currentUser = authService.getCurrentUser();

        PlayerCharacter character = new PlayerCharacter();
        character.setName(request.getName());
        character.setCharacterClass(request.getCharacterClass());
        character.setRace(request.getRace());
        character.setLevel(request.getLevel());
        character.setBackstory(request.getBackstory());
        character.setOwner(currentUser);

        return toResponse(characterRepository.save(character));
    }

    // Update a character - owner only
    public CharacterResponse updateCharacter(Long id, CharacterRequest request) {
        User currentUser = authService.getCurrentUser();
        PlayerCharacter character = characterRepository.findByIdAndOwner(id, currentUser)
                .orElseThrow(() -> new RuntimeException("Character not found"));

        character.setName(request.getName());
        character.setCharacterClass(request.getCharacterClass());
        character.setRace(request.getRace());
        character.setLevel(request.getLevel());
        character.setBackstory(request.getBackstory());

        return toResponse(characterRepository.save(character));
    }

    // Delete a character - owner only
    public void deleteCharacter(Long id) {
        User currentUser = authService.getCurrentUser();
        PlayerCharacter character = characterRepository.findByIdAndOwner(id, currentUser)
                .orElseThrow(() -> new RuntimeException("Character not found"));

        // Remove from all campaigns before deleting
        for (Campaign campaign : character.getCampaigns()) {
            campaign.getCharacters().remove(character);;
            campaignRepository.save(campaign);
        }

        characterRepository.delete(character);
    }

    // Add character to campaign - campaign owner only
    public void addCharacterToCampaign(Long campaignId, Long characterId) {
        User currentUser = authService.getCurrentUser();

        Campaign campaign = campaignRepository.findByIdAndOwner(campaignId, currentUser)
                .orElseThrow(() -> new RuntimeException("Campaign not found"));

        PlayerCharacter character = characterRepository.findById(characterId)
                .orElseThrow(() -> new RuntimeException("Character not found"));

        campaign.getCharacters().add(character);
        campaignRepository.save(campaign);
    }

    // Remove character from campaign - campaign owner only
    public void removeCharacterFromCampaign(Long campaignId, Long characterId) {
        User currentUser = authService.getCurrentUser();

        Campaign campaign = campaignRepository.findByIdAndOwner(campaignId, currentUser)
                .orElseThrow(() -> new RuntimeException("Campaign not found"));

        PlayerCharacter character = characterRepository.findById(characterId)
                .orElseThrow(() -> new RuntimeException("Character not found"));

        campaign.getCharacters().remove(character);
        campaignRepository.save(campaign);
    }

    // Get all characters assigned to a campaign
    public List<CharacterResponse> getCampaignCharacters(Long campaignId) {
        User currentUser = authService.getCurrentUser();
        Campaign campaign = campaignRepository.findByIdAndOwner(campaignId, currentUser)
                .orElseThrow(() -> new RuntimeException("Campaign not found"));

        return campaign.getCharacters().stream()
                .map(this::toResponse)
                .toList();
    }
}