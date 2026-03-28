package com.dungeonscribe.service;


import com.dungeonscribe.dto.SessionNoteRequest;
import com.dungeonscribe.dto.SessionNoteResponse;
import com.dungeonscribe.entity.Campaign;
import com.dungeonscribe.entity.SessionNote;
import com.dungeonscribe.entity.User;
import com.dungeonscribe.repository.CampaignRepository;
import com.dungeonscribe.repository.SessionNoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SessionNoteService {

    private final SessionNoteRepository sessionNoteRepository;
    private final CampaignRepository campaignRepository;
    private final AuthService authService;

    private SessionNoteResponse toResponse(SessionNote note) {
        SessionNoteResponse response = new SessionNoteResponse();
        response.setId(note.getId());
        response.setSessionNumber(note.getSessionNumber());
        response.setTitle(note.getTitle());
        response.setSessionDate(note.getSessionDate());
        response.setSummary(note.getSummary());
        response.setCreatedAt(note.getCreatedAt());
        response.setCampaignId(note.getCampaign().getId());
        return response;
    }

    private Campaign getOwnedCampaign(Long campaignId) {
        User currentUser = authService.getCurrentUser();
        return campaignRepository.findByIdAndOwner(campaignId, currentUser)
                .orElseThrow(() -> new RuntimeException("Campaign not found"));
    }

    public List<SessionNoteResponse> getSessions(Long campaignId) {
        Campaign campaign = getOwnedCampaign(campaignId);
        return sessionNoteRepository
                .findByCampaignOrderBySessionNumberAsc(campaign)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public SessionNoteResponse getSession(Long campaignId, Long sessionId) {
        Campaign campaign = getOwnedCampaign(campaignId);
        SessionNote note = sessionNoteRepository
                .findByIdAndCampaign(sessionId, campaign)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        return toResponse(note);
    }

    public SessionNoteResponse createSession(Long campaignId, SessionNoteRequest request) {
        Campaign campaign = getOwnedCampaign(campaignId);

        // Auto-increment session number per campaign
        Integer nextSessionNumber = sessionNoteRepository
                .countByCampaign(campaign) + 1;

        SessionNote note = new SessionNote();
        note.setSessionNumber(nextSessionNumber);
        note.setTitle(request.getTitle());
        note.setSessionDate(request.getSessionDate());
        note.setSummary(request.getSummary());
        note.setCampaign(campaign);

        return toResponse(sessionNoteRepository.save(note));
    }

    public SessionNoteResponse updateSession(
            Long campaignId, Long sessionId, SessionNoteRequest request) {
        Campaign campaign = getOwnedCampaign(campaignId);
        SessionNote note = sessionNoteRepository
                .findByIdAndCampaign(sessionId, campaign)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        note.setTitle(request.getTitle());
        note.setSessionDate(request.getSessionDate());
        note.setSummary(request.getSummary());

        return toResponse(sessionNoteRepository.save(note));
    }

    public void deleteSession(Long campaignId, Long sessionId) {
        Campaign campaign = getOwnedCampaign(campaignId);
        SessionNote note = sessionNoteRepository
                .findByIdAndCampaign(sessionId, campaign)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        sessionNoteRepository.delete(note);
    }
}
