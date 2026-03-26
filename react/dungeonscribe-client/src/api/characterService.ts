import { AxiosResponse } from "axios";
import api from "./axios";
import { PlayerCharacter, CharacterRequest } from "../types";

export const characterService = {
    getAll: (campaignId: number): Promise<AxiosResponse<PlayerCharacter[]>> => api.get(`/campaigns/${campaignId}/characters`),
    getOne: (campaignId: number, characterId: number): Promise<AxiosResponse<PlayerCharacter>> => api.get(`/campaigns/${campaignId}/characters/${characterId}`),
    create: (campaignId: number, data: CharacterRequest): Promise<AxiosResponse<PlayerCharacter>> => api.post(`/campaigns/${campaignId}/characters`, data),
    update: (campaignId: number, characterId: number, data: CharacterRequest): Promise<AxiosResponse<PlayerCharacter>> => api.put(`/campaigns/${campaignId}/characters/${characterId}`, data),
    delete: (campaignId: number, characterId: number): Promise<AxiosResponse<void>> => api.delete(`/campaigns/${campaignId}/characters/${characterId}`),
}