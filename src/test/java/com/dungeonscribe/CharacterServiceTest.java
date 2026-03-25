package com.dungeonscribe;

import com.dungeonscribe.dto.CharacterRequest;
import com.dungeonscribe.dto.CharacterResponse;
import com.dungeonscribe.entity.Campaign;
import com.dungeonscribe.entity.PlayerCharacter;
import com.dungeonscribe.entity.User;
import com.dungeonscribe.repository.CampaignRepository;
import com.dungeonscribe.repository.CharacterRepository;
import com.dungeonscribe.service.AuthService;
import com.dungeonscribe.service.CharacterService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CharacterServiceTest {

    @Mock
    private CharacterRepository characterRepository;

    @Mock
    private CampaignRepository campaignRepository;

    @Mock
    private AuthService authService;

    @InjectMocks
    private CharacterService characterService;

    private User testUser;
    private Campaign testCampaign;
    private PlayerCharacter testCharacter;
    private CharacterRequest testRequest;

    @BeforeEach
    void setUp(){
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("test@test.com");
        testUser.setUsername("testuser");

        testCampaign = new Campaign();
        testCampaign.setId(1L);
        testCampaign.setName("Lost Mines");
        testCampaign.setOwner(testUser);

        testCharacter = new PlayerCharacter();
        testCharacter.setId(1L);
        testCharacter.setName("Aria Swiftblade");
        testCharacter.setCharacterClass("Rogue");
        testCharacter.setRace("Elf");
        testCharacter.setLevel(1);
        testCharacter.setBackstory("A mysterious elf");
        testCharacter.setCampaign(testCampaign);

        testRequest = new CharacterRequest();
        testRequest.setName("Aria Swiftblade");
        testRequest.setCharacterClass("Rogue");
        testRequest.setRace("Elf");
        testRequest.setLevel(1);
        testRequest.setBackstory("A mysterious elf");
    }
    @Test
    void createCharacter_ShouldReturnResponse_WhenValidInput(){

        when(authService.getCurrentUser()).thenReturn(testUser);
        when(campaignRepository.findByIdAndOwner(1L, testUser))
                .thenReturn(Optional.of(testCampaign));
        when(characterRepository.save(any(PlayerCharacter.class)))
                .thenReturn(testCharacter);

        CharacterResponse response = characterService.createCharacter(1L, testRequest);

        assertThat(response).isNotNull();
        assertThat(response.getName()).isEqualTo("Aria Swiftblade");
        assertThat(response.getCharacterClass()).isEqualTo("Rogue");
        assertThat(response.getRace()).isEqualTo("Elf");
        assertThat(response.getLevel()).isEqualTo(1);
        assertThat(response.getCampaignId()).isEqualTo(1L);
    }

    @Test
    void createCharacter_ShouldThrowException_WhenCampaignNotFound(){

        when(authService.getCurrentUser()).thenReturn(testUser);
        when(campaignRepository.findByIdAndOwner(99L, testUser))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() ->
                characterService.createCharacter(99L, testRequest))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Campaign not found");
    }

    @Test
    void getCharacters_ShouldReturnList_WhenCampaignHasCharacters(){
        when(authService.getCurrentUser()).thenReturn(testUser);
        when(campaignRepository.findByIdAndOwner(1L, testUser))
                .thenReturn(Optional.of(testCampaign));
        when(characterRepository.findByCampaign(testCampaign))
                .thenReturn(List.of(testCharacter));

        List<CharacterResponse> responses = characterService.getCharacters(1L);

        assertThat(responses).hasSize(1);
        assertThat(responses.getFirst().getName()).isEqualTo("Aria Swiftblade");
    }

    @Test
    void getCharacters_ShouldReturnEmptyList_WhenCampaignHasNoCharacters(){

        when(authService.getCurrentUser()).thenReturn(testUser);
        when(campaignRepository.findByIdAndOwner(1L, testUser))
                .thenReturn(Optional.of(testCampaign));
        when(characterRepository.findByCampaign(testCampaign))
                .thenReturn(List.of());

        List<CharacterResponse> responses = characterService.getCharacters(1L);

        assertThat(responses).isEmpty();
    }

    @Test
    void getCharacter_ShouldReturnResponse_WhenCharacterExists(){

        when(authService.getCurrentUser()).thenReturn(testUser);
        when(campaignRepository.findByIdAndOwner(1L, testUser))
                .thenReturn(Optional.of(testCampaign));
        when(characterRepository.findByIdAndCampaign(1L, testCampaign))
                .thenReturn(Optional.of(testCharacter));

        CharacterResponse response = characterService.getCharacter(1L,1L);

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getName()).isEqualTo("Aria Swiftblade");
    }

    @Test
    void getCharacter_ShouldThrowException_WhenCharacterNotFound(){

        when(authService.getCurrentUser()).thenReturn(testUser);
        when(campaignRepository.findByIdAndOwner(1L, testUser))
                .thenReturn(Optional.of(testCampaign));
        when(characterRepository.findByIdAndCampaign(99L, testCampaign))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() ->
                characterService.getCharacter(1L, 99L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Character not found");
    }

    @Test
    void updateCharacter_ShouldReturnUpdateResponse_WhenValidInput() {
       CharacterRequest updateRequest = new CharacterRequest();
        updateRequest.setName("Aria Swiftblade");
        updateRequest.setCharacterClass("Rogue");
        updateRequest.setRace("Elf");
        updateRequest.setLevel(5);
        updateRequest.setBackstory("Updated backstory");

        PlayerCharacter updatedCharacter = new PlayerCharacter();
        updatedCharacter.setId(1L);
        updatedCharacter.setName("Aria Swiftblade");
        updatedCharacter.setCharacterClass("Rogue");
        updatedCharacter.setRace("Elf");
        updatedCharacter.setLevel(5);
        updatedCharacter.setBackstory("Updated backstory");
        updatedCharacter.setCampaign(testCampaign);

        when(authService.getCurrentUser()).thenReturn(testUser);
        when(campaignRepository.findByIdAndOwner(1L, testUser))
                .thenReturn(Optional.of(testCampaign));
        when(characterRepository.findByIdAndCampaign(1L, testCampaign))
                .thenReturn(Optional.of(testCharacter));
        when(characterRepository.save(any(PlayerCharacter.class)))
                .thenReturn(updatedCharacter);

        CharacterResponse response = characterService.updateCharacter(1L,1L, updateRequest);

        assertThat(response.getLevel()).isEqualTo(5);
        assertThat(response.getBackstory()).isEqualTo("Updated backstory");
    }

    @Test
    void deleteCharacter_ShouldDelete_WhenOwnerRequests(){

        when(authService.getCurrentUser()).thenReturn(testUser);
        when(campaignRepository.findByIdAndOwner(1L, testUser))
                .thenReturn(Optional.of(testCampaign));
        when(characterRepository.findByIdAndCampaign(1L,testCampaign))
                .thenReturn(Optional.of(testCharacter));

        characterService.deleteCharacter(1L,1L);

        verify(characterRepository).delete(testCharacter);
    }

    @Test
    void deleteCharacter_ShouldThrowException_WhenCampaignNotOwned(){

        when(authService.getCurrentUser()).thenReturn(testUser);
        when(campaignRepository.findByIdAndOwner(99L, testUser))
                .thenReturn(Optional.empty());

        assertThatThrownBy(()->
                characterService.deleteCharacter(99L,1L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Campaign not found");
    }
}
