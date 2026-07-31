import { Bouton, BeltGraphic } from './ui'
import { Shifu } from './Shifu'

// Page de présentation, montrée aux visiteurs non connectés avant l'inscription.
// Vend le concept (apprendre Excel comme un art martial), montre les ceintures et
// l'offre, et pousse vers la création d'un compte gratuit (2 chapitres offerts).

const CEINTURES_APERCU = ['blanche', 'jaune', 'orange', 'verte', 'bleue', 'marron', 'noire']

const ATOUTS = [
  { emoji: '🥋', titre: '13 chapitres, 7 ceintures', texte: 'De la ceinture blanche à la noire, une progression claire, un palier après l’autre.' },
  { emoji: '📊', titre: '91 exercices corrigés', texte: 'De vrais fichiers Excel à télécharger et refaire, du niveau débutant au niveau pro.' },
  { emoji: '🧠', titre: 'Quiz et répétition', texte: 'On valide chaque chapitre par un quiz, et la répétition espacée ancre ce que tu apprends.' },
  { emoji: '📄', titre: 'Les guides PDF inclus', texte: 'Le manuel de chaque chapitre à garder sous la main, formule par formule.' },
  { emoji: '📱', titre: 'Mobile et ordinateur', texte: 'Apprends sur ton téléphone, fais les exercices sur PC. Ta progression te suit partout.' },
  { emoji: '🧘', titre: 'Le Shifu te guide', texte: 'Un coach bienveillant qui t’accompagne, sans jargon, une compétence à la fois.' },
]

function Section({ children, className = '' }) {
  return <section className={`mx-auto w-full max-w-3xl px-5 ${className}`}>{children}</section>
}

export default function Accueil({ onCommencer, onConnexion }) {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-cream text-navy">
      {/* Barre haute */}
      <header className="mx-auto flex w-full max-w-3xl items-center justify-between px-5 py-5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[.3em] text-mint">L'Art du Digital</p>
          <p className="font-display text-xl leading-none text-navy">Excel Académie</p>
        </div>
        <button onClick={onConnexion} className="text-sm font-bold text-navy/60 transition hover:text-navy">
          Se connecter
        </button>
      </header>

      {/* Hero */}
      <Section className="pb-8 pt-6 text-center">
        <div className="flex justify-center animate-float">
          <Shifu humeur="accueil" size={104} />
        </div>
        <p className="mt-4 text-xs font-bold uppercase tracking-[.25em] text-mint">La méthode Shaolin pour Excel</p>
        <h1 className="mt-2 font-display text-4xl leading-[1.05] text-navy sm:text-5xl" style={{ textWrap: 'balance' }}>
          Deviens ceinture noire d'Excel
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-navy/70">
          Excel s'apprend comme un art martial : par la régularité, un geste après l'autre. Tu progresses de la ceinture
          blanche à la noire, avec de vrais exercices et un Shifu qui te guide.
        </p>
        <div className="mx-auto mt-7 max-w-xs">
          <Bouton onClick={onCommencer}>Créer mon compte gratuit</Bouton>
        </div>
        <p className="mt-3 text-xs font-semibold text-navy/50">
          🥋 Les 2 premiers chapitres sont offerts. Sans carte bancaire.
        </p>

        {/* La rangée de ceintures */}
        <div className="mt-10 flex flex-wrap items-end justify-center gap-3">
          {CEINTURES_APERCU.map((c) => (
            <BeltGraphic key={c} ceinture={c} size={54} />
          ))}
        </div>
      </Section>

      {/* Ce que tu obtiens */}
      <Section className="py-12">
        <h2 className="text-center font-display text-3xl text-navy">Ce que tu obtiens</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {ATOUTS.map((a) => (
            <div key={a.titre} className="rounded-2xl border border-navy/10 bg-white/60 p-5">
              <div className="text-2xl">{a.emoji}</div>
              <h3 className="mt-2 font-bold text-navy">{a.titre}</h3>
              <p className="mt-1 text-sm leading-relaxed text-navy/65">{a.texte}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Comment ça marche */}
      <Section className="pb-12">
        <div className="rounded-3xl bg-navy p-8 text-center text-cream">
          <h2 className="font-display text-3xl">La Voie, simplement</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {[
              ['1', 'Apprends', 'Une leçon narrée, courte et claire, avec le Shifu.'],
              ['2', "Entraîne-toi", 'Un vrai fichier Excel à refaire, puis un quiz.'],
              ['3', 'Gagne ta ceinture', 'Chaque chapitre validé te fait monter d’un palier.'],
            ].map(([n, t, d]) => (
              <div key={n}>
                <div className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-mint font-display text-lg text-navy-deep">
                  {n}
                </div>
                <h3 className="mt-3 font-bold">{t}</h3>
                <p className="mt-1 text-sm text-cream/70">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* L'offre */}
      <Section className="pb-12">
        <h2 className="text-center font-display text-3xl text-navy">Commence gratuitement</h2>
        <p className="mx-auto mt-2 max-w-lg text-center text-sm text-navy/60">
          Teste les 2 premiers chapitres sans rien payer. Quand tu es convaincu, débloque tout le parcours.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border-2 border-mint bg-mint/10 p-6 text-center">
            <p className="text-xs font-bold uppercase tracking-wide text-navy/60">Accès à vie</p>
            <p className="mt-1 font-display text-4xl text-navy-deep">129 €</p>
            <p className="mt-1 text-sm text-navy/60">Un seul paiement, à toi pour toujours. Le meilleur choix.</p>
          </div>
          <div className="rounded-2xl border border-navy/15 bg-white/60 p-6 text-center">
            <p className="text-xs font-bold uppercase tracking-wide text-navy/60">Mensuel</p>
            <p className="mt-1 font-display text-4xl text-navy-deep">
              19,90 €<span className="text-lg font-bold text-navy/50">/mois</span>
            </p>
            <p className="mt-1 text-sm text-navy/60">Sans engagement, résiliable à tout moment.</p>
          </div>
        </div>
      </Section>

      {/* CTA final */}
      <Section className="pb-16 text-center">
        <h2 className="font-display text-3xl text-navy" style={{ textWrap: 'balance' }}>
          Ton entraînement commence maintenant
        </h2>
        <div className="mx-auto mt-6 max-w-xs">
          <Bouton onClick={onCommencer}>Créer mon compte gratuit</Bouton>
        </div>
        <button onClick={onConnexion} className="mt-4 text-sm font-bold text-navy/55 transition hover:text-navy">
          J'ai déjà un compte
        </button>
      </Section>

      <footer className="border-t border-navy/10 py-6 text-center text-[11px] text-navy/40">
        L'Art du Digital · Excel Académie
      </footer>
    </div>
  )
}
