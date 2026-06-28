# Audit de contenu — Chapitre 2 (ebook vs web app)

**But** : repérer ce qui est dans l'ebook mais pas (ou peu) dans l'app, pour décider quoi ajouter.
**Philosophie** : l'app = dojo interactif des essentiels ; l'ebook = référence complète. Donc tout n'a pas vocation à passer dans l'app, une partie peut rester dans l'ebook (téléchargeable).

Légende : 🟢 couvert · 🟡 allégé · 🔴 manquant

---

## 1. Saisie & modification de données — 🟢
- 🟢 Saisir texte/nombres, alignement auto, ##### (colonne à élargir), dates (/ et -), Échap, Ctrl+Z
- 🟡 Modifier le **format d'affichage** d'une date (clic droit > Format de cellule > Date : court/long/perso)
- 🟡 Annuler via la **croix de la barre de formule** (l'app cite Échap et Ctrl+Z, pas la croix)
- **Reco** : ajouter 1 étape « format de date » + la croix. Priorité faible.

## 2. Saisie de calculs — 🟡
- 🟢 Le `=`, opérateurs `+ - * /`, priorités, parenthèses, étapes pas à pas
- 🔴 Opérateurs **`%`** (=50% → 0,5) et **`^`** (puissance, =10^2 → 100)
- 🟡 Astuce « **pas d'espaces** dans une formule »
- **Reco** : ajouter % et ^ (1 étape) + l'astuce espaces. Priorité moyenne.

## 3. Recopie des données & formules — 🟢
- 🟢 Poignée de recopie, recopie texte/nombres, recopie de formule (D2 → D3 → D4)
- 🟡 Recopie vers le bas (lignes) vs vers la droite (colonnes) — vu plus en détail dans la leçon Références
- 🟡 Mode de calcul « manuel » → Formules > Options de calcul > Automatique (cas rare)
- **Reco** : OK tel quel. Le cas « calcul manuel » peut rester dans l'ebook.

## 4. Création de séries — 🔴 (le plus gros manque)
L'app n'en montre que 2 aspects (mois, nombres +2). L'ebook est bien plus riche :
- 🔴 **Série de dates** (01/05 → 02/05 → 03/05…)
- 🔴 **Options avancées** : jours ouvrés (sans week-ends), par mois, par année
- 🔴 **CTRL en tirant = répéter** au lieu d'incrémenter (et inversement, CTRL sur un seul chiffre = créer la suite 1, 2, 3…)
- 🔴 **Séries personnalisées** texte+nombre (Client 1, Client 2, Client 3…)
- 🟡 Mois/jours **abrégés** (sept, mer), trimestres
- **Reco** : assez riche pour une **leçon dédiée « Séries automatiques »** (séparée de Recopie). Ferait passer le ch.2 à 9 leçons. Priorité haute.

## 5. La somme automatique — 🟢
- 🟢 Bouton ∑ Somme auto (Accueil > Édition), `=SOMME(plage)`, cellules non adjacentes avec `;`
- **Reco** : OK.

## 6. Déplacer & copier des cellules — 🟢
- 🟢 Couper/coller (ruban, clic droit, Ctrl+X/V), glisser-déposer, copier vers une autre feuille
- **Reco** : OK.

## 7. Collage spécial — 🟢
- 🟢 Coller les valeurs, transposer, étapes, caveat après Couper
- **Reco** : OK.

## 8. Références relatives & absolues — 🟢
- 🟢 Relative, absolue ($), les 4 types ($A$1 / A$1 / $A1 / A1), F4 — *revu le 28/06*
- **Reco** : OK.

## 9. L'assistant fonction — 🟢
- 🟢 Vraies fenêtres Excel (Insérer une fonction, Arguments, recherche NBVAL, autocomplétion), fonctions de base, NB vs NBVAL — *revu le 28/06*
- **Reco** : OK.

## 10. Fiche mémo — 🟢
- 🟢 9 fonctions (SOMME, MOYENNE, MIN, MAX, NBVAL, NB, CONCATENER, AUJOURDHUI, SI)
- **Reco** : OK.

---

## Synthèse — à décider par Sihem

| Priorité | Manque | Action proposée |
|---|---|---|
| 🔴 Haute | **Séries automatiques** (dates, jours ouvrés, CTRL répéter/incrémenter, séries perso) | En faire une **leçon dédiée** (ch.2 → 9 leçons) |
| 🟡 Moyenne | Opérateurs **% et ^** | Ajouter 1 étape à la leçon Calculs |
| 🟡 Faible | Format de date + croix barre de formule | Ajouter 1 étape à la leçon Saisie |
| 🟢 — | Tout le reste | Couvert, ou laissé à l'ebook (téléchargeable) |

**Le reste de l'ebook** (méthode/motivation, cas rares comme le mode de calcul manuel) reste dans l'ebook complet.
