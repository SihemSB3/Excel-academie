import { useMemo, useState } from 'react'
import { CEINTURES } from '../lib/belts'
import {
  ORGANISATION as ORGANISATION_DEMO,
  APPRENANTS as APPRENANTS_DEMO,
  JALONS as JALONS_DEMO,
  DATE_DEMO,
  SEUIL_INACTIF_JOURS,
} from '../demo/donnees-formateur'

const TOTAL_CHAPITRES = 13

// La ceinture d'un apprenant découle du nombre de chapitres terminés
// (1 chapitre = 1 ceinture, la noire au 13e).
const ceintureDe = (chapitres) => (chapitres > 0 ? CEINTURES[Math.min(chapitres, TOTAL_CHAPITRES) - 1] : null)

const formaterDuree = (minutes) => {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h} h ${String(m).padStart(2, '0')}` : `${m} min`
}

// Les dates arrivent en AAAA-MM-JJ. On les construit en heure locale (et non via
// new Date('2026-10-15'), interprété en UTC) pour éviter un décalage d'un jour.
const enDate = (iso) => {
  const [a, m, j] = String(iso).split('-').map(Number)
  return new Date(a, (m || 1) - 1, j || 1)
}

const formaterDate = (iso) =>
  enDate(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })

const ajouterMois = (iso, mois) => {
  const d = enDate(iso)
  d.setMonth(d.getMonth() + mois)
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

const formaterAcces = (jours) => {
  if (jours <= 1) return "aujourd'hui"
  if (jours < 7) return `il y a ${jours} jours`
  if (jours < 14) return 'il y a 1 semaine'
  return `il y a ${Math.floor(jours / 7)} semaines`
}

function Pastille({ chapitres }) {
  const ceinture = ceintureDe(chapitres)
  if (!ceinture) {
    return (
      <span className="inline-flex items-center gap-2 text-xs text-navy/40">
        <span className="h-3.5 w-3.5 rounded-full border border-navy/20 bg-navy/5" />
        Pas commencé
      </span>
    )
  }
  const bicolore = ceinture.couleur2 && ceinture.couleur2 !== ceinture.couleur
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap text-xs font-bold text-navy">
      <span
        className="h-3.5 w-3.5 shrink-0 rounded-full border"
        style={{
          borderColor: ceinture.bord,
          background: bicolore
            ? `linear-gradient(90deg, ${ceinture.couleur} 50%, ${ceinture.couleur2} 50%)`
            : ceinture.couleur,
        }}
      />
      {ceinture.label}
    </span>
  )
}

function Tuile({ valeur, libelle, detail, accent = false }) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        accent ? 'border-mint/40 bg-mint/10' : 'border-navy/10 bg-white/60'
      }`}
    >
      <p className="font-display text-3xl leading-none text-navy-deep">{valeur}</p>
      <p className="mt-2 text-sm font-bold text-navy">{libelle}</p>
      {detail && <p className="mt-0.5 text-xs text-navy/55">{detail}</p>}
    </div>
  )
}

