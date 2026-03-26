// ===========================
// Auth Types
// ===========================
export interface User {
  id: number
  email: string
  username: string
}

export interface RegisterRequest {
  email: string
  username: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
}

// ===========================
// Campaign Types
// ===========================
export interface Campaign {
  id: number
  name: string
  description: string
  setting: string
  createdAt: string
  ownerUsername: string
}

export interface CampaignRequest {
  name: string
  description: string
  setting: string
}

// ===========================
// Character Types
// ===========================
export interface PlayerCharacter {
  id: number
  name: string
  characterClass: string
  race: string
  level: number
  backstory?: string
  campaignId: number
  campaignName: string
}

export interface CharacterRequest {
  name: string
  characterClass: string
  race: string
  level: number
  backstory?: string
}

// ===========================
// D&D Reference Types
// ===========================
export interface SpellDto {
  name: string
  desc: string
  level: string
  school: string
  range: string
  duration: string
  castingTime: string
  components: string
  documentTitle: string
  documentUrl: string
}

export interface MonsterDto {
  name: string
  size: string
  type: string
  subtype?: string
  alignment: string
  armorClass: number
  armorDesc?: string
  hitPoints: number
  hitDice: string
  cr: number
  challengeRating: string
  strength: number
  dexterity: number
  constitution: number
  intelligence: number
  wisdom: number
  charisma: number
  strengthSave?: number | null
  dexteritySave?: number | null
  constitutionSave?: number | null
  intelligenceSave?: number | null
  wisdomSave?: number | null
  charismaSave?: number | null
  damageVulnerabilities?: string
  damageResistances?: string
  damageImmunities?: string
  conditionImmunities?: string
  senses?: string
  languages?: string
  desc?: string
  speed?: Record<string, number | boolean>
  actions?: Array<{ name: string; desc: string }>
  specialAbilities?: Array<{ name: string; desc: string }>
  legendaryActions?: Array<{ name: string; desc: string }>
  documentTitle: string
  documentUrl: string
}

export interface MagicItemDto {
  name: string
  desc: string
  type: string
  rarity: string
  documentTitle: string
  documentUrl: string
}

export interface Open5eResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

// ===========================
// UI Types
// ===========================
export interface ConfirmDialogState {
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export interface StatBlockField {
  label: string
  value: string | number | null | undefined
  link?: string
}
