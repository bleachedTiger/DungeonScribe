import { AxiosResponse } from "axios";
import api from "./axios";
import { PlayerCharacter, CharacterRequest } from "../types";

export const characterService = {
    getAll: (): Promise<AxiosResponse<PlayerCharacter[]>> => api.get(`/characters`),
    getOne: (characterId: number): Promise<AxiosResponse<PlayerCharacter>> => api.get(`/characters/${characterId}`),
    create: (data: CharacterRequest): Promise<AxiosResponse<PlayerCharacter>> => {
        console.log('characterService.create called with:', data)
        return api.post(`/characters`, data)
    },
    update: (characterId: number, data: CharacterRequest): Promise<AxiosResponse<PlayerCharacter>> => api.put(`/characters/${characterId}`, data),
    delete: (characterId: number): Promise<AxiosResponse<void>> => api.delete(`/characters/${characterId}`),

    //Campaign-specific character operations
    getByCampaignCharacters: (campaignId: number): Promise<AxiosResponse<PlayerCharacter[]>> => api.get(`/campaigns/${campaignId}/characters`),
    addToCampaign: (campaignId: number, characterId: number): Promise<AxiosResponse<void>> => api.post(`/campaigns/${campaignId}/characters/${characterId}`),
    removeFromCampaign: (campaignId: number, characterId: number): Promise<AxiosResponse<void>> => api.delete(`/campaigns/${campaignId}/characters/${characterId}`),
}