// Une échéance du planning : le formateur choisit la date et le nombre de
// chapitres attendus à cette date.
function Jalon({ jalon, courant, echue, onDate, onChapitres, onSupprimer }) {
  const label = formaterDate(jalon.date)
  return (
    <div
      className={`min-w-[11rem] flex-1 rounded-2xl border p-3 ${
        courant ? 'border-mint bg-mint/10' : echue ? 'border-navy/15 bg-white/60' : 'border-dashed border-navy/20 bg-white/40'
      }`}
    >
      <div className="mb-1.5 flex items-center gap-1">
        <p className="min-w-0 flex-1 text-xs font-bold uppercase tracking-wide text-navy/50">
          {courant ? 'Échéance en cours' : echue ? 'Échéance passée' : 'À venir'}
        </p>
        <button
          onClick={onSupprimer}
          aria-label={`Supprimer l'échéance du ${label}`}
          className="shrink-0 rounded-full px-1.5 text-navy/35 transition hover:bg-navy/5 hover:text-navy/70"
        >
          ×
        </button>
      </div>
      <input
        type="date"
        value={jalon.date}
        onChange={(e) => e.target.value && onDate(e.target.value)}
        aria-label={`Date de l'échéance du ${label}`}
        className="w-full rounded-xl border border-navy/15 bg-white px-2 py-1.5 text-sm font-bold text-navy focus:border-mint focus:outline-none"
      />
      <div className="mt-2 flex items-center gap-2">
        <button
          onClick={() => onChapitres(-1)}
          aria-label={`Retirer un chapitre à l'échéance du ${label}`}
          className="h-7 w-7 shrink-0 rounded-full bg-navy/5 text-lg leading-none text-navy/60 transition hover:bg-navy/10"
        >
          −
        </button>
        <p className="min-w-0 flex-1 text-center text-sm font-bold text-navy">
          {jalon.chapitres} <span className="font-normal text-navy/60">chap.</span>
        </p>
        <button
          onClick={() => onChapitres(1)}
          aria-label={`Ajouter un chapitre à l'échéance du ${label}`}
          className="h-7 w-7 shrink-0 rounded-full bg-navy/5 text-lg leading-none text-navy/60 transition hover:bg-navy/10"
        >
          +
        </button>
      </div>
    </div>
  )
}

const FILTRES = [
  { id: 'tous', label: 'Tous' },
  { id: 'heure', label: 'À l’heure' },
  { id: 'retard', label: 'En retard' },
  { id: 'inactif', label: 'Inactifs' },
]

