const SOURCE_URL_MAP = {
  '5e Core Rules': {
    spells: 'https://www.dndbeyond.com/sources/dnd/phb-2024/spell-descriptions',
    monsters: 'https://www.dndbeyond.com/sources/dnd/mm-2024/monster-lists',
    items: 'https://www.dndbeyond.com/sources/dnd/dmg-2024/magic-items-a-z',
  }
}

const SOURCE_LABEL_MAP = {
  '5e Core Rules': {
    spells: "Player's Handbook",
    monsters: "Monster Manual",
    items: "Dungeon Master's Guide",
  }
}

export const formatSourceUrl = (url, documentTitle, contentType) => {
  if (!documentTitle) return url
  if (SOURCE_URL_MAP[documentTitle]?.[contentType]) {
    return SOURCE_URL_MAP[documentTitle][contentType]
  }
  return url
}

export const formatSourceLabel = (documentTitle, contentType) => {
  if (!documentTitle) return documentTitle
  if (SOURCE_LABEL_MAP[documentTitle]?.[contentType]) {
    return SOURCE_LABEL_MAP[documentTitle][contentType]
  }
  return documentTitle
}