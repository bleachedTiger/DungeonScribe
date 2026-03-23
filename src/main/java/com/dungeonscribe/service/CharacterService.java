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

    //Convert Character Entity to DTO
    private CharacterResponse toResponse(PlayerCharacter character) {
        CharacterResponse response = new CharacterResponse();
        response.setId(character.getId());
        response.setName(character.getName());
        response.setCharacterClass(character.getCharacterClass());
        response.setRace(character.getRace());
        response.setLevel(character.getLevel());
        response.setBackstory(character.getBackstory());
        response.setCampaignId(character.getCampaign().getId());
        response.setCampaignName(character.getCampaign().getName());
        return response;
    }

    //Helper to verify campaign ownership
    private Campaign getOwnedCampaign(Long campaignId){
        User currentUser = authService.getCurrentUser();
        return campaignRepository
                .findByIdAndOwner(campaignId, currentUser)
                .orElseThrow(() -> new RuntimeException("Campaign not found"));
    }

    public CharacterResponse createCharacter(
            Long campaignId, CharacterRequest request){

        Campaign campaign = getOwnedCampaign(campaignId);

        PlayerCharacter character = new PlayerCharacter();
        character.setName(request.getName());
        character.setCharacterClass(request.getCharacterClass());
        character.setRace(request.getRace());
        character.setLevel(request.getLevel());
        character.setBackstory(request.getBackstory());
        character.setCampaign(campaign);

        return toResponse(characterRepository.save(character));
    }

    public List<CharacterResponse> getCharacters(Long campaignId){
        Campaign campaign = getOwnedCampaign(campaignId);
        return characterRepository.findByCampaign(campaign)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public CharacterResponse getCharacter(Long campaignId, Long characterId){
        Campaign campaign = getOwnedCampaign(campaignId);
        PlayerCharacter playerCharacter = characterRepository
                .findByIdAndCampaign(characterId, campaign)
                .orElseThrow(() -> new RuntimeException("Character not found"));
        return toResponse(playerCharacter);
    }

    public CharacterResponse updateCharacter(Long campaignId, Long characterId, CharacterRequest request){
        Campaign campaign = getOwnedCampaign(campaignId);
        PlayerCharacter character = characterRepository
                .findByIdAndCampaign(characterId, campaign)
                .orElseThrow(() -> new RuntimeException("Character not found"));

        character.setName(request.getName());
        character.setCharacterClass(request.getCharacterClass());
        character.setRace(request.getRace());
        character.setLevel(request.getLevel());
        character.setBackstory(request.getBackstory());

        return toResponse(characterRepository.save(character));
    }

    public void deleteCharacter(Long campaignId, Long characterId){
        Campaign campaign = getOwnedCampaign(campaignId);
        PlayerCharacter playerCharacter = characterRepository
                .findByIdAndCampaign(characterId, campaign)
                .orElseThrow(() -> new RuntimeException("Character not found"));
        characterRepository.delete(playerCharacter);
    }
}
