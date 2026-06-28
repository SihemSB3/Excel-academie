# Excel Dojo, contenu structuré

Source de vérité du contenu pédagogique pour la webapp Excel Dojo. Chaque chapitre = un fichier JSON que l'app lit directement.

## Périmètre du pilote (MVP)
- **Chapitre 1** (`chapitre-1.json`) → ceinture **blanche** : vocabulaire + raccourcis, pas d'exercice.
- **Chapitre 2** (`chapitre-2.json`) → ceinture **jaune** : 9 leçons, **19 exercices Google Sheet** reliés aux leçons, fiche mémo (9 fonctions), quiz 16 QCM, checklist. C'est la boucle complète du pilote.

## Structure d'un fichier chapitre
- `modules[]` : les étapes du parcours, dans l'ordre. Chaque module a un `type` :
  - `lecon` : suite d'`ecrans` (titre + texte court + parfois `capture`). Peut contenir un tableau `exercices` (voir plus bas).
  - `flashcards` : `cartes` (ex. les 16 raccourcis du ch.1), avec `intro` et `hack_shaolin`.
  - `fiche_memo` : `fonctions` (nom, but, syntaxe, exemple).
  - `quiz` : `questions` (QCM). `reponses_correctes` = liste des index corrects (0 à 3), multi-réponses possible (`multi: true`). `seuil_reussite` = nb de bonnes réponses pour débloquer la ceinture.
  - `checklist` : `items` d'auto-évaluation.
- `faq[]` : base de réponses pré-écrites du « Sifu » (chatbot à mots-clés, pas d'IA). Matching sur `mots_cles`.
- `recompense` : ce qui se passe à la fin du chapitre (déblocage de ceinture + animation + XP bonus).

## Objet `capture`
```json
{ "fichier": "captures/ch1/04-barre-formule.png", "interaction": "clic", "cible": "barre_formule", "consigne": "Clique sur la barre de formule" }
```
- `fichier` : image à fournir (capture recadrée de l'ebook). À déposer dans `captures/ch1/` en suivant ce nom.
- `interaction` : `clic` ou `selection` (ou `null` pour un écran texte sans capture).
- `cible` / `consigne` : où l'élève doit cliquer et la phrase affichée.

## Objet `exercice` (chapitre 2)
Chaque leçon du ch.2 porte un tableau `exercices`. Un exercice :
```json
{ "n": 1, "titre": "Saisie de texte", "url": ".../edit", "url_copie": ".../copy", "consigne": "Onglet 1 = exercice, onglet 2 = correction" }
```
- `url` : la feuille en consultation.
- `url_copie` : se termine par `/copy`. **À utiliser par l'app** pour que chaque élève reçoive SA copie au lieu d'écrire dans le fichier commun.

## Ce que Sihem doit faire (validation)
1. **Réponses du quiz** : Q1 à Q8 validées sur ton corrigé (PARTIE 2, p301-302), `a_valider: false`. Q9 à Q12 (raccourcis) pré-remplies avec confiance haute, `a_valider: true`, à confirmer sur ta page de corrigé des raccourcis.
2. **Question `ch1-qcm-07`** : la 4e option « D la réponse D » est un clin d'œil humoristique volontaire (sketch Gad Elmaleh), gardée telle quelle.
3. **Fournir les captures recadrées** listées dans les objets `capture` (dossier `captures/ch1/`). Tes images d'ebook ont déjà les bons éléments entourés, il suffit de recadrer.
4. **Garder le ton** : ajuster les textes si besoin, ils doivent sonner « toi ».
5. **Chapitre 2** : valider `ch2-qcm-12` (réponse corrigée NB→NBVAL, voir la note dans le JSON), désambiguïser les options de `ch2-qcm-07`, et remplacer la checklist brouillon par la vraie (ebook p84+).

## Sources
- Texte intégral extrait : `context/import/ebook-excel-texte.txt` (à la racine du workspace).
- PDF d'origine : `Ton guide Excel_compressed.pdf` (692 p, complet). NB : il existe aussi un `PARTIE 1 E-BOOK.pdf` (355 p) côté Sihem, à confirmer comme version maître si plus propre.
