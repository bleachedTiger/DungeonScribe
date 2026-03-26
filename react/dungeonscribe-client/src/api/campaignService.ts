import { AxiosResponse } from "axios";
import api from "./axios";
import { Campaign, CampaignRequest } from "../types";

export const campaignService = {
    getAll: (): Promise<AxiosResponse<Campaign[]>> => api.get('/campaigns'),
    getOne: (id: number): Promise<AxiosResponse<Campaign>> => api.get(`/campaigns/${id}`),
    create: (data: CampaignRequest): Promise<AxiosResponse<Campaign>> => api.post('/campaigns', data),
    update: (id: number, data: CampaignRequest): Promise<AxiosResponse<Campaign>> => api.put(`/campaigns/${id}`, data),
    delete: (id: number): Promise<AxiosResponse<void>> => api.delete(`/campaigns/${id}`),
}