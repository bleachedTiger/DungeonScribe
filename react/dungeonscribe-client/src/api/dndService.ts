import api from "./axios";
import { AxiosResponse } from "axios";
import { SpellDto, MonsterDto, MagicItemDto, Open5eResponse } from "../types";

export const dndService = {
    searchSpells: (search: string) : Promise<AxiosResponse<Open5eResponse<SpellDto>>> => api.get('/dnd/spells', {params: {search}}),
    searchMonsters: (search: string) : Promise<AxiosResponse<Open5eResponse<MonsterDto>>> => api.get('/dnd/monsters', {params: {search}}),
    searchItems: (search: string) : Promise<AxiosResponse<Open5eResponse<MagicItemDto>>> => api.get('/dnd/items', {params: {search}}),
}