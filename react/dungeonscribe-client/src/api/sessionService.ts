import { AxiosResponse } from 'axios'
import api from './axios'
import { SessionNote, SessionNoteRequest } from '../types'

export const sessionService = {
  getAll: (campaignId: number): Promise<AxiosResponse<SessionNote[]>> =>
    api.get(`/campaigns/${campaignId}/sessions`),

  getOne: (campaignId: number, sessionId: number): Promise<AxiosResponse<SessionNote>> =>
    api.get(`/campaigns/${campaignId}/sessions/${sessionId}`),

  create: (campaignId: number, data: SessionNoteRequest): Promise<AxiosResponse<SessionNote>> =>
    api.post(`/campaigns/${campaignId}/sessions`, data),

  update: (campaignId: number, sessionId: number, data: SessionNoteRequest): Promise<AxiosResponse<SessionNote>> =>
    api.put(`/campaigns/${campaignId}/sessions/${sessionId}`, data),

  delete: (campaignId: number, sessionId: number): Promise<AxiosResponse<void>> =>
    api.delete(`/campaigns/${campaignId}/sessions/${sessionId}`),
}