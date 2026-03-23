import api from "./axios";

export const dndService = {
    searchSpells: (search) => api.get('/dnd/spells', {params: {search}}),
    searchMonsters: (search) => api.get('/dnd/monsters', {params: {search}}),
    searchItems: (search) => api.get('/dnd/items', {params: {search}}),
}