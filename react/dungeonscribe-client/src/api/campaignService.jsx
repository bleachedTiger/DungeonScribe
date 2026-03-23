import api from "./axios";

export const campaignService = {
    getAll: () => api.get('/campaigns'),
    getOne: (id) => api.get(`/campaigns/${id}`),
    create: (data) => api.post('/campaigns', data),
    update: (id, data) => api.put(`/campaigns/${id}`, data),
    delete: (id) => api.delete(`/campaigns/${id}`),
}