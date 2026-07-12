// Source de vérité : les fichiers chapitre-*.json vivent dans livrables/excel-dojo/
// (un niveau au-dessus de app/). On les importe directement, pas de copie.
import chapitre1 from '../../../chapitre-1.json'
import chapitre2 from '../../../chapitre-2.json'
import chapitre3 from '../../../chapitre-3.json'
import chapitre4 from '../../../chapitre-4.json'
import chapitre5 from '../../../chapitre-5.json'
import chapitre6 from '../../../chapitre-6.json'
import chapitre7 from '../../../chapitre-7.json'
import chapitre8 from '../../../chapitre-8.json'
import chapitre9 from '../../../chapitre-9.json'
import chapitre10 from '../../../chapitre-10.json'
import chapitre11 from '../../../chapitre-11.json'
import chapitre12 from '../../../chapitre-12.json'
import chapitre13 from '../../../chapitre-13.json'

// Le chapitre du guide « Ton Guide Excel » en PDF, hébergé sur Drive
// (dossier « Guide Excel par chapitre (app) »). Téléchargeable depuis l'écran du chapitre.
// Lien de téléchargement direct (uc?export=download) plutôt que l'aperçu Drive.
const GUIDES_PDF = {
  1: 'https://drive.google.com/uc?export=download&id=1haem4Ln7kSIhdnofz3RvoFZw8c1KTbln',
  2: 'https://drive.google.com/uc?export=download&id=1mjH5UzkR4vhFb1nRS81cfMW-d14oa3hf',
  3: 'https://drive.google.com/uc?export=download&id=1XyATVIu2ckl-R7quSiVHjU2BF4Z34Fjr',
  4: 'https://drive.google.com/uc?export=download&id=10jSrw9O5LR3q0lHiuLpL6tnEBrQwyEl7',
  5: 'https://drive.google.com/uc?export=download&id=1TvPL4lbdYkEw5r5q6kOje7bgMR_x-NW0',
  6: 'https://drive.google.com/uc?export=download&id=1i8Wu4Ij9l3CM---HaS3S865vP5_tXF6k',
  7: 'https://drive.google.com/uc?export=download&id=1C0z8DhJdducFcMfvCqNgk2vVPzomVsxs',
  8: 'https://drive.google.com/uc?export=download&id=1tNVx0rU4-So7ll7S4qZIsfqCOlV1RyXn',
  9: 'https://drive.google.com/uc?export=download&id=1ZG7eNK7WY6cXIjFmcIstb-6fWLR0V9RQ',
  10: 'https://drive.google.com/uc?export=download&id=1AyQpiF5Y7cjJ2ch5Hqk_rbnEcjNmsI1S',
  11: 'https://drive.google.com/uc?export=download&id=1If6p6w9VN5_QU_MTRauzTDaXtiFxTHf_',
  12: 'https://drive.google.com/uc?export=download&id=1Vc9Uy3GFDkIpfpnisa_1toJUps4WpgEf',
  13: 'https://drive.google.com/uc?export=download&id=1hEDRD_Rim5O0n2N_u2jgyns4kYeDj0o1',
}

export const chapitres = [chapitre1, chapitre2, chapitre3, chapitre4, chapitre5, chapitre6, chapitre7, chapitre8, chapitre9, chapitre10, chapitre11, chapitre12, chapitre13].map(
  // gratuit : chapitres 1 et 2 offerts (freemium). Le reste sera premium une fois le paiement branché.
  (c) => ({ ...c, guideUrl: GUIDES_PDF[c.chapitre] || null, gratuit: c.chapitre === 1 || c.chapitre === 2 }),
)

export const getChapitre = (n) => chapitres.find((c) => c.chapitre === n)

// Nombre total d'étapes validables dans un chapitre (1 par écran de leçon, 1 par autre module)
export function etapesChapitre(ch) {
  let total = 0
  for (const m of ch.modules) {
    total += m.type === 'lecon' ? m.ecrans.length : 1
  }
  return total
}
