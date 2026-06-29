// Les 7 ceintures de l'académie, dans l'ordre de progression.
export const CEINTURES = [
  { id: 'blanche', label: 'Blanche', couleur: '#f2f0e6', bord: '#cfc9b4' },
  { id: 'jaune', label: 'Jaune', couleur: '#f4cf3f', bord: '#caa520' },
  { id: 'orange', label: 'Orange', couleur: '#e8853a', bord: '#c0671f' },
  { id: 'verte', label: 'Verte', couleur: '#4caf72', bord: '#358a57' },
  { id: 'bleue', label: 'Bleue', couleur: '#3f7fc4', bord: '#2c5f9a' },
  { id: 'marron', label: 'Marron', couleur: '#7a4a2b', bord: '#5a3420' },
  { id: 'noire', label: 'Noire', couleur: '#1c1c1c', bord: '#000000' },
]

export const ceintureInfo = (id) =>
  CEINTURES.find((c) => c.id === id) || { id: 'aucune', label: 'Aucune', couleur: '#2a3a5a', bord: '#1c2a44' }

export const indexCeinture = (id) => CEINTURES.findIndex((c) => c.id === id)
