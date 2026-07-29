import { supabase, supabaseActif } from './supabase'

// Le code d'invitation arrive par l'URL (?groupe=ESC-B2A-7F3K) ou peut être saisi
// à la main en secours. On normalise pour que la casse et les espaces n'aient
// aucune importance.
export const normaliserCode = (code) => String(code || '').trim().toUpperCase()

export const codeDepuisUrl = () => {
  try {
    const code = new URLSearchParams(window.location.search).get('groupe')
    return code ? normaliserCode(code) : null
  } catch {
    return null
  }
}

// Retire le code de l'URL une fois le rattachement fait, pour que l'écran ne
// revienne pas à chaque rechargement.
export const nettoyerUrl = () => {
  try {
    window.history.replaceState(null, '', window.location.pathname)
  } catch {
    /* historique indisponible */
  }
}

// Aperçu avant confirmation : quel groupe, quelle organisation, reste-t-il de la place.
export async function apercuGroupe(code) {
  if (!supabaseActif) return null
  const { data, error } = await supabase.rpc('apercu_groupe', { code_saisi: normaliserCode(code) })
  if (error || !data || data.length === 0) return null
  const ligne = data[0]
  return { groupe: ligne.groupe_nom, organisation: ligne.organisation_nom, complet: ligne.complet }
}

// Rattachement effectif. Renvoie un des codes de résultat de la fonction SQL.
export async function rejoindreGroupe(code) {
  if (!supabaseActif) return 'indisponible'
  const { data, error } = await supabase.rpc('rejoindre_groupe', { code_saisi: normaliserCode(code) })
  if (error) return 'erreur'
  return data
}

export const MESSAGES_RESULTAT = {
  deja_membre: 'Tu fais déjà partie de ce groupe, tout est en ordre.',
  code_inconnu: "Ce lien d'invitation n'est plus actif. Demande le lien à jour à ton formateur.",
  licences_epuisees: 'Toutes les places de ce groupe sont prises. Préviens ton formateur, il pourra en ajouter.',
  domaine_refuse: "Ce groupe accepte uniquement les adresses de l'établissement. Crée ton compte avec ton adresse scolaire.",
  non_connecte: 'Connecte-toi pour rejoindre le groupe.',
  indisponible: 'La connexion aux groupes sera disponible très bientôt.',
  erreur: "Le rattachement n'a pas abouti. Réessaie dans un instant.",
}

// Les groupes de l'utilisateur, avec son rôle. Sert à savoir quoi afficher
// après la connexion : le dojo pour un apprenant, le suivi pour un formateur.
export async function chargerMesGroupes() {
  if (!supabaseActif) return []
  const { data, error } = await supabase
    .from('membres')
    .select('role, groupe:groupes (id, nom, code, licences, domaine_email, organisation:organisations (nom))')
  if (error || !data) return []
  return data.map((m) => ({ role: m.role, ...m.groupe }))
}

// Accès premium individuel (B2C) : à vie, ou abonnement encore valide.
// Lu sur le profil de l'utilisateur (RLS : il ne voit que le sien). Les champs
// premium ne sont écrits que côté serveur (webhook Stripe), jamais depuis ici.
export async function chargerStatutPremium(userId) {
  if (!supabaseActif || !userId) return false
  const { data, error } = await supabase
    .from('profils')
    .select('premium_a_vie, premium_jusqu_au')
    .eq('user_id', userId)
    .maybeSingle()
  if (error || !data) return false
  if (data.premium_a_vie) return true
  const aujourdhui = new Date().toISOString().slice(0, 10)
  return Boolean(data.premium_jusqu_au && data.premium_jusqu_au >= aujourdhui)
}

// Détail du compte de l'utilisateur pour son espace perso (identité + abonnement).
export async function chargerMonCompte(userId) {
  if (!supabaseActif || !userId) return null
  const { data, error } = await supabase
    .from('profils')
    .select('prenom, nom, premium_a_vie, premium_jusqu_au, stripe_customer_id')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) return null
  return data
}

const joursDepuis = (iso) => {
  if (!iso) return 999
  const ecart = Date.now() - new Date(iso).getTime()
  return Math.max(0, Math.floor(ecart / 86400000))
}

// Transforme une ligne de progression brute en indicateurs affichables.
// Tout est calculé à partir de ce que l'app enregistre réellement : pas de
// colonne inventée. Le temps vient du journal des katas, en secondes.
export function indicateurs(progression) {
  const p = progression || {}
  const journal = p.journal || {}
  const quiz = p.quiz || {}
  const passages = Object.values(journal)
  const scores = Object.values(quiz).map((q) => q?.pourcentage).filter((n) => typeof n === 'number')
  const chapitres = Array.isArray(p.chapitres_termines) ? p.chapitres_termines.length : 0
  return {
    chapitres,
    xp: p.xp || 0,
    katas: passages.length,
    tempsMin: Math.round(passages.reduce((t, k) => t + (k?.dureeTotale || 0), 0) / 60),
    serie: p.streak?.serie || 0,
    quiz: scores.length ? Math.round(scores.reduce((t, n) => t + n, 0) / scores.length) : null,
    dernierAccesJours: joursDepuis(p.updated_at),
  }
}

// Le suivi complet d'un groupe : chaque apprenant avec son identité et ses
// indicateurs. Les règles de sécurité de la base font le tri, un formateur
// n'obtient que les membres de ses propres groupes.
export async function chargerSuiviGroupe(groupeId) {
  if (!supabaseActif) return []
  const { data: membres, error } = await supabase
    .from('membres')
    .select('user_id, role, rejoint_le')
    .eq('groupe_id', groupeId)
    .eq('role', 'apprenant')
  if (error || !membres?.length) return []

  const ids = membres.map((m) => m.user_id)
  const [{ data: profils }, { data: progressions }] = await Promise.all([
    supabase.from('profils').select('user_id, prenom, nom').in('user_id', ids),
    supabase.from('progression').select('*').in('user_id', ids),
  ])

  const parId = (liste) => Object.fromEntries((liste || []).map((l) => [l.user_id, l]))
  const profilsParId = parId(profils)
  const progParId = parId(progressions)

  return membres.map((m) => {
    const profil = profilsParId[m.user_id] || {}
    return {
      id: m.user_id,
      prenom: profil.prenom || '',
      nom: profil.nom || '(nom non renseigné)',
      ...indicateurs(progParId[m.user_id]),
    }
  })
}

// Échéances du groupe (le rythme attendu).
export async function chargerJalons(groupeId) {
  if (!supabaseActif) return []
  const { data, error } = await supabase
    .from('jalons')
    .select('id, date, chapitres')
    .eq('groupe_id', groupeId)
    .order('date')
  return error || !data ? [] : data
}

export async function ajouterJalon(groupeId, date, chapitres) {
  const { data, error } = await supabase
    .from('jalons')
    .insert({ groupe_id: groupeId, date, chapitres })
    .select('id, date, chapitres')
    .single()
  return error ? null : data
}

export async function majJalon(id, champs) {
  const { error } = await supabase.from('jalons').update(champs).eq('id', id)
  return !error
}

export async function supprimerJalon(id) {
  const { error } = await supabase.from('jalons').delete().eq('id', id)
  return !error
}

export async function retirerMembre(groupeId, userId) {
  const { error } = await supabase.from('membres').delete().eq('groupe_id', groupeId).eq('user_id', userId)
  return !error
}

// Le lien que le formateur diffuse à ses apprenants.
export const lienInvitation = (code) => `${window.location.origin}/?groupe=${encodeURIComponent(code)}`
