// Source de vérité : les fichiers chapitre-*.json vivent dans livrables/excel-dojo/
// (un niveau au-dessus de app/). On les importe directement, pas de copie.
import chapitre1 from '../../../chapitre-1.json'
import chapitre2 from '../../../chapitre-2.json'
import chapitre3 from '../../../chapitre-3.json'
import chapitre4 from '../../../chapitre-4.json'

export const chapitres = [chapitre1, chapitre2, chapitre3, chapitre4]

export const getChapitre = (n) => chapitres.find((c) => c.chapitre === n)

// Nombre total d'étapes validables dans un chapitre (1 par écran de leçon, 1 par autre module)
export function etapesChapitre(ch) {
  let total = 0
  for (const m of ch.modules) {
    total += m.type === 'lecon' ? m.ecrans.length : 1
  }
  return total
}
