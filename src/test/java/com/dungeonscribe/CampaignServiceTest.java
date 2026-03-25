package com.dungeonscribe;

import com.dungeonscribe.dto.CampaignRequest;
import com.dungeonscribe.dto.CampaignResponse;
import com.dungeonscribe.entity.Campaign;
import com.dungeonscribe.entity.User;
import com.dungeonscribe.repository.CampaignRepository;
import com.dungeonscribe.service.AuthService;
import com.dungeonscribe.service.CampaignService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.OptionalInt;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CampaignServiceTest {

    @Mock
    private CampaignRepository campaignRepository;

    @Mock
    private AuthService authService;

    @InjectMocks
    private CampaignService campaignService;

    private User testUser;
    private Campaign testCampaign;
    private CampaignRequest testRequest;

    @BeforeEach
    void setUp(){
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("test@test.com");
        testUser.setUsername("testUser");

        testCampaign = new Campaign();
        testCampaign.setId(1L);
        testCampaign.setName("Lost Mines");
        testCampaign.setDescription("A classic campaign");
        testCampaign.setSetting("Forgotten Realms");
        testCampaign.setOwner(testUser);

        testRequest = new CampaignRequest();
        testRequest.setName("Lost Mines");
        testRequest.setDescription("A classic campaign");
        testRequest.setSetting("Forgotten Realms");

    }

    @Test
    void createCampaign_ShouldReturnResponse_WhenValidInput(){

        when(authService.getCurrentUser()).thenReturn(testUser);
        when(campaignRepository.save(any(Campaign.class)))
                .thenReturn(testCampaign);

        CampaignResponse response = campaignService.createCampaign(testRequest);

        assertThat(response).isNotNull();
        assertThat(response.getName()).isEqualTo("Lost Mines");
        assertThat(response.getSetting()).isEqualTo("Forgotten Realms");
        assertThat(response.getOwnerUsername()).isEqualTo("testUser");
    }

    @Test
    void getMyCampaigns_ShouldReturnList_WhenUserHasCampaigns(){

        when(authService.getCurrentUser()).thenReturn(testUser);
        when(campaignRepository.findByOwner(testUser))
                .thenReturn(List.of(testCampaign));

        List<CampaignResponse> responses = campaignService.getMyCampaigns();

        assertThat(responses).isNotNull();
        assertThat(responses.getFirst().getName()).isEqualTo("Lost Mines");
    }

    @Test
    void getMyCampaigns_ShouldReturnEmptyList_WhenUserHasNoCampaigns(){

        when(authService.getCurrentUser()).thenReturn(testUser);
        when(campaignRepository.findByOwner(testUser))
                .thenReturn(List.of());

        List<CampaignResponse> responses = campaignService.getMyCampaigns();

        assertThat(responses).isEmpty();
    }

    @Test
    void getCampaign_ShouldReturnResponse_WhenCampaignExists(){
        when(authService.getCurrentUser()).thenReturn(testUser);
        when(campaignRepository.findByIdAndOwner(1L, testUser))
                .thenReturn(Optional.of(testCampaign));

        CampaignResponse response = campaignService.getCampaign(1L);

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getName()).isEqualTo("Lost Mines");

    }

    @Test
    void getCampaign_ShouldThrowException_WhenCampaignNotFound(){
        when(authService.getCurrentUser()).thenReturn(testUser);
        when(campaignRepository.findByIdAndOwner(99L, testUser))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> campaignService.getCampaign(99L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Campaign not found");
    }

    @Test
    void updateCampaign_ShouldReturnUpdatedResponse_WhenInputValid(){
        CampaignRequest updateRequest = new CampaignRequest();
        updateRequest.setName("Updated Name");
        updateRequest.setDescription("Updated Description");
        updateRequest.setSetting("Eberron");

        Campaign updatedCampaign = new Campaign();
        updatedCampaign.setId(1L);
        updatedCampaign.setName("Updated Name");
        updatedCampaign.setDescription("Updated Description");
        updatedCampaign.setSetting("Eberron");
        updatedCampaign.setOwner(testUser);

        when(authService.getCurrentUser()).thenReturn(testUser);
        when(campaignRepository.findByIdAndOwner(1L, testUser))
                .thenReturn(Optional.of(testCampaign));
        when(campaignRepository.save(any(Campaign.class)))
                .thenReturn(updatedCampaign);

        CampaignResponse response = campaignService.updateCampaign(1L, updateRequest);

        assertThat(response.getName()).isEqualTo("Updated Name");
        assertThat(response.getSetting()).isEqualTo("Eberron");
    }

    @Test
    void deleteCampaign_ShouldDelete_WhenOwnerRequests(){

        when(authService.getCurrentUser()).thenReturn(testUser);
        when(campaignRepository.findByIdAndOwner(1L, testUser))
                .thenReturn(Optional.of(testCampaign));

        campaignService.deleteCampaign(1L);

        verify(campaignRepository).delete(testCampaign);
    }

    @Test
    void deleteCampaign_ShouldThrowException_WhenCampaignNotFound() {
        when(authService.getCurrentUser()).thenReturn(testUser);
        when(campaignRepository.findByIdAndOwner(99L, testUser))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> campaignService.deleteCampaign(99L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Campaign not found");
    }
}
