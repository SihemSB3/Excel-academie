# Chapitre 3 - Récap de production

**Titre :** Mise en forme & mise en page
**Ceinture :** Orange
**Statut :** Fait et vérifié en preview (28/06/2026). Zéro erreur.
**Source ebook :** `context/import/ebook-excel-texte.txt`, pages 88 à 115.

Principe appliqué (ton exigence) : **un visuel pour chaque explication** (comme les captures de ton ebook) et **« En savoir plus » repris mot pour mot de l'ebook**.

---

## Où vit le contenu

| Fichier | Rôle |
|---------|------|
| `chapitre-3.json` | Structure du chapitre : 7 leçons + quiz + checklist + récompense + FAQ du Sifu |
| `app/src/data/lecons-fonctions.js` | Les 7 leçons narrées (texte + visuels + « En savoir plus ») |
| `app/src/components/LeconNarree.jsx` | Les composants visuels (dont les nouveaux du ch.3) |
| `app/src/data/chapitres.js` | Branchement du ch.3 (se débloque après le ch.2) |

---

## Les 7 leçons (et leurs exercices Drive)

1. **Gérer les lignes & les colonnes** : insérer/supprimer (ruban + clic droit), élargir à la main, double-clic auto, commande Format. → Ex. 20 + 21
2. **L'onglet Accueil & la boîte Format de cellule** : les 6 onglets. → Ex. 22 + 23
3. **Couleurs, bordures & texte** : bordures rapides + personnalisées, fond, couleur du texte. → Ex. 22
4. **Formater les nombres** : €, %, séparateur de milliers, décimales. → Ex. 23
5. **Le pinceau & les styles de cellule** : reproduire la mise en forme, appliquer/créer un style. → Ex. 24 + 25
6. **Mise en page** : thèmes, mode page, orientation, zone d'impression, répéter les titres, mise à l'échelle. → Ex. 26
7. **En-tête, pied de page & impression** : insérer, personnaliser, imprimer. → Ex. 26

Chaque leçon finit par une mini-question + l'étape « Entraînement » qui ouvre le(s) fichier(s) Excel sur le Drive.

Pas de fiche mémo pour ce chapitre (ton ebook n'en a pas au ch.3).

---

## Nouveaux visuels créés pour ce chapitre

- Boîte **Format de cellule** à 6 onglets (Nombre, Alignement, Police, Bordure, Remplissage, Protection)
- **Bordures + couleur de fond** en « avant / après » + le menu Bordures
- Tableau **format des nombres** (Bouton / Avant / Après)
- Le **pinceau** (cellule modèle reproduite)
- La **galerie de styles** de cellule
- L'**aperçu d'impression** (portrait / paysage, zones en-tête et pied de page)

---

## ⚠️ À VALIDER PAR TOI : les réponses du QCM

Le corrigé imprimé n'était pas récupérable dans le texte extrait de l'ebook (les coches étaient des images). J'ai donc rempli les 8 réponses avec ma connaissance d'Excel. **Merci de vérifier**, surtout les Q2 et Q7 où j'ai un petit doute.

> Légende : la ou les bonnes réponses sont marquées ✅.

**Q1. Quelle méthode permet d'insérer une ligne ?**
- Cliquer sur « Fichier > Insérer une ligne »
- ✅ Cliquer droit sur l'en-tête de ligne > Insérer
- ✅ Onglet Accueil > Cellules > Insérer
- Onglet Insertion > Ligne verticale

**Q2. Pour adapter automatiquement la largeur d'une colonne :** *(doute)*
- ✅ Double-cliquer sur la bordure droite de l'en-tête de colonne
- Cliquer sur Accueil > Insertion > Adapter
- ✅ Utiliser Accueil > Cellules > Format > Ajuster la largeur
- Utiliser l'outil « Fusionner »
- *Note : j'ai mis les deux car le double-clic ET « Format > Ajuster » ajustent automatiquement. Si tu veux une seule bonne réponse, dis-moi laquelle.*

**Q3. Que peut-on modifier via la boîte « Format de cellule » ?**
- ✅ La couleur de fond
- ✅ Le format monétaire
- La position de la cellule sur la feuille
- ✅ La police et les bordures

**Q4. À quoi sert l'outil « Reproduire la mise en forme » ?**
- ✅ Copier le style d'une cellule vers d'autres
- Créer un graphique avec le même style
- ✅ Gagner du temps pour appliquer une mise en forme identique
- Supprimer les formats d'une cellule

**Q5. Qu'est-ce qu'un style de cellule dans Excel ?**
- ✅ Un ensemble de mises en forme prédéfinies
- Une macro liée à une cellule
- ✅ Un outil pour uniformiser visuellement un tableau
- Un format de fichier spécifique

**Q6. Où peut-on insérer un en-tête personnalisé ?**
- Dans l'onglet Affichage
- ✅ Dans l'onglet Mise en page > Flèche du groupe > En-tête/Pied de page
- ✅ Dans la fenêtre « Mise en page »
- Dans le menu Insertion > Logo

**Q7. Quelle est la fonction de la mise à l'échelle dans Excel ?** *(doute)*
- ✅ Ajuster un tableau pour qu'il tienne sur une seule page imprimée
- Ajouter des lignes de code VBA
- Étendre le tableau sur plusieurs feuilles
- Réduire automatiquement la taille du texte pour l'impression
- *Note : j'ai retenu seulement la 1re. La 4e (« réduit la taille du texte ») est un effet/avertissement, pas la fonction. À confirmer si tu veux aussi la cocher.*

**Q8. Que se passe-t-il si tu appliques un thème ?**
- ✅ Les polices et couleurs changent automatiquement
- ✅ Le style visuel de toutes les feuilles s'harmonise
- Les données sont protégées
- Seules les lignes sélectionnées sont affectées

Seuil de réussite : 6 bonnes réponses sur 8.

---

## Checklist (validation de ceinture) - 20 items

Reprise mot pour mot de l'ebook (p117-118), de « Je sais insérer ou supprimer une ligne/colonne » jusqu'à « Je sais imprimer un tableau lisible et bien structuré ».

---

## Reste à faire / à voir avec toi

- **Valider les 8 réponses du QCM** ci-dessus.
- Relire les leçons écran par écran si tu veux ajuster un texte ou un visuel.
- (Optionnel) Continuer avec le chapitre 4.
