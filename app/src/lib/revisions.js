// Répétition espacée (la mémoire du Shifu).
// À partir du journal d'apprentissage (date du dernier passage + niveau de maîtrise), on
// calcule QUAND chaque kata doit être révisé. L'intervalle grandit à chaque révision
// réussie (sans faute) et se raccourcit dès qu'il y a des erreurs. Tout tourne en
// localStorage, zéro backend. Principe éprouvé : on revoit une notion juste avant de
// l'oublier, à intervalles de plus en plus espacés, pour l'ancrer durablement.

// Intervalles en JOURS, indexés par le niveau de maîtrise (0 = fraîchement vu).
export const INTERVALLES = [1, 2, 4, 8, 16, 32]

export function jourLocal(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// Ajoute n jours à une date 'AAAA-MM-JJ' (midi local pour éviter les bascules de fuseau).
export function ajouterJours(jour, n) {
  const d = new Date(`${jour}T12:00:00`)
  d.setDate(d.getDate() + n)
  return jourLocal(d)
}

// Nouveau niveau après un passage : +1 si sans faute (on espace davantage), -1 par erreur
// (on rapproche la prochaine révision). Plancher 0, plafond au dernier intervalle.
export function calcNiveau(niveauAvant = 0, erreurs = 0) {
  const max = INTERVALLES.length - 1
  return erreurs > 0 ? Math.max(0, niveauAvant - 1) : Math.min(niveauAvant + 1, max)
}

// Date à laquelle un kata devient « à réviser ». Rétro-compatible : si le journal n'a pas
// encore d'échéance stockée, on la déduit du dernier passage et du niveau.
export function echeance(entry) {
  if (!entry || !entry.dernierLe) return null
  if (entry.prochaineLe) return entry.prochaineLe
  const niveau = Math.min(entry.niveau || 0, INTERVALLES.length - 1)
  return ajouterJours(entry.dernierLe, INTERVALLES[niveau])
}

export function estDue(entry, auj = jourLocal()) {
  const e = echeance(entry)
  return Boolean(e) && e <= auj
}

// La liste des katas (leçons narrées) à réviser aujourd'hui, avec de quoi les rouvrir.
// Triés du plus en retard au plus récent.
export function revisionsDues(journal = {}, chapitres = [], auj = jourLocal()) {
  const out = []
  for (const ch of chapitres) {
    for (const m of ch.modules || []) {
      if (m.type !== 'narration') continue
      const entry = journal[m.id]
      if (entry && estDue(entry, auj)) {
        out.push({ id: m.id, chapitre: ch.chapitre, moduleId: m.id, titre: m.titre, chapitreTitre: ch.titre, echeanceLe: echeance(entry) })
      }
    }
  }
  return out.sort((a, b) => (a.echeanceLe < b.echeanceLe ? -1 : 1))
}
