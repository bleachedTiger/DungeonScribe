import api from "./axios";

export const characterService = {
    getAll: (campaignId) => api.get(`/campaigns/${campaignId}/characters`),
    getOne: (campaignId, characterId) => api.get(`/campaigns/${campaignId}/characters/${characterId}`),
    create: (campaignId, data) => api.post(`/campaigns/${campaignId}/characters`, data),
    update: (campaignId, characterId, data) => api.put(`/campaigns/${campaignId}/characters/${characterId}`, data),
    delete: (campaignId, characterId) => api.delete(`/campaigns/${campaignId}/characters/${characterId}`),
}