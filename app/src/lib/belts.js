// Les 13 ceintures de l'académie, dans l'ordre de progression : une par chapitre,
// la noire au chapitre 13. 7 couleurs pleines, séparées par des ceintures BICOLORES
// (mi-couleur, mi-couleur suivante), comme les paliers du judo (blanche-jaune, etc.).
const PALETTE = {
  blanche: { couleur: '#f2f0e6', bord: '#cfc9b4' },
  jaune: { couleur: '#f4cf3f', bord: '#caa520' },
  orange: { couleur: '#e8853a', bord: '#c0671f' },
  verte: { couleur: '#4caf72', bord: '#358a57' },
  bleue: { couleur: '#3f7fc4', bord: '#2c5f9a' },
  marron: { couleur: '#7a4a2b', bord: '#5a3420' },
  noire: { couleur: '#1c1c1c', bord: '#000000' },
}
const LABELS = { blanche: 'Blanche', jaune: 'Jaune', orange: 'Orange', verte: 'Verte', bleue: 'Bleue', marron: 'Marron', noire: 'Noire' }
const SEQ = ['blanche', 'jaune', 'orange', 'verte', 'bleue', 'marron', 'noire']

// Pour chaque couleur : la ceinture pleine, puis (sauf la noire) la bicolore vers la suivante.
export const CEINTURES = SEQ.flatMap((id, i) => {
  const solide = { id, label: LABELS[id], ...PALETTE[id] }
  const suivant = SEQ[i + 1]
  if (!suivant) return [solide]
  return [
    solide,
    {
      id: `${id}-${suivant}`,
      label: `${LABELS[id]}-${LABELS[suivant]}`,
      couleur: PALETTE[id].couleur,
      couleur2: PALETTE[suivant].couleur,
      bord: PALETTE[id].bord,
    },
  ]
})

export const ceintureInfo = (id) =>
  CEINTURES.find((c) => c.id === id) || { id: 'aucune', label: 'Aucune', couleur: '#2a3a5a', bord: '#1c2a44' }

export const indexCeinture = (id) => CEINTURES.findIndex((c) => c.id === id)