// Le même écran sert à deux usages : la démonstration commerciale (données
// fictives, aucun compte requis) et le suivi réel d'un groupe. Seules les
// données changent, jamais la présentation, pour qu'un prospect voie
// exactement ce qu'il aura.
export default function EspaceFormateur({
  onQuitter,
  demo = true,
  organisation = ORGANISATION_DEMO,
  apprenants = APPRENANTS_DEMO,
  jalonsInitiaux = JALONS_DEMO,
  dateReference = DATE_DEMO,
  lien = null,
  onJalonsChange = null,
}) {
  const APPRENANTS = apprenants
  const ORGANISATION = organisation
  const [filtre, setFiltre] = useState('tous')
  const [jalons, setJalons] = useState(jalonsInitiaux)
  const [lienCopie, setLienCopie] = useState(false)
  const [exportEnCours, setExportEnCours] = useState(false)
  const [exportErreur, setExportErreur] = useState(null)

  // En mode réel, chaque modification d'échéance est enregistrée en base.
  // En démonstration, onJalonsChange est absent et tout reste en mémoire.
  const majJalons = (calcul) =>
    setJalons((liste) => {
      const suivante = calcul(liste)
      if (onJalonsChange) onJalonsChange(suivante, liste)
      return suivante
    })

  // Mise à jour fonctionnelle : deux clics rapides doivent compter deux fois.
  const reglerChapitres = (id, delta) =>
    majJalons((liste) =>
      liste.map((j) =>
        j.id === id ? { ...j, chapitres: Math.max(0, Math.min(TOTAL_CHAPITRES, j.chapitres + delta)) } : j,
      ),
    )

  const reglerDate = (id, date) =>
    majJalons((liste) => liste.map((j) => (j.id === id ? { ...j, date } : j)))

  const supprimerJalon = (id) => majJalons((liste) => liste.filter((j) => j.id !== id))

  const ajouterJalon = () =>
    majJalons((liste) => {
      const dernier = [...liste].sort((a, b) => a.date.localeCompare(b.date))[liste.length - 1]
      return [
        ...liste,
        {
          id: `j${Date.now()}`,
          date: dernier ? ajouterMois(dernier.date, 1) : ajouterMois(dateReference, 1),
          chapitres: Math.min(TOTAL_CHAPITRES, (dernier?.chapitres ?? 0) + 2),
        },
      ]
    })

  // Échéances toujours affichées dans l'ordre chronologique, quelles que soient
  // les dates saisies. Le nombre de chapitres attendus aujourd'hui est celui de
  // la dernière échéance déjà passée.
  const jalonsTries = useMemo(() => [...jalons].sort((a, b) => a.date.localeCompare(b.date)), [jalons])
  const jalonCourant = useMemo(
    () => [...jalonsTries].reverse().find((j) => j.date <= dateReference) ?? null,
    [jalonsTries, dateReference],
  )
  const attendu = jalonCourant?.chapitres ?? 0
  const jalonFinal = jalonsTries[jalonsTries.length - 1] ?? null

  // Un planning cohérent ne redescend jamais : on prévient plutôt que de corriger
  // à la place du formateur.
  const incoherent = useMemo(
    () => jalonsTries.some((j, i) => i > 0 && j.chapitres < jalonsTries[i - 1].chapitres),
    [jalonsTries],
  )

  const stats = useMemo(() => {
    const n = APPRENANTS.length
    const alHeure = APPRENANTS.filter((a) => a.chapitres >= attendu)
    const enRetard = APPRENANTS.filter((a) => a.chapitres < attendu)
    const actifs = APPRENANTS.filter((a) => a.dernierAccesJours <= 7)
    const inactifs = APPRENANTS.filter((a) => a.dernierAccesJours > SEUIL_INACTIF_JOURS)
    const bloques = APPRENANTS.filter((a) => a.bloqueChapitre)
    const sommeChapitres = APPRENANTS.reduce((t, a) => t + a.chapitres, 0)
    const sommeTemps = APPRENANTS.reduce((t, a) => t + a.tempsMin, 0)
    const sommeKatas = APPRENANTS.reduce((t, a) => t + a.katas, 0)
    return {
      n,
      tauxHeure: Math.round((alHeure.length / n) * 100),
      nbHeure: alHeure.length,
      nbRetard: enRetard.length,
      enRetard,
      progressionMoyenne: Math.round((sommeChapitres / n / TOTAL_CHAPITRES) * 100),
      chapitresMoyens: (sommeChapitres / n).toFixed(1).replace('.', ','),
      tempsMoyen: Math.round(sommeTemps / n),
      tauxActifs: Math.round((actifs.length / n) * 100),
      nbActifs: actifs.length,
      inactifs,
      bloques,
      totalKatas: sommeKatas,
      nbFinal: jalonFinal ? APPRENANTS.filter((a) => a.chapitres >= jalonFinal.chapitres).length : 0,
    }
  }, [attendu, jalonFinal])

  const liste = useMemo(() => {
    const tri = [...APPRENANTS].sort((a, b) => b.chapitres - a.chapitres || a.nom.localeCompare(b.nom))
    if (filtre === 'heure') return tri.filter((a) => a.chapitres >= attendu)
    if (filtre === 'retard') return tri.filter((a) => a.chapitres < attendu)
    if (filtre === 'inactif') return tri.filter((a) => a.dernierAccesJours > SEUIL_INACTIF_JOURS)
    return tri
  }, [filtre, attendu])

  // Vrai fichier .xlsx (pas un CSV renommé) : la bibliothèque n'est chargée
  // qu'au moment du clic, pour ne pas alourdir le démarrage de l'app.
  const exporterExcel = async () => {
    setExportEnCours(true)
    setExportErreur(null)
    try {
      const { default: ecrireXlsx } = await import('write-excel-file/browser')
      const entete = [
        'Nom',
        'Prénom',
        'Ceinture',
        'Chapitres terminés',
        'Attendus au ' + (jalonCourant ? formaterDate(jalonCourant.date) : '-'),
        'Statut',
        'Entraînements',
        'Moyenne quiz',
        'Temps passé (min)',
        'Dernière connexion (jours)',
      ].map((v) => ({
        value: v,
        fontWeight: 'bold',
        backgroundColor: '#0a335d',
        // La propriété s'appelle bien textColor : avec `color`, elle est ignorée
        // et l'en-tête ressort en texte foncé sur fond foncé.
        textColor: '#ffffff',
        align: 'left',
        alignVertical: 'center',
        wrap: true,
      }))

      const lignes = [...APPRENANTS]
        .sort((a, b) => b.chapitres - a.chapitres)
        .map((a) => {
          const retard = a.chapitres < attendu
          return [
            { value: a.nom, type: String },
            { value: a.prenom, type: String },
            { value: ceintureDe(a.chapitres)?.label ?? 'Aucune', type: String },
            { value: a.chapitres, type: Number },
            { value: attendu, type: Number },
            {
              value: retard ? 'En retard' : 'À l’heure',
              type: String,
              fontWeight: retard ? 'bold' : undefined,
              textColor: retard ? '#c0671f' : '#1f7a74',
            },
            { value: a.katas, type: Number },
            { value: a.quiz, type: Number },
            { value: a.tempsMin, type: Number },
            { value: a.dernierAccesJours, type: Number },
          ]
        })

      // L'API renvoie { toBlob, toFile }. On passe par toBlob pour déclencher
      // nous-mêmes le téléchargement, plus fiable selon les navigateurs.
      const blob = await ecrireXlsx([entete, ...lignes], {
        sheet: 'Suivi',
        // L'en-tête reste visible quand on fait défiler la liste des apprenants.
        stickyRowsCount: 1,
        columns: [
          { width: 16 }, { width: 14 }, { width: 16 }, { width: 19 }, { width: 24 },
          { width: 12 }, { width: 16 }, { width: 15 }, { width: 18 }, { width: 24 },
        ],
      }).toBlob()
      const url = URL.createObjectURL(blob)
      const lien = document.createElement('a')
      lien.href = url
      lien.download = 'suivi-apprenants-demonstration.xlsx'
      document.body.appendChild(lien)
      lien.click()
      lien.remove()
      // Libéré au tour suivant : révoquer immédiatement peut annuler le téléchargement.
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch (erreur) {
      console.error('Export Excel impossible', erreur)
      setExportErreur("L'export n'a pas pu être généré.")
    } finally {
      setExportEnCours(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-cream px-4 py-6 sm:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Bandeau d'honnêteté : personne ne doit croire que ces chiffres sont réels. */}
        {demo && (
          <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-[#e8853a]/40 bg-[#e8853a]/10 px-4 py-3">
            <span className="rounded-full bg-[#e8853a] px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
              Démonstration
            </span>
            <p className="min-w-0 flex-1 text-sm text-navy/75">
              Apprenants et chiffres fictifs, pour montrer ce que voit un formateur.
            </p>
            {onQuitter && (
              <button onClick={onQuitter} className="text-sm font-bold text-navy/60 underline hover:text-navy">
                Quitter
              </button>
            )}
          </div>
        )}

        <header className="mb-6">
          <p className="text-xs font-bold uppercase tracking-wide text-navy/50">Espace formateur</p>
          <h1 className="font-display text-3xl text-navy-deep sm:text-4xl">{ORGANISATION.nom}</h1>
          <p className="mt-1 text-sm text-navy/70">
            {[ORGANISATION.groupe, ORGANISATION.periode].filter(Boolean).join(' · ')}
            {ORGANISATION.groupe || ORGANISATION.periode ? ' · ' : ''}
            {stats.n} apprenants sur {ORGANISATION.licences} licences
          </p>
        </header>

        {/* Le lien que le formateur diffuse à ses apprenants pour qu'ils rejoignent
            le groupe. Un seul lien, donc aucun code à recopier et aucune erreur possible. */}
        {lien && (
          <section className="mb-6 rounded-2xl border border-navy/10 bg-white/60 p-4">
            <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-navy/60">
              Inviter vos apprenants
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap rounded-xl bg-navy/5 px-3 py-2 text-sm text-navy">
                {lien}
              </code>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(lien).then(
                    () => setLienCopie(true),
                    () => setLienCopie(false),
                  )
                }}
                className="rounded-full bg-mint px-4 py-2 text-xs font-bold text-navy-deep transition hover:bg-mint-dark"
              >
                {lienCopie ? 'Copié' : 'Copier le lien'}
              </button>
            </div>
            <p className="mt-2 text-xs text-navy/50">
              Diffusez-le comme vous voulez. Chaque apprenant qui clique voit le nom de votre établissement avant de
              confirmer, et le lien s'arrête automatiquement une fois les {ORGANISATION.licences} licences utilisées.
            </p>
          </section>
        )}

        <section className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Tuile
            accent
            valeur={`${stats.tauxHeure} %`}
            libelle="À l’heure"
            detail={`${stats.nbHeure} apprenants au rythme, ${stats.nbRetard} en retard`}
          />
          <Tuile
            valeur={`${stats.progressionMoyenne} %`}
            libelle="Progression moyenne"
            detail={`${stats.chapitresMoyens} chapitres sur ${TOTAL_CHAPITRES}, et ${stats.totalKatas} entraînements réalisés`}
          />
          <Tuile
            valeur={formaterDuree(stats.tempsMoyen)}
            libelle="Temps moyen passé"
            detail="par apprenant, depuis le lancement"
          />
          <Tuile
            valeur={`${stats.tauxActifs} %`}
            libelle="Actifs cette semaine"
            detail={`${stats.nbActifs} apprenants connectés depuis 7 jours`}
          />
        </section>

        {/* Le rythme : c'est ici que le formateur définit ce qu'il attend et à quelle date. */}
        <section className="mb-6 rounded-2xl border border-navy/10 bg-white/60 p-4">
          <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-sm font-bold uppercase tracking-wide text-navy/60">Rythme attendu</h2>
            <p className="text-xs text-navy/50">Nous sommes le {formaterDate(dateReference)}</p>
          </div>
          <div className="flex flex-wrap items-stretch gap-3">
            {jalonsTries.map((j) => (
              <Jalon
                key={j.id}
                jalon={j}
                courant={jalonCourant?.id === j.id}
                echue={j.date <= dateReference}
                onDate={(v) => reglerDate(j.id, v)}
                onChapitres={(v) => reglerChapitres(j.id, v)}
                onSupprimer={() => supprimerJalon(j.id)}
              />
            ))}
            <button
              onClick={ajouterJalon}
              className="min-w-[9rem] flex-1 rounded-2xl border border-dashed border-navy/25 px-3 py-4 text-sm font-bold text-navy/60 transition hover:border-mint hover:bg-mint/5 hover:text-navy"
            >
              + Ajouter une échéance
            </button>
          </div>
          {jalonFinal ? (
            <p className="mt-3 text-sm text-navy/75">
              Au {formaterDate(dateReference)}, <strong className="font-bold text-navy">{attendu} chapitres</strong> sont
              attendus. <strong className="font-bold text-navy">{stats.nbHeure}</strong> apprenants sur {stats.n} sont à
              l’heure, <strong className="font-bold text-[#c0671f]">{stats.nbRetard}</strong> sont en retard. Pour
              l’échéance du {formaterDate(jalonFinal.date)}, {stats.nbFinal} ont déjà atteint les {jalonFinal.chapitres}{' '}
              chapitres visés.
            </p>
          ) : (
            <p className="mt-3 text-sm text-navy/60">
              Aucune échéance définie : ajoutez-en une pour suivre le rythme du groupe.
            </p>
          )}
          {incoherent && (
            <p className="mt-2 text-xs font-bold text-[#c0671f]">
              Attention : le nombre de chapitres attendus diminue d’une échéance à la suivante.
            </p>
          )}
          <p className="mt-1 text-xs text-navy/45">
            Choisissez la date et le nombre de chapitres attendus, tout le tableau de bord se recalcule.
          </p>
        </section>

        {(stats.inactifs.length > 0 || stats.bloques.length > 0) && (
          <section className="mb-6 rounded-2xl border border-navy/10 bg-white/60 p-4">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-navy/60">À relancer</h2>
            <ul className="space-y-2 text-sm">
              {stats.inactifs.map((a) => (
                <li key={`i-${a.id}`} className="flex flex-wrap items-center gap-2 text-navy/80">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-[#e8853a]" />
                  <strong className="font-bold text-navy">
                    {a.prenom} {a.nom}
                  </strong>
                  <span>sans connexion depuis {Math.floor(a.dernierAccesJours / 7)} semaines</span>
                  <span className="text-navy/45">({a.chapitres} chapitres terminés)</span>
                </li>
              ))}
              {stats.bloques.map((a) => (
                <li key={`b-${a.id}`} className="flex flex-wrap items-center gap-2 text-navy/80">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-navy/40" />
                  <strong className="font-bold text-navy">
                    {a.prenom} {a.nom}
                  </strong>
                  <span>bloque sur le quiz du chapitre {a.bloqueChapitre}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="rounded-2xl border border-navy/10 bg-white/60">
          <div className="flex flex-wrap items-center gap-2 border-b border-navy/10 p-4">
            <div className="flex min-w-0 flex-1 flex-wrap gap-2">
              {FILTRES.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFiltre(f.id)}
                  className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                    filtre === f.id ? 'bg-navy text-cream' : 'bg-navy/5 text-navy/70 hover:bg-navy/10'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <button
              onClick={exporterExcel}
              disabled={exportEnCours}
              className="rounded-full bg-mint px-4 py-1.5 text-xs font-bold text-navy-deep transition hover:bg-mint-dark disabled:opacity-50"
            >
              {exportEnCours ? 'Export…' : 'Exporter en Excel'}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-navy/10 text-xs uppercase tracking-wide text-navy/50">
                  <th className="px-4 py-3 font-bold">Apprenant</th>
                  <th className="px-4 py-3 font-bold">Ceinture</th>
                  <th className="px-4 py-3 font-bold">Progression</th>
                  <th className="px-4 py-3 font-bold">Statut</th>
                  <th className="px-4 py-3 font-bold">Entraînements</th>
                  <th className="px-4 py-3 font-bold">Quiz</th>
                  <th className="px-4 py-3 font-bold">Dernière connexion</th>
                </tr>
              </thead>
              <tbody>
                {liste.map((a) => {
                  const pct = Math.round((a.chapitres / TOTAL_CHAPITRES) * 100)
                  const inactif = a.dernierAccesJours > SEUIL_INACTIF_JOURS
                  const retard = a.chapitres < attendu
                  return (
                    <tr key={a.id} className="border-b border-navy/5 last:border-0">
                      <td className="px-4 py-3">
                        <span className="font-bold text-navy">
                          {a.prenom} {a.nom}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Pastille chapitres={a.chapitres} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="relative h-2 w-24 overflow-hidden rounded-full bg-navy/10">
                            <div className="h-full rounded-full bg-mint" style={{ width: `${pct}%` }} />
                            {/* Repère du rythme attendu */}
                            <span
                              className="absolute top-0 h-full w-0.5 bg-navy/45"
                              style={{ left: `${Math.min(100, (attendu / TOTAL_CHAPITRES) * 100)}%` }}
                            />
                          </div>
                          <span className="whitespace-nowrap text-xs text-navy/60">
                            {a.chapitres}/{TOTAL_CHAPITRES}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-bold ${
                            retard ? 'bg-[#e8853a]/15 text-[#c0671f]' : 'bg-mint/25 text-navy'
                          }`}
                        >
                          {retard ? `−${attendu - a.chapitres} chap.` : 'À l’heure'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-navy/70">{a.katas}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-bold text-navy ${
                            a.quiz >= 80 ? 'bg-mint/25' : 'bg-navy/[.07]'
                          }`}
                        >
                          {a.quiz}/100
                        </span>
                      </td>
                      <td className={`px-4 py-3 text-xs ${inactif ? 'font-bold text-[#c0671f]' : 'text-navy/55'}`}>
                        {formaterAcces(a.dernierAccesJours)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {liste.length === 0 && (
            <p className="p-6 text-center text-sm text-navy/50">Aucun apprenant dans cette catégorie.</p>
          )}
        </section>

        <p className="mt-4 text-xs text-navy/45">
          Ceinture attribuée automatiquement à chaque chapitre validé. Le quiz de fin de chapitre doit être réussi pour
          débloquer le suivant, l'ordre est verrouillé côté serveur.
        </p>
      </div>
    </div>
  )
}
