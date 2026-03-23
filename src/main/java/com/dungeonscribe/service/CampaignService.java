package com.dungeonscribe.service;

import com.dungeonscribe.dto.CampaignRequest;
import com.dungeonscribe.dto.CampaignResponse;
import com.dungeonscribe.entity.Campaign;
import com.dungeonscribe.entity.User;
import com.dungeonscribe.repository.CampaignRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CampaignService {

    private final CampaignRepository campaignRepository;
    private final AuthService authService;

    public CampaignResponse toResponse(Campaign campaign){
        CampaignResponse response = new CampaignResponse();
        response.setId(campaign.getId());
        response.setName(campaign.getName());
        response.setDescription(campaign.getDescription());
        response.setSetting(campaign.getSetting());
        response.setCreatedAt(campaign.getCreateAt());
        response.setOwnerUsername(campaign.getOwner().getUsername());
        return response;
    }

    public CampaignResponse createCampaign(CampaignRequest request) {
        User currentUser = authService.getCurrentUser();

        Campaign campaign = new Campaign();
        campaign.setName(request.getName());
        campaign.setDescription(request.getDescription());
        campaign.setSetting(request.getSetting());
        campaign.setOwner(currentUser);

        return toResponse(campaignRepository.save(campaign));
    }

    public List<CampaignResponse> getMyCampaigns(){
        User currentUser = authService.getCurrentUser();
        return campaignRepository.findByOwner(currentUser)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public CampaignResponse getCampaign(Long id){
        User currentUser = authService.getCurrentUser();
        Campaign campaign = campaignRepository
                .findByIdAndOwner(id, currentUser)
                .orElseThrow(() -> new RuntimeException("Campaign Not Found"));
        return toResponse(campaign);
    }

    public CampaignResponse updateCampaign(Long id, CampaignRequest request) {
        User currentUser = authService.getCurrentUser();
        Campaign campaign = campaignRepository
                .findByIdAndOwner(id, currentUser)
                .orElseThrow(() -> new RuntimeException("Campaign not found"));

        campaign.setName(request.getName());
        campaign.setDescription(request.getDescription());
        campaign.setSetting(request.getSetting());

        return toResponse(campaignRepository.save(campaign));
    }

    public void deleteCampaign(Long id) {
        User currentUser = authService.getCurrentUser();
        Campaign campaign = campaignRepository
                .findByIdAndOwner(id, currentUser)
                .orElseThrow(() -> new RuntimeException("Campaign not found"));

        campaignRepository.delete(campaign);
    }
}
