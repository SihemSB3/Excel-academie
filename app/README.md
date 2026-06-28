# Excel Dojo — l'application

Webapp du dojo (React + Vite + Tailwind). Elle lit le contenu directement depuis
`../chapitre-1.json` et `../chapitre-2.json` (la source de vérité, un niveau au-dessus).

## Lancer en local
```bash
cd livrables/excel-dojo/app
npm install      # uniquement la première fois
npm run dev
```
Puis ouvre l'URL affichée (par défaut http://localhost:5174).

## Build de production
```bash
npm run build    # génère le dossier dist/
npm run preview  # prévisualise le build
```

## Structure
- `src/data/chapitres.js` — charge les 2 fichiers JSON de contenu
- `src/store/` — progression (XP, ceintures, écrans validés) sauvegardée dans le navigateur (localStorage, zéro backend)
- `src/lib/belts.js` — les 7 ceintures et leurs couleurs
- `src/components/` — Dashboard, ChapterFlow (le moteur de parcours), LeconScreen, Flashcards, FicheMemo, Quiz, Checklist, BeltUnlock, ui
- `tailwind.config.js` — palette bleu marine / menthe / crème, polices Anton + Nunito

## Ce qui marche (pilote)
Boucle complète, ceinture blanche puis jaune : accueil → leçons (avec emplacements de captures) → flashcards des raccourcis → quiz → checklist → **déblocage de ceinture animé**. Les 19 exercices Google Sheet du chapitre 2 ouvrent une copie personnelle (lien `/copy`).

## Pas encore fait (prochaines étapes)
- Remplacer les emplacements « Capture Excel à venir » par tes vraies captures recadrées.
- Le tunnel d'entrée (animation ceinture blanche + règles du dojo) et l'écran objectifs SMART (après la 1re ceinture).
- Le « Sifu » (FAQ chatbot à mots-clés) à partir du champ `faq` des JSON.
- L'hébergement (Netlify ou Vercel) le jour de la mise en ligne.
