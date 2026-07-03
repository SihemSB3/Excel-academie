// Leçons de fonctions narrées par le Shifu, une étape à la fois.
// La formule se CONSTRUIT morceau par morceau (barre de formule + cellule), puis « Entrée » → résultat.
// Étapes en **gras**, encarts "Bon à savoir" avec icône cerveau. Ton 100 % positif.
// Contenu repris de l'ebook (SOMME : ch.2 ; SI : ch.10).

// --- Exemple SOMME (produits / prix) ---
const S = {
  A1: { t: 'Produit', entete: true },
  B1: { t: 'Prix (€)', entete: true },
  A2: { t: 'Clavier' },
  B2: { t: '30' },
  A3: { t: 'Souris' },
  B3: { t: '20' },
  A4: { t: 'Écran' },
  B4: { t: '150' },
  A5: { t: 'Total', entete: true },
}
const colsS = ['A', 'B']
const rowsS = [1, 2, 3, 4, 5]
const tabS = (formule, resultat, refs) => {
  const cells = { ...S }
  if (refs) refs.forEach((id) => (cells[id] = { ...cells[id], ref: true }))
  if (resultat) cells.B5 = resultat
  else if (formule) cells.B5 = { t: formule }
  return { type: 'tableur', cols: colsS, rows: rowsS, cells, actif: 'B5', formule }
}

const SOMME = {
  id: 'fn-somme',
  titre: 'La fonction SOMME',
  exercices: [
    { titre: 'Exercice 27 · La somme automatique', url: 'https://drive.google.com/file/d/1-jhK6ibgg4FalgRiCDb2E1Z3LzT2G7Vf/view?usp=drivesdk' },
  ],
  narration: [
    { humeur: 'accueil', dit: 'SOMME additionne plusieurs cellules d\'un seul coup. On va la construire ensemble.' },
    { humeur: 'accueil', dit: 'Voici trois prix. On veut leur total sur la ligne « Total ». **Clique la cellule qui va recevoir le total.**', visuel: { type: 'cliquecible', support: 'tableur', consigne: 'Clique la cellule du total (à droite de « Total »)', cols: colsS, rows: rowsS, cells: { ...S }, cible: 'B5', explication: 'Oui : B5, à droite de « Total ». C\'est là qu\'on écrit la somme.' } },
    { humeur: 'pensif', dit: '**Étape 1 :** dans B5, toute formule commence par le signe =.', visuel: tabS('=') },
    { humeur: 'pensif', dit: '**Étape 2 :** on écrit SOMME et on ouvre une parenthèse.', visuel: tabS('=SOMME(') },
    { humeur: 'accueil', dit: '**Étape 3 :** on sélectionne la plage à additionner, de B2 à B4 (en bleu).', visuel: tabS('=SOMME(B2:B4', null, ['B2', 'B3', 'B4']) },
    { humeur: 'pensif', dit: '**Étape 4 :** on ferme la parenthèse. La formule complète est dans la case.', visuel: tabS('=SOMME(B2:B4)') },
    {
      humeur: 'accueil',
      dit: 'On appuie sur Entrée. Les trois prix sont 30, 20 et 150. **Que va afficher B5 ?**',
      visuel: { type: 'question', options: ['200', '150', '20030'], bonne: 0, explication: '30 + 20 + 150 = 200. SOMME additionne toute la plage B2:B4 d\'un coup.' },
    },
    { humeur: 'fier', dit: 'Et voilà, la case affiche 200.', visuel: tabS('=SOMME(B2:B4)', { t: '200', vert: true }) },
    {
      humeur: 'pensif',
      dit: 'Une astuce à retenir.',
      visuel: { type: 'encart', label: 'Astuce', texte: 'Encore plus rapide : sélectionne la colonne et clique sur le bouton **∑ Somme automatique**. Excel écrit la formule pour toi.' },
    },
    {
      humeur: 'accueil',
      dit: 'Essaie : dans l\'onglet **Accueil**, **clique le bouton Somme automatique.**',
      visuel: { type: 'cliquecible', support: 'ruban', consigne: 'Clique le bouton Somme automatique', actif: 'Accueil', groupeNom: 'Édition', groupes: [{ icone: '∑', label: 'Somme auto' }, { icone: '↓', label: 'Remplissage' }, { icone: '🧹', label: 'Effacer' }], cible: 'Somme auto', explication: 'Le bouton ∑ : Excel devine la plage à additionner et écrit le SOMME tout seul. Un vrai gain de temps.' },
    },
    { humeur: 'accueil', dit: 'Et pour des cellules qui ne se suivent pas, sépare-les par un point-virgule : =SOMME(B2;B4).' },
    {
      humeur: 'accueil',
      dit: 'À toi. Pour additionner toute la plage de A1 à A20, quelle formule est correcte ?',
      visuel: { type: 'question', options: ['=SOMME(A1:A20)', '=SOMME(A1;A20)'], bonne: 0, explication: 'Les deux points ( : ) couvrent toute la plage de A1 à A20. Le point-virgule, lui, sert pour des cellules séparées.' },
    },
    { humeur: 'fier', dit: 'Et voilà, tu sais construire un SOMME : =, le nom, la parenthèse, la plage, puis on ferme. Bravo ! 🎉' },
  ],
}

// --- Exemple SI (note / résultat) ---
const baseSI = { A1: { t: 'Note', entete: true }, B1: { t: 'Résultat', entete: true } }
const colsSI = ['A', 'B']
const rowsSI = [1, 2]
const fSI = '=SI(A2>10;"OK";"À refaire")'
const tabSI = (a2, formule, resultat) => {
  const cells = { ...baseSI, A2: a2 }
  if (resultat) cells.B2 = resultat
  else if (formule) cells.B2 = { t: formule }
  return { type: 'tableur', cols: colsSI, rows: rowsSI, cells, actif: 'B2', formule }
}

const SI = {
  id: 'fn-si',
  titre: 'La fonction SI',
  narration: [
    { humeur: 'accueil', dit: 'La fonction SI pose une question à Excel : selon la réponse, elle affiche une chose ou une autre.' },
    { humeur: 'accueil', dit: 'Notre but : afficher « OK » si la note (en A2) dépasse 10, sinon « À refaire ». On construit la formule pas à pas.', visuel: tabSI({ t: '12' }) },
    { humeur: 'accueil', dit: 'Le résultat doit apparaître à droite de la note. **Clique la cellule du résultat.**', visuel: { type: 'cliquecible', support: 'tableur', consigne: 'Clique la cellule Résultat de la note', cols: colsSI, rows: rowsSI, cells: { ...baseSI, A2: { t: '12' } }, cible: 'B2', explication: 'Oui, B2 : colonne « Résultat », en face de la note. C\'est là qu\'on écrit le SI.' } },
    { humeur: 'pensif', dit: '**Étape 1 :** on clique dans B2 et on tape =. Il s\'écrit dans la case et dans la barre de formule.', visuel: tabSI({ t: '12' }, '=') },
    { humeur: 'pensif', dit: '**Étape 2 :** on écrit SI et on ouvre une parenthèse.', visuel: tabSI({ t: '12' }, '=SI(') },
    { humeur: 'accueil', dit: '**Argument 1, la condition :** on veut tester la note. **Clique la cellule de la note**, celle qu\'on va comparer à 10.', visuel: { type: 'cliquecible', support: 'tableur', consigne: 'Clique la cellule de la note (celle qu\'on teste)', cols: colsSI, rows: rowsSI, cells: { ...baseSI, A2: { t: '12' }, B2: { t: '=SI(' } }, formule: '=SI(', cible: 'A2', explication: 'Exact : A2, la note. On écrit donc =SI(A2>10 : « si A2 dépasse 10… ».' } },
    { humeur: 'accueil', dit: 'La condition s\'écrit donc **A2>10** : « si la note est supérieure à 10 ».', visuel: tabSI({ t: '12', ref: true }, '=SI(A2>10') },
    { humeur: 'pensif', dit: 'Point-virgule ; puis **argument 2, le résultat si c\'est VRAI**, entre guillemets.', visuel: tabSI({ t: '12' }, '=SI(A2>10;"OK"') },
    { humeur: 'pensif', dit: 'Encore un point-virgule ; puis **argument 3, le résultat si c\'est FAUX**.', visuel: tabSI({ t: '12' }, '=SI(A2>10;"OK";"À refaire"') },
    { humeur: 'accueil', dit: 'On ferme la parenthèse. La formule complète est dans la case et dans la barre.', visuel: tabSI({ t: '12' }, fSI) },
    {
      humeur: 'accueil',
      dit: 'On appuie sur Entrée. La note est 12. **Que va afficher B2 ?**',
      visuel: { type: 'question', options: ['OK', 'À refaire'], bonne: 0, explication: '12 > 10 ? Oui, la condition est vraie : Excel affiche le 2ᵉ argument, « OK ».' },
    },
    { humeur: 'fier', dit: 'Exact : 12 > 10, donc la case affiche OK.', visuel: tabSI({ t: '12' }, fSI, { t: 'OK', vert: true }) },
    { humeur: 'pensif', dit: 'Et si la note avait été 7 ? 7 > 10 ? Non → la case affiche À refaire.', visuel: tabSI({ t: '7' }, fSI, { t: 'À refaire', rouge: true }) },
    {
      humeur: 'pensif',
      dit: 'Une astuce à garder en tête.',
      visuel: { type: 'encart', label: 'Astuce', texte: 'Le texte (comme **OK** ou **À refaire**) va toujours **entre guillemets**. C\'est comme ça qu\'Excel le reconnaît comme du texte.' },
    },
    {
      humeur: 'pensif',
      dit: 'Vérifions cette règle. **Vrai ou faux ?**',
      visuel: { type: 'vraifaux', affirmation: 'Dans un SI, le texte à afficher (OK, À refaire…) doit être entouré de guillemets.', bonne: true, explication: 'Vrai : sans les guillemets, Excel croit que « OK » est un nom de cellule ou de formule, et renvoie une erreur. Les guillemets disent « c\'est du texte ».' },
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Si la note en A2 est 5, qu\'affiche la case B2 ?',
      visuel: { type: 'question', options: ['"OK"', '"À refaire"'], bonne: 1, explication: '5 n\'est pas supérieur à 10 : la condition est fausse, donc Excel affiche « À refaire ».' },
    },
    { humeur: 'fier', dit: 'Tu as construit ta première formule SI, étape par étape. Bravo ! 🎉' },
  ],
}

// --- Exemple CALCULS (prix x quantité) ---
const baseC = {
  A1: { t: 'Prix (€)', entete: true },
  B1: { t: 'Quantité', entete: true },
  C1: { t: 'Total', entete: true },
  A2: { t: '10' },
  B2: { t: '3' },
}
const colsC = ['A', 'B', 'C']
const rowsC = [1, 2]
const tabC = (opts, formule, resultat) => {
  const cells = { ...baseC }
  if (opts.A2ref) cells.A2 = { ...cells.A2, ref: true }
  if (opts.B2ref) cells.B2 = { ...cells.B2, ref: true }
  if (resultat) cells.C2 = resultat
  else if (formule) cells.C2 = { t: formule }
  return { type: 'tableur', cols: colsC, rows: rowsC, cells, actif: 'C2', formule }
}
// Version cliquable de la table des calculs : l'élève désigne lui-même la bonne cellule.
const clicC = (consigne, cible, formule, explication) => ({
  type: 'cliquecible', support: 'tableur', consigne, cible, explication,
  cols: colsC, rows: rowsC, formule: formule || undefined,
  cells: { ...baseC, C2: { t: formule || '' } },
})

const CALCULS = {
  id: 'fn-calculs',
  titre: 'Faire des calculs',
  exercices: [
    { titre: 'Exercice 5 · Les calculs avec les opérateurs', url: 'https://drive.google.com/file/d/1OI37AtYGKyXyn8yLMxrtGoqx3qRh32ic/view?usp=drivesdk' },
  ],
  narration: [
    { humeur: 'accueil', dit: 'Excel, c\'est une super calculatrice : tu fais tes calculs directement dans les cellules. Regarde ce petit tableau, c\'est lui qu\'on va faire parler.', visuel: tabC({}) },
    { humeur: 'pensif', dit: 'Comme toute formule, un calcul commence toujours par le signe =.' },
    {
      humeur: 'accueil',
      dit: 'Voici les opérateurs de base.',
      visuel: { type: 'operateurs', items: [{ s: '+', l: 'additionner' }, { s: '-', l: 'soustraire' }, { s: '*', l: 'multiplier' }, { s: '/', l: 'diviser' }] },
    },
    {
      humeur: 'pensif',
      dit: 'Et deux autres, bien pratiques :',
      visuel: { type: 'operateurs', items: [{ s: '%', l: 'pourcentage (=50% donne 0,5)' }, { s: '^', l: 'puissance (=10^2 donne 100)' }] },
    },
    {
      humeur: 'pensif',
      dit: 'Un point à garder en tête.',
      visuel: { type: 'encart', label: 'Astuce', texte: 'Pas d\'**espaces** dans une formule : Excel a besoin que tout soit collé pour la lire correctement.' },
    },
    {
      humeur: 'accueil',
      dit: 'Une croyance à vérifier tout de suite. **Vrai ou faux ?**',
      visuel: { type: 'vraifaux', affirmation: 'On peut mettre des espaces autour des signes dans une formule, ex. = A2 * B2.', bonne: false, explication: 'Non : tout doit être collé, =A2*B2. Un espace au mauvais endroit et Excel ne sait plus lire la formule.' },
    },
    { humeur: 'accueil', dit: 'Passons à la pratique : un prix (A2) multiplié par une quantité (B2). On veut le total dans C2. Où va-t-on écrire la formule ? **Clique la cellule du total.**', visuel: clicC('Clique la cellule où doit apparaître le total', 'C2', '', 'Exactement, C2 : c\'est là qu\'on écrit la formule, à l\'intersection du produit et de la colonne Total.') },
    { humeur: 'pensif', dit: '**Étape 1 :** dans C2, on commence toujours par le signe =.', visuel: tabC({}, '=') },
    { humeur: 'accueil', dit: '**Étape 2 :** au lieu de retaper « 10 », on **clique la cellule du prix**. À toi : clique le prix.', visuel: clicC('Clique la cellule qui contient le prix', 'A2', '=', 'Bravo. En cliquant A2, Excel utilise son contenu : si le prix change plus tard, le total se recalcule tout seul.') },
    { humeur: 'accueil', dit: '**Étape 3 :** on tape l\'opérateur de multiplication, la touche *.', visuel: tabC({ A2ref: true }, '=A2*') },
    { humeur: 'accueil', dit: '**Étape 4 :** il manque la quantité. **Clique la bonne cellule.**', visuel: clicC('Clique la cellule qui contient la quantité', 'B2', '=A2*', 'Parfait : =A2*B2. La formule est complète, il ne reste qu\'à valider.') },
    {
      humeur: 'pensif',
      dit: 'On appuie sur **Entrée**. Avant de regarder : le prix est 10, la quantité 3. **Que va afficher C2 ?**',
      visuel: { type: 'question', options: ['30', '13', '103'], bonne: 0, explication: 'Excel calcule 10 × 3 = 30. (13 serait une addition, 103 une simple juxtaposition.)' },
    },
    { humeur: 'fier', dit: 'Et voilà : Excel affiche 30. Ta première formule tourne !', visuel: tabC({}, '=A2*B2', { t: '30', vert: true, num: true }) },
    {
      humeur: 'pensif',
      dit: 'Retiens bien cette règle.',
      visuel: { type: 'encart', label: 'Règle de calcul', texte: 'La **multiplication** et la **division** passent toujours avant l\'**addition** et la **soustraction**. Ce n\'est pas propre à Excel : c\'est la règle de priorité des opérations, comme en maths.' },
      plus: ['* et / ont la même priorité (calculés en premier). + et - aussi (calculés après). Si tu imbriques des calculs de même priorité, le calcul se fera de la gauche vers la droite. Les parenthèses permettent de contrôler l\'ordre du calcul.', 'Deux façons d\'écrire un calcul : avec des valeurs directes (=5*12) ou avec des cellules (=A1+B1, le contenu des cellules sera utilisé).'],
    },
    { humeur: 'accueil', dit: 'Exemple : dans =5+2*3, on calcule d\'abord 2×3 = 6, puis on ajoute 5 → 11. Avec des parenthèses, =(5+2)*3 fait d\'abord 5+2 = 7, puis ×3 → 21.', visuel: { type: 'formule', formule: '=5+2*3' } },
    {
      humeur: 'accueil',
      dit: 'À toi de trancher, en appliquant la règle. Combien fait =2+3*4 ?',
      visuel: { type: 'question', options: ['14', '20'], bonne: 0, explication: '× passe avant + : on fait d\'abord 3×4 = 12, puis on ajoute 2 = 14. (20 serait faux : ce serait (2+3)×4.)' },
    },
    { humeur: 'fier', dit: 'Tu sais faire tes calculs dans Excel ! Bravo ! 🎉' },
  ],
}

// --- Saisir des données ---
const baseSai2 = { A1: { t: 'Fruit', entete: true }, B1: { t: 'Stock', entete: true } }
const tabSai = (cells) => ({ type: 'tableur', cols: ['A', 'B'], rows: [1, 2, 3], cells: { ...baseSai2, ...cells } })

const SAISIE = {
  id: 'fn-saisie',
  titre: 'Saisir des données',
  exercices: [
    { titre: 'Exercice 1 · Saisie et modification de données', url: 'https://drive.google.com/file/d/1TUJmySZN9RH-IFm_XN3AfiyDUhYjgiBP/view?usp=drivesdk' },
    { titre: 'Exercice 3 · Saisie et modification de données', url: 'https://drive.google.com/file/d/1KQT1lJm2r8XSCeXW_190mpvLVPeiTsjr/view?usp=drivesdk' },
  ],
  narration: [
    { humeur: 'accueil', dit: 'Avant de calculer, il faut savoir remplir ses cellules. C\'est la base de tout tableau.' },
    { humeur: 'pensif', dit: '**Le geste :** clique sur une cellule, tape ton texte ou ton nombre, puis valide avec **Entrée**.', visuel: { type: 'saisiecell' } },
    { humeur: 'accueil', dit: 'Le texte se cale à gauche, les nombres à droite, automatiquement. Pas besoin d\'y penser.', visuel: tabSai({ A2: { t: 'Pomme' }, B2: { t: '120', num: true }, A3: { t: 'Poire' }, B3: { t: '85', num: true } }) },
    {
      humeur: 'accueil',
      dit: 'Vérifions que tu lis bien la grille. **Clique le stock des pommes.**',
      visuel: { type: 'cliquecible', support: 'tableur', consigne: 'Clique la cellule du stock des pommes', cols: ['A', 'B'], rows: [1, 2, 3], cells: { A1: { t: 'Fruit', entete: true }, B1: { t: 'Stock', entete: true }, A2: { t: 'Pomme' }, B2: { t: '120', num: true }, A3: { t: 'Poire' }, B3: { t: '85', num: true } }, cible: 'B2', explication: 'Oui : ligne « Pomme », colonne « Stock » = B2. Et remarque, c\'est un nombre, donc calé à droite.' },
    },
    {
      humeur: 'pensif',
      dit: 'Si une colonne est trop étroite, Excel affiche #####. À toi de l\'élargir !',
      visuel: { type: 'elargir' },
    },
    { humeur: 'accueil', dit: 'Et voilà, le nombre réapparaît. Aucune inquiétude, donc : ##### veut juste dire « élargis-moi ».' },
    { humeur: 'pensif', dit: 'Pour une date, écris-la avec des / ou des - (ex : 11/05/2025). Excel la reconnaît comme une vraie date.', visuel: { type: 'tableur', cols: ['A', 'B'], rows: [1, 2], cells: { A1: { t: 'Tâche', entete: true }, B1: { t: 'Date', entete: true }, A2: { t: 'Réunion' }, B2: { t: '11/05/2025', num: true } } } },
    {
      humeur: 'pensif',
      dit: 'Un piège classique. **Vrai ou faux ?**',
      visuel: { type: 'vraifaux', affirmation: 'Si tu écris « 11 mai 2025 » en toutes lettres, Excel le comprend comme une vraie date calculable.', bonne: false, explication: 'Non : écrit en toutes lettres, c\'est du texte. Pour une vraie date, utilise les / ou les - : 11/05/2025 ou 11-05-2025.' },
    },
    { humeur: 'accueil', dit: 'Tu peux changer son **affichage** (court, long, personnalisé) : clic droit sur la cellule > **Format de cellule** > Date.', visuel: { type: 'formatcellule', etapes: ['Clic droit sur la cellule', 'Format de cellule', 'Onglet Nombre > Date', 'Choisis le format qui te plaît'] }, plus: ['Tu peux toujours modifier le format d\'affichage (court, long, personnalisé) en faisant clic droit > Format de cellule > Date.', 'Pour qu\'Excel reconnaisse une date, il faut utiliser un format qu\'il comprend. Tu peux écrire ta date de plusieurs façons : avec des slashs (11/05/2025 ou 11/05) ou avec des tirets (11-05-2025 ou 11-05).'] },
    {
      humeur: 'pensif',
      dit: 'Une faute de frappe ? **Échap** (ou la croix ✕ de la barre de formule) annule ta saisie en cours. Et **Ctrl + Z** (sur **Mac** : **⌘ + Z**) annule après avoir validé.',
      visuel: { type: 'barreformule' },
      plus: ['Quand tu tapes du texte ou un nombre dans une cellule, cela remplace ce qui était déjà dedans (si elle n\'était pas vide).', 'Tu veux annuler ce que tu es en train d\'écrire ? Clique sur la croix dans la barre de formule, ou appuie sur la touche Échap. Si tu valides par erreur, tu peux toujours faire Ctrl + Z pour revenir en arrière.'],
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Une cellule affiche #####. Qu\'est-ce que ça veut dire ?',
      visuel: { type: 'question', options: ['La colonne est trop étroite', 'La formule est fausse'], bonne: 0, explication: '##### veut juste dire que la colonne est trop étroite pour le nombre. Élargis-la, et tout réapparaît.' },
    },
    { humeur: 'fier', dit: 'Tu sais remplir un tableau proprement. Bravo ! 🎉' },
  ],
}

// --- Recopie & séries ---
const REC = {
  A1: { t: 'Produit', entete: true },
  B1: { t: 'Prix', entete: true },
  C1: { t: 'Qté', entete: true },
  D1: { t: 'Total', entete: true },
  A2: { t: 'Clavier' },
  B2: { t: '30' },
  C2: { t: '2' },
  A3: { t: 'Souris' },
  B3: { t: '20' },
  C3: { t: '3' },
  A4: { t: 'Écran' },
  B4: { t: '150' },
  C4: { t: '1' },
}
const tabRec = (cells, formule, actif, legende, extra = {}) => ({ type: 'tableur', cols: ['A', 'B', 'C', 'D', 'E'], rows: [1, 2, 3, 4], cells: { ...REC, ...cells }, actif, formule, poignee: actif, legende, ...extra })

const RECOPIE = {
  id: 'fn-recopie',
  titre: 'Recopie des données & formules',
  exercices: [
    { titre: 'Exercice 6 · Recopie des données et des formules', url: 'https://drive.google.com/file/d/1F8xgMQ9lXx8kHiDayV7lNx_ykT1se3ew/view?usp=drivesdk' },
    { titre: 'Exercice 7 · Recopie des données et des formules', url: 'https://drive.google.com/file/d/1ESKhSMHzcT4-vz2w3EZNrWvetip41t6f/view?usp=drivesdk' },
  ],
  narration: [
    { humeur: 'accueil', dit: 'Excel peut recopier une donnée ou une formule tout seul, pour t\'éviter de tout retaper à la main.' },
    { humeur: 'pensif', dit: 'En bas à droite d\'une cellule, il y a une petite croix : la poignée de recopie. Tu cliques dessus et tu tires.', visuel: tabRec({}, null, 'A2', 'La petite croix (+) en bas à droite de la cellule sélectionnée, c\'est la poignée de recopie.'), plus: ['Place ta souris sur le petit carré en bas à droite de la cellule (la poignée de recopie). Clique, maintiens et tire la poignée vers les cellules où tu veux dupliquer le contenu.', 'Tu peux tirer vers le haut, le bas, la gauche ou la droite.'] },
    { humeur: 'accueil', dit: 'On va calculer le total de la ligne « Clavier » (prix × quantité). Dans quelle cellule écrire la formule ? **Clique-la.**', visuel: { type: 'cliquecible', support: 'tableur', consigne: 'Clique la cellule du total de la ligne Clavier', cols: ['A', 'B', 'C', 'D', 'E'], rows: [1, 2, 3, 4], cells: { ...REC }, cible: 'D2', explication: 'Oui : ligne « Clavier », colonne « Total » = D2. C\'est là qu\'on écrit =B2*C2.' } },
    { humeur: 'accueil', dit: 'Donc en D2, tu écris =B2*C2 pour le total de la première ligne.', visuel: tabRec({ D2: { t: '=B2*C2' } }, '=B2*C2', 'D2', 'Chaque cellule de la formule prend une couleur, comme dans Excel : B2 en bleu, C2 en orange.', { refsCouleur: { B2: 'bleu', C2: 'ambre' } }) },
    { humeur: 'pensif', dit: 'Tu tires la poignée vers le bas : Excel adapte la formule à chaque ligne. Regarde le détail : =B2*C2 devient =B3*C3, puis =B4*C4.', visuel: { type: 'recopieanim' } },
    {
      humeur: 'pensif',
      dit: 'Vérifions que le principe est clair. **Vrai ou faux ?**',
      visuel: { type: 'vraifaux', affirmation: 'Il faut réécrire la formule à la main dans chaque ligne du tableau.', bonne: false, explication: 'Non ! Tu l\'écris UNE seule fois, puis tu tires la poignée : Excel l\'adapte tout seul à chaque ligne. C\'est tout l\'intérêt de la recopie.' },
    },
    { humeur: 'fier', dit: 'Et voilà, chaque ligne se calcule. Tu n\'as écrit la formule qu\'une seule fois.', visuel: tabRec({ D2: { t: '60', vert: true }, D3: { t: '60', vert: true }, D4: { t: '150', vert: true } }), plus: ['Quand tu copies une cellule, Excel adapte automatiquement les références : si tu copies vers le bas, les lignes changent mais la colonne reste la même (=B2 devient =B3, puis =B4). Si tu copies vers la droite, les colonnes changent mais la ligne reste la même (=B2 devient =C2, puis =D2). C\'est ce qu\'on appelle une référence relative.', 'Astuce : si le mode de calcul d\'Excel est défini sur « manuel », les formules ne se recalculent pas automatiquement. Solution : Formules > Options de calcul > Automatique.'] },
    {
      humeur: 'accueil',
      dit: 'À toi. Tu écris =B2*C2 en D2, puis tu tires la poignée vers le bas. En D3, Excel met...',
      visuel: { type: 'question', options: ['=B3*C3', '=B2*C2'], bonne: 0, explication: 'Excel adapte la formule à chaque ligne : en D3, elle devient =B3*C3. C\'est la référence relative.' },
    },
    { humeur: 'fier', dit: 'Tu gagnes un temps fou avec la recopie. Bravo ! 🎉' },
  ],
}

// --- Références relatives & absolues ---
const REFb = { A1: { t: 'Prix HT', entete: true }, B1: { t: 'Prix TTC', entete: true }, C1: { t: 'Taux', entete: true }, A2: { t: '30' }, A3: { t: '20' }, C2: { t: '1,2' } }
const tabRef = (cells, formule, actif, legende, extra = {}) => ({ type: 'tableur', cols: ['A', 'B', 'C'], rows: [1, 2, 3], cells: { ...REFb, ...cells }, actif, formule, legende, ...extra })

const REFERENCES = {
  id: 'fn-references',
  titre: 'Références relatives & absolues',
  exercices: [
    { titre: 'Exercice 29 · Les références absolues', url: 'https://drive.google.com/file/d/1l5K36ffDWFQ4YcFC1GhLm2xxCbh8lA5O/view?usp=drivesdk' },
  ],
  narration: [
    { humeur: 'accueil', dit: 'Quand tu recopies une formule, Excel adapte tout seul les cellules. Très pratique ! Et parfois, tu veux qu\'une cellule reste fixe. Voyons les deux cas.', plus: ['Par défaut, Excel utilise des références dites « relatives » : quand tu copies une formule vers une autre cellule, les coordonnées de cellule s\'adaptent en fonction de la nouvelle position.', 'Une référence absolue, elle, reste fixe même si tu copies la formule ailleurs. C\'est utile quand tu veux toujours faire référence à la même cellule, comme un taux de TVA, un seuil, ou une valeur constante.'] },
    { humeur: 'accueil', dit: 'On veut le Prix TTC = Prix HT × le taux. Pour la première ligne, **clique la cellule du Prix TTC.**', visuel: { type: 'cliquecible', support: 'tableur', consigne: 'Clique la cellule du Prix TTC de la première ligne', cols: ['A', 'B', 'C'], rows: [1, 2, 3], cells: { ...REFb }, cible: 'B2', explication: 'Oui, B2 : colonne « Prix TTC », première ligne. C\'est là qu\'on écrit la formule.' } },
    { humeur: 'pensif', dit: 'Dans B2, on écrit =A2*C2 : le Prix HT (A2) multiplié par le taux (C2).', visuel: tabRef({ B2: { t: '=A2*C2' }, A2: { t: '30' }, C2: { t: '1,2' } }, '=A2*C2', 'B2', 'Prix HT (A2) en bleu, Taux (C2) en orange, comme dans Excel.', { refsCouleur: { A2: 'bleu', C2: 'ambre' } }) },
    {
      humeur: 'accueil',
      dit: 'Le Prix HT est 30, le taux 1,2. **Que va afficher B2 ?**',
      visuel: { type: 'question', options: ['36', '31,2', '3,6'], bonne: 0, explication: '30 × 1,2 = 36. (31,2 serait une addition, 3,6 une virgule mal placée.)' },
    },
    { humeur: 'fier', dit: 'En B2, ça marche : 30 × 1,2 = 36.', visuel: tabRef({ B2: { t: '36', vert: true } }, '=A2*C2', 'B2') },
    { humeur: 'pensif', dit: 'En recopiant vers le bas, Excel décale tout : B3 devient =A3*C3. Sauf que le taux, lui, est en C2 : celui-là, on veut le garder en place.', visuel: tabRef({ B2: { t: '36', vert: true }, B3: { t: '=A3*C3' }, C3: { t: '', ref: true } }, '=A3*C3', 'B3') },
    { humeur: 'accueil', dit: '**La solution :** figer le taux avec des $. On écrit =A2*$C$2. Les $ verrouillent la cellule C2.', visuel: tabRef({ B2: { t: '=A2*$C$2' }, A2: { t: '30' }, C2: { t: '1,2' } }, '=A2*$C$2', 'B2', 'Le taux $C$2 garde sa couleur : il restera figé en recopiant.', { refsCouleur: { A2: 'bleu', C2: 'ambre' } }) },
    {
      humeur: 'pensif',
      dit: 'Un raccourci bien utile.',
      visuel: { type: 'encart', label: 'Astuce clavier', texte: 'Pas besoin de taper les $ à la main : clique sur la cellule dans ta formule et appuie sur **F4**. Sur un PC portable, c\'est parfois **Fn + F4**. Et sur **Mac**, utilise **⌘ + T**.' },
      plus: ['Tu peux activer une référence absolue en appuyant sur F4 juste après avoir cliqué sur une cellule dans la formule. Si F4 ne fonctionne pas tout seul, essaie FN + F4.'],
    },
    { humeur: 'fier', dit: 'Maintenant, en recopiant, A2 s\'adapte (A3, A4...) mais $C$2 reste fixe. Tous les calculs tombent juste : 36, 24...', visuel: tabRef({ B2: { t: '36', vert: true }, B3: { t: '24', vert: true }, A3: { t: '20' } }, '=A3*$C$2', 'B3', 'A3 a changé de cellule (bleu), mais $C$2 (orange) est resté le même.', { refsCouleur: { A3: 'bleu', C2: 'ambre' } }) },
    {
      humeur: 'pensif',
      dit: 'Le point clé du chapitre. **Vrai ou faux ?**',
      visuel: { type: 'vraifaux', affirmation: 'Une référence figée avec des $ (comme $C$2) se décale quand on recopie la formule vers le bas.', bonne: false, explication: 'Non, justement : les $ l\'empêchent de bouger. $C$2 reste $C$2 partout. C\'est une référence relative (sans $) qui se décale.' },
    },
    {
      humeur: 'accueil',
      dit: 'Le $ peut figer la colonne, la ligne, ou les deux. Regarde ce que chacun garde fixe (en vert) :',
      visuel: { type: 'reffiger' },
      plus: ['$A$1 → Absolu (ligne et colonne figées). A$1 → ligne figée. $A1 → colonne figée. A1 → référence relative.'],
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Tu recopies une formule et tu veux que la cellule B1 reste fixe. Tu écris...',
      visuel: { type: 'question', options: ['$B$1', 'B1'], bonne: 0, explication: 'Les $ figent la cellule : $B$1 ne bougera pas, même en recopiant la formule ailleurs.' },
    },
    { humeur: 'fier', dit: 'Relative qui suit, absolue qui reste. Tu maîtrises les références ! Bravo ! 🎉' },
  ],
}

// --- Déplacer & copier des cellules ---
const baseDep = {
  A1: { t: 'Produit', entete: true },
  B1: { t: 'Prix (€)', entete: true },
  A2: { t: 'Clavier' },
  B2: { t: '30', num: true },
  A3: { t: 'Souris' },
  B3: { t: '20', num: true },
}
const tabDep = (cells, actif) => ({ type: 'tableur', cols: ['A', 'B'], rows: [1, 2, 3, 4], cells: { ...baseDep, ...cells }, actif })

const DEPLACER = {
  id: 'fn-deplacer',
  titre: 'Déplacer & copier des cellules',
  exercices: [
    { titre: 'Exercice 13 · Déplacer ou copier des cellules', url: 'https://drive.google.com/file/d/1kkB6js7svYzkQtPr16gbB3E4WM4riT1x/view?usp=drivesdk' },
    { titre: 'Exercice 15 · Déplacer ou copier des cellules', url: 'https://drive.google.com/file/d/1q9KdbsHFcTJ8mHQBI-IjAOAqmjv_ctXI/view?usp=drivesdk' },
  ],
  narration: [
    { humeur: 'accueil', dit: 'Réorganiser ton tableau, dupliquer des infos... dans Excel, tout peut se déplacer, à condition de connaître les bons gestes.' },
    {
      humeur: 'pensif',
      dit: 'Un repère bien utile : dans Excel, ton curseur **change de forme** selon ce que tu fais. Il y en a 3 à reconnaître.',
      visuel: { type: 'curseurs' },
    },
    { humeur: 'pensif', dit: 'Pour copier une cellule, tu as le choix entre trois méthodes. Prends celle que tu préfères.' },
    {
      humeur: 'accueil',
      dit: '**Méthode 1, le ruban :** sélectionne ta cellule, va dans l\'onglet **Accueil** et clique sur **Copier**. Puis clique la destination et **Coller**.',
      visuel: { type: 'ruban', actif: 'Accueil', groupeNom: 'Presse-papiers', groupes: [{ icone: '📋', label: 'Coller' }, { icone: '✂', label: 'Couper' }, { icone: '📄', label: 'Copier', actif: true }] },
      plus: ['Copier des cellules : 1. Sélectionne les cellules à copier. 2. Clique sur Accueil > Copier (📄). 3. Clique sur la cellule de destination. 4. Clique sur Coller.', 'Déplacer une cellule ou une plage : sélectionne-la, puis Accueil > Presse-papiers > Couper (✂). Clique sur la cellule de destination, puis Coller. (Ou clic droit > Couper, puis clic droit sur la cible > Insérer les cellules coupées.)'],
    },
    {
      humeur: 'accueil',
      dit: 'Essayons la méthode 1. Dans le ruban **Accueil**, **clique le bouton pour copier.**',
      visuel: { type: 'cliquecible', support: 'ruban', consigne: 'Clique le bouton Copier', actif: 'Accueil', groupeNom: 'Presse-papiers', groupes: [{ icone: '📋', label: 'Coller' }, { icone: '✂', label: 'Couper' }, { icone: '📄', label: 'Copier' }], cible: 'Copier', explication: 'Voilà, le bouton Copier (📄). Ensuite tu cliques la destination et tu fais Coller.' },
    },
    {
      humeur: 'accueil',
      dit: '**Méthode 2, le clic droit :** clic droit sur la cellule > **Copier**, puis clic droit sur la destination > **Coller**.',
      visuel: { type: 'menu', items: [{ icone: '✂', label: 'Couper' }, { icone: '📄', label: 'Copier', actif: true }, { icone: '📋', label: 'Coller', actif: true }, { label: 'Collage spécial…' }, '-', { label: 'Insérer…' }, { label: 'Supprimer…' }] },
    },
    {
      humeur: 'accueil',
      dit: 'Tu as copié, tu es sur la cellule de destination et tu fais clic droit. **Clique l\'entrée pour coller.**',
      visuel: { type: 'cliquecible', support: 'menu', consigne: 'Clique « Coller » dans le menu', items: [{ icone: '✂', label: 'Couper' }, { icone: '📄', label: 'Copier' }, { icone: '📋', label: 'Coller' }, { label: 'Collage spécial…' }, '-', { label: 'Insérer…' }, { label: 'Supprimer…' }], cible: 2, explication: 'Coller (📋) dépose ce que tu as copié. Le « Collage spécial » juste en dessous, on le verra bientôt : il colle au choix les valeurs, la mise en forme…' },
    },
    {
      humeur: 'accueil',
      dit: '**Méthode 3, les raccourcis clavier** (les plus rapides). Sur Mac, utilise ⌘ à la place de Ctrl.',
      visuel: { type: 'operateurs', items: [{ s: 'Ctrl + C', l: 'copier' }, { s: 'Ctrl + X', l: 'couper (pour déplacer)' }, { s: 'Ctrl + V', l: 'coller' }] },
    },
    {
      humeur: 'pensif',
      dit: 'Attention à ne pas confondre. **Vrai ou faux ?**',
      visuel: { type: 'vraifaux', affirmation: 'Pour DÉPLACER une cellule (la retirer d\'un endroit pour la mettre ailleurs), on utilise Ctrl + C.', bonne: false, explication: 'Non : Ctrl + C copie (l\'original reste). Pour déplacer, c\'est Ctrl + X (couper), qui retire l\'original. Puis Ctrl + V pour coller.' },
    },
    { humeur: 'accueil', dit: 'Exemple : tu copies la ligne « Clavier » et tu la colles plus bas. La copie apparaît, l\'original reste en place.', visuel: tabDep({ A2: { t: 'Clavier', ref: true }, B2: { t: '30', num: true, ref: true }, A4: { t: 'Clavier', vert: true }, B4: { t: '30', num: true, vert: true } }, 'A4') },
    { humeur: 'pensif', dit: 'Encore plus direct : le **glisser-déposer**. Sélectionne tes cellules, attrape le **bord** de la sélection (le curseur devient une flèche), et fais-les glisser où tu veux.', visuel: { type: 'glisser' }, plus: ['Glisser-déposer : 1. Clique sur le bord de la sélection (ta souris devient une flèche blanche). 2. Maintiens le clic, glisse la cellule où tu veux. 3. Relâche : Excel déplace les données.'] },
    {
      humeur: 'pensif',
      dit: 'Pour copier vers une **autre feuille** : clic droit sur l\'onglet en bas > **Déplacer ou copier**, et coche « Créer une copie » pour garder l\'original.',
      visuel: { type: 'onglets' },
      plus: ['Pour copier ou déplacer vers une autre feuille, utilise la barre d\'onglets en bas : clic droit sur l\'onglet > Déplacer ou copier. Coche « Créer une copie » si tu veux dupliquer sans toucher à l\'original.'],
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Quel raccourci copie une cellule ?',
      visuel: { type: 'question', options: ['Ctrl + C', 'Ctrl + V'], bonne: 0, explication: 'Ctrl + C copie, Ctrl + V colle, et Ctrl + X coupe pour déplacer.' },
    },
    { humeur: 'fier', dit: 'Tu déplaces et tu dupliques tes données sans effort. Bravo ! 🎉' },
  ],
}

// --- Le collage spécial ---
const baseCol = {
  A1: { t: 'Article', entete: true },
  B1: { t: 'PU (€)', entete: true },
  C1: { t: 'Qté', entete: true },
  D1: { t: 'Total', entete: true },
  A2: { t: 'Stylo' },
  B2: { t: '2', num: true },
  C2: { t: '5', num: true },
}
const tabCol = (cells, formule, actif) => ({ type: 'tableur', cols: ['A', 'B', 'C', 'D'], rows: [1, 2], cells: { ...baseCol, ...cells }, actif, formule })

const COLLAGE = {
  id: 'fn-collage',
  titre: 'Le collage spécial',
  exercices: [
    { titre: 'Exercice 16 · Collage spécial', url: 'https://drive.google.com/file/d/1CBaMieuqtAYGiPPsnRYEJ-N6n9oEUhB9/view?usp=drivesdk' },
  ],
  narration: [
    { humeur: 'accueil', dit: 'Le Ctrl + C / Ctrl + V, tu le connais déjà. Le **collage spécial**, c\'est la version précise : tu colles seulement ce que tu veux.' },
    {
      humeur: 'pensif',
      dit: 'Avec le collage spécial, tu peux coller au choix...',
      visuel: { type: 'parties', items: [{ label: 'Les valeurs seules (sans la formule derrière)' }, { label: 'La mise en forme seule (couleurs, police)' }, { label: 'Les formules' }, { label: 'Le tableau transposé (lignes ↔ colonnes)' }] },
      plus: ['Le collage spécial est une fonction d\'Excel qui te permet de : 1. Copier uniquement les valeurs, sans garder les formules. 2. Coller uniquement la mise en forme (polices, couleurs…). 3. Transposer un tableau (échanger lignes ↔ colonnes). 4. Faire des calculs directement au collage (ajouter, soustraire…).'],
    },
    {
      humeur: 'accueil',
      dit: 'Comment y accéder, étape par étape :',
      visuel: { type: 'collagespecial', etapes: ['Copie ta cellule (Ctrl + C ou clic droit > Copier)', 'Clic droit sur la cellule de destination', 'Clique sur Collage spécial…', 'Choisis ce que tu veux coller (valeurs, format, formules…)'] },
      plus: ['Méthode clic droit : 1. Clic droit sur la cellule que tu veux copier > Copier. 2. Clic droit sur la cellule de destination. 3. Clique sur Collage spécial… 4. Choisis ce que tu veux coller (valeurs, formats, formules…).', 'Méthode ruban : onglet Accueil > Coller > Collage spécial. Tu y trouveras plusieurs icônes (Formule, Mise en forme, 123 Valeurs…). Passe ta souris dessus pour voir un aperçu avant de cliquer.'],
    },
    {
      humeur: 'accueil',
      dit: 'Tu as copié, tu fais clic droit sur la destination. **Clique l\'entrée qui ouvre le choix de collage.**',
      visuel: { type: 'cliquecible', support: 'menu', consigne: 'Clique « Collage spécial… »', items: [{ icone: '✂', label: 'Couper' }, { icone: '📄', label: 'Copier' }, { icone: '📋', label: 'Coller' }, { label: 'Collage spécial…' }, '-', { label: 'Insérer…' }], cible: 3, explication: 'C\'est là que tu choisis : valeurs seules, mise en forme seule, transposer… au lieu de tout coller d\'un bloc.' },
    },
    { humeur: 'accueil', dit: 'Cas très utile : en D2 tu as un total calculé par une formule, =B2*C2, qui affiche 10.', visuel: tabCol({ D2: { t: '=B2*C2' }, B2: { t: '2', num: true, ref: true }, C2: { t: '5', num: true, ref: true } }, '=B2*C2', 'D2') },
    { humeur: 'pensif', dit: 'Avec **Collage spécial > Valeurs**, tu colles le résultat **10** tout seul, sans la formule. Pratique pour figer un résultat.', visuel: tabCol({ D2: { t: '10', num: true, vert: true } }, null, 'D2') },
    {
      humeur: 'pensif',
      dit: 'Vérifions que la nuance est claire. **Vrai ou faux ?**',
      visuel: { type: 'vraifaux', affirmation: 'Après un Collage spécial > Valeurs, la cellule contient encore la formule =B2*C2.', bonne: false, explication: 'Non : « Valeurs » colle seulement le résultat affiché (10). La formule disparaît. C\'est justement ce qu\'on veut pour figer un chiffre.' },
    },
    {
      humeur: 'accueil',
      dit: 'Autre option : **Transposer**. Une ligne se colle en colonne : les lignes et les colonnes s\'échangent.',
      visuel: { type: 'transposer' },
      plus: ['1. Copie le tableau. 2. Clique droit à l\'endroit où tu veux le coller. 3. Clique sur Collage spécial > Transposer. 4. Ton tableau s\'inverse automatiquement.'],
    },
    {
      humeur: 'pensif',
      dit: 'Une précision utile.',
      visuel: { type: 'encart', label: 'Bon à savoir', texte: 'Certaines options du collage spécial ne marchent **pas** après un Couper (Ctrl + X). Pour le collage spécial, fais plutôt **Copier (Ctrl + C)**.' },
      plus: ['Certaines options de collage spécial ne fonctionnent pas lorsque tu coupes un élément (Ctrl + X). Pour en profiter pleinement, copie (Ctrl + C) plutôt que couper.'],
    },
    {
      humeur: 'pensif',
      dit: 'Un dernier réflexe. **Vrai ou faux ?**',
      visuel: { type: 'vraifaux', affirmation: 'Le collage spécial fonctionne aussi bien après un Couper (Ctrl + X) qu\'après un Copier (Ctrl + C).', bonne: false, explication: 'Non : certaines options du collage spécial sont désactivées après un Couper. Pour en profiter, copie (Ctrl + C) plutôt que couper.' },
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Tu veux coller le résultat d\'une formule, sans la formule. Tu choisis...',
      visuel: { type: 'question', options: ['Collage spécial > Valeurs', 'Collage spécial > Formules'], bonne: 0, explication: 'Coller les Valeurs garde le résultat affiché et retire la formule derrière.' },
    },
    { humeur: 'fier', dit: 'Tu colles exactement ce que tu veux, ni plus ni moins. Bravo ! 🎉' },
  ],
}

// --- L'assistant fonction & les fonctions de base ---
const baseAss = {
  A1: { t: 'Élève', entete: true },
  B1: { t: 'Note', entete: true },
  A2: { t: 'Léa' },
  B2: { t: '14', num: true },
  A3: { t: 'Tom' },
  B3: { t: '16', num: true },
  A4: { t: 'Sam' },
  B4: { t: '12', num: true },
  A5: { t: 'Moyenne', entete: true },
}
const tabAss = (formule, resultat, refs) => {
  const cells = { ...baseAss }
  if (refs) refs.forEach((id) => (cells[id] = { ...cells[id], ref: true }))
  if (resultat) cells.B5 = resultat
  else if (formule) cells.B5 = { t: formule }
  return { type: 'tableur', cols: ['A', 'B'], rows: [1, 2, 3, 4, 5], cells, actif: 'B5', formule }
}

const ASSISTANT = {
  id: 'fn-assistant',
  titre: 'L\'assistant fonction & les fonctions de base',
  exercices: [
    { titre: 'Exercice 18 · L\'assistant fonction', url: 'https://drive.google.com/file/d/1gjZG8-JbugggNgei9agNRgHk4Ku2ywRE/view?usp=drivesdk' },
    { titre: 'Exercice 19 · Formule sans assistant fonction', url: 'https://drive.google.com/file/d/1eREpvf22vzKVNxCrcEV9xxM74HRy1tOc/view?usp=drivesdk' },
  ],
  narration: [
    { humeur: 'accueil', dit: 'Tu ne sais pas encore taper une formule tout(e) seul(e) ? L\'**assistant fonction** te guide, pas à pas.' },
    {
      humeur: 'pensif',
      dit: 'Cet outil t\'aide à...',
      visuel: { type: 'parties', items: [{ label: 'Choisir la bonne fonction' }, { label: 'Comprendre ses arguments' }, { label: 'Sélectionner facilement les bonnes cellules' }] },
      plus: ['Utiliser l\'assistant pas à pas : 1. Sélectionne la fonction souhaitée (Excel t\'explique à quoi elle sert en bas). 2. Clique sur OK. 3. Remplis les arguments en cliquant sur les cellules concernées. 4. Clique sur OK → Excel place la bonne formule dans la cellule.'],
    },
    { humeur: 'accueil', dit: 'On veut la **moyenne** des notes, sur la ligne « Moyenne ». Première chose : **clique la cellule qui recevra le résultat.**', visuel: { type: 'cliquecible', support: 'tableur', consigne: 'Clique la cellule de la Moyenne', cols: ['A', 'B'], rows: [1, 2, 3, 4, 5], cells: { ...baseAss }, cible: 'B5', explication: 'Oui, B5 : à droite de « Moyenne ». C\'est de cette cellule qu\'on ouvre l\'assistant.' } },
    {
      humeur: 'accueil',
      dit: '**Pour l\'ouvrir :** clique sur la cellule du résultat, puis va dans l\'onglet **Formules** (ou Accueil).',
      visuel: { type: 'etapes', items: ['Clique sur la cellule où tu veux le résultat', 'Onglet Formules (ou Accueil)', 'Clique sur Insérer une fonction (fx)', 'La boîte de dialogue s\'ouvre'] },
    },
    {
      humeur: 'accueil',
      dit: 'Le bouton **Insérer une fonction** (fx) se trouve tout à gauche de l\'onglet Formules. 👇',
      visuel: { type: 'ruban' },
    },
    {
      humeur: 'accueil',
      dit: 'À toi : dans l\'onglet **Formules**, **clique le bouton qui ouvre l\'assistant** (fx).',
      visuel: { type: 'cliquecible', support: 'ruban', consigne: 'Clique « Insérer une fonction » (fx)', actif: 'Formules', groupeNom: 'Bibliothèque de fonctions', groupes: [{ icone: 'fx', label: 'Insérer une fonction' }, { icone: 'Σ', label: 'Somme auto' }, { icone: '?', label: 'Logique' }], cible: 'Insérer une fonction', explication: 'Le fx vert : il ouvre la boîte « Insérer une fonction », où Excel te guide pas à pas.' },
    },
    {
      humeur: 'accueil',
      dit: 'Voici la boîte « Insérer une fonction ». Tu sélectionnes la fonction, ici **MOYENNE**. En bas, Excel explique à quoi elle sert.',
      visuel: { type: 'assistant', categorie: 'Les dernières utilisées', fonctions: ['SI', 'RECHERCHEX', 'RECHERCHEV', 'SOMME.SI.ENS', 'MOYENNE', 'SOMME', 'LIEN_HYPERTEXTE'], selection: 4, signature: 'MOYENNE(nombre1;nombre2;...)', description: 'Renvoie la moyenne (arithmétique) des arguments, qui peuvent être des nombres, des noms ou des plages.', focus: 'liste' },
    },
    {
      humeur: 'pensif',
      dit: 'Tu cliques sur **OK** : Excel ouvre les arguments. Tu cliques les cellules une par une (B2, B3, B4), et **Nombre4 reste vide** (tous les arguments ne sont pas obligatoires). En bas, l\'aperçu du résultat et la définition s\'affichent.',
      visuel: { type: 'arguments', fonction: 'MOYENNE', args: [{ label: 'Nombre1', ref: 'B2', valeur: '14' }, { label: 'Nombre2', ref: 'B3', valeur: '16' }, { label: 'Nombre3', ref: 'B4', valeur: '12' }, { label: 'Nombre4', ref: '', valeur: 'nombre' }], apercu: '14', description: 'Renvoie la moyenne (arithmétique) des arguments.', resultat: '14', encadre: true },
    },
    {
      humeur: 'accueil',
      dit: 'Les trois notes sont 14, 16 et 12. **Quelle moyenne va afficher Excel ?**',
      visuel: { type: 'question', options: ['14', '42', '16'], bonne: 0, explication: '(14 + 16 + 12) ÷ 3 = 42 ÷ 3 = 14. MOYENNE additionne puis divise par le nombre de valeurs.' },
    },
    { humeur: 'fier', dit: 'Un dernier OK, et Excel place =MOYENNE(B2;B3;B4) dans la cellule. Résultat : 14. 🎉', visuel: tabAss('=MOYENNE(B2;B3;B4)', { t: '14', num: true, vert: true }) },
    {
      humeur: 'pensif',
      dit: 'Tu te souviens du Nombre4 resté vide ? **Vrai ou faux ?**',
      visuel: { type: 'vraifaux', affirmation: 'Dans une fonction, il faut obligatoirement remplir TOUS les champs d\'arguments proposés.', bonne: false, explication: 'Non : beaucoup d\'arguments sont facultatifs. Pour MOYENNE, tu remplis autant de nombres que tu veux et tu laisses le reste vide.' },
    },
    {
      humeur: 'pensif',
      dit: 'Et si tu ne sais pas quelle fonction choisir ? Tape ta demande en **langage simple** dans la recherche : « compter les cellules non vides ». Excel te propose **NBVAL**.',
      visuel: { type: 'assistant', recherche: 'compter les cellules non vides', categorie: 'Recommandé', fonctions: ['NBVAL'], selection: 0, signature: 'NBVAL(valeur1;valeur2;...)', description: 'Compte le nombre de cellules non vides dans une plage.', focus: 'recherche' },
    },
    {
      humeur: 'accueil',
      dit: 'Quand tu es à l\'aise, tape directement dans la cellule : commence par =NB. Une **liste déroulante** s\'affiche, choisis avec les flèches ↑ ↓ puis Tab.',
      visuel: { type: 'autocomplete', saisie: '=NB', items: [{ nom: 'NB' }, { nom: 'NB.SI' }, { nom: 'NB.SI.ENS' }, { nom: 'NB.VIDE' }, { nom: 'NBCAR' }, { nom: 'NBVAL', desc: 'Compte le nombre de cellules non vides dans une plage.' }], selection: 5 },
      plus: ['Quand tu es un peu plus à l\'aise, tu peux écrire tes formules toi-même : clique dans une cellule, tape = puis commence à écrire le nom de la fonction (ex : =SOMME, =MOYENNE, =NBVAL…). Une liste déroulante s\'affiche : double-clique sur la fonction voulue, ou utilise les flèches ↑ ↓ + TAB.', 'Astuce : tape juste les premières lettres de la fonction (ex : =NB) pour afficher toutes les fonctions qui commencent par ces lettres. Excel t\'assiste même dans la rédaction en te montrant les arguments à remplir.'],
    },
    {
      humeur: 'accueil',
      dit: 'Voici les fonctions de base à garder en tête.',
      visuel: { type: 'parties', items: [{ label: 'SOMME : additionne des cellules' }, { label: 'MOYENNE : calcule la moyenne' }, { label: 'MIN / MAX : la plus petite / la plus grande valeur' }, { label: 'NBVAL : compte les cellules non vides' }, { label: 'NB : compte seulement les nombres' }] },
    },
    {
      humeur: 'pensif',
      dit: 'Deux fonctions à bien distinguer.',
      visuel: { type: 'encart', label: 'À retenir', texte: '**NBVAL** compte **toutes** les cellules non vides (nombres, textes, dates). **NB** compte **seulement** les nombres.' },
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Quelle fonction compte les cellules non vides, textes compris ?',
      visuel: { type: 'question', options: ['NBVAL', 'NB'], bonne: 0, explication: 'NBVAL compte tout ce qui n\'est pas vide. NB ne compte que les nombres.' },
    },
    { humeur: 'fier', dit: 'Tu sais te faire guider par l\'assistant et reconnaître les fonctions de base. Bravo ! 🎉' },
  ],
}

// --- Les séries automatiques ---
const tabSerie = (cells, actif, legende) => ({ type: 'tableur', cols: ['A', 'B', 'C', 'D', 'E'], rows: [1, 2], cells, actif, poignee: actif, legende })

const SERIES = {
  id: 'fn-series',
  titre: 'Les séries automatiques',
  exercices: [
    { titre: 'Exercice 8 · Création de série', url: 'https://drive.google.com/file/d/11ynTg8L2DuaPlp-vdYi9RKWptpctU4cS/view?usp=drivesdk' },
    { titre: 'Exercice 9 · Création de série', url: 'https://drive.google.com/file/d/1P0pTkfmihSKXD_MVp5SB4XXEzNtin1XG/view?usp=drivesdk' },
    { titre: 'Exercice 10 · Création de série', url: 'https://drive.google.com/file/d/1w2DDpfULU8QDFKhlx9iLjW3ini_cemG7/view?usp=drivesdk' },
  ],
  narration: [
    { humeur: 'accueil', dit: 'La poignée de recopie ne sert pas qu\'à copier : elle crée aussi des **suites automatiques**, les séries. Un vrai gain de temps.' },
    { humeur: 'accueil', dit: 'Écris « janvier » (ou « janv »), tire la poignée, et Excel complète tout seul.', visuel: tabSerie({ A1: { t: 'janvier' }, B1: { t: 'février', vert: true }, C1: { t: 'mars', vert: true }, D1: { t: 'avril', vert: true } }, 'A1', 'La poignée de recopie : la petite croix (+) en bas à droite de la cellule. Clique dessus et tire pour recopier.'), plus: ['Écris un mois dans une cellule (septembre ou sept). Tire la poignée de recopie vers la droite ou vers le bas. Excel complètera automatiquement avec octobre, nov, déc, etc.', 'Tu peux aussi écrire les mois en version abrégée (3 ou 4 lettres) : sept, nov...'] },
    { humeur: 'accueil', dit: 'Pareil pour les **jours** (lundi, mardi...) et les **trimestres**. Peu importe la version, entière ou abrégée (mer, sept).', visuel: tabSerie({ A1: { t: 'lundi' }, B1: { t: 'mardi', vert: true }, C1: { t: 'mercredi', vert: true }, D1: { t: 'jeudi', vert: true } }, 'A1'), plus: ['Écris un jour de la semaine dans une cellule (mercredi, mer). Tire la poignée de recopie. Excel continuera avec jeudi, vendredi, samedi, etc.', 'Peu importe si tu tapes le jour en entier ou en version courte, Excel reconnaît la suite.'] },
    {
      humeur: 'accueil',
      dit: 'Et pour une **date** ? Tu tapes 01/05/2025 et tu tires la poignée. **Que met Excel dans la case suivante ?**',
      visuel: { type: 'question', options: ['02/05/2025', '01/05/2025', '01/06/2025'], bonne: 0, explication: 'Par défaut, Excel ajoute un jour à chaque case : 02/05, 03/05… (On verra juste après comment changer ce pas.)' },
    },
    { humeur: 'pensif', dit: 'Voilà : tape 01/05/2025, tire, et Excel ajoute un jour à chaque cellule. (La cellule doit être au format date.)', visuel: tabSerie({ A1: { t: '01/05/2025' }, B1: { t: '02/05/2025', vert: true }, C1: { t: '03/05/2025', vert: true } }, 'A1') },
    {
      humeur: 'accueil',
      dit: 'Tu peux même choisir le pas des dates : par **jours ouvrés** (sans week-ends), par **mois** ou par **année**.',
      visuel: { type: 'seriesoptions', etapes: ['Tire la poignée pour créer la série', 'Une petite balise bleue apparaît en bas à droite', 'Clique dessus', 'Choisis : jours ouvrés, mois, années...'] },
      plus: [
        'Tu peux aussi utiliser la poignée de recopie pour générer une suite de dates : sans les week-ends (jours ouvrés) ? par mois (01/05 → 01/06 → 01/07) ? par année ?',
        'Tu peux le faire en choisissant l\'option dans le menu (ex : « incrémenter les mois »), ou bien en cliquant sur la petite balise bleue qui apparaît après la recopie.',
        'Pour que ça marche, il faut que ta cellule soit au format date !',
      ],
    },
    {
      humeur: 'pensif',
      dit: 'Et si tu veux recopier la **même** valeur, sans la transformer en suite ?',
      visuel: { type: 'encart', label: 'Astuce clavier', texte: 'Maintiens **Ctrl** (sur **Mac** : **⌘**) en tirant la poignée : Excel répète la valeur au lieu de créer une série. À l\'inverse, sur un seul chiffre, Ctrl crée la suite 1, 2, 3...' },
      plus: ['Par défaut, Excel crée une suite logique. Mais si tu veux recopier exactement la même date ou le même jour, sans l\'incrémenter : maintiens la touche CTRL enfoncée pendant que tu tires la poignée. Excel répétera la valeur au lieu de créer une série.'],
    },
    {
      humeur: 'pensif',
      dit: 'Vérifions cette astuce. **Vrai ou faux ?**',
      visuel: { type: 'vraifaux', affirmation: 'En maintenant Ctrl (⌘ sur Mac) pendant que tu tires « lundi », Excel répète « lundi » partout au lieu de continuer la série.', bonne: true, explication: 'Vrai : Ctrl inverse le comportement. Sur un jour ou une date, il répète la valeur. (Sur un simple chiffre, c\'est l\'inverse : Ctrl crée la suite 1, 2, 3.)' },
    },
    {
      humeur: 'accueil',
      dit: 'Pour une suite de nombres avec un écart : tape 1 puis 3, sélectionne les deux, et tire. **Que va mettre Excel dans la case suivante ?**',
      visuel: { type: 'question', options: ['5', '4', '33'], bonne: 0, explication: 'Excel repère l\'écart entre 1 et 3 (c\'est +2) et continue : 5, 7, 9…' },
    },
    { humeur: 'accueil', dit: 'Voilà : tu tapes 1 puis 3, tu sélectionnes les deux, tu tires, et Excel comprend « +2 ».', visuel: tabSerie({ A1: { t: '1', num: true }, B1: { t: '3', num: true }, C1: { t: '5', num: true, vert: true }, D1: { t: '7', num: true, vert: true }, E1: { t: '9', num: true, vert: true } }, 'B1'), plus: ['Tu veux 1, 2, 3, 4, 5… ? ou une série avec un écart (par exemple +2) ? Tape les deux premiers chiffres de ta suite dans deux cellules consécutives (ex : 1 puis 3), sélectionne les deux cellules, puis tire la poignée de recopie. Excel détecte la logique (ici, +2) et continue automatiquement : 5, 7, 9…', 'Pour une suite simple 1, 2, 3 : tape 1 dans une cellule, puis tire la poignée en maintenant la touche CTRL.'] },
    { humeur: 'accueil', dit: 'Encore plus fort : du **texte + un nombre**. Tape « Client 1 », tire, et Excel continue : Client 2, Client 3...', visuel: tabSerie({ A1: { t: 'Client 1' }, B1: { t: 'Client 2', vert: true }, C1: { t: 'Client 3', vert: true } }, 'A1'), plus: ['Tu peux créer tes propres listes automatiques (ex : Client 1, Client 2, Client 3…) en combinant texte + nombre dans une cellule. Tape « Client 1 », puis tire la poignée : Excel créera la suite tout seul !'] },
    {
      humeur: 'accueil',
      dit: 'À toi. Tu écris « janvier » et tu tires la poignée. Excel affiche...',
      visuel: { type: 'question', options: ['février, mars, avril...', 'janvier, janvier, janvier...'], bonne: 0, explication: 'Excel reconnaît les mois et continue la série tout seul : février, mars, avril...' },
    },
    { humeur: 'fier', dit: 'Les séries, c\'est un temps fou gagné sur tes plannings et tes listes. Bravo ! 🎉' },
  ],
}

// ======================================================================
// CHAPITRE 3 — Mise en forme & mise en page (ceinture orange)
// Chaque explication a son visuel (comme les captures de l'ebook).
// « En savoir plus » = texte de l'ebook (verbatim).
// ======================================================================
const U3 = (id) => `https://drive.google.com/file/d/${id}/view?usp=drivesdk`
const EX3 = {
  ex20: { titre: 'Exercice 20 · Gérer les lignes et les colonnes', url: U3('1ARgtsYquOrh70G3Wf8SdeGhdjeZUHC-_') },
  ex21: { titre: 'Exercice 21 · Gérer les lignes et les colonnes', url: U3('1T_PH2xE7JuVkrBO_NBkM8bW8AANQ_Hrb') },
  ex22: { titre: 'Exercice 22 · Mise en forme', url: U3('1ghp7gHiC7yJ1C5YgusteqC55oE0Aqk2o') },
  ex23: { titre: 'Exercice 23 · Mise en forme - Format de cellule', url: U3('1KUKIwvYcWv-Kx-ESf7zg466zMNvGkFPG') },
  ex24: { titre: 'Exercice 24 · Mise en forme - Pinceau magique', url: U3('1e2Tfq-ci6sYx_dWgXcVzMZ_uMutayzag') },
  ex25: { titre: 'Exercice 25 · Mise en forme - Style de cellule', url: U3('1GpwoFYdkdO6h5lTOzMiSYgBeJtAXhCKX') },
  ex26: { titre: 'Exercice 26 · Thème et impression', url: U3('1nhtbeHh0mc-SGOuc6L_RdEbhV9HcXhqT') },
}

// --- Leçon 1 : Gérer les lignes & les colonnes ---
const LIGNESCOLONNES = {
  id: 'fn-lignescolonnes',
  titre: 'Gérer les lignes & les colonnes',
  exercices: [EX3.ex20, EX3.ex21],
  narration: [
    { humeur: 'accueil', dit: 'Un tableau, ça vit : on ajoute une ligne oubliée, on enlève une colonne en trop, on ajuste la taille. On va voir tous les gestes, tranquillement.' },
    {
      humeur: 'pensif',
      dit: 'Pour **insérer** une ligne ou une colonne, tu as deux méthodes. Voici la première, avec le ruban.',
      visuel: {
        type: 'methode',
        titre: 'Méthode 1 : le ruban',
        blocs: [
          { etapes: ['Sélectionne une cellule', 'Va dans l\'onglet **Accueil**, groupe **Cellules**', 'Clique sur **Insérer** (l\'icône en forme de petit tableau avec une flèche)'] },
          { capture: { type: 'ruban', actif: 'Accueil', groupeNom: 'Cellules', groupes: [{ icone: '⊞', label: 'Insérer', actif: true }, { icone: '⊟', label: 'Supprimer' }, { icone: '▤', label: 'Format' }] } },
          { etapes: ['Choisis : **Insérer des lignes dans la feuille**, ou **Insérer des colonnes dans la feuille**'] },
          { capture: { type: 'menu', items: [{ label: 'Insérer des cellules…' }, { label: 'Insérer des lignes dans la feuille', actif: true }, { label: 'Insérer des colonnes dans la feuille', actif: true }, { label: 'Insérer une feuille' }] } },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: 'Repérons le bon bouton. Dans **Accueil > groupe Cellules**, **clique le bouton Insérer.**',
      visuel: { type: 'cliquecible', support: 'ruban', consigne: 'Clique le bouton Insérer', actif: 'Accueil', groupeNom: 'Cellules', groupes: [{ icone: '⊞', label: 'Insérer' }, { icone: '⊟', label: 'Supprimer' }, { icone: '▤', label: 'Format' }], cible: 'Insérer', explication: 'L\'icône ⊞ Insérer : elle ajoute lignes, colonnes ou cellules. Juste à côté, ⊟ Supprimer fait l\'inverse.' },
    },
    {
      humeur: 'pensif',
      dit: 'Et la deuxième, souvent la plus rapide, avec le clic droit.',
      visuel: {
        type: 'menu',
        titre: 'Méthode 2 : le clic droit',
        etapes: [
          'Clique droit sur l\'**en-tête** de la ligne (le chiffre) ou de la colonne (la lettre)',
          'Choisis **Insérer** dans le menu',
        ],
        items: [{ icone: '✂', label: 'Couper' }, { icone: '📄', label: 'Copier' }, { icone: '📋', label: 'Coller' }, '-', { icone: '⊞', label: 'Insérer', actif: true }, { icone: '⊟', label: 'Supprimer' }],
      },
    },
    {
      humeur: 'accueil',
      dit: 'Et pour **supprimer** ? C\'est exactement la même chose, mais tu cliques sur **Supprimer** au lieu d\'**Insérer** (ou clic droit sur l\'en-tête > Supprimer).',
      visuel: { type: 'ruban', actif: 'Accueil', groupeNom: 'Cellules', groupes: [{ icone: '⊞', label: 'Insérer' }, { icone: '⊟', label: 'Supprimer', actif: true }, { icone: '▤', label: 'Format' }] },
    },
    {
      humeur: 'pensif',
      dit: 'Une astuce pour aller plus vite :',
      visuel: { type: 'encart', label: 'Astuce', texte: 'Pour insérer ou supprimer **plusieurs** lignes ou colonnes d\'un coup, commence par en **sélectionner plusieurs** (clique-glisse sur les en-têtes), puis utilise une des deux méthodes.' },
    },
    {
      humeur: 'accueil',
      dit: 'Maintenant, **ajuster la largeur d\'une colonne à la main** : place ta souris sur le **bord droit** de l\'en-tête (le curseur devient une double flèche ↔), puis clique-glisse. À toi d\'essayer !',
      visuel: { type: 'elargir', labelA: 'Réunion', valeurEtroit: 'Compte-rendu mensuel', valeurLarge: 'Compte-rendu mensuel', largeurLarge: '150px', aligneDroite: false, okMsg: '✓ Colonne élargie : le texte s\'affiche en entier.', promptMsg: '👆 Clique sur la poignée verte (bord droit de la colonne) pour l\'élargir' },
      plus: [
        '**Personnaliser manuellement la taille**',
        '**Largeur de colonne :**',
        '1. Place ta souris sur la limite droite de l\'en-tête de colonne (ex : entre C et D).',
        '2. Clique-glisse vers la droite ou la gauche pour élargir ou réduire.',
        '**Hauteur de ligne :**',
        '1. Place ta souris sur la limite inférieure de l\'en-tête de ligne (ex : entre la ligne 5 et 6).',
        '2. Clique-glisse vers le haut ou le bas.',
      ],
    },
    {
      humeur: 'accueil',
      dit: '**Encore plus rapide :** double-clique toi-même sur le bord droit de l\'en-tête, et Excel ajuste la largeur au contenu le plus long. Essaie !',
      visuel: { type: 'doubleclic' },
    },
    {
      humeur: 'pensif',
      dit: 'Et pour une taille **précise** (ou identique sur plusieurs colonnes), il y a la commande Format.',
      visuel: {
        type: 'methode',
        titre: 'La commande Format',
        blocs: [
          { etapes: ['Sélectionne les colonnes (ou les lignes) à modifier', 'Va dans **Accueil > Cellules > Format**'] },
          { capture: { type: 'ruban', actif: 'Accueil', groupeNom: 'Cellules', groupes: [{ icone: '⊞', label: 'Insérer' }, { icone: '⊟', label: 'Supprimer' }, { icone: '▤', label: 'Format', actif: true }] } },
          { etapes: ['Choisis : **Largeur de colonne** (valeur exacte), ou **Ajuster la largeur de colonne** (automatique)'] },
          { capture: { type: 'menu', items: [{ label: 'Largeur de colonne…', actif: true }, { label: 'Ajuster la largeur de colonne', actif: true }, '-', { label: 'Hauteur de ligne…' }, { label: 'Ajuster la hauteur de ligne' }] } },
          { note: 'Sélectionne plusieurs en-têtes d\'un coup pour leur donner tous la même taille.' },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: 'À toi de jouer. Pour adapter **automatiquement** la largeur d\'une colonne à son contenu, le plus rapide c\'est...',
      visuel: { type: 'question', options: ['Double-cliquer sur le bord droit de l\'en-tête de colonne', 'Cliquer sur l\'onglet Insertion'], bonne: 0, explication: 'Le double-clic sur le bord droit de l\'en-tête ajuste la largeur au contenu, instantanément. (La commande Accueil > Cellules > Format > Ajuster la largeur fait pareil.)' },
    },
    { humeur: 'fier', dit: 'Tu sais structurer ta feuille : insérer, supprimer, ajuster. Premier pas de la ceinture orange. Bravo ! 🎉' },
  ],
}

// --- Leçon 2 : L'onglet Accueil & la boîte Format de cellule ---
const MISEENFORME = {
  id: 'fn-miseenforme',
  titre: 'L\'onglet Accueil & la boîte Format de cellule',
  exercices: [EX3.ex22, EX3.ex23],
  narration: [
    { humeur: 'accueil', dit: 'Rendre un tableau lisible et agréable, c\'est de la mise en forme. Et tout part d\'un seul endroit : l\'onglet Accueil.' },
    {
      humeur: 'pensif',
      dit: '**L\'onglet Accueil :** il regroupe tous les outils de mise en forme, sous forme d\'icônes. Quand tu **survoles** une option, Excel affiche un **aperçu instantané** du résultat, avant même de cliquer.',
      visuel: { type: 'ruban', actif: 'Accueil', groupeNom: 'Police', groupes: [{ icone: 'B', label: 'Gras' }, { icone: 'A', label: 'Couleur' }, { icone: '▦', label: 'Bordures', actif: true }, { icone: '🪣', label: 'Remplissage' }] },
    },
    {
      humeur: 'accueil',
      dit: 'Repérons un outil ensemble. Dans le groupe **Police**, **clique le bouton Bordures.**',
      visuel: { type: 'cliquecible', support: 'ruban', consigne: 'Clique le bouton Bordures', actif: 'Accueil', groupeNom: 'Police', groupes: [{ icone: 'B', label: 'Gras' }, { icone: 'A', label: 'Couleur' }, { icone: '▦', label: 'Bordures' }, { icone: '🪣', label: 'Remplissage' }], cible: 'Bordures', explication: 'C\'est l\'icône ▦ : elle ouvre les styles de bordures (toutes, contour, épaisses…).' },
    },
    {
      humeur: 'pensif',
      dit: 'Un réflexe bien pratique. **Vrai ou faux ?**',
      visuel: { type: 'vraifaux', affirmation: 'En passant simplement la souris au-dessus d\'une option de mise en forme (sans cliquer), Excel montre déjà un aperçu du résultat.', bonne: true, explication: 'Vrai : c\'est l\'aperçu instantané. Tu vois l\'effet AVANT de cliquer, ce qui évite les essais-erreurs.' },
    },
    {
      humeur: 'accueil',
      dit: 'Ce que tu peux formater depuis le ruban :',
      visuel: { type: 'parties', items: [{ label: 'La **police** : taille, couleur, gras, italique' }, { label: 'L\'**alignement** du texte dans la cellule' }, { label: 'Les **bordures** et la **couleur de fond**' }, { label: 'Le **format des nombres** (€, %, décimales)' }] },
    },
    {
      humeur: 'pensif',
      dit: '**Pour tout régler au même endroit**, ouvre la boîte de dialogue Format de cellule.',
      visuel: {
        type: 'methode',
        titre: 'Ouvrir la boîte Format de cellule',
        blocs: [
          { etapes: ['Sélectionne une cellule ou une plage', 'Onglet **Accueil** > clique sur le petit **lanceur** du groupe **Nombre** (la flèche ↘ en bas à droite du groupe)'] },
          { capture: { type: 'ruban', actif: 'Accueil', groupeNom: 'Nombre', lanceur: true, groupes: [{ icone: '€', label: 'Monétaire' }, { icone: '%', label: 'Pourcentage' }, { icone: '000', label: 'Milliers' }] } },
          { capture: { type: 'formatcellule', actif: 'Nombre' } },
          { note: 'La fenêtre s\'ouvre avec ses 6 onglets, un par famille de réglages.' },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'À quoi sert chacun des **6 onglets** :',
      visuel: { type: 'parties', items: [{ label: '**Nombre** : choisir un format (date, heure, pourcentage, monétaire...)' }, { label: '**Alignement** : centrer, justifier, orienter, retour à la ligne' }, { label: '**Police** : taille, couleur, police de caractères' }, { label: '**Bordure** : cadres autour ou à l\'intérieur des cellules' }, { label: '**Remplissage** : couleur d\'arrière-plan' }, { label: '**Protection** : empêcher la modification de certaines cellules' }] },
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Que peux-tu régler dans la boîte Format de cellule ?',
      visuel: { type: 'question', options: ['La couleur, les bordures et le format des nombres', 'La position de la cellule sur la feuille'], bonne: 0, explication: 'La boîte Format de cellule règle le format des nombres, la police, l\'alignement, les bordures, le remplissage. Pas la position de la cellule.' },
    },
    { humeur: 'fier', dit: 'Tu sais où trouver chaque outil de mise en forme. Le QG, c\'est l\'onglet Accueil. Bravo ! 🎉' },
  ],
}

// --- Leçon 3 : Couleurs, bordures & texte ---
const COULEURS = {
  id: 'fn-couleurs',
  titre: 'Couleurs, bordures & texte',
  exercices: [EX3.ex22],
  narration: [
    { humeur: 'accueil', dit: 'Les couleurs et les bordures rendent ton tableau plus clair et agréable à lire. On va les poser proprement.' },
    {
      humeur: 'pensif',
      dit: 'Pour **encadrer ton tableau de bordures**, la méthode rapide passe par le ruban.',
      visuel: {
        type: 'methode',
        titre: 'Méthode rapide',
        blocs: [
          { etapes: ['Sélectionne ta plage de cellules', 'Clique sur l\'icône **Bordures** dans **Accueil > groupe Police**'] },
          { capture: { type: 'ruban', actif: 'Accueil', groupeNom: 'Police', groupes: [{ icone: 'B', label: 'Gras' }, { icone: 'A', label: 'Couleur' }, { icone: '▦', label: 'Bordures', actif: true }, { icone: '🪣', label: 'Remplissage' }] } },
          { etapes: ['Choisis un style (ex : **Toutes les bordures**)'] },
          { capture: { type: 'borduresfond', menu: true } },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: 'À toi de trouver le bon outil. Dans le groupe **Police**, **clique le bouton des bordures.**',
      visuel: { type: 'cliquecible', support: 'ruban', consigne: 'Clique le bouton Bordures', actif: 'Accueil', groupeNom: 'Police', groupes: [{ icone: 'B', label: 'Gras' }, { icone: 'A', label: 'Couleur' }, { icone: '▦', label: 'Bordures' }, { icone: '🪣', label: 'Remplissage' }], cible: 'Bordures', explication: 'L\'icône ▦ : un clic sur la petite flèche à côté déroule tous les styles de traits.' },
    },
    {
      humeur: 'pensif',
      dit: 'Pour des bordures **sur-mesure**, passe par la boîte Format de cellule.',
      visuel: {
        type: 'methode',
        titre: 'Méthode avancée (personnalisée)',
        blocs: [
          { etapes: ['Clic droit > **Format de cellule**', 'Va sur l\'onglet **Bordure**', 'Choisis le **style** du trait, la **couleur**, et les **côtés** à appliquer (haut, bas, intérieur...)'] },
          { capture: { type: 'formatcellule', actif: 'Bordure' } },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: '**Modifier la couleur de fond** d\'une cellule, c\'est le pot de peinture.',
      visuel: {
        type: 'methode',
        titre: 'Modifier la couleur de fond',
        blocs: [
          { etapes: ['Sélectionne tes cellules', 'Clique sur le bouton **Remplissage** (le pot de peinture) dans **Accueil > groupe Police**', 'Choisis une couleur'] },
          { capture: { type: 'ruban', actif: 'Accueil', groupeNom: 'Police', groupes: [{ icone: 'B', label: 'Gras' }, { icone: 'A', label: 'Couleur' }, { icone: '▦', label: 'Bordures' }, { icone: '🪣', label: 'Remplissage', actif: true }] } },
          { capture: { type: 'borduresfond', avantSelection: true, apres: 'fond' } },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: 'Le pot de peinture, c\'est pour la couleur de fond. **Clique-le dans le ruban.**',
      visuel: { type: 'cliquecible', support: 'ruban', consigne: 'Clique le bouton Remplissage (le pot de peinture)', actif: 'Accueil', groupeNom: 'Police', groupes: [{ icone: 'B', label: 'Gras' }, { icone: 'A', label: 'Couleur' }, { icone: '▦', label: 'Bordures' }, { icone: '🪣', label: 'Remplissage' }], cible: 'Remplissage', explication: 'Le pot 🪣 : il colore le FOND de la cellule. À ne pas confondre avec le A coloré, qui colore le texte.' },
    },
    {
      humeur: 'accueil',
      dit: '**Modifier la couleur du texte** met un mot en valeur.',
      visuel: {
        type: 'methode',
        titre: 'Modifier la couleur du texte',
        blocs: [
          { etapes: ['Sélectionne la cellule ou le texte', 'Clique sur l\'icône **Couleur de police** (le A coloré) dans **Accueil > groupe Police**', 'Choisis la couleur'] },
          { capture: { type: 'ruban', actif: 'Accueil', groupeNom: 'Police', groupes: [{ icone: 'B', label: 'Gras' }, { icone: 'A', label: 'Couleur', actif: true }, { icone: '▦', label: 'Bordures' }, { icone: '🪣', label: 'Remplissage' }] } },
          { capture: { type: 'tableur', cols: ['A', 'B'], rows: [1, 2], cells: { A1: { t: 'Produit', entete: true }, B1: { t: 'État', entete: true }, A2: { t: 'Clavier' }, B2: { t: 'Soldes' } }, refsCouleur: { B2: 'violet' }, legende: 'La couleur de police met un mot en valeur (ici « Soldes »).' } },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Ne confondons pas les deux boutons. **Vrai ou faux ?**',
      visuel: { type: 'vraifaux', affirmation: 'Le bouton « A » coloré change la couleur du FOND de la cellule.', bonne: false, explication: 'Non : le « A » coloré change la couleur du TEXTE. C\'est le pot de peinture 🪣 qui change le fond.' },
    },
    {
      humeur: 'pensif',
      dit: 'Attention, le piège du « trop » :',
      visuel: { type: 'encart', label: 'Erreurs à éviter', liste: ['Trop de couleurs vives diminue la lisibilité.', 'Pas de contraste entre le fond et le texte rend la lecture difficile.', 'Trop de styles de bordures donne un effet fouillis.'] },
    },
    {
      humeur: 'accueil',
      dit: 'Et une astuce qui fait gagner du temps :',
      visuel: { type: 'encart', label: 'Astuce', texte: 'Tu veux appliquer le même style à plusieurs cellules **non voisines** ? Sélectionne la première, maintiens **Ctrl** (sur **Mac** : **⌘**), et clique sur les autres avant de formater.' },
      plus: ['Utilise une couleur claire et douce pour l\'arrière-plan, afin de garder une bonne lisibilité.', 'Tu peux créer un tableau visuel sans insérer de tableau : les bordures suffisent !', 'Tu veux appliquer le même style à plusieurs cellules non voisines ? Sélectionne la première, maintiens Ctrl, et clique sur les autres avant de formater.'],
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Pour formater d\'un coup plusieurs cellules qui ne se touchent pas, tu...',
      visuel: { type: 'question', options: ['Maintiens Ctrl (⌘ sur Mac) en cliquant chaque cellule', 'Tu es obligé(e) de les faire une par une'], bonne: 0, explication: 'En maintenant Ctrl (⌘ sur Mac), tu sélectionnes plusieurs cellules non voisines, puis tu les formates toutes ensemble.' },
    },
    { humeur: 'fier', dit: 'Bordures, fond, couleur de texte : ton tableau respire et se lit d\'un coup d\'œil. Bravo ! 🎉' },
  ],
}

// --- Leçon 4 : Formater les nombres ---
const NOMBRES = {
  id: 'fn-nombres',
  titre: 'Formater les nombres',
  exercices: [EX3.ex23],
  narration: [
    { humeur: 'accueil', dit: 'Un nombre bien formaté se comprend tout de suite : 1 234,50 € se lit mieux que 1234,5. On va choisir le bon format.' },
    {
      humeur: 'pensif',
      dit: '**Méthode complète :** la boîte Format de cellule donne accès à tous les formats.',
      visuel: {
        type: 'methode',
        titre: 'La boîte Format de cellule',
        blocs: [
          { etapes: ['Sélectionne tes cellules de nombres', 'Onglet **Accueil** > clique sur le petit **lanceur** du groupe **Nombre** (la flèche ↘ en bas à droite du groupe)'] },
          { capture: { type: 'ruban', actif: 'Accueil', groupeNom: 'Nombre', lanceur: true, groupes: [{ icone: '€', label: 'Monétaire' }, { icone: '%', label: 'Pourcentage' }, { icone: '000', label: 'Milliers' }] } },
          { etapes: ['Choisis un format dans la liste'] },
          { capture: { type: 'formatcellule', actif: 'Nombre', categorieActive: 'Monétaire', categories: ['Standard', 'Nombre', 'Monétaire', 'Comptabilité', 'Pourcentage', 'Scientifique', 'Personnalisé'], titreDroite: 'Aperçu :', types: ['1 234,50 €', '1 234,50 $', '1 234,50'] } },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: '**Plus rapide :** des boutons du ruban changent le format en un clic.',
      visuel: {
        type: 'methode',
        titre: 'Les raccourcis du ruban',
        blocs: [
          { etapes: ['Sélectionne tes cellules de nombres', 'Va dans **Accueil > groupe Nombre**', 'Clique sur le bouton du format voulu'] },
          { capture: { type: 'ruban', actif: 'Accueil', groupeNom: 'Nombre', groupes: [{ icone: '€', label: 'Monétaire' }, { icone: '%', label: 'Pourcentage' }, { icone: '000', label: 'Séparateur' }, { icone: ',0', label: 'Décimale' }] } },
          { capture: { type: 'formatnombre' } },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Tu veux afficher tes valeurs en **pourcentage**. **Clique le bon bouton du ruban.**',
      visuel: { type: 'cliquecible', support: 'ruban', consigne: 'Clique le bouton Pourcentage', actif: 'Accueil', groupeNom: 'Nombre', groupes: [{ icone: '€', label: 'Monétaire' }, { icone: '%', label: 'Pourcentage' }, { icone: '000', label: 'Séparateur' }, { icone: ',0', label: 'Décimale' }], cible: 'Pourcentage', explication: 'Le bouton % : il transforme 0,45 en 45 %. Un clic, et toute la sélection passe au format pourcentage.' },
    },
    {
      humeur: 'accueil',
      dit: 'À quoi ça sert, dans la vraie vie :',
      visuel: { type: 'parties', items: [{ label: 'Afficher des prix ou des totaux proprement' }, { label: 'Exprimer une tendance ou une part en %' }, { label: 'Préparer un document pour l\'impression ou un client' }, { label: 'Comparer des valeurs alignées, avec cohérence' }] },
    },
    {
      humeur: 'pensif',
      dit: 'Les pièges classiques du format des nombres :',
      visuel: { type: 'encart', label: 'Erreurs fréquentes', liste: ['Oublier le format « % » : un 0,45 sera mal interprété (0,45 au lieu de 45 %).', 'Mélanger les formats dans une même colonne (du nombre et du texte).', 'Mettre trop de décimales : une surcharge visuelle inutile.'] },
    },
    {
      humeur: 'pensif',
      dit: 'À toi de jouer : un prix a été saisi **sans le bon format**. **Clique-le !**',
      visuel: {
        type: 'trouvererreur',
        consigne: 'Trouve le prix qui n\'est pas au format monétaire',
        entetes: ['Produit', 'Prix'],
        lignes: [['Clavier', '45,00 €'], ['Écran', '1500'], ['Souris', '12,50 €']],
        erreur: { ligne: 1, col: 1 },
        indice: 'Compare l\'affichage des trois prix : lequel n\'a ni séparateur de milliers ni € ?',
        explication: '« 1500 » est un nombre brut : applique le format Monétaire (Accueil > groupe Nombre) pour obtenir « 1 500,00 € », lisible et cohérent avec le reste de la colonne.',
      },
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Tu as 0,75 dans une cellule et tu veux afficher 75 %. Tu appliques le format...',
      visuel: { type: 'question', options: ['Pourcentage', 'Monétaire'], bonne: 0, explication: 'Le format Pourcentage transforme 0,75 en 75 %. Le format Monétaire, lui, ajoute le symbole € (ou $).' },
    },
    { humeur: 'fier', dit: 'Euros, pourcentages, décimales : tes chiffres parlent enfin clairement. Bravo ! 🎉' },
  ],
}

// --- Leçon 5 : Le pinceau & les styles de cellule ---
const PINCEAUSTYLES = {
  id: 'fn-pinceaustyles',
  titre: 'Le pinceau & les styles de cellule',
  exercices: [EX3.ex24, EX3.ex25],
  narration: [
    { humeur: 'accueil', dit: 'Tu as passé du temps à formater une cellule (police, couleur, bordure...) et tu veux le même style ailleurs, sans tout refaire ? Deux outils magiques pour ça.' },
    {
      humeur: 'pensif',
      dit: 'Le **pinceau** (Reproduire la mise en forme) copie le style d\'une cellule sur une autre.',
      visuel: {
        type: 'methode',
        titre: 'Le pinceau (Reproduire la mise en forme)',
        blocs: [
          { etapes: ['Clique sur la cellule **modèle** (celle qui a le style à copier)', 'Clique sur l\'icône **Pinceau** dans **Accueil > groupe Presse-papiers**', 'Clique sur la cellule à repeindre', 'Pour l\'éteindre : re-clique sur l\'icône, ou appuie sur **Échap**'] },
          { capture: { type: 'ruban', actif: 'Accueil', groupeNom: 'Presse-papiers', groupes: [{ icone: '📋', label: 'Coller' }, { icone: '✂', label: 'Couper' }, { icone: '🖌️', label: 'Pinceau', actif: true }] } },
          { capture: { type: 'pinceau' } },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: 'Trouve l\'outil. Dans **Accueil > groupe Presse-papiers**, **clique le pinceau.**',
      visuel: { type: 'cliquecible', support: 'ruban', consigne: 'Clique le bouton Pinceau (Reproduire la mise en forme)', actif: 'Accueil', groupeNom: 'Presse-papiers', groupes: [{ icone: '📋', label: 'Coller' }, { icone: '✂', label: 'Couper' }, { icone: '🖌️', label: 'Pinceau' }], cible: 'Pinceau', explication: 'Le pinceau 🖌️ : il copie le STYLE d\'une cellule (couleur, police, bordure) pour le repeindre ailleurs, sans toucher au contenu.' },
    },
    {
      humeur: 'pensif',
      dit: 'Un détail bien pratique avec le pinceau :',
      visuel: { type: 'encart', label: 'Bon à savoir', liste: ['Tu cliques sur le pinceau puis **fais glisser** sur plusieurs cellules → la mise en forme s\'applique à **toute la plage**.', 'Tu cliques **une seule fois** → elle s\'applique à **une seule** cellule.'] },
    },
    {
      humeur: 'pensif',
      dit: 'Vérifions ce détail. **Vrai ou faux ?**',
      visuel: { type: 'vraifaux', affirmation: 'Le pinceau copie aussi le CONTENU (le texte, les chiffres) de la cellule modèle.', bonne: false, explication: 'Non : le pinceau ne copie que la MISE EN FORME (couleur, police, bordure). Le contenu de la cellule repeinte ne change pas.' },
    },
    {
      humeur: 'accueil',
      dit: '**Les styles de cellule** regroupent police, taille, couleur, alignement et bordure en une mise en forme prête à l\'emploi.',
      visuel: {
        type: 'methode',
        titre: 'Appliquer un style de cellule',
        blocs: [
          { etapes: ['Sélectionne la ou les cellules à formater', 'Va dans **Accueil > groupe Style > Styles de cellule**', 'Survole les styles pour voir un aperçu', 'Clique sur le style souhaité'] },
          { capture: { type: 'ruban', actif: 'Accueil', groupeNom: 'Style', groupes: [{ icone: '🎨', label: 'Styles de cellule', actif: true }, { icone: '▦', label: 'Sous forme de tableau' }] } },
          { capture: { type: 'styles' } },
          { capture: { type: 'tableur', cols: ['A', 'B', 'C'], rows: [1, 2, 3, 4], cells: { A1: { t: 'Produit', entete: true }, B1: { t: 'Prix', entete: true }, C1: { t: 'Qté', entete: true }, A2: { t: 'Clavier' }, B2: { t: '30 €' }, C2: { t: '2' }, A3: { t: 'Souris' }, B3: { t: '20 €' }, C3: { t: '3' }, A4: { t: 'Total', vert: true }, B4: { t: '80 €', vert: true }, C4: { t: '5', vert: true } }, legende: 'Le résultat : un tableau lisible, ici avec un style sur l\'en-tête et la ligne « Total ».' } },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: 'Pourquoi utiliser les styles :',
      visuel: { type: 'parties', items: [{ label: 'Gagner du temps avec une mise en forme homogène, sans la choisir à la main' }, { label: 'Structurer visuellement les tableaux (titres, totaux, alertes)' }] },
    },
    {
      humeur: 'pensif',
      dit: '**Créer ton propre style** est pratique pour tes devis ou tes factures.',
      visuel: {
        type: 'methode',
        titre: 'Créer ton propre style',
        blocs: [
          { etapes: ['Va dans l\'onglet **Accueil**, groupe **Style**, et clique sur **Styles de cellule**'] },
          { capture: { type: 'ruban', actif: 'Accueil', groupeNom: 'Style', groupes: [{ icone: '🎨', label: 'Styles de cellule', actif: true }, { icone: '▦', label: 'Sous forme de tableau' }] } },
          { etapes: ['Tout en bas du menu, clique sur **Nouveau style de cellule**'] },
          { capture: { type: 'menu', items: [{ label: 'Titre' }, { label: 'Total' }, { label: 'Accentuation' }, '-', { label: 'Nouveau style de cellule…', actif: true }] } },
          { etapes: ['**Nomme** ton style (ex. « Mon style devis »)'] },
          { capture: { type: 'stylenom' } },
          { etapes: ['Clique sur **Format** pour définir : police, bordures, couleur de fond, alignement'] },
          { capture: { type: 'formatcellule' } },
          { etapes: ['Valide une première fois, puis **OK**'] },
          { note: 'Tes styles personnalisés sont mémorisés dans le fichier en cours. Pour les réutiliser ailleurs, enregistre ton document comme modèle Excel (.xltx).' },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: 'À toi. L\'outil « Reproduire la mise en forme » (le pinceau) sert à...',
      visuel: { type: 'question', options: ['Copier le style d\'une cellule vers d\'autres', 'Copier les valeurs d\'une cellule'], bonne: 0, explication: 'Le pinceau copie la mise en forme (police, couleur, bordure...) d\'une cellule vers d\'autres. Il ne touche pas aux valeurs.' },
    },
    { humeur: 'fier', dit: 'Pinceau et styles : tu formates vite, et toujours de la même façon. Bravo ! 🎉' },
  ],
}

// --- Leçon 6 : Mise en page (thèmes, marges, impression) ---
const MISEENPAGE = {
  id: 'fn-miseenpage',
  titre: 'Mise en page : thèmes, marges & zone d\'impression',
  exercices: [EX3.ex26],
  narration: [
    { humeur: 'accueil', dit: 'Avant d\'imprimer, on prépare la page pour que tout soit propre, lisible et bien découpé. C\'est l\'onglet Mise en page.' },
    {
      humeur: 'pensif',
      dit: 'Un **thème** harmonise d\'un coup les couleurs et les polices de tout le classeur.',
      visuel: {
        type: 'methode',
        titre: 'Appliquer un thème',
        blocs: [
          { etapes: ['Va dans **Mise en page > groupe Thèmes**'] },
          { capture: { type: 'ruban', actif: 'Mise en page', groupeNom: 'Thèmes', groupes: [{ icone: '🎨', label: 'Thèmes', actif: true }, { icone: 'A', label: 'Polices' }, { icone: '🎨', label: 'Couleurs' }] } },
          { etapes: ['Survole les thèmes proposés pour prévisualiser, puis clique pour appliquer'] },
          { capture: { type: 'themes' } },
          { note: 'Le thème s\'applique à tout le classeur, pas à une seule feuille.' },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Un point à retenir sur les thèmes. **Vrai ou faux ?**',
      visuel: { type: 'vraifaux', affirmation: 'Un thème ne change les couleurs et polices que de la feuille active, pas du reste du classeur.', bonne: false, explication: 'Non : un thème s\'applique à TOUT le classeur d\'un coup. C\'est justement ce qui garde une cohérence entre toutes tes feuilles.' },
    },
    {
      humeur: 'accueil',
      dit: '**Le mode Page** te montre la feuille telle qu\'elle sera imprimée.',
      visuel: {
        type: 'methode',
        titre: 'Voir le mode Page',
        blocs: [
          { etapes: ['Onglet **Affichage** > groupe **Modes d\'affichage** > **Mise en page** (ou l\'icône en bas à droite de la fenêtre)'] },
          { capture: { type: 'ruban', actif: 'Affichage', groupeNom: 'Modes d\'affichage', groupes: [{ icone: '▭', label: 'Normal' }, { icone: '📄', label: 'Mise en page', actif: true }, { icone: '✂', label: 'Sauts de page' }] } },
          { etapes: ['Tu vois alors les **sauts de page**, les **marges** et les **zones en-tête/pied**'] },
          { capture: { type: 'apercuimpression', bureau: true, legende: 'Le mode Page : la feuille telle qu\'elle sera imprimée, avec ses marges et ses zones.' } },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Au fait, c\'est quoi un saut de page :',
      visuel: { type: 'encart', label: 'Bon à savoir', texte: 'Un **saut de page** indique où la feuille sera découpée à l\'impression. Quand ton tableau dépasse une page A4, Excel crée un saut **automatique**. Tu peux aussi créer des sauts **manuels** pour décider toi-même où couper.' },
    },
    {
      humeur: 'accueil',
      dit: 'Les outils de mise en page disponibles :',
      visuel: { type: 'parties', items: [{ label: 'Définir les marges' }, { label: 'Choisir l\'orientation (portrait ou paysage)' }, { label: 'Définir la taille du papier' }, { label: 'Définir une zone d\'impression' }, { label: 'Insérer des sauts de page' }, { label: 'Imprimer les en-têtes de lignes/colonnes' }] },
    },
    {
      humeur: 'accueil',
      dit: 'Découvrons par la logique. Ton tableau a **beaucoup de colonnes** (il est large). Quelle orientation choisir pour tout faire tenir ?',
      visuel: { type: 'question', options: ['Paysage (horizontal)', 'Portrait (vertical)'], bonne: 0, explication: 'Paysage : la feuille est plus large que haute, parfaite pour un tableau à nombreuses colonnes. Le portrait convient mieux aux tableaux longs et étroits.' },
    },
    {
      humeur: 'accueil',
      dit: '**L\'orientation** dépend de la largeur de ton tableau.',
      visuel: {
        type: 'methode',
        titre: 'Choisir l\'orientation',
        blocs: [
          { etapes: ['Va dans **Mise en page > Orientation**', 'Choisis **Portrait** (vertical) ou **Paysage** (horizontal)'] },
          { capture: { type: 'apercuimpression', orientation: 'paysage', legende: 'Paysage : idéal quand le tableau a beaucoup de colonnes.' } },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: '**La zone d\'impression** choisit quelles cellules seront imprimées.',
      visuel: {
        type: 'methode',
        titre: 'Définir la zone d\'impression',
        blocs: [
          { etapes: ['Sélectionne la plage de cellules à imprimer'] },
          { capture: { type: 'tableur', cols: ['A', 'B', 'C'], rows: [1, 2, 3], cells: { A1: { t: 'Produit', entete: true }, B1: { t: 'Prix', entete: true }, C1: { t: 'Note' }, A2: { t: 'Clavier', ref: true }, B2: { t: '30', ref: true }, C2: { t: 'interne' }, A3: { t: 'Souris', ref: true }, B3: { t: '20', ref: true }, C3: { t: 'interne' } }, legende: 'La plage sélectionnée (en bleu) est celle qui sera imprimée.' } },
          { etapes: ['Va dans **Mise en page > Zone d\'impression > Définir**'] },
          { capture: { type: 'ruban', actif: 'Mise en page', groupeNom: 'Mise en page', groupes: [{ icone: '🖨', label: 'Zone d\'impression', actif: true }, { icone: '📐', label: 'Marges' }, { icone: '📄', label: 'Orientation' }] } },
          { etapes: ['Vérifie avec **Fichier > Imprimer** : l\'aperçu à droite te montre la zone'] },
          { capture: { type: 'impressionapercu' } },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Dans l\'onglet **Mise en page**, **clique le bouton Zone d\'impression.**',
      visuel: { type: 'cliquecible', support: 'ruban', consigne: 'Clique le bouton Zone d\'impression', actif: 'Mise en page', groupeNom: 'Mise en page', groupes: [{ icone: '🖨', label: 'Zone impression' }, { icone: '📐', label: 'Marges' }, { icone: '📄', label: 'Orientation' }], cible: 'Zone impression', explication: 'C\'est ici que tu choisis « Définir » : seules les cellules sélectionnées seront imprimées, le reste est ignoré.' },
    },
    {
      humeur: 'accueil',
      dit: '**Répéter les titres** pour qu\'ils apparaissent sur chaque page imprimée.',
      visuel: {
        type: 'methode',
        titre: 'Répéter les titres à l\'impression',
        blocs: [
          { etapes: ['Va dans **Mise en page > Imprimer les titres**'] },
          { capture: { type: 'ruban', actif: 'Mise en page', groupeNom: 'Mise en page', groupes: [{ icone: '⬓', label: 'Imprimer les titres', actif: true }, { icone: '🖨', label: 'Zone d\'impression' }, { icone: '📐', label: 'Marges' }] } },
          { etapes: ['Dans la fenêtre, choisis **Lignes à répéter en haut** (et/ou colonnes à répéter à gauche)'] },
          { capture: { type: 'champs', titre: 'Mise en page — Feuille', champs: [{ l: 'Lignes à répéter en haut', v: '$1:$1', actif: true }, { l: 'Colonnes à répéter à gauche', v: '' }] } },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: '**La mise à l\'échelle** fait tenir ton tableau sur le nombre de pages voulu.',
      visuel: {
        type: 'methode',
        titre: 'La mise à l\'échelle',
        blocs: [
          { etapes: ['Va dans **Mise en page > groupe Mise à l\'échelle**'] },
          { capture: { type: 'ruban', actif: 'Mise en page', groupeNom: 'Mise à l\'échelle', groupes: [{ icone: '↔', label: 'Largeur' }, { icone: '↕', label: 'Hauteur' }, { icone: '%', label: 'Échelle' }] } },
          { etapes: ['Choisis « **1 page de large sur 1 page de haut** »'] },
          { capture: { type: 'champs', titre: 'Mise à l\'échelle', champs: [{ l: 'Largeur', v: '1 page', actif: true }, { l: 'Hauteur', v: '1 page', actif: true }] } },
          { note: 'Attention à la lisibilité : Excel réduit la taille de la police si le tableau est trop grand. Vérifie que ça reste lisible.' },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Quand tu appliques un thème, il change le style de...',
      visuel: { type: 'question', options: ['Tout le classeur', 'Une seule cellule'], bonne: 0, explication: 'Le thème s\'applique à tout le classeur (toutes les feuilles), pas à une cellule isolée : couleurs et polices s\'harmonisent partout.' },
    },
    { humeur: 'fier', dit: 'Ta feuille est cadrée : thème, orientation, zone d\'impression, titres répétés. Plus qu\'à imprimer ! 🎉' },
  ],
}

// --- Leçon 7 : En-tête, pied de page & impression ---
const IMPRESSION = {
  id: 'fn-impression',
  titre: 'En-tête, pied de page & impression',
  exercices: [EX3.ex26],
  narration: [
    { humeur: 'accueil', dit: 'La touche finale : ajouter un en-tête et un pied de page, puis lancer une impression propre et pro.' },
    {
      humeur: 'pensif',
      dit: '**L\'en-tête** est en **haut** de chaque page (titre, nom de l\'auteur ou de l\'entreprise, date, logo...). **Le pied de page** est en **bas** (numéro de page, date, mention de confidentialité, contact...).',
      visuel: { type: 'apercuimpression', bureau: true, legende: 'En mode Page (vue Excel), l\'en-tête est en haut et le pied de page en bas, sur chaque page imprimée.' },
    },
    {
      humeur: 'accueil',
      dit: 'À quoi ça sert, un en-tête / pied de page :',
      visuel: { type: 'parties', items: [{ label: 'Donner un aspect **professionnel** et structuré au document' }, { label: 'Faciliter la lecture quand on imprime **plusieurs pages**' }, { label: 'Ajouter des **repères** utiles (numéro de page, date, nom de la feuille)' }] },
    },
    {
      humeur: 'accueil',
      dit: 'Réfléchissons. Ton document imprimé fait **8 pages**. Quel élément de pied de page aide le plus le lecteur à s\'y retrouver ?',
      visuel: { type: 'question', options: ['Le numéro de page (Page 3 sur 8)', 'Une couleur de fond', 'Une bordure épaisse'], bonne: 0, explication: 'Le numéro de page permet de remettre les feuilles dans l\'ordre et de se repérer. C\'est le repère indispensable d\'un document multi-pages.' },
    },
    {
      humeur: 'pensif',
      dit: 'Un point à savoir sur ces zones :',
      visuel: { type: 'encart', label: 'Bon à savoir', texte: 'Ces zones ne sont **pas visibles** à l\'écran en édition normale. Elles apparaissent en **mode Page**, dans l\'**aperçu avant impression**, et sur la **version papier**.' },
    },
    {
      humeur: 'pensif',
      dit: 'Vérifions ce point. **Vrai ou faux ?**',
      visuel: { type: 'vraifaux', affirmation: 'L\'en-tête et le pied de page s\'affichent à l\'écran en mode d\'édition normal.', bonne: false, explication: 'Non : en édition normale, ils sont invisibles. Tu les vois en mode Page, dans l\'aperçu avant impression, et sur le papier.' },
    },
    {
      humeur: 'pensif',
      dit: '**Pour insérer** un en-tête ou un pied de page :',
      visuel: {
        type: 'methode',
        titre: 'Insérer un en-tête ou un pied de page',
        blocs: [
          { etapes: ['Onglet **Mise en page** > clique sur la petite **flèche** (lanceur ↘) du groupe', 'Va sur l\'onglet **En-tête/Pied de page**'] },
          { capture: { type: 'ruban', actif: 'Mise en page', groupeNom: 'Mise en page', lanceur: true, groupes: [{ icone: '📏', label: 'Marges' }, { icone: '📄', label: 'Orientation' }, { icone: '📐', label: 'Taille' }] } },
          { etapes: ['Choisis un modèle dans la liste (En-tête en haut, Pied de page en bas)'] },
          { capture: { type: 'menu', items: [{ label: '(aucun)' }, { label: 'Page 1' }, { label: 'Confidentiel ; Page 1', actif: true }, { label: 'Feuil1' }, { label: 'Personnalisé…' }] } },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Dans la liste des modèles, **clique celui qui affiche à la fois « Confidentiel » et le numéro de page.**',
      visuel: { type: 'cliquecible', support: 'menu', consigne: 'Clique le modèle « Confidentiel ; Page 1 »', items: [{ label: '(aucun)' }, { label: 'Page 1' }, { label: 'Confidentiel ; Page 1' }, { label: 'Feuil1' }, { label: 'Personnalisé…' }], cible: 2, explication: 'Ce modèle combine la mention « Confidentiel » et le numéro de page. Et si aucun modèle ne te convient, « Personnalisé… » tout en bas te laisse tout composer.' },
    },
    {
      humeur: 'accueil',
      dit: 'Tu peux aussi **personnaliser** entièrement ton en-tête ou ton pied de page.',
      visuel: {
        type: 'methode',
        titre: 'Personnaliser ton en-tête / pied de page',
        blocs: [
          { etapes: ['Clique sur le bouton **Personnalisé**'] },
          { capture: { type: 'enteteperso' } },
          { etapes: ['Insère ce que tu veux : **date**, **heure**, **nom de l\'auteur**, **titre du fichier**, **numéro de page**, **image/logo**', 'Place chaque élément à gauche, au centre ou à droite', 'Clique sur **OK** pour valider'] },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: 'Enfin, **imprimer** :',
      visuel: {
        type: 'methode',
        titre: 'Imprimer',
        blocs: [
          { etapes: ['Menu **Fichier > Imprimer**', 'Choisis ton **imprimante**', 'Choisis quoi imprimer : feuilles actives, tout le classeur, ou sélection', 'Ajuste : orientation, format papier (A4...), mise à l\'échelle, nombre de copies', 'Vérifie l\'**aperçu** à droite', 'Clique sur **Imprimer**'] },
          { capture: { type: 'impressionapercu' } },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Le réflexe qui évite les mauvaises surprises :',
      visuel: { type: 'encart', label: 'Astuce', texte: '**Prévisualise toujours** avant d\'imprimer : l\'aperçu te montre exactement le rendu papier (marges, sauts de page, zone d\'impression).' },
    },
    {
      humeur: 'accueil',
      dit: 'Pour finir, trois réflexes à garder du chapitre :',
      visuel: { type: 'parties', items: [{ label: 'Utilise le pinceau 🖌 pour reproduire une mise en forme rapidement' }, { label: 'Applique un style de cellule pour un rendu uniforme et facile à modifier' }, { label: 'Prévisualise toujours avant impression pour éviter les mauvaises surprises' }] },
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Où vérifier ce qui sera réellement imprimé ?',
      visuel: { type: 'question', options: ['Dans l\'aperçu de Fichier > Imprimer', 'Ça ne se vérifie pas avant'], bonne: 0, explication: 'L\'aperçu avant impression (Fichier > Imprimer) montre exactement le rendu papier : marges, sauts de page, zone d\'impression. À regarder à chaque fois.' },
    },
    { humeur: 'fier', dit: 'Ton tableau est prêt à imprimer, propre et professionnel. La ceinture orange est à toi ! 🎉' },
  ],
}

// ======================================================================
// CHAPITRE 4 — Les fonctions de calculs Excel (ceinture verte)
// Chaque explication a son visuel. « En savoir plus » = texte de l'ebook (verbatim).
// Le ch.2 a déjà enseigné l'assistant, les fonctions de base et les références :
// ici on approfondit (fonctions simples/complexes, ARRONDI) et on découvre le NEUF
// (les noms dans les formules, les fonctions à plusieurs arguments, VPM).
// ======================================================================
const U4 = (id) => `https://drive.google.com/file/d/${id}/view?usp=drivesdk`
const EX4 = {
  ex27: { titre: 'Exercice 27 · La somme automatique & l\'assistant fonction', url: U4('1gLigeNmo2AoNXepQFKYX_E--PIBMzKDZ') },
  ex28: { titre: 'Exercice 28 · Les formules simples', url: U4('1JKWi2XOuuMVEKpkkZs29uklNAXuQak2e') },
  ex29: { titre: 'Exercice 29 · Les références absolues', url: U4('1jmbeEpSQhDTRBUklRyADas9cGgCkGnBs') },
  ex30: { titre: 'Exercice 30 · Les noms de cellules', url: U4('1el8wJNKuVKPaUHlAMlMSMyDG3hJVC26s') },
  ex31: { titre: 'Exercice 31 · L\'Assistant Fonction & la fonction VPM', url: U4('12iolLrs8zG3TjJGG4R_tsfjaH_Hr_FXw') },
}

// --- Tableur d'exemple : ventes par produit (pour MIN) ---
const VENTES = {
  A1: { t: 'Produit', entete: true },
  B1: { t: 'Ventes (€)', entete: true },
  A2: { t: 'Clavier' },
  B2: { t: '12000', num: true },
  A3: { t: 'Souris' },
  B3: { t: '9500', num: true },
  A4: { t: 'Écran' },
  B4: { t: '15000', num: true },
  A5: { t: 'Casque' },
  B5: { t: '11000', num: true },
  A6: { t: 'Tablier' },
  B6: { t: '8800', num: true },
  A7: { t: 'Le + petit', entete: true },
}
const tabMIN = (formule, resultat, refs) => {
  const cells = { ...VENTES }
  if (refs) refs.forEach((id) => (cells[id] = { ...cells[id], ref: true }))
  if (resultat) cells.B7 = resultat
  else if (formule) cells.B7 = { t: formule }
  return { type: 'tableur', cols: ['A', 'B'], rows: [1, 2, 3, 4, 5, 6, 7], cells, actif: 'B7', formule }
}

// --- Leçon 1 : Les fonctions simples ---
const FONCTIONSSIMPLES = {
  id: 'fn-fonctionssimples',
  titre: 'Les fonctions simples',
  exercices: [EX4.ex27, EX4.ex28],
  narration: [
    { humeur: 'accueil', dit: 'Une fonction, c\'est un outil tout prêt d\'Excel pour faire un calcul à ta place. Les plus simples n\'ont besoin que d\'une seule chose : une plage de cellules.' },
    {
      humeur: 'pensif',
      dit: 'Les fonctions **simples** sont celles pour lesquelles tu as juste besoin d\'indiquer une plage de cellules. Pas de formules compliquées, pas d\'arguments multiples à gérer. Et leur structure est **toujours la même**.',
      visuel: { type: 'formule', formule: '=Nom_de_la_fonction(plage_de_cellules)' },
    },
    {
      humeur: 'pensif',
      dit: 'La règle d\'or, vraie pour toutes les formules :',
      visuel: { type: 'encart', label: 'Bon à savoir', texte: 'Tu dois **toujours** commencer ta formule par le signe **=**. C\'est ce qui indique à Excel qu\'il s\'agit d\'un calcul, et pas d\'un simple texte.' },
    },
    {
      humeur: 'pensif',
      dit: 'Dans une plage, deux séparateurs à bien distinguer. Ils ne veulent pas dire la même chose :',
      visuel: { type: 'operateurs', cols: 1, items: [{ s: ':', l: 'Les deux points veulent dire « jusqu\'à ». Exemple : A1:A5 = de A1 à A5' }, { s: ';', l: 'Le point-virgule veut dire « et ». Exemple : A1;C1;E1 = A1 et C1 et E1' }] },
    },
    { humeur: 'accueil', dit: 'Un exemple concret : on cherche le produit qui a le **moins** vendu. La fonction MIN trouve la plus petite valeur de la plage. On la construit en la tapant.', visuel: tabMIN() },
    { humeur: 'accueil', dit: 'Le résultat ira sur la ligne « Le + petit ». **Clique la cellule qui va le recevoir.**', visuel: { type: 'cliquecible', support: 'tableur', consigne: 'Clique la cellule du résultat (à droite de « Le + petit »)', cols: ['A', 'B'], rows: [1, 2, 3, 4, 5, 6, 7], cells: { ...VENTES }, cible: 'B7', explication: 'Oui, B7 : c\'est là qu\'on écrit =MIN(…) pour afficher la plus petite valeur.' } },
    {
      humeur: 'pensif',
      dit: 'On la saisit directement dans la cellule, pas à pas.',
      visuel: {
        type: 'methode',
        titre: 'Méthode 1 : saisie directe',
        blocs: [
          { etapes: ['Clique dans la cellule où tu veux voir le résultat (ici B7)', 'Tape **=** suivi du nom de la fonction (ex : **MIN** pour la valeur la plus petite)', 'Clique sur la suggestion **MIN**'] },
          { capture: { type: 'autocomplete', cellule: 'B7', saisie: '=MI', items: [{ nom: 'MILLIONS.OCTETS.CONVERTIS' }, { nom: 'MIN', desc: 'Renvoie la plus petite valeur d\'une série de valeurs.' }, { nom: 'MIN.SI.ENS' }, { nom: 'MINUSCULE' }, { nom: 'MINUTE' }], selection: 1 } },
          { etapes: ['Sélectionne la plage à calculer (ici B2:B6) : elle se surligne en bleu, et la formule s\'écrit dans B7 et dans la barre de formule'], depart: 4 },
          { capture: tabMIN('=MIN(B2:B6', null, ['B2', 'B3', 'B4', 'B5', 'B6']) },
          { etapes: ['Ferme la parenthèse **)**'], depart: 5 },
          { capture: tabMIN('=MIN(B2:B6)') },
          { etapes: ['Clique sur **Entrée**'], depart: 6 },
          { capture: tabMIN('=MIN(B2:B6)', { t: '8800', num: true, vert: true }) },
          { note: 'Dans cette plage (B2 à B6), la valeur 8800 correspond aux ventes du Tablier, le produit qui a eu le moins de ventes.' },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: 'Tu as trouvé le produit qui a le moins vendu avec MIN. Et pour trouver celui qui a le **plus** vendu, quelle fonction utilises-tu ?',
      visuel: { type: 'question', options: ['MAX', 'MIN', 'SOMME'], bonne: 0, explication: 'MAX renvoie la plus GRANDE valeur, MIN la plus petite. Elles s\'écrivent pareil : =MAX(B2:B6). SOMME, elle, additionnerait tout.' },
    },
    {
      humeur: 'accueil',
      dit: 'Tu peux aussi te faire guider par l\'**assistant fonction** : il construit la formule à ta place, étape par étape.',
      visuel: {
        type: 'methode',
        titre: 'Méthode 2 : l\'assistant fonction (fx)',
        blocs: [
          { etapes: ['Clique dans la cellule où tu veux le résultat (ici B7)'] },
          { capture: tabMIN() },
          { etapes: ['Clique sur le bouton **fx**. Tu le trouves à deux endroits : sur la **barre de formule**, ou dans l\'onglet **Formules > Insérer une fonction**'], depart: 2 },
          { capture: { type: 'barrefx', cellule: 'B7' } },
          { capture: { type: 'ruban', actif: 'Formules', groupeNom: 'Bibliothèque de fonctions', groupes: [{ icone: 'fx', label: 'Insérer une fonction', actif: true }, { icone: '∑', label: 'Somme automatique' }, { icone: '🕘', label: 'Récentes' }] } },
          { etapes: ['Choisis une **catégorie** (ex : Statistiques, Math & Trigo…)'], depart: 3 },
          { capture: { type: 'assistant', categorie: 'Statistiques', fonctions: ['MAX', 'MEDIANE', 'MIN', 'MOYENNE', 'NB', 'NBVAL'], selection: -1, focus: 'categorie' } },
          { etapes: ['Sélectionne la fonction (ex : **MIN**), puis clique sur **OK**'], depart: 4 },
          { capture: { type: 'assistant', categorie: 'Statistiques', fonctions: ['MAX', 'MEDIANE', 'MIN', 'MOYENNE', 'NB', 'NBVAL'], selection: 2, signature: 'MIN(nombre1;nombre2;...)', description: 'Renvoie la plus petite valeur d\'une série de valeurs. Ignore le texte et les valeurs logiques.', focus: 'liste' } },
          { etapes: ['Remplis les arguments (**Nombre1**, **Nombre2**…), puis clique de nouveau sur **OK**'], depart: 5 },
          { capture: { type: 'arguments', fonction: 'MIN', args: [{ label: 'Nombre1', ref: 'B2:B6', valeur: '{12000;9500;…}', obligatoire: true }, { label: 'Nombre2', ref: '', valeur: 'nombre' }], apercu: '8800', description: 'Renvoie la plus petite valeur d\'une série de valeurs.', resultat: '8800', encadre: true } },
          { note: 'Deux façons de remplir les arguments : soit tu sélectionnes toute la plage d\'un coup dans **Nombre1** (ex : B2:B6), soit tu mets chaque cellule séparément (**Nombre1** = B2, **Nombre2** = B3, **Nombre3** = B4…). Tu peux aller jusqu\'à 255 arguments.', label: 'Bon à savoir' },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Ta formule ne fonctionne pas ? La cause la plus fréquente, en images :',
      visuel: {
        type: 'methode',
        titre: 'Ta formule ne fonctionne pas ?',
        blocs: [
          { etapes: ['Tu vois la **formule** au lieu du **résultat** ? La cellule est sûrement au format « Texte »'] },
          { capture: { type: 'tableur', cols: ['A', 'B'], rows: [1, 2, 3, 4, 5, 6, 7], cells: { ...VENTES, B7: { t: '=MIN(B2:B6)' } }, actif: 'B7', formule: '=MIN(B2:B6)', legende: 'Ici, B7 affiche la formule au lieu de 8800 : la cellule est au format « Texte ».' } },
          { etapes: ['Fais **clic droit > Format de cellule**, choisis « **Standard** » ou « **Nombre** », puis revalide avec **Entrée**'], depart: 2 },
          { capture: { type: 'formatcellule', actif: 'Nombre', categorieActive: 'Standard', categories: ['Standard', 'Nombre', 'Monétaire', 'Comptabilité', 'Date', 'Texte'], titreDroite: 'Aperçu :', types: ['8 800'] } },
          { note: 'une erreur de syntaxe. Vérifie les parenthèses, les points-virgules (;) et la plage de cellules.', label: 'Autre cause possible' },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Réfléchis bien. **Vrai ou faux ?**',
      visuel: { type: 'vraifaux', affirmation: '=MOYENNE(B2:B4) donne exactement le même résultat que =SOMME(B2:B4)/3.', bonne: true, explication: 'La moyenne, c\'est la somme divisée par le nombre de valeurs. MOYENNE fait les deux d\'un coup, et s\'adapte toute seule si la plage grandit.' },
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Quelle écriture est correcte pour une fonction simple ?',
      visuel: { type: 'question', options: ['=MIN(B2:B6)', '=MIN[B2;B6]'], bonne: 0, explication: 'Une fonction simple s\'écrit =Nom(plage), avec des parenthèses rondes et les deux points pour « jusqu\'à ». Les crochets ne sont pas reconnus par Excel.' },
    },
    { humeur: 'fier', dit: 'Tu sais reconnaître et écrire une fonction simple, à la main ou avec l\'assistant. Premier pas de la ceinture verte. Bravo ! 🎉' },
  ],
}

// --- Tableur SI (rappel) pour les fonctions complexes ---
const baseSI4 = { A1: { t: 'Note', entete: true }, B1: { t: 'Résultat', entete: true } }
const tabSI4 = (a2, formule, resultat) => {
  const cells = { ...baseSI4, A2: a2 }
  if (resultat) cells.B2 = resultat
  else if (formule) cells.B2 = { t: formule }
  return { type: 'tableur', cols: ['A', 'B'], rows: [1, 2], cells, actif: 'B2', formule }
}
// Tableur ARRONDI
const tabARR = (formule, resultat) => ({
  type: 'tableur',
  cols: ['A', 'B'],
  rows: [1, 2],
  cells: { A1: { t: 'Montant', entete: true }, B1: { t: 'Arrondi', entete: true }, A2: { t: '12,8', num: true, ...(formule && formule.includes('A2') ? { ref: true } : {}) }, ...(resultat ? { B2: resultat } : formule ? { B2: { t: formule } } : {}) },
  actif: 'B2',
  formule,
})

// --- Leçon 2 : Les fonctions complexes (SI & ARRONDI) ---
const FONCTIONSCOMPLEXES = {
  id: 'fn-fonctionscomplexes',
  titre: 'Les fonctions complexes : SI & ARRONDI',
  exercices: [],
  narration: [
    { humeur: 'accueil', dit: 'Certaines fonctions ont besoin de plusieurs informations pour travailler : ce sont les fonctions complexes. Rien de méchant, juste plusieurs **arguments** séparés par des points-virgules.' },
    {
      humeur: 'pensif',
      dit: 'Une fonction **complexe** demande **plusieurs arguments** (deux ou plus) pour fonctionner. La structure générale :',
      visuel: { type: 'formule', formule: '=Nom_de_la_fonction(Argument1 ; Argument2 ; … ; ArgumentN)' },
    },
    {
      humeur: 'accueil',
      dit: 'Tu l\'as déjà croisée en ceinture jaune : la fonction **SI**. Elle demande **trois** arguments.',
      visuel: { type: 'parties', items: [{ label: 'Une **condition** (la question posée à Excel)' }, { label: 'Un **résultat si c\'est vrai**' }, { label: 'Un **résultat si c\'est faux**' }] },
    },
    { humeur: 'accueil', dit: 'On va la construire pas à pas. Le résultat doit s\'afficher en face de la note. **Clique la cellule du résultat.**', visuel: { type: 'cliquecible', support: 'tableur', consigne: 'Clique la cellule Résultat', cols: ['A', 'B'], rows: [1, 2], cells: { ...baseSI4, A2: { t: '12' } }, cible: 'B2', explication: 'Oui, B2 : colonne « Résultat ». C\'est là qu\'on construit le SI.' } },
    { humeur: 'pensif', dit: '**Étape 1 :** clique dans B2 et tape **=**. Il s\'écrit dans la cellule et dans la barre de formule.', visuel: tabSI4({ t: '12' }, '=') },
    { humeur: 'pensif', dit: '**Étape 2 :** écris **SI** et ouvre une parenthèse.', visuel: tabSI4({ t: '12' }, '=SI(') },
    { humeur: 'accueil', dit: '**Argument 1, la condition :** on veut comparer la note à 10. **Clique la cellule de la note.**', visuel: { type: 'cliquecible', support: 'tableur', consigne: 'Clique la cellule de la note à tester', cols: ['A', 'B'], rows: [1, 2], cells: { ...baseSI4, A2: { t: '12' }, B2: { t: '=SI(' } }, formule: '=SI(', cible: 'A2', explication: 'Exact : A2. On écrit =SI(A2>10 : « si la note dépasse 10… ».' } },
    { humeur: 'accueil', dit: 'La condition s\'écrit donc **A2>10** : on teste si A2 est supérieur à 10.', visuel: tabSI4({ t: '12', ref: true }, '=SI(A2>10') },
    { humeur: 'pensif', dit: 'Un point-virgule **;** puis **argument 2, le résultat si VRAI**, entre guillemets.', visuel: tabSI4({ t: '12' }, '=SI(A2>10;"OK"') },
    { humeur: 'pensif', dit: 'Encore un **;** puis **argument 3, le résultat si FAUX**.', visuel: tabSI4({ t: '12' }, '=SI(A2>10;"OK";"À refaire"') },
    { humeur: 'pensif', dit: 'On ferme la parenthèse **)**. La formule complète est dans B2 et dans la barre de formule.', visuel: tabSI4({ t: '12' }, '=SI(A2>10;"OK";"À refaire")') },
    {
      humeur: 'accueil',
      dit: 'On appuie sur Entrée. La note est 12. **Que va afficher B2 ?**',
      visuel: { type: 'question', options: ['OK', 'À refaire'], bonne: 0, explication: '12 > 10 ? Oui : la condition est vraie, Excel affiche le 2ᵉ argument, « OK ».' },
    },
    { humeur: 'fier', dit: 'Exact : 12 > 10, donc B2 affiche **OK**.', visuel: tabSI4({ t: '12' }, '=SI(A2>10;"OK";"À refaire")', { t: 'OK', vert: true }) },
    {
      humeur: 'accueil',
      dit: 'Et si la note avait été **7** ? **Que va afficher B2 ?**',
      visuel: { type: 'question', options: ['À refaire', 'OK'], bonne: 0, explication: '7 > 10 ? Non : la condition est fausse, Excel affiche le 3ᵉ argument, « À refaire ».' },
    },
    { humeur: 'pensif', dit: 'Voilà : 7 > 10 ? Non → B2 affiche **À refaire**.', visuel: tabSI4({ t: '7' }, '=SI(A2>10;"OK";"À refaire")', { t: 'À refaire', rouge: true }) },
    {
      humeur: 'pensif',
      dit: 'Un détail à ne pas oublier dans SI :',
      visuel: { type: 'encart', label: 'Bon à savoir', texte: 'Les **guillemets** sont nécessaires : tout texte dans une formule Excel doit être entouré de guillemets (« OK », « À refaire »). Sans eux, Excel ne reconnaît pas le mot comme du texte.' },
    },
    {
      humeur: 'accueil',
      dit: 'Si tu préfères être guidé(e), construis SI avec l\'**assistant fonction**.',
      visuel: {
        type: 'methode',
        titre: 'La formule SI avec l\'assistant',
        blocs: [
          { etapes: ['Clique dans la cellule où tu veux le résultat (ici B2)', 'Clique sur le bouton **fx** dans la barre de formule'] },
          { capture: { type: 'barrefx', cellule: 'B2' } },
          { etapes: ['Choisis une **catégorie** (ex : Logique)', 'Sélectionne ta fonction **SI**', 'Clique sur **OK**'], depart: 3 },
          { capture: { type: 'assistant', categorie: 'Logique', fonctions: ['ET', 'FAUX', 'OU', 'SI', 'SI.CONDITIONS', 'SIERREUR'], selection: 3, signature: 'SI(test_logique;valeur_si_vrai;valeur_si_faux)', description: 'Vérifie si une condition est respectée et renvoie une valeur si VRAI, une autre si FAUX.', focus: 'liste' } },
          { etapes: ['Renseigne chaque argument (au moins les obligatoires)', 'Clique sur **OK** → Excel remplit la formule pour toi'], depart: 6 },
          { capture: { type: 'arguments', fonction: 'SI', args: [{ label: 'Test_logique', ref: 'A2>10', valeur: 'VRAI', obligatoire: true }, { label: 'Valeur_si_vrai', ref: '"OK"', valeur: '"OK"', obligatoire: true }, { label: 'Valeur_si_faux', ref: '"À refaire"', valeur: '"À refaire"' }], apercu: 'OK', description: 'Vérifie si une condition est respectée.', resultat: 'OK', encadre: true } },
          { note: 'Une fois tous les champs remplis, Excel affiche un aperçu du résultat (ici « OK », car le test est vrai).' },
        ],
      },
    },
    { humeur: 'accueil', dit: 'Une autre fonction complexe bien pratique : **ARRONDI**. Elle réduit le nombre de décimales d\'un chiffre. Tu choisis combien de chiffres après la virgule, et Excel arrondit pour toi.', visuel: { type: 'formule', formule: '=ARRONDI(nombre ; nombre_de_chiffres)' } },
    { humeur: 'accueil', dit: 'On l\'écrit pas à pas dans B2, pour arrondir le montant 12,8 placé en A2.', visuel: tabARR() },
    { humeur: 'pensif', dit: '**Étape 1 :** dans B2, tape **=ARRONDI(**.', visuel: tabARR('=ARRONDI(') },
    { humeur: 'accueil', dit: '**Argument 1, le nombre :** on veut arrondir le montant. **Clique la cellule à arrondir.**', visuel: { type: 'cliquecible', support: 'tableur', consigne: 'Clique la cellule du montant à arrondir', cols: ['A', 'B'], rows: [1, 2], cells: { A1: { t: 'Montant', entete: true }, B1: { t: 'Arrondi', entete: true }, A2: { t: '12,8', num: true }, B2: { t: '=ARRONDI(' } }, formule: '=ARRONDI(', cible: 'A2', explication: 'Oui, A2 : le montant 12,8. On écrit donc =ARRONDI(A2 : « arrondis A2… ».' } },
    { humeur: 'accueil', dit: 'On a donc **=ARRONDI(A2** : A2 est la valeur à arrondir.', visuel: tabARR('=ARRONDI(A2') },
    { humeur: 'pensif', dit: 'Un **;** puis **argument 2, le nombre de décimales** : 0 pour un entier.', visuel: tabARR('=ARRONDI(A2;0') },
    { humeur: 'pensif', dit: 'On ferme la parenthèse **)**.', visuel: tabARR('=ARRONDI(A2;0)') },
    { humeur: 'fier', dit: 'On appuie sur **Entrée** : 12,8 arrondi à l\'entier donne **13**.', visuel: tabARR('=ARRONDI(A2;0)', { t: '13', num: true, vert: true }) },
    {
      humeur: 'accueil',
      dit: 'Et avec l\'assistant, c\'est exactement la même logique que pour SI.',
      visuel: {
        type: 'methode',
        titre: 'ARRONDI avec l\'assistant',
        blocs: [
          { etapes: ['Clique dans la cellule où tu veux le résultat (ici B2)', 'Clique sur le bouton **fx** dans la barre de formule'] },
          { capture: { type: 'barrefx', cellule: 'B2' } },
          { etapes: ['Choisis une catégorie ou **tape le nom** dans la barre de recherche', 'Sélectionne ta fonction **ARRONDI**', 'Clique sur **OK**'], depart: 3 },
          { capture: { type: 'assistant', recherche: 'arrondi', categorie: 'Recommandé', fonctions: ['ARRONDI', 'ARRONDI.INF', 'ARRONDI.SUP'], selection: 0, signature: 'ARRONDI(nombre;no_chiffres)', description: 'Arrondit un nombre au nombre de chiffres indiqué.', focus: 'recherche' } },
          { etapes: ['Renseigne les deux arguments : **Nombre** = la valeur à arrondir, **No_chiffres** = le nombre de décimales', 'Clique sur **OK**, le résultat s\'affiche'], depart: 6 },
          { capture: { type: 'arguments', fonction: 'ARRONDI', args: [{ label: 'Nombre', ref: 'A2', valeur: '12,8', obligatoire: true }, { label: 'No_chiffres', ref: '0', valeur: '0', obligatoire: true }], apercu: '13', description: 'Arrondit un nombre au nombre de chiffres indiqué.', resultat: '13', encadre: true } },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Le réflexe à garder sur le second argument :',
      visuel: { type: 'encart', label: 'Bon à savoir', texte: 'Si tu mets **0** en second argument, Excel arrondit à l\'entier le plus proche. Mets **2** pour garder deux décimales (ex : les centimes d\'euro).' },
    },
    {
      humeur: 'accueil',
      dit: 'Tu te demandais s\'il y avait d\'autres ARRONDI : oui, deux petites sœurs, au cas où tu veux forcer le sens.',
      visuel: { type: 'encart', label: 'Les variantes d\'ARRONDI', liste: ['**ARRONDI** : arrondit normalement (au plus proche).', '**ARRONDI.INF** : arrondit toujours vers le **bas**.', '**ARRONDI.SUP** : arrondit toujours vers le **haut**.'] },
    },
    {
      humeur: 'pensif',
      dit: 'Vérifions ces variantes. **Vrai ou faux ?**',
      visuel: { type: 'vraifaux', affirmation: '=ARRONDI.SUP(12,1 ; 0) donne 12.', bonne: false, explication: 'Non : ARRONDI.SUP arrondit toujours vers le HAUT, donc 12,1 devient 13. C\'est ARRONDI.INF qui donnerait 12.' },
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Que donne =ARRONDI(12,8 ; 0) ?',
      visuel: { type: 'question', options: ['13', '12'], bonne: 0, explication: '12,8 arrondi à l\'entier le plus proche donne 13 (au-delà de ,5 on monte). Le 0 indique « zéro décimale ».' },
    },
    { humeur: 'fier', dit: 'SI, ARRONDI : tu construis les fonctions à plusieurs arguments, à la main ou avec l\'assistant. Bravo ! 🎉' },
  ],
}

// --- Tableur références (rappel) ---
const REF4 = { A1: { t: 'Produit', entete: true }, B1: { t: 'Prix HT', entete: true }, C1: { t: 'TTC', entete: true }, E1: { t: 'TVA', entete: true }, A2: { t: 'Clavier' }, B2: { t: '30', num: true }, A3: { t: 'Souris' }, B3: { t: '20', num: true }, E2: { t: '1,2', num: true } }
const tabREF4 = (cells, formule, actif, legende, extra = {}) => ({ type: 'tableur', cols: ['A', 'B', 'C', 'D', 'E'], rows: [1, 2, 3], cells: { ...REF4, ...cells }, actif, formule, legende, ...extra })

// --- Leçon 3 : Recopier les formules (références relatives & absolues) — RAPPEL ---
const RECOPIERFORMULES = {
  id: 'fn-recopierformules',
  titre: 'Recopier les formules : références relatives & absolues',
  exercices: [EX4.ex29],
  narration: [
    { humeur: 'accueil', dit: 'Petit rappel essentiel avant d\'aller plus loin : quand tu recopies une formule, Excel adapte les cellules tout seul. Et parfois, tu veux qu\'une cellule reste figée. Revoyons les deux cas, vite fait bien fait.' },
    {
      humeur: 'pensif',
      dit: '**Les références relatives.** Quand tu copies une formule (avec la poignée ou un copier-coller), les cellules utilisées s\'ajustent automatiquement selon la nouvelle position. Exemple : =B2*C2 en D2, tiré vers le bas, devient =B3*C3 puis =B4*C4.',
      visuel: { type: 'recopieanim' },
    },
    {
      humeur: 'accueil',
      dit: 'Le sens de la recopie décide de ce qui change :',
      visuel: { type: 'encart', label: 'Recopie vers le bas ou vers la droite ?', liste: ['Vers le **bas** : les lignes changent, la colonne reste la même (=B2 devient =B3, puis =B4).', 'Vers la **droite** : les colonnes changent, la ligne reste la même (=B2 devient =C2, puis =D2).'] },
    },
    {
      humeur: 'pensif',
      dit: 'Vérifions ce sens. **Vrai ou faux ?**',
      visuel: { type: 'vraifaux', affirmation: 'Quand tu recopies =B2 vers la DROITE, c\'est le numéro de ligne qui change (B2 → B3).', bonne: false, explication: 'Non : vers la droite, c\'est la COLONNE qui change (B2 → C2 → D2). Vers le bas, ce serait la ligne (B2 → B3).' },
    },
    {
      humeur: 'pensif',
      dit: 'Un piège classique avec les relatives :',
      visuel: { type: 'encart', label: 'Bon à savoir', texte: 'Si tes formules ne se recalculent pas toutes seules, le mode de calcul est sûrement réglé sur « manuel ». Solution : **Formules > Options de calcul > Automatique**.' },
    },
    { humeur: 'accueil', dit: '**Les références absolues.** Parfois, une cellule doit rester fixe, même en recopiant : un taux de TVA, un seuil, une constante. Ici, le taux est en E2 et on veut le garder. On écrit =B2*$E$2.', visuel: tabREF4({ C2: { t: '=B2*$E$2' } }, '=B2*$E$2', 'C2', 'Les $ verrouillent E2 : le taux restera figé en recopiant.', { refsCouleur: { B2: 'bleu', E2: 'ambre' } }) },
    {
      humeur: 'accueil',
      dit: 'Tu recopies =B2*$E$2 une ligne plus bas, en C3. **Qu\'obtiens-tu ?**',
      visuel: { type: 'question', options: ['=B3*$E$2', '=B3*$E$3', '=B2*$E$2'], bonne: 0, explication: 'B2 est relatif : il devient B3. Mais $E$2 est figé par les $ : il reste $E$2. Le taux ne bouge pas.' },
    },
    { humeur: 'fier', dit: 'En recopiant vers le bas, B2 s\'adapte (B3…) mais $E$2 reste figé. Tous les calculs tombent juste.', visuel: tabREF4({ C2: { t: '36', vert: true }, C3: { t: '24', vert: true } }, '=B3*$E$2', 'C3', 'B3 a changé (bleu), mais $E$2 (orange) est resté le même.', { refsCouleur: { B3: 'bleu', E2: 'ambre' } }) },
    {
      humeur: 'pensif',
      dit: 'Le raccourci pour mettre les $ sans les taper :',
      visuel: { type: 'encart', label: 'Astuce clavier', texte: 'Clique sur la cellule dans ta formule, puis appuie sur **F4** : Excel transforme B1 en $B$1. Si F4 ne marche pas tout seul, essaie **Fn + F4** (claviers portables). Sur **Mac**, utilise **⌘ + T**.' },
    },
    {
      humeur: 'pensif',
      dit: 'Vérifions ce raccourci. **Vrai ou faux ?**',
      visuel: { type: 'vraifaux', affirmation: 'Sélectionner une référence dans la formule et appuyer sur F4 (⌘ + T sur Mac) ajoute les $ automatiquement.', bonne: true, explication: 'Vrai : F4 (ou ⌘ + T) transforme B1 en $B$1 sans taper les $ à la main. Un appui de plus fige seulement la ligne, puis la colonne.' },
    },
    {
      humeur: 'accueil',
      dit: 'Le $ peut figer la colonne, la ligne, ou les deux. Voici les types de référence (en vert, ce qui reste fixe) :',
      visuel: { type: 'reffiger' },
      plus: ['$A$1 → Absolu (ligne et colonne figées). A$1 → ligne figée. $A1 → colonne figée. A1 → référence relative.'],
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Tu recopies une formule et tu veux que la cellule E2 reste fixe. Tu écris...',
      visuel: { type: 'question', options: ['$E$2', 'E2'], bonne: 0, explication: 'Les $ figent la cellule : $E$2 ne bougera pas, même en recopiant la formule ailleurs. E2 seul, lui, s\'adapterait.' },
    },
    { humeur: 'fier', dit: 'Relative qui suit, absolue qui reste : ce rappel te servira dans toutes tes fonctions. Bravo ! 🎉' },
  ],
}

// --- Leçon 4 : Utiliser les noms dans les formules (NOUVEAU) ---
const NOMSFORMULES = {
  id: 'fn-nomsformules',
  titre: 'Utiliser les noms dans les formules',
  exercices: [EX4.ex30],
  narration: [
    { humeur: 'accueil', dit: 'Imagine écrire =Prix*Quantité au lieu de =A1*B1. Plus clair, plus pro, et tu t\'y retrouves bien mieux, surtout dans un gros fichier. C\'est tout l\'intérêt de **nommer** une cellule.' },
    {
      humeur: 'pensif',
      dit: 'Utiliser un nom rend le fichier plus **lisible**. Plutôt que =A1*B1, tu écris =Prix*Quantité. La formule se comprend d\'un coup d\'œil, surtout si d\'autres personnes utilisent ton fichier.',
      visuel: { type: 'formule', formule: '=Prix * Quantité' },
    },
    {
      humeur: 'pensif',
      dit: 'Vérifions l\'intérêt. **Vrai ou faux ?**',
      visuel: { type: 'vraifaux', affirmation: '=Prix*Quantité et =A1*B1 donnent le même résultat, mais la première se relit plus facilement.', bonne: true, explication: 'Vrai : le nom rend la formule parlante. Six mois plus tard (ou pour un collègue), =Prix*Quantité se comprend d\'un coup, pas =A1*B1.' },
    },
    {
      humeur: 'pensif',
      dit: 'Avant de commencer, le petit lexique à avoir en tête :',
      visuel: { type: 'parties', items: [{ label: '**Nom** : l\'identifiant qu\'on donne à une cellule ou une plage' }, { label: '**Plage** : un ensemble de cellules (ex : A1:A10)' }, { label: '**Référence** : l\'adresse d\'une cellule (comme B2)' }, { label: '**Zone Nom** : la boîte à gauche de la barre de formule, où s\'affiche ou s\'écrit un nom' }] },
    },
    { humeur: 'accueil', dit: 'Justement, voici la **Zone Nom** : repère-la bien, c\'est elle qu\'on va utiliser.', visuel: { type: 'zonenom', nom: 'B2', formule: '30' } },
    {
      humeur: 'pensif',
      dit: 'Première méthode pour nommer, la plus rapide : directement dans la Zone Nom.',
      visuel: {
        type: 'methode',
        titre: 'Méthode 1 : via la Zone Nom',
        blocs: [
          { etapes: ['Sélectionne la cellule ou la plage à nommer', 'Clique dans la **Zone Nom** (à gauche de la barre de formule)', 'Tape le nom (respecte la syntaxe, juste après)', 'Appuie sur **Entrée**'] },
          { capture: { type: 'zonenom', nom: 'Prix_Unitaire', saisie: true, formule: '30', legende: 'On tape « Prix_Unitaire » dans la Zone Nom, puis Entrée : la cellule B2 s\'appelle désormais Prix_Unitaire.' } },
          { note: 'N\'oublie pas d\'appuyer sur Entrée : sans ça, le nom n\'est pas enregistré.' },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Les trois erreurs qui font échouer un nom :',
      visuel: { type: 'encart', label: 'Erreurs à éviter', liste: ['Oublier d\'appuyer sur **Entrée** après avoir tapé le nom.', 'Utiliser un **espace** dans le nom (« Prix unitaire » → erreur).', 'Nommer avec un mot **déjà utilisé** par Excel (comme SOMME).'] },
    },
    {
      humeur: 'accueil',
      dit: 'Deuxième méthode, via le ruban : pratique pour un nom limité à une feuille précise.',
      visuel: {
        type: 'methode',
        titre: 'Méthode 2 : via le ruban (Noms définis)',
        blocs: [
          { etapes: ['Va dans l\'onglet **Formules > groupe Noms définis**', 'Clique sur **Définir un nom** (ou Créer un nom)'] },
          { capture: { type: 'ruban', actif: 'Formules', groupeNom: 'Noms définis', groupes: [{ icone: '🔖', label: 'Définir un nom', actif: true }, { icone: '📋', label: 'Gestionnaire de noms' }, { icone: '⊞', label: 'Créer depuis sélection' }] } },
          { etapes: ['Renseigne le **Nom**, le **Champ** (classeur ou feuille) et la **Zone** (la plage concernée)', 'Valide avec **OK**'], depart: 3 },
          { capture: { type: 'champs', titre: 'Nouveau nom', champs: [{ l: 'Nom', v: 'Prix_Unitaire', actif: true }, { l: 'Champ', v: 'Classeur' }, { l: 'Fait référence à', v: '=Feuil1!$B$2' }] } },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Dans l\'onglet **Formules**, **clique le bouton qui définit un nom.**',
      visuel: { type: 'cliquecible', support: 'ruban', consigne: 'Clique le bouton Définir un nom', actif: 'Formules', groupeNom: 'Noms définis', groupes: [{ icone: '🔖', label: 'Définir un nom' }, { icone: '📋', label: 'Gestionnaire de noms' }, { icone: '⊞', label: 'Créer depuis sélection' }], cible: 'Définir un nom', explication: 'Le bouton 🔖 Définir un nom ouvre la fenêtre où tu choisis le nom, sa portée (classeur ou feuille) et sa plage.' },
    },
    {
      humeur: 'accueil',
      dit: 'Troisième méthode, avec la souris : le clic droit.',
      visuel: {
        type: 'methode',
        titre: 'Méthode 3 : avec le clic droit',
        blocs: [
          { etapes: ['Sélectionne la cellule ou la plage à nommer', 'Fais un **clic droit** sur la sélection', 'Choisis **Définir un nom** dans le menu'] },
          { capture: { type: 'menu', items: [{ icone: '📄', label: 'Copier' }, { icone: '📋', label: 'Coller' }, '-', { icone: '🔖', label: 'Définir un nom…', actif: true }, { label: 'Lien…' }] } },
          { etapes: ['Dans la fenêtre, donne un nom explicite (ex : PrixHT), vérifie que la référence est correcte', 'Clique sur **OK**'], depart: 4 },
          { capture: { type: 'champs', titre: 'Nouveau nom', champs: [{ l: 'Nom', v: 'PrixHT', actif: true }, { l: 'Fait référence à', v: '=Feuil1!$B$2' }] } },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Quel que soit le moyen, le nom doit respecter quelques règles :',
      visuel: { type: 'encart', label: 'Les règles à suivre pour un nom', liste: ['Il doit **commencer par une lettre**.', '**Pas d\'espace** (utilise _ ou colle les mots : Prix_Unitaire, PrixUnitaire).', 'Pas de **référence** (n\'utilise pas l\'adresse d\'une cellule, comme A1).', 'Longueur **max : 255 caractères** (largement suffisant !).', 'Pas de **doublon** dans un même classeur.'] },
    },
    {
      humeur: 'pensif',
      dit: 'Vérifions ces règles. **Vrai ou faux ?**',
      visuel: { type: 'vraifaux', affirmation: '« Prix unitaire » (avec un espace) est un nom de plage valide.', bonne: false, explication: 'Non : les espaces sont interdits. Écris « Prix_unitaire » ou « PrixUnitaire ». Le nom doit aussi commencer par une lettre, pas un chiffre.' },
    },
    {
      humeur: 'accueil',
      dit: 'Et trois bons réflexes pour t\'y retrouver :',
      visuel: { type: 'encart', label: 'Astuce pratique', liste: ['Utilise des noms **courts mais parlants** : TVA, Client, Montant.', 'Pour un tableau complexe, crée un **tableau structuré** avant de nommer les plages.', 'Tu peux gérer tous tes noms via **Formules > Gestionnaire de noms**.'] },
    },
    {
      humeur: 'pensif',
      dit: 'Pour **supprimer** un nom devenu inutile :',
      visuel: {
        type: 'methode',
        titre: 'Supprimer un nom de cellule',
        blocs: [
          { etapes: ['Va dans **Formules > groupe Noms définis**', 'Clique sur **Gestionnaire de noms**'] },
          { capture: { type: 'ruban', actif: 'Formules', groupeNom: 'Noms définis', groupes: [{ icone: '🔖', label: 'Définir un nom' }, { icone: '📋', label: 'Gestionnaire de noms', actif: true }, { icone: '⊞', label: 'Créer depuis sélection' }] } },
          { etapes: ['La fenêtre affiche tous les noms du classeur', 'Sélectionne le nom à supprimer', 'Clique sur **Supprimer**', 'Confirme si une alerte s\'affiche'], depart: 3 },
          { capture: { type: 'gestionnairenoms', selection: 0, noms: [{ nom: 'PrixHT', valeur: '30', ref: '=Feuil1!$B$2' }, { nom: 'Quantite', valeur: '2', ref: '=Feuil1!$C$2' }, { nom: 'TVA', valeur: '1,2', ref: '=Feuil1!$E$2' }] } },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Une précaution avant de supprimer :',
      visuel: { type: 'encart', label: 'Attention', texte: 'Si une formule utilise encore ce nom, elle renverra une erreur **#NOM ?** après suppression. Vérifie que le nom n\'est plus utilisé avant de le supprimer.' },
    },
    {
      humeur: 'pensif',
      dit: 'Anticipons un problème. **Vrai ou faux ?**',
      visuel: { type: 'vraifaux', affirmation: 'Si tu supprimes un nom encore utilisé dans une formule, cette formule affichera #NOM ?.', bonne: true, explication: 'Vrai : la formule ne retrouve plus le nom et renvoie #NOM ?. D\'où le réflexe : vérifie qu\'aucune formule ne l\'utilise avant de supprimer.' },
    },
    {
      humeur: 'accueil',
      dit: 'Maintenant, **utiliser** tes noms. D\'abord pour **naviguer** : la Zone Nom t\'emmène directement à la cellule.',
      visuel: {
        type: 'methode',
        titre: 'Naviguer grâce à un nom',
        blocs: [
          { etapes: ['Clique sur la **flèche** de la Zone Nom (à gauche de la barre de formule)', 'Choisis le nom dans la liste déroulante', 'Excel te conduit automatiquement à la cellule ou la plage'] },
          { capture: { type: 'zonenom', nom: 'Prix_Unitaire', fleche: true, liste: ['Prix_Unitaire', 'Quantite', 'TVA'], legende: 'La flèche ouvre la liste de tous tes noms : un clic et Excel t\'y emmène.' } },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: 'Et **pour insérer un nom pendant que tu écris une formule** ? Là, tu ne peux pas cliquer dans la Zone Nom. Le raccourci **F3** te donne la liste de tes noms, tu n\'as plus qu\'à choisir (tu n\'écris pas le nom toi-même).',
      visuel: {
        type: 'methode',
        titre: 'Méthode 1 : avec le raccourci F3',
        blocs: [
          { etapes: ['Dans ta cellule, tape **=** pour commencer ta formule'] },
          { capture: { type: 'tableur', cols: ['A', 'B', 'C'], rows: [1, 2], cells: { A1: { t: 'Prix', entete: true }, B1: { t: 'Qté', entete: true }, C1: { t: 'Total', entete: true }, A2: { t: '30' }, B2: { t: '2' }, C2: { t: '=' } }, actif: 'C2', formule: '=', legende: 'Tu es en train d\'écrire ta formule (ici dans C2, elle commence par =). C\'est le moment d\'appuyer sur F3.' } },
          { etapes: ['Appuie sur la touche **F3**', 'La boîte « Coller un nom » s\'ouvre avec **tous tes noms**', 'Clique sur le nom voulu, puis sur **OK** : Excel l\'insère dans ta formule'], depart: 2 },
          { capture: { type: 'listedialog', titre: 'Coller un nom', intro: 'Nom collé :', items: ['Prix_Unitaire', 'Quantite', 'TVA'], selection: 0 } },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Tu es en train d\'écrire une formule et tu veux insérer un nom déjà créé. Quelle touche ouvre la liste de tes noms ?',
      visuel: { type: 'question', options: ['F3', 'F1', 'Entrée'], bonne: 0, explication: 'F3 ouvre la boîte « Coller un nom » : tu choisis, Excel l\'insère. (Pendant la saisie d\'une formule, tu ne peux pas cliquer dans la Zone Nom.)' },
    },
    {
      humeur: 'accueil',
      dit: 'Encore plus rapide : tape les **premières lettres** du nom.',
      visuel: {
        type: 'methode',
        titre: 'Méthode 2 : en tapant les premières lettres',
        blocs: [
          { etapes: ['Tape **=** puis les premières lettres du nom (ex : =P)', 'Excel affiche une liste de propositions (fonctions + tes noms)', 'Double-clique sur le nom souhaité'] },
          { capture: { type: 'autocomplete', saisie: '=P', items: [{ nom: 'Prix_Unitaire', desc: 'Nom personnalisé → Feuil1!$B$2' }, { nom: 'PAIR' }, { nom: 'PENTE' }, { nom: 'PGCD' }, { nom: 'PRODUIT' }], selection: 0 } },
          { note: 'Tes noms personnalisés apparaissent en haut de la liste, juste après (ou avant) les fonctions Excel. Tu les reconnais facilement, surtout s\'ils sont bien nommés.' },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Dernier bonus : quand ton tableau a des **titres**, Excel peut créer les noms tout seul à partir d\'eux.',
      visuel: {
        type: 'methode',
        titre: 'Créer des noms à partir d\'étiquettes',
        blocs: [
          { etapes: ['Sélectionne tout le tableau, **titres compris**'] },
          { capture: { type: 'tableur', cols: ['A', 'B'], rows: [1, 2, 3], cells: { A1: { t: 'Produit', entete: true, ref: true }, B1: { t: 'Prix', entete: true, ref: true }, A2: { t: 'Clavier', ref: true }, B2: { t: '30', ref: true }, A3: { t: 'Souris', ref: true }, B3: { t: '20', ref: true } }, legende: 'Tout le tableau est sélectionné, y compris la ligne de titres.' } },
          { etapes: ['Va dans **Formules > groupe Noms définis**', 'Clique sur **Créer à partir de la sélection**'], depart: 2 },
          { capture: { type: 'ruban', actif: 'Formules', groupeNom: 'Noms définis', groupes: [{ icone: '🔖', label: 'Définir un nom' }, { icone: '📋', label: 'Gestionnaire de noms' }, { icone: '⊞', label: 'Créer depuis sélection', actif: true }] } },
          { etapes: ['Coche **Ligne du haut** (titres en haut) ou **Colonne de gauche** (titres à gauche)', 'Clique sur **OK**'], depart: 4 },
          { capture: { type: 'listedialog', titre: 'Créer des noms à partir de la sélection', intro: 'Créer les noms à partir des valeurs de :', cases: [{ label: 'Ligne du haut', coche: true }, { label: 'Colonne de gauche', coche: false }] } },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Quelle est la règle à respecter pour créer un nom de cellule ?',
      visuel: { type: 'question', options: ['Ne pas contenir d\'espace et commencer par une lettre', 'Commencer par un chiffre et être en majuscules'], bonne: 0, explication: 'Un nom doit commencer par une lettre, sans espace (ni doublon, ni adresse de cellule). « Prix_Unitaire » fonctionne, « 1Prix » ou « Prix unitaire » non.' },
    },
    { humeur: 'fier', dit: 'Nommer, gérer, utiliser : tes formules deviennent lisibles et pro. C\'était LE gros morceau du chapitre. Bravo ! 🎉' },
  ],
}

// --- Tableur VPM (simulation de prêt) ---
const tabVPM = (resultat) => ({
  type: 'tableur',
  cols: ['A', 'B'],
  rows: [1, 2, 3, 4],
  cells: {
    A1: { t: 'Montant emprunté', entete: true },
    B1: { t: '15 000 €' },
    A2: { t: 'Taux annuel', entete: true },
    B2: { t: '5 %' },
    A3: { t: 'Durée (mois)', entete: true },
    B3: { t: '120' },
    A4: { t: 'Mensualité', entete: true },
    B4: resultat ? { t: '-159,10 €', rouge: true } : { t: '=VPM(B2/12;B3;-B1)' },
  },
  actif: 'B4',
  formule: '=VPM(B2/12;B3;-B1)',
  refsCouleur: { B2: 'bleu', B3: 'ambre', B1: 'violet' },
})

// --- Leçon 5 : Fonctions à plusieurs arguments & VPM (NOUVEAU) ---
const ARGUMENTSVPM = {
  id: 'fn-argumentsvpm',
  titre: 'Fonctions à plusieurs arguments & VPM',
  exercices: [EX4.ex31],
  narration: [
    { humeur: 'accueil', dit: 'Pour finir la ceinture verte, on s\'attaque aux fonctions un peu plus avancées (VPM, NB.SI, RECHERCHEV). Bonne nouvelle : tu n\'es pas obligé(e) de tout taper, l\'assistant te guide.' },
    { humeur: 'accueil', dit: 'On commence par une fonction très concrète : **VPM** (Valeur des Paiements Mensuels). Elle calcule la **mensualité d\'un prêt** à partir du taux, de la durée et du montant emprunté.' },
    {
      humeur: 'pensif',
      dit: 'À quoi elle sert au quotidien : savoir combien tu rembourses chaque mois pour...',
      visuel: { type: 'parties', items: [{ label: 'Un **crédit auto**' }, { label: 'Un **prêt immobilier**' }, { label: 'Tout autre **emprunt à paiements fixes**' }] },
    },
    { humeur: 'pensif', dit: 'Voici sa structure. Les arguments entre crochets [ ] sont facultatifs :', visuel: { type: 'formule', formule: '=VPM(taux ; nb_périodes ; valeur_actuelle ; [valeur_future] ; [type])' } },
    {
      humeur: 'accueil',
      dit: 'Chaque argument a un rôle précis. On les détaille un par un :',
      visuel: { type: 'parties', items: [
        { label: '**Taux** (obligatoire) : le taux d\'intérêt **par période**. Pour 5 % par an payé chaque mois, c\'est 5%/12.' },
        { label: '**Nb_périodes** (obligatoire) : le **nombre total de paiements**. Sur 10 ans en mensualités : 10 × 12 = 120.' },
        { label: '**Valeur_actuelle** (obligatoire) : le **montant emprunté**, écrit en négatif (ex : -15000).' },
        { label: '**[Valeur_future]** (facultatif) : ce qu\'il **reste à devoir à la fin**. 0 par défaut (prêt entièrement remboursé).' },
        { label: '**[Type]** (facultatif) : paiement en **fin** de période (0) ou en **début** (1). 0 par défaut.' },
      ] },
    },
    {
      humeur: 'pensif',
      dit: 'Dans la fenêtre de l\'assistant, l\'affichage te dit l\'essentiel :',
      visuel: { type: 'encart', label: 'Détails utiles sur les arguments', liste: ['**Gras** = argument **obligatoire**.', 'Normal = argument **facultatif**.', 'La valeur affichée à droite = la valeur **par défaut** si tu ne changes rien.'] },
    },
    {
      humeur: 'accueil',
      dit: 'Réfléchis. Ton prêt est à **5 % par an**, mais tu paies **chaque mois**. Quel taux mettre dans l\'argument Taux ?',
      visuel: { type: 'question', options: ['5%/12', '5%', '5%*12'], bonne: 0, explication: 'Le taux doit être PAR PÉRIODE. Comme tu paies mensuellement, on divise le taux annuel par 12 : 5%/12. C\'est le piège classique de VPM.' },
    },
    {
      humeur: 'pensif',
      dit: 'Un réflexe de lecture de l\'assistant. **Vrai ou faux ?**',
      visuel: { type: 'vraifaux', affirmation: 'Dans la fenêtre de l\'assistant, un argument affiché en gras est facultatif.', bonne: false, explication: 'Non : le gras signale un argument OBLIGATOIRE. Les facultatifs sont en écriture normale (et souvent entre crochets dans la syntaxe).' },
    },
    {
      humeur: 'accueil',
      dit: 'Maintenant qu\'on sait ce que fait VPM, on la construit avec l\'**assistant fonction**. Le résultat ira sur la ligne « Mensualité ». **Clique la cellule du résultat.**',
      visuel: { type: 'cliquecible', support: 'tableur', consigne: 'Clique la cellule de la Mensualité', cols: ['A', 'B'], rows: [1, 2, 3, 4], cells: { A1: { t: 'Montant emprunté', entete: true }, B1: { t: '15 000 €' }, A2: { t: 'Taux annuel', entete: true }, B2: { t: '5 %' }, A3: { t: 'Durée (mois)', entete: true }, B3: { t: '120' }, A4: { t: 'Mensualité', entete: true } }, cible: 'B4', explication: 'Oui, B4 : à droite de « Mensualité ». C\'est de là qu\'on ouvre l\'assistant pour écrire le VPM.' },
    },
    {
      humeur: 'accueil',
      dit: 'On la construit avec l\'**assistant fonction**.',
      visuel: {
        type: 'methode',
        titre: 'Construire VPM avec l\'assistant',
        blocs: [
          { etapes: ['Clique sur la cellule du résultat (ici B4)', 'Clique sur le bouton **fx** (barre de formule) ou **Formules > Insérer une fonction**'] },
          { capture: { type: 'barrefx', cellule: 'B4' } },
          { etapes: ['Choisis la catégorie **Financières** (ou tape « VPM » dans la recherche)', 'Sélectionne **VPM**', 'Clique sur **OK**'], depart: 3 },
          { capture: { type: 'assistant', categorie: 'Financières', fonctions: ['TAUX', 'VA', 'VAN', 'VC', 'VPM'], selection: 4, signature: 'VPM(taux;npm;va;[vc];[type])', description: 'Calcule le remboursement d\'un emprunt sur la base de remboursements et d\'un taux d\'intérêt constants.', focus: 'liste' } },
          { etapes: ['Renseigne les arguments (les **obligatoires** sont en gras), puis clique sur **OK**'], depart: 6 },
          { capture: { type: 'arguments', fonction: 'VPM', args: [{ label: 'Taux', ref: '5%/12', valeur: '0,00417', obligatoire: true }, { label: 'Npm', ref: '120', valeur: '120', obligatoire: true }, { label: 'Va', ref: '-15000', valeur: '-15000', obligatoire: true }, { label: 'Vc', ref: '', valeur: 'facultatif' }, { label: 'Type', ref: '', valeur: 'facultatif' }], apercu: '-159,10 €', description: 'Calcule la mensualité d\'un emprunt à taux constant.', resultat: '-159,10 €', encadre: true } },
        ],
      },
    },
    { humeur: 'accueil', dit: 'Exemple complet : tu empruntes 15 000 € à 5 % par an, sur 10 ans (120 mois). =VPM(5%/12 ; 120 ; -15000) donne environ -159,10 € par mois.', visuel: tabVPM(true) },
    {
      humeur: 'pensif',
      dit: 'Pourquoi le résultat est-il négatif :',
      visuel: { type: 'encart', label: 'Bon à savoir', texte: 'Le résultat est **négatif** car c\'est une sortie d\'argent (tu paies). Pour l\'afficher en positif, ajoute un signe moins devant : =-VPM(...).' },
    },
    {
      humeur: 'pensif',
      dit: 'Vérifions ce point. **Vrai ou faux ?**',
      visuel: { type: 'vraifaux', affirmation: 'VPM renvoie un montant négatif, et c\'est normal : c\'est de l\'argent qui sort de ta poche.', bonne: true, explication: 'Vrai : par convention, une sortie d\'argent est négative. Pour l\'afficher en positif, mets un signe moins devant la fonction : =-VPM(…).' },
    },
    {
      humeur: 'pensif',
      dit: 'Et si tu bloques sur les arguments d\'une fonction (VPM, SI…), le réflexe :',
      visuel: { type: 'encart', label: 'Astuce', texte: 'Ne reste pas bloqué(e) ! Clique sur **fx**, choisis ta fonction et **lis les descriptions** : les champs en gras sont obligatoires. Pose-toi juste : « Qu\'est-ce que je veux calculer exactement ? »' },
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Quel est le rôle de la fonction VPM ?',
      visuel: { type: 'question', options: ['Calculer une mensualité de prêt', 'Afficher le total hors taxe'], bonne: 0, explication: 'VPM (Valeur des Paiements Mensuels) calcule la mensualité d\'un emprunt selon le taux, la durée et le montant emprunté.' },
    },
    { humeur: 'fier', dit: 'Assistant, arguments obligatoires/facultatifs, VPM : tu manies maintenant les fonctions complexes. La ceinture verte est à toi ! 🎉' },
  ],
}

// ======================================================================
// CHAPITRE 5 — Outils particuliers & Fonctions particulières (ceinture bleue)
// Construit en plusieurs temps. PARTIE 1 : les outils (Rechercher/Remplacer,
// Convertir) + l'aperçu des fonctions. PARTIE 2 (à venir) : arrondis, dates,
// texte, financières. Mêmes règles que ch.3-4 (un visuel par explication…).
// ======================================================================
const U5 = (id) => `https://drive.google.com/file/d/${id}/view?usp=drivesdk`
const EX5 = {
  ex32: { titre: 'Exercice 32 · Outils Rechercher & Remplacer', url: U5('14vsQh2c4uGF2MnBamFbmw1fYtgM3zGCH') },
  ex33: { titre: 'Exercice 33 · Outils Convertir', url: U5('1sur2I43EWLIEJ_JVD0EtIFZEtBY5S0P8') },
  ex34: { titre: 'Exercice 34 · La formule ARRONDI', url: U5('1aMgQmQ7cDWDaAHdydk6BanjmEJvDpkkB') },
  ex35: { titre: 'Exercice 35 · La formule ARRONDI.INF', url: U5('1G0BChNm5lJQhVl2eg8hCK8gR6PO1h-DN') },
  ex36: { titre: 'Exercice 36 · La formule ARRONDI.SUP', url: U5('12v9bE2CBvo04swEH_hh8NulrTUW1TaZs') },
  ex37: { titre: 'Exercice 37 · La formule TRONQUE', url: U5('1lv2z88X7R7aGxfVeR0Qpr8I5YaPoNnaE') },
  ex39: { titre: 'Exercice 39 · Quelques fonctions dates', url: U5('16xVopbr8ckfE2xNjewwUMrtaTjAZme8O') },
  ex45: { titre: 'Exercice 45 · La fonction VPM', url: U5('1Knkc-_HzjmKXvYCwv8r-Svi8VXcPd_Ed') },
  ex46: { titre: 'Exercice 46 · La fonction VA', url: U5('1d-vITQUCEhKjJE6zFtYWafKbhj8I7pXy') },
  ex47: { titre: 'Exercice 47 · La fonction NPM', url: U5('1cj0xGn9VA8AbM7w7uiOjlmW54c1CnDIN') },
}

// --- Leçon 1 : Rechercher & Remplacer ---
const RR = { A1: { t: 'Élève', entete: true }, B1: { t: 'Note', entete: true }, A2: { t: 'Léa' }, B2: { t: '14', num: true }, A3: { t: 'Tom' }, B3: { t: '9,5', num: true }, A4: { t: 'Sam' }, B4: { t: '16', num: true }, A5: { t: 'Lou' }, B5: { t: '9,5', num: true } }
const tabRR = (cells) => ({ type: 'tableur', cols: ['A', 'B'], rows: [1, 2, 3, 4, 5], cells: { ...RR, ...cells } })

const RECHERCHERREMPLACER = {
  id: 'fn-rechercherremplacer',
  titre: 'Rechercher & Remplacer',
  exercices: [EX5.ex32],
  narration: [
    { humeur: 'accueil', dit: 'Quand un tableau est rempli de données (noms, notes, statuts…), tu peux avoir besoin de modifier plein de cellules d\'un coup. Plutôt que de les chercher une à une, Excel les trouve et les remplace en un clic.' },
    {
      humeur: 'pensif',
      dit: 'À quoi ça sert, concrètement :',
      visuel: { type: 'parties', items: [{ label: 'Corriger une erreur répétée dans une colonne' }, { label: 'Remplacer un mot par un autre (ex : « Non répondu » → « À relancer »)' }, { label: 'Harmoniser des libellés en une seule fois' }] },
    },
    { humeur: 'accueil', dit: 'Exemple : dans une colonne de notes, on veut remplacer toutes les notes « 9,5 » par « 10 ».', visuel: tabRR({ B3: { t: '9,5', num: true, ref: true }, B5: { t: '9,5', num: true, ref: true } }) },
    {
      humeur: 'pensif',
      dit: 'On passe par le ruban, pas à pas.',
      visuel: {
        type: 'methode',
        titre: 'Via le ruban',
        blocs: [
          { etapes: ['Va dans l\'onglet **Accueil**', 'Clique sur la **loupe** (Rechercher & sélectionner) dans le groupe **Édition**', 'Choisis **Remplacer…**'] },
          { capture: { type: 'ruban', actif: 'Accueil', groupeNom: 'Édition', groupes: [{ icone: '∑', label: 'Somme' }, { icone: '⇅', label: 'Trier & filtrer' }, { icone: '🔍', label: 'Rechercher & sélectionner', actif: true }] } },
          { etapes: ['Dans **Rechercher**, tape la valeur à trouver (9,5)', 'Dans **Remplacer par**, tape la nouvelle valeur (10)'], depart: 4 },
          { capture: { type: 'champs', titre: 'Rechercher et remplacer', champs: [{ l: 'Rechercher', v: '9,5', actif: true }, { l: 'Remplacer par', v: '10' }] } },
          { etapes: ['Clique sur **Remplacer tout** (si tu es sûr·e), ou **Suivant** puis **Remplacer** au cas par cas'], depart: 6 },
          { capture: tabRR({ B3: { t: '10', num: true, vert: true }, B5: { t: '10', num: true, vert: true } }) },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: 'À toi de trouver l\'outil. Dans l\'onglet **Accueil > groupe Édition**, **clique la loupe** (Rechercher & sélectionner).',
      visuel: { type: 'cliquecible', support: 'ruban', consigne: 'Clique le bouton Rechercher & sélectionner', actif: 'Accueil', groupeNom: 'Édition', groupes: [{ icone: '∑', label: 'Somme' }, { icone: '⇅', label: 'Trier & filtrer' }, { icone: '🔍', label: 'Rechercher & sélectionner' }], cible: 'Rechercher & sélectionner', explication: 'La loupe 🔍 : elle ouvre le menu Rechercher / Remplacer. Choisis « Remplacer… » pour changer des valeurs en masse.' },
    },
    {
      humeur: 'pensif',
      dit: 'Les deux raccourcis à retenir :',
      visuel: { type: 'encart', label: 'Astuce clavier', liste: ['**Ctrl + H** ouvre « Rechercher et remplacer » (Mac : **⌘ + Maj + H**).', '**Ctrl + F** ouvre juste « Rechercher » : pour **trouver** une valeur, sans la remplacer (Mac : **⌘ + F**).'] },
    },
    {
      humeur: 'pensif',
      dit: 'Ne confondons pas les deux raccourcis. **Vrai ou faux ?**',
      visuel: { type: 'vraifaux', affirmation: 'Ctrl + F sert à remplacer une valeur par une autre.', bonne: false, explication: 'Non : Ctrl + F sert seulement à TROUVER une valeur. Pour la remplacer, c\'est Ctrl + H (Rechercher ET remplacer).' },
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Quel raccourci ouvre « Rechercher et remplacer » ?',
      visuel: { type: 'question', options: ['Ctrl + H', 'Ctrl + F'], bonne: 0, explication: 'Ctrl + H ouvre Remplacer. (Ctrl + F ouvre seulement Rechercher, sans le remplacement.)' },
    },
    { humeur: 'fier', dit: 'Tu corriges tout un tableau en un clic. Premier pas de la ceinture bleue. Bravo ! 🎉' },
  ],
}

// --- Leçon 2 : Convertir (séparer une colonne) ---
const CONVERTIR = {
  id: 'fn-convertir',
  titre: 'Convertir : séparer une colonne',
  exercices: [EX5.ex33],
  narration: [
    { humeur: 'accueil', dit: 'Tu as une colonne qui mélange deux infos, par exemple « paul dupont » (prénom + nom), et tu veux les séparer en deux colonnes ? L\'outil **Convertir** fait ça automatiquement. Parfait pour structurer un fichier client mal formaté.' },
    { humeur: 'pensif', dit: 'Au départ, tout est collé dans une seule colonne :', visuel: { type: 'tableur', cols: ['A'], rows: [1, 2, 3], cells: { A1: { t: 'Nom complet', entete: true }, A2: { t: 'paul dupont' }, A3: { t: 'marie curie' } }, legende: 'Prénom et nom sont dans la même cellule.' } },
    {
      humeur: 'pensif',
      dit: 'On sépare la colonne, pas à pas.',
      visuel: {
        type: 'methode',
        titre: 'Séparer une colonne avec Convertir',
        blocs: [
          { etapes: ['Sélectionne la colonne à découper', 'Va dans **Données > Convertir** (groupe **Outils de données**)'] },
          { capture: { type: 'ruban', actif: 'Données', groupeNom: 'Outils de données', groupes: [{ icone: '🔀', label: 'Convertir', actif: true }, { icone: '🧹', label: 'Supprimer les doublons' }, { icone: '✓', label: 'Validation des données' }] } },
          { etapes: ['Choisis **Délimité**, puis **Suivant**'], depart: 3 },
          { capture: { type: 'listedialog', titre: 'Assistant Conversion (étape 1)', intro: 'Type de données d\'origine :', cases: [{ label: 'Délimité (séparé par des espaces, virgules…)', coche: true }, { label: 'Largeur fixe', coche: false }], ok: 'Suivant' } },
          { etapes: ['Coche le **séparateur** (ici **Espace**) : un aperçu du découpage s\'affiche en direct', 'Clique sur **Suivant**'], depart: 4 },
          { capture: { type: 'listedialog', titre: 'Assistant Conversion (étape 2)', intro: 'Séparateurs :', cases: [{ label: 'Tabulation', coche: false }, { label: 'Point-virgule', coche: false }, { label: 'Virgule', coche: false }, { label: 'Espace', coche: true }], ok: 'Suivant' } },
          { capture: { type: 'tableur', cols: ['A', 'B'], rows: [1, 2], cells: { A1: { t: 'paul', vert: true }, B1: { t: 'dupont', vert: true }, A2: { t: 'marie', vert: true }, B2: { t: 'curie', vert: true } }, legende: 'Aperçu : le prénom d\'un côté, le nom de l\'autre.' } },
          { etapes: ['Choisis la **Destination** (ex : $B$1 pour garder l\'original en colonne A), puis clique sur **Terminer**'], depart: 6 },
          { capture: { type: 'champs', titre: 'Assistant Conversion (étape 3)', champs: [{ l: 'Destination', v: '=$B$1', actif: true }] } },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Dans l\'onglet **Données**, **clique le bouton Convertir.**',
      visuel: { type: 'cliquecible', support: 'ruban', consigne: 'Clique le bouton Convertir', actif: 'Données', groupeNom: 'Outils de données', groupes: [{ icone: '🔀', label: 'Convertir' }, { icone: '🧹', label: 'Supprimer doublons' }, { icone: '✓', label: 'Validation' }], cible: 'Convertir', explication: 'Convertir 🔀 lance l\'assistant qui découpe une colonne en plusieurs, selon un séparateur (espace, virgule…).' },
    },
    {
      humeur: 'pensif',
      dit: 'Les pièges à éviter :',
      visuel: { type: 'encart', label: 'Erreurs fréquentes', liste: ['Oublier de **prévoir des colonnes vides à droite** : tu risques d\'écraser des données existantes.', 'Cliquer sur **Suivant** trop vite, sans vérifier l\'aperçu du découpage.', 'Croire que Convertir **modifie** le texte : en réalité, il le **copie** dans d\'autres cellules.'] },
    },
    {
      humeur: 'pensif',
      dit: 'Un point important à comprendre. **Vrai ou faux ?**',
      visuel: { type: 'vraifaux', affirmation: 'Il faut prévoir des colonnes vides à droite avant de convertir, sinon tu écrases des données existantes.', bonne: true, explication: 'Vrai : Convertir place les morceaux dans les colonnes voisines. S\'il y a déjà des données à droite, elles seront écrasées. Prévois de l\'espace (ou choisis une destination).' },
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Pour séparer « paul dupont » (un espace entre les deux), quel séparateur coches-tu ?',
      visuel: { type: 'question', options: ['Espace', 'Point-virgule'], bonne: 0, explication: 'Le prénom et le nom sont séparés par un espace, donc on coche « Espace ». (Le point-virgule servirait pour « paul;dupont ».)' },
    },
    { humeur: 'fier', dit: 'Une colonne en bazar devient un tableau propre, en quelques clics. Bravo ! 🎉' },
  ],
}

// --- Leçon 3 : Aperçu des fonctions particulières ---
const FONCTIONSPARTICULIERES = {
  id: 'fn-fonctionsparticulieres',
  titre: 'Aperçu des fonctions',
  exercices: [],
  narration: [
    { humeur: 'accueil', dit: 'Les fonctions Excel automatisent, calculent, vérifient, comparent… Bref, elles te font gagner du temps et évitent les erreurs. Bonne nouvelle : avec quelques fonctions bien choisies, tu fais déjà beaucoup, sans être expert·e.' },
    {
      humeur: 'pensif',
      dit: 'Où les trouver ? Toutes rangées par familles.',
      visuel: {
        type: 'methode',
        titre: 'Où trouver les fonctions',
        blocs: [
          { etapes: ['Va dans l\'onglet **Formules**', 'Groupe **Bibliothèque de fonctions** : les fonctions y sont classées par catégorie'] },
          { capture: { type: 'ruban', actif: 'Formules', groupeNom: 'Bibliothèque de fonctions', groupes: [{ icone: 'fx', label: 'Insérer une fonction', actif: true }, { icone: '💰', label: 'Financières' }, { icone: '📅', label: 'Date & heure' }, { icone: '🔤', label: 'Texte' }] } },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Tu cherches une fonction pour calculer une durée entre deux dates. Dans l\'onglet **Formules**, **clique la famille où chercher.**',
      visuel: { type: 'cliquecible', support: 'ruban', consigne: 'Clique la catégorie Date & heure', actif: 'Formules', groupeNom: 'Bibliothèque de fonctions', groupes: [{ icone: 'fx', label: 'Insérer fonction' }, { icone: '💰', label: 'Financières' }, { icone: '📅', label: 'Date & heure' }, { icone: '🔤', label: 'Texte' }], cible: 'Date & heure', explication: 'Chaque famille regroupe des fonctions par thème. Les durées, jours ouvrés, mois… sont dans « Date & heure ».' },
    },
    {
      humeur: 'pensif',
      dit: 'Les grandes familles de fonctions :',
      visuel: { type: 'parties', items: [{ label: '**Math & trigo** : arrondis, sommes conditionnelles…' }, { label: '**Texte** : extraire un mot, reformater du texte' }, { label: '**Date & heure** : plannings, durées, jours ouvrés' }, { label: '**Logique** : SI, ET, OU…' }, { label: '**Financières** : simuler un prêt, une mensualité' }, { label: '**Statistiques** : comptages, moyennes, médianes' }, { label: '**Recherche & référence** : RECHERCHEV, RECHERCHEX…' }] },
    },
    {
      humeur: 'accueil',
      dit: 'Le plus rassurant :',
      visuel: { type: 'encart', label: 'Bon à savoir', texte: 'Tu **n\'as pas besoin de retenir toutes les fonctions** ! Clique sur **fx** (Insérer une fonction), tape ce que tu veux faire (« moyenne », « arrondir »…), et Excel te propose la bonne fonction et t\'accompagne pas à pas.' },
    },
    {
      humeur: 'pensif',
      dit: 'De quoi te rassurer. **Vrai ou faux ?**',
      visuel: { type: 'vraifaux', affirmation: 'Pour bien utiliser Excel, il faut connaître par cœur le nom de toutes les fonctions.', bonne: false, explication: 'Faux, et heureusement ! Le bouton fx te laisse décrire ton besoin en mots (« arrondir », « compter »…) et Excel propose la fonction. Tu apprends les plus utiles avec la pratique.' },
    },
    {
      humeur: 'pensif',
      dit: 'Voici les fonctions à connaître, qu\'on va voir dans ce chapitre et les suivants :',
      visuel: { type: 'encart', label: 'Les fonctions à connaître', liste: ['**Texte** : GAUCHE(), DROITE(), STXT(), TEXTE(), CONCAT()', '**Math** : ARRONDI(), ARRONDI.SUP(), ARRONDI.INF(), TRONQUE()', '**Logique** : SI(), SI.CONDITIONS(), ET(), OU(), NON()', '**Date & heure** : DATEDIF(), AUJOURDHUI(), MOIS(), NB.JOURS.OUVRES.INTL()', '**Recherche** : RECHERCHEV(), RECHERCHEX(), INDEX(), EQUIV()', '**Statistiques** : NB(), NB.SI(), NB.SI.ENS(), SOMME.SI()', '**Financières** : VPM(), VA(), NPM()', '**Divers utiles** : CONVERTIR(), SIERREUR(), TRANSPOSE()'] },
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Tu ne te souviens plus du nom d\'une fonction. Que fais-tu ?',
      visuel: { type: 'question', options: ['Je clique sur fx et je tape ce que je veux faire', 'J\'abandonne, c\'est trop dur'], bonne: 0, explication: 'Le bouton fx (Insérer une fonction) te laisse décrire ton besoin en mots, et Excel propose la bonne fonction. Pas besoin de tout retenir !' },
    },
    { humeur: 'fier', dit: 'Tu sais où chercher et comment te faire aider. Ta boîte à outils est ouverte. Bravo ! 🎉' },
  ],
}

// ====================== CHAPITRE 5 — PARTIE 2 : les fonctions ======================

// --- Leçon 4 : Les arrondis & le tronquage ---
const tabArr5 = (valeur, formule, resultat, entete) => ({
  type: 'tableur',
  cols: ['A', 'B'],
  rows: [1, 2],
  cells: { A1: { t: 'Valeur', entete: true }, B1: { t: entete || 'Résultat', entete: true }, A2: { t: valeur, num: true, ...(formule && formule.includes('A2') ? { ref: true } : {}) }, ...(resultat ? { B2: resultat } : formule ? { B2: { t: formule } } : {}) },
  actif: 'B2',
  formule,
})

const ARRONDIS = {
  id: 'fn-arrondis',
  titre: 'Les arrondis & le tronquage',
  exercices: [EX5.ex34, EX5.ex35, EX5.ex36, EX5.ex37],
  narration: [
    { humeur: 'accueil', dit: 'Arrondir ou tronquer un nombre, c\'est utile pour présenter des prix proprement, simplifier un résultat ou respecter une contrainte pro. Excel a une petite famille de fonctions pour ça.' },
    { humeur: 'pensif', dit: '**ARRONDI** arrondit un nombre au plus proche, selon le nombre de décimales que tu choisis.', visuel: { type: 'formule', formule: '=ARRONDI(nombre ; no_chiffres)' } },
    {
      humeur: 'pensif',
      dit: 'Le 2e argument, **no_chiffres**, décide où on arrondit :',
      visuel: { type: 'encart', label: 'Le rôle de no_chiffres', liste: ['**no_chiffres > 0** : arrondi aux décimales (ex : 2 = deux chiffres après la virgule).', '**no_chiffres = 0** : arrondi à l\'entier le plus proche.', '**no_chiffres < 0** : arrondi à gauche de la virgule (ex : -2 = à la centaine).'] },
    },
    {
      humeur: 'pensif',
      dit: 'Un cas surprenant. **Vrai ou faux ?**',
      visuel: { type: 'vraifaux', affirmation: '=ARRONDI(31415 ; -2) arrondit à la centaine la plus proche et donne 31400.', bonne: true, explication: 'Vrai : un no_chiffres négatif arrondit à GAUCHE de la virgule. -2 = à la centaine. 31415 devient 31400 (la centaine la plus proche).' },
    },
    {
      humeur: 'accueil',
      dit: 'À toi de deviner. **=ARRONDI(12,8 ; 0), combien ça donne ?**',
      visuel: { type: 'question', options: ['13', '12', '12,8'], bonne: 0, explication: '12,8 est plus proche de 13 que de 12, donc ARRONDI le monte à 13. Le 0 signifie « zéro décimale ».' },
    },
    { humeur: 'accueil', dit: '**ARRONDI.INF** arrondit **toujours vers le bas** (vers zéro). Pratique pour ne pas surestimer un résultat (budgets, prévisions prudentes).', visuel: { type: 'formule', formule: '=ARRONDI.INF(nombre ; no_chiffres)' } },
    {
      humeur: 'pensif',
      dit: 'On la construit pas à pas.',
      visuel: {
        type: 'methode',
        titre: 'Construire ARRONDI.INF, pas à pas',
        blocs: [
          { etapes: ['Clique dans une cellule vide (ici B2) et tape **=**'] },
          { capture: tabArr5('76,3', '=') },
          { etapes: ['Tape les premières lettres, puis clique sur la suggestion **ARRONDI.INF**'], depart: 2 },
          { capture: { type: 'autocomplete', cellule: 'B2', saisie: '=ARRONDI', items: [{ nom: 'ARRONDI', desc: 'Arrondit un nombre au nombre de chiffres indiqué.' }, { nom: 'ARRONDI.INF', desc: 'Arrondit un nombre en tendant vers zéro (vers le bas).' }, { nom: 'ARRONDI.SUP' }, { nom: 'ARRONDI.AU.MULTIPLE' }], selection: 1 } },
          { etapes: ['Clique sur la cellule à arrondir (A2)'], depart: 3 },
          { capture: tabArr5('76,3', '=ARRONDI.INF(A2') },
          { etapes: ['Tape **;** puis le nombre de décimales voulu (0 pour un entier)'], depart: 4 },
          { capture: tabArr5('76,3', '=ARRONDI.INF(A2;0') },
          { etapes: ['Ferme la parenthèse **)**, puis appuie sur **Entrée**'], depart: 5 },
          { capture: tabArr5('76,3', '=ARRONDI.INF(A2;0)', { t: '76', num: true, vert: true }) },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: 'À toi. **=ARRONDI.INF(76,3 ; 0), ça donne quoi ?**',
      visuel: { type: 'question', options: ['76', '77', '76,3'], bonne: 0, explication: 'ARRONDI.INF va toujours vers le BAS : 76,3 devient 76, même si 76,3 est plus proche de 76 (ici ça tombe pareil qu\'ARRONDI, mais ARRONDI.INF descendrait aussi 76,9 à 76).' },
    },
    {
      humeur: 'pensif',
      dit: 'Trois exemples pour bien voir :',
      visuel: { type: 'encart', label: 'ARRONDI.INF en exemples', liste: ['=ARRONDI.INF(76,3 ; 0) → **76** (entier juste en dessous).', '=ARRONDI.INF(3,14159 ; 3) → **3,141** (coupe après 3 décimales).', '=ARRONDI.INF(31415 ; -2) → **31400** (centaine inférieure).'] },
    },
    { humeur: 'accueil', dit: '**ARRONDI.SUP** fait l\'inverse : il arrondit **toujours vers le haut**. Idéal pour prévoir une marge (prix, temps, stocks).', visuel: { type: 'formule', formule: '=ARRONDI.SUP(nombre ; no_chiffres)' } },
    {
      humeur: 'pensif',
      dit: 'On la construit de la même façon, en images.',
      visuel: {
        type: 'methode',
        titre: 'Construire ARRONDI.SUP',
        blocs: [
          { etapes: ['Dans une cellule vide, tape **=** puis les premières lettres, et clique sur **ARRONDI.SUP**'] },
          { capture: { type: 'autocomplete', cellule: 'B2', saisie: '=ARRONDI', items: [{ nom: 'ARRONDI' }, { nom: 'ARRONDI.INF' }, { nom: 'ARRONDI.SUP', desc: 'Arrondit un nombre à l\'entier ou à la décimale supérieure (vers le haut).' }], selection: 2 } },
          { etapes: ['Clique sur la cellule (A2), tape **;** le nombre de décimales (0)'], depart: 2 },
          { capture: tabArr5('76,3', '=ARRONDI.SUP(A2;0') },
          { etapes: ['Ferme la parenthèse **)**, puis **Entrée** : 76,3 monte à 77'], depart: 3 },
          { capture: tabArr5('76,3', '=ARRONDI.SUP(A2;0)', { t: '77', num: true, vert: true }) },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: 'À toi. **=ARRONDI.SUP(76,3 ; 0), ça donne quoi ?**',
      visuel: { type: 'question', options: ['77', '76', '80'], bonne: 0, explication: 'ARRONDI.SUP va toujours vers le HAUT : même 76,1 monterait à 77. C\'est parfait pour prévoir une marge (arrondir un temps, un stock, un prix au-dessus).' },
    },
    {
      humeur: 'pensif',
      dit: 'Les mêmes valeurs, arrondies vers le haut :',
      visuel: { type: 'encart', label: 'ARRONDI.SUP en exemples', liste: ['=ARRONDI.SUP(76,3 ; 0) → **77** (entier juste au-dessus).', '=ARRONDI.SUP(3,14159 ; 3) → **3,142** (vers le haut à la 3e décimale).', '=ARRONDI.SUP(31415 ; -2) → **31500** (centaine supérieure).'] },
    },
    { humeur: 'accueil', dit: '**TRONQUE** ne fait pas d\'arrondi du tout : il **coupe** simplement la partie qu\'on ne garde pas. Le résultat reste toujours inférieur ou égal à la valeur d\'origine.', visuel: { type: 'formule', formule: '=TRONQUE(nombre ; no_chiffres)' } },
    {
      humeur: 'pensif',
      dit: 'On la construit pas à pas, comme les arrondis.',
      visuel: {
        type: 'methode',
        titre: 'Construire TRONQUE',
        blocs: [
          { etapes: ['Dans une cellule vide, tape **=** puis les premières lettres, et clique sur **TRONQUE**'] },
          { capture: { type: 'autocomplete', cellule: 'B2', saisie: '=TRON', items: [{ nom: 'TRONQUE', desc: 'Tronque un nombre en supprimant les décimales, sans arrondir.' }], selection: 0 } },
          { etapes: ['Clique sur la cellule (A2), tape **;** le nombre de décimales à garder (0)'], depart: 2 },
          { capture: tabArr5('76,3', '=TRONQUE(A2;0') },
          { etapes: ['Ferme la parenthèse **)**, puis **Entrée** : 76,3 devient 76 (la décimale est juste coupée)'], depart: 3 },
          { capture: tabArr5('76,3', '=TRONQUE(A2;0)', { t: '76', num: true, vert: true }) },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Les mêmes valeurs, tronquées :',
      visuel: { type: 'encart', label: 'TRONQUE en exemples', liste: ['=TRONQUE(76,3 ; 0) → **76** (supprime la décimale, sans arrondir).', '=TRONQUE(3,14159 ; 3) → **3,141** (coupe après 3 décimales).', '=TRONQUE(31415 ; -2) → **31400** (coupe à la centaine).'] },
    },
    {
      humeur: 'pensif',
      dit: 'La différence clé entre ARRONDI et TRONQUE :',
      visuel: { type: 'encart', label: 'ARRONDI vs TRONQUE', liste: ['**ARRONDI** regarde la valeur et arrondit au plus proche : 12,8 → **13**.', '**TRONQUE** ne regarde rien, il coupe : 12,8 → **12**.', 'Pour un nombre positif, TRONQUE donne le même résultat qu\'ARRONDI.INF, mais c\'est une simple coupe, pas un arrondi.'] },
    },
    {
      humeur: 'accueil',
      dit: 'La question qui fait la différence. La valeur est 12,8. **=TRONQUE(12,8 ; 0), combien ça donne ?**',
      visuel: { type: 'question', options: ['12', '13', '12,8'], bonne: 0, explication: 'TRONQUE COUPE, il n\'arrondit pas : il jette la partie décimale. 12,8 devient 12 (alors qu\'ARRONDI donnerait 13).' },
    },
    { humeur: 'accueil', dit: 'Côte à côte : la même valeur 12,8, traitée par les deux.', visuel: { type: 'tableur', cols: ['A', 'B', 'C'], rows: [1, 2], cells: { A1: { t: 'Valeur', entete: true }, B1: { t: 'ARRONDI', entete: true }, C1: { t: 'TRONQUE', entete: true }, A2: { t: '12,8', num: true }, B2: { t: '13', num: true, vert: true }, C2: { t: '12', num: true, vert: true } }, legende: 'ARRONDI(12,8;0) = 13, mais TRONQUE(12,8;0) = 12.' } },
    {
      humeur: 'pensif',
      dit: 'Attention au piège. **Vrai ou faux ?**',
      visuel: { type: 'vraifaux', affirmation: '=ARRONDI(2,4 ; 0) donne 3.', bonne: false, explication: 'ARRONDI ne passe au-dessus qu\'à partir de ,5 : 2,4 devient 2. Pour forcer vers le haut quoi qu\'il arrive, c\'est ARRONDI.SUP.' },
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Quelle fonction arrondit **toujours vers le bas** ?',
      visuel: { type: 'question', options: ['ARRONDI.INF', 'ARRONDI.SUP'], bonne: 0, explication: 'ARRONDI.INF arrondit toujours vers le bas (vers zéro). ARRONDI.SUP, lui, va toujours vers le haut.' },
    },
    { humeur: 'fier', dit: 'ARRONDI, ARRONDI.INF, ARRONDI.SUP, TRONQUE : tu choisis exactement comment présenter tes nombres. Bravo ! 🎉' },
  ],
}

// --- Leçon 5 : Les fonctions de date ---
// Date du jour, recalculée à chaque ouverture de l'app (pour illustrer AUJOURDHUI()).
const _auj = new Date()
const dateAujFR = _auj.toLocaleDateString('fr-FR')
const ansDepuis = (annee, mois, jour) => {
  let a = _auj.getFullYear() - annee
  const m = _auj.getMonth() + 1
  const d = _auj.getDate()
  if (m < mois || (m === mois && d < jour)) a--
  return a
}
const tabDate = (a2, formule, resultat, libA) => ({
  type: 'tableur',
  cols: ['A', 'B'],
  rows: [1, 2],
  cells: { A1: { t: libA || 'Date', entete: true }, B1: { t: 'Résultat', entete: true }, A2: { t: a2, ...(formule && formule.includes('A2') ? { ref: true } : {}) }, ...(resultat ? { B2: resultat } : formule ? { B2: { t: formule } } : {}) },
  actif: 'B2',
  formule,
})
// Tableur DATEDIF : Début (31/03/1990), Fin = AUJOURDHUI() (date du jour), Ancienneté en C2.
const tabDdif = (cf, resultat) => {
  const refsCouleur = {}
  if (cf.includes('A2')) refsCouleur.A2 = 'bleu'
  if (cf.includes('B2')) refsCouleur.B2 = 'ambre'
  return {
    type: 'tableur',
    cols: ['A', 'B', 'C'],
    rows: [1, 2],
    cells: { A1: { t: 'Début', entete: true }, B1: { t: 'Fin (=AUJOURDHUI())', entete: true }, C1: { t: 'Ancienneté', entete: true }, A2: { t: '31/03/1990' }, B2: { t: dateAujFR }, ...(resultat ? { C2: resultat } : { C2: { t: cf } }) },
    actif: 'C2',
    formule: cf,
    refsCouleur,
  }
}

const FONCTIONSDATE = {
  id: 'fn-fonctionsdate',
  titre: 'Les fonctions de date',
  exercices: [EX5.ex39],
  narration: [
    { humeur: 'accueil', dit: 'Les fonctions de date servent à découper une date (année, mois, jour) ou à calculer des durées : ancienneté, délai, jours restants, jours ouvrés… Très utile pour les plannings et les suivis.' },
    { humeur: 'pensif', dit: '**ANNEE** renvoie l\'année d\'une date, **MOIS** renvoie le numéro du mois (1 = janvier, 12 = décembre).', visuel: { type: 'formule', formule: '=ANNEE(date)   =MOIS(date)' } },
    {
      humeur: 'pensif',
      dit: 'On construit ANNEE pas à pas (MOIS marche pareil).',
      visuel: {
        type: 'methode',
        titre: 'Construire ANNEE',
        blocs: [
          { etapes: ['Clique dans une cellule vide', 'Tape **=** puis les premières lettres, clique sur **ANNEE**', 'Clique sur la cellule qui contient la date (A2)', 'Ferme la parenthèse, puis **Entrée**'] },
          { capture: tabDate('11/05/2025', '=ANNEE(A2)', { t: '2025', num: true, vert: true }) },
          { note: 'Tu peux aussi saisir la date directement entre guillemets : =ANNEE("11/05/2025").' },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: 'À toi. La date en A2 est le 11/05/2025. **=ANNEE(A2), ça donne quoi ?**',
      visuel: { type: 'question', options: ['2025', '5', '11'], bonne: 0, explication: 'ANNEE extrait l\'année : 2025. (MOIS donnerait 5, JOUR donnerait 11.)' },
    },
    { humeur: 'accueil', dit: '**JOURSEM** renvoie le jour de la semaine sous forme de chiffre. Le 2e argument, **type_retour**, choisit par quel jour commence la semaine.', visuel: { type: 'formule', formule: '=JOURSEM(date ; type_retour)' } },
    {
      humeur: 'pensif',
      dit: 'Les valeurs de type_retour :',
      visuel: { type: 'encart', label: 'L\'option type_retour', liste: ['**1** (ou vide) : 1 = dimanche … 7 = samedi.', '**2** : 1 = lundi … 7 = dimanche.', '**3** : 0 = lundi … 6 = dimanche.'] },
    },
    { humeur: 'accueil', dit: '**DATEDIF** calcule la durée entre deux dates (années, mois ou jours). Parfait pour une ancienneté ou un délai.', visuel: { type: 'formule', formule: '=DATEDIF(date_début ; date_fin ; "unité")' } },
    {
      humeur: 'pensif',
      dit: 'Le 3e argument, **l\'unité** (entre guillemets), choisit ce que tu calcules. Chacune avec un exemple :',
      visuel: { type: 'encart', label: 'Les unités de DATEDIF', liste: ['**"Y"** : années entières. Ex : 35.', '**"M"** : mois entiers. Ex : 423.', '**"D"** : nombre total de jours. Ex : 12 878.', '**"YM"** : mois restants, une fois les années retirées. Ex : 3.', '**"MD"** : jours restants, une fois les mois retirés. Ex : 2.', '**"YD"** : jours écoulés sans tenir compte de l\'année.', 'En combinant **"Y" + "YM" + "MD"**, tu obtiens une durée lisible : « 35 ans, 3 mois et 2 jours ».'] },
    },
    { humeur: 'accueil', dit: `Exemple concret : l'ancienneté entre le 31/03/1990 et aujourd'hui. En B2, on met **=AUJOURDHUI()** (la date du jour, ${dateAujFR}), et on construit DATEDIF qui pointe sur A2 et B2.` },
    {
      humeur: 'pensif',
      dit: 'DATEDIF est un peu spéciale : Excel ne la suggère pas. On la tape donc en entier, pas à pas.',
      visuel: {
        type: 'methode',
        titre: 'Construire DATEDIF, pas à pas',
        blocs: [
          { etapes: ['Dans la cellule résultat (C2), tape **=DATEDIF(** en entier (aucune suggestion n\'apparaît, c\'est normal)'] },
          { capture: tabDdif('=DATEDIF(') },
          { etapes: ['Clique sur la **date de début** (A2), puis tape **;**'], depart: 2 },
          { capture: tabDdif('=DATEDIF(A2;') },
          { etapes: ['Clique sur la **date de fin** (B2), puis tape **;**'], depart: 3 },
          { capture: tabDdif('=DATEDIF(A2;B2;') },
          { etapes: ['Tape l\'unité entre guillemets : **"Y"** pour des années'], depart: 4 },
          { capture: tabDdif('=DATEDIF(A2;B2;"Y"') },
          { etapes: ['Ferme la parenthèse **)**, puis **Entrée**'], depart: 5 },
          { capture: { ...tabDdif('=DATEDIF(A2;B2;"Y")', { t: `${ansDepuis(1990, 3, 31)} ans`, vert: true }), legende: `Comme B2 = AUJOURDHUI(), l'ancienneté (${ansDepuis(1990, 3, 31)} ans) se recalcule toute seule chaque jour.` } },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Un détail à connaître sur DATEDIF :',
      visuel: { type: 'encart', label: 'Bon à savoir', texte: 'Quand tu tapes =DATEDIF, **aucune suggestion ne s\'affiche**, c\'est normal : écris-la en entier. Combine-la avec **AUJOURDHUI()** pour une durée qui se met à jour toute seule.' },
    },
    {
      humeur: 'pensif',
      dit: 'L\'astuce qui rend ça vivant. **Vrai ou faux ?**',
      visuel: { type: 'vraifaux', affirmation: 'Si la date de fin est =AUJOURDHUI(), l\'ancienneté calculée par DATEDIF se met à jour toute seule chaque jour.', bonne: true, explication: 'Vrai : AUJOURDHUI() renvoie la date du jour, recalculée à chaque ouverture. L\'ancienneté (ou le délai) reste donc toujours exacte, sans rien retoucher.' },
    },
    { humeur: 'accueil', dit: '**NB.JOURS.OUVRES.INTL** compte les jours travaillés entre deux dates (hors week-ends et jours fériés).', visuel: { type: 'formule', formule: '=NB.JOURS.OUVRES.INTL(début ; fin ; [weekend] ; [fériés])' } },
    {
      humeur: 'pensif',
      dit: 'Ses deux arguments facultatifs, bien pratiques :',
      visuel: { type: 'encart', label: 'Les options', liste: ['**[weekend]** : adapte les jours non travaillés (utile si ton week-end est décalé, ex : vendredi-samedi).', '**[jours_fériés]** : une plage de cellules (ex : F2:F10) ou une liste de dates à exclure, pour un total plus juste.'] },
    },
    {
      humeur: 'pensif',
      dit: 'On la construit pas à pas.',
      visuel: {
        type: 'methode',
        titre: 'Construire NB.JOURS.OUVRES.INTL',
        blocs: [
          { etapes: ['Clique dans une cellule vide, tape **=** puis les premières lettres', 'Clique sur la suggestion **NB.JOURS.OUVRES.INTL**'] },
          { capture: { type: 'autocomplete', cellule: 'C2', saisie: '=NB.JOURS', items: [{ nom: 'NB.JOURS' }, { nom: 'NB.JOURS.OUVRES' }, { nom: 'NB.JOURS.OUVRES.INTL', desc: 'Nombre de jours ouvrés entre deux dates (week-ends et fériés exclus).' }], selection: 2 } },
          { etapes: ['Clique sur la **date de début** (A2), tape **;** puis clique sur la **date de fin** (B2)'], depart: 3 },
          { capture: { type: 'tableur', cols: ['A', 'B', 'C'], rows: [1, 2], cells: { A1: { t: 'Début', entete: true }, B1: { t: 'Fin', entete: true }, C1: { t: 'Jours ouvrés', entete: true }, A2: { t: '01/04/2025' }, B2: { t: '30/04/2025' }, C2: { t: '=NB.JOURS.OUVRES.INTL(A2;B2' } }, formule: '=NB.JOURS.OUVRES.INTL(A2;B2', actif: 'C2', refsCouleur: { A2: 'bleu', B2: 'ambre' } } },
          { etapes: ['Si besoin, ajoute les **jours fériés** à exclure, ferme la parenthèse **)**, puis **Entrée**'], depart: 4 },
          { capture: { type: 'tableur', cols: ['A', 'B', 'C'], rows: [1, 2], cells: { A1: { t: 'Début', entete: true }, B1: { t: 'Fin', entete: true }, C1: { t: 'Jours ouvrés', entete: true }, A2: { t: '01/04/2025' }, B2: { t: '30/04/2025' }, C2: { t: '22', num: true, vert: true } }, formule: '=NB.JOURS.OUVRES.INTL(A2;B2)', actif: 'C2', refsCouleur: { A2: 'bleu', B2: 'ambre' }, legende: 'Du 1er au 30 avril 2025 : 22 jours ouvrés (week-ends exclus).' } },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Du **1er au 30 avril 2025**, en comptant seulement les jours travaillés (les week-ends exclus), combien de jours ouvrés à peu près ?',
      visuel: { type: 'question', options: ['22', '30', '8'], bonne: 0, explication: 'Avril 2025 compte 30 jours, dont 8 de week-end : il reste 22 jours ouvrés. C\'est exactement ce que renvoie NB.JOURS.OUVRES.INTL.' },
    },
    { humeur: 'accueil', dit: '**SERIE.JOURS.OUVRES** fait l\'inverse : à partir d\'une date, elle ajoute (ou retire) un nombre de jours ouvrés pour trouver une date d\'échéance ou de livraison.', visuel: { type: 'formule', formule: '=SERIE.JOURS.OUVRES(début ; nb_jours ; [fériés])' } },
    {
      humeur: 'pensif',
      dit: 'Pareil, pas à pas.',
      visuel: {
        type: 'methode',
        titre: 'Construire SERIE.JOURS.OUVRES',
        blocs: [
          { etapes: ['Clique dans une cellule vide, tape **=** puis les premières lettres, clique sur **SERIE.JOURS.OUVRES**'] },
          { capture: { type: 'autocomplete', cellule: 'C2', saisie: '=SERIE', items: [{ nom: 'SERIE.JOUR' }, { nom: 'SERIE.JOURS.OUVRES', desc: 'Date située un nombre de jours ouvrés avant ou après une date.' }, { nom: 'SERIE.JOURS.OUVRES.INTL' }], selection: 1 } },
          { etapes: ['Clique sur la **date de début** (A2), tape **;** puis le **nombre de jours ouvrés** à ajouter (B2)'], depart: 2 },
          { capture: { type: 'tableur', cols: ['A', 'B', 'C'], rows: [1, 2], cells: { A1: { t: 'Début', entete: true }, B1: { t: 'Jours ouvrés', entete: true }, C1: { t: 'Échéance', entete: true }, A2: { t: '01/04/2025' }, B2: { t: '10', num: true }, C2: { t: '=SERIE.JOURS.OUVRES(A2;B2' } }, formule: '=SERIE.JOURS.OUVRES(A2;B2', actif: 'C2', refsCouleur: { A2: 'bleu', B2: 'ambre' } } },
          { etapes: ['Ferme la parenthèse **)**, puis **Entrée**'], depart: 3 },
          { capture: { type: 'tableur', cols: ['A', 'B', 'C'], rows: [1, 2], cells: { A1: { t: 'Début', entete: true }, B1: { t: 'Jours ouvrés', entete: true }, C1: { t: 'Échéance', entete: true }, A2: { t: '01/04/2025' }, B2: { t: '10', num: true }, C2: { t: '15/04/2025', vert: true } }, formule: '=SERIE.JOURS.OUVRES(A2;B2)', actif: 'C2', refsCouleur: { A2: 'bleu', B2: 'ambre' }, legende: '10 jours ouvrés après le 01/04/2025 → échéance le 15/04/2025.' } },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Un réflexe puissant. **Vrai ou faux ?**',
      visuel: { type: 'vraifaux', affirmation: 'Avec SERIE.JOURS.OUVRES, un nombre de jours négatif (ex : -10) permet de REMONTER dans le temps.', bonne: true, explication: 'Vrai : -10 recule de 10 jours ouvrés. Pratique pour retrouver « quand dois-je commencer pour livrer à telle date ? ».' },
    },
    {
      humeur: 'pensif',
      dit: 'Une astuce et des erreurs à éviter :',
      visuel: { type: 'encart', label: 'À retenir', liste: ['Utilise un **nombre négatif** pour remonter dans le temps (ex : -10 = reculer de 10 jours ouvrés).', 'Vérifie que tes dates sont bien au **format date** (pas du texte), sinon le calcul est faussé.', 'Pense à exclure les **jours fériés**, sinon tes échéances seront décalées.'] },
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Quelle fonction compte les jours ouvrés entre deux dates ?',
      visuel: { type: 'question', options: ['NB.JOURS.OUVRES.INTL', 'ANNEE'], bonne: 0, explication: 'NB.JOURS.OUVRES.INTL compte les jours travaillés (hors week-ends et fériés). ANNEE, elle, extrait juste l\'année d\'une date.' },
    },
    { humeur: 'fier', dit: 'Années, mois, jours de la semaine, durées, jours ouvrés : tu pilotes le temps dans Excel. Bravo ! 🎉' },
  ],
}

// --- Leçon 6 : Les fonctions de texte ---
const tabTxt = (a2, formule, resultat, libA) => ({
  type: 'tableur',
  cols: ['A', 'B'],
  rows: [1, 2],
  cells: { A1: { t: libA || 'Texte', entete: true }, B1: { t: 'Résultat', entete: true }, A2: { t: a2, ...(formule && formule.includes('A2') ? { ref: true } : {}) }, ...(resultat ? { B2: resultat } : formule ? { B2: { t: formule } } : {}) },
  actif: 'B2',
  formule,
})

const FONCTIONSTEXTE = {
  id: 'fn-fonctionstexte',
  titre: 'Les fonctions de texte',
  exercices: [],
  narration: [
    { humeur: 'accueil', dit: 'Les fonctions de texte servent à reformater ou découper du texte : afficher une date joliment, extraire un prénom, isoler un code… Pratique pour nettoyer un fichier.' },
    { humeur: 'pensif', dit: '**TEXTE** affiche une valeur (date, nombre…) dans le format exact que tu veux, écrit entre guillemets.', visuel: { type: 'formule', formule: '=TEXTE(valeur ; "format")' } },
    {
      humeur: 'pensif',
      dit: 'Le « format » est une **chaîne** (du texte entre guillemets). Pour une date, on combine ces lettres :',
      visuel: { type: 'encart', label: 'Les codes de format de date', liste: ['**j / jj** : jour sans / avec le zéro (5 ou 05).', '**mmm / mmmm** : mois en abrégé (mar) / en entier (mars).', '**aa / aaaa** : année sur 2 / 4 chiffres (25 ou 2025).'] },
    },
    {
      humeur: 'pensif',
      dit: 'On la construit pas à pas.',
      visuel: {
        type: 'methode',
        titre: 'Construire TEXTE',
        blocs: [
          { etapes: ['Clique dans la cellule cible, tape **=TEXTE(**', 'Clique sur la cellule qui contient la valeur (A2)', 'Tape **;** puis le format entre guillemets : "jj mmmm aaaa"', 'Ferme la parenthèse, puis **Entrée**'] },
          { capture: { type: 'autocomplete', cellule: 'B2', saisie: '=TEX', items: [{ nom: 'TEXTE', desc: 'Convertit une valeur en texte, dans le format que tu choisis.' }, { nom: 'TEXTE.AVANT' }, { nom: 'TEXTE.APRES' }, { nom: 'TEXTEJOINDRE' }], selection: 0 } },
          { capture: tabTxt('15/04/2025', '=TEXTE(A2;"jj mmmm aaaa")', { t: '15 avril 2025', vert: true }) },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'TEXTE ne sert pas qu\'aux dates :',
      visuel: { type: 'encart', label: 'Autres usages', liste: ['=TEXTE(123 ; "00000") → « 00123 » (codes clients à longueur fixe).', '=TEXTE(2,5 ; "0,000 kg") → « 2,500 kg » (ajoute automatiquement l\'unité).'] },
    },
    {
      humeur: 'pensif',
      dit: 'Vérifions le rôle de TEXTE. **Vrai ou faux ?**',
      visuel: { type: 'vraifaux', affirmation: '=TEXTE(15/04/2025 ; "jj mmmm aaaa") affiche « 15 avril 2025 ».', bonne: true, explication: 'Vrai : « jj » = jour sur 2 chiffres, « mmmm » = mois en toutes lettres, « aaaa » = année sur 4 chiffres. TEXTE habille la valeur exactement comme tu l\'écris entre guillemets.' },
    },
    { humeur: 'accueil', dit: '**GAUCHE** extrait les premiers caractères (par la gauche), **DROITE** les derniers (par la droite).', visuel: { type: 'formule', formule: '=GAUCHE(texte ; no_car)   =DROITE(texte ; no_car)' } },
    {
      humeur: 'pensif',
      dit: 'On construit GAUCHE pas à pas (DROITE marche pareil).',
      visuel: {
        type: 'methode',
        titre: 'Construire GAUCHE',
        blocs: [
          { etapes: ['Clique dans la cellule cible, tape **=GAUCHE(**', 'Clique sur la cellule de texte (A2)', 'Tape **;** puis le nombre de caractères à garder', 'Ferme la parenthèse, puis **Entrée**'] },
          { capture: { type: 'autocomplete', cellule: 'B2', saisie: '=GAU', items: [{ nom: 'GAUCHE', desc: 'Extrait les premiers caractères (à gauche) d\'un texte.' }, { nom: 'GAUCHEB' }], selection: 0 } },
          { capture: tabTxt('FR-2025-001', '=GAUCHE(A2;2)', { t: 'FR', vert: true }, 'Code') },
          { note: 'GAUCHE et DROITE sont parfaites pour isoler un préfixe (code pays, code produit) ou créer une clé pour un RECHERCHEV.' },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Le code en A2 est **« FR-2025-001 »**. **=DROITE(A2 ; 3), ça donne quoi ?**',
      visuel: { type: 'question', options: ['001', 'FR-', '025'], bonne: 0, explication: 'DROITE prend les caractères par la fin : les 3 derniers de « FR-2025-001 », c\'est « 001 » (le numéro de série).' },
    },
    { humeur: 'accueil', dit: '**DROITE** marche exactement comme **GAUCHE**, sauf qu\'elle compte **à partir de la droite** : elle prend la **fin** du texte. Ici, les 3 derniers caractères du code donnent bien « 001 ».', visuel: tabTxt('FR-2025-001', '=DROITE(A2;3)', { t: '001', vert: true }, 'Code') },
    { humeur: 'accueil', dit: '**STXT** extrait un morceau **au milieu** : tu indiques à quelle position commencer et combien de caractères prendre.', visuel: { type: 'formule', formule: '=STXT(texte ; position_départ ; nb_caractères)' } },
    { humeur: 'accueil', dit: 'Notre but ici : dans le code **« FR-2025-001 »**, isoler **l\'année 2025**. Elle commence au **4e caractère** et fait **4 caractères** : c\'est exactement ce qu\'on va dire à STXT.', visuel: { type: 'tableur', cols: ['A'], rows: [1, 2], cells: { A1: { t: 'Code', entete: true }, A2: { t: 'FR-2025-001' } }, legende: 'F(1) R(2) -(3) 2(4) 0(5) 2(6) 5(7) : « 2025 » commence en position 4, sur 4 caractères.' } },
    {
      humeur: 'pensif',
      dit: 'Maintenant, on la construit pas à pas pour isoler ce « 2025 ».',
      visuel: {
        type: 'methode',
        titre: 'Construire STXT, pas à pas',
        blocs: [
          { etapes: ['Dans la cellule cible, tape **=STXT(** (ou choisis-la dans la liste)'] },
          { capture: { type: 'autocomplete', cellule: 'B2', saisie: '=STXT', items: [{ nom: 'STXT', desc: 'Extrait des caractères au milieu d\'un texte, à partir d\'une position.' }, { nom: 'STXTB' }], selection: 0 } },
          { etapes: ['Clique sur la cellule de texte (A2)'], depart: 2 },
          { capture: tabTxt('FR-2025-001', '=STXT(A2', null, 'Code') },
          { etapes: ['Tape **;** puis la **position de départ** (4 = on commence au 4e caractère)'], depart: 3 },
          { capture: tabTxt('FR-2025-001', '=STXT(A2;4', null, 'Code') },
          { etapes: ['Tape **;** puis le **nombre de caractères** à prendre (4)'], depart: 4 },
          { capture: tabTxt('FR-2025-001', '=STXT(A2;4;4', null, 'Code') },
          { etapes: ['Ferme la parenthèse **)**, puis **Entrée**'], depart: 5 },
          { capture: tabTxt('FR-2025-001', '=STXT(A2;4;4)', { t: '2025', vert: true }, 'Code') },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: 'On a dit à STXT de partir du 4e caractère et d\'en prendre 4, sur « FR-2025-001 ». **Qu\'est-ce qui s\'affiche ?**',
      visuel: { type: 'question', options: ['2025', '-202', 'R-20'], bonne: 0, explication: 'On commence en position 4 (le « 2 » de 2025) et on prend 4 caractères : « 2025 ». STXT extrait pile au milieu.' },
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Pour extraire les 3 premiers caractères de A2, tu écris...',
      visuel: { type: 'question', options: ['=GAUCHE(A2;3)', '=DROITE(A2;3)'], bonne: 0, explication: 'GAUCHE part du début (la gauche) et prend le nombre de caractères demandé. DROITE, elle, part de la fin.' },
    },
    { humeur: 'fier', dit: 'TEXTE, GAUCHE, DROITE, STXT : tu mets en forme et tu découpes le texte comme tu veux. Bravo ! 🎉' },
  ],
}

// --- Leçon 7 : Les fonctions financières ---
// Tableur prêt pour NPM : Capital (B1), Taux annuel (B2), Mensualité (B3), Durée en B4.
const tabNpm = (cf, resultat) => {
  const rc = {}
  if (cf.includes('B2')) rc.B2 = 'bleu'
  if (cf.includes('B3')) rc.B3 = 'ambre'
  if (cf.includes('B1')) rc.B1 = 'violet'
  return {
    type: 'tableur',
    cols: ['A', 'B'],
    rows: [1, 2, 3, 4],
    cells: { A1: { t: 'Capital', entete: true }, B1: { t: '10 000 €' }, A2: { t: 'Taux annuel', entete: true }, B2: { t: '2 %' }, A3: { t: 'Mensualité', entete: true }, B3: { t: '-102,45 €' }, A4: { t: 'Durée (mois)', entete: true }, ...(resultat ? { B4: resultat } : { B4: { t: cf } }) },
    actif: 'B4',
    formule: cf,
    refsCouleur: rc,
  }
}

const FONCTIONSFINANCIERES = {
  id: 'fn-fonctionsfinancieres',
  titre: 'Les fonctions financières : VPM, VA, NPM',
  exercices: [EX5.ex45, EX5.ex46, EX5.ex47],
  narration: [
    { humeur: 'accueil', dit: 'Trois fonctions financières à connaître pour modéliser un prêt ou un investissement : **VPM** (la mensualité), **VA** (la valeur actuelle) et **NPM** (le nombre de paiements).' },
    { humeur: 'pensif', dit: 'Tu connais déjà **VPM** (ceinture verte) : elle calcule la **mensualité** d\'un prêt. Petit rappel, et si tu maîtrises, utilise « Je connais, passer » en haut.', visuel: { type: 'formule', formule: '=VPM(taux ; nb_périodes ; valeur_actuelle)' } },
    { humeur: 'pensif', dit: 'Exemple : 15 000 € à 5 % par an sur 120 mois → =VPM(5%/12 ; 120 ; -15000) ≈ -159,10 €/mois.', visuel: tabVPM(true) },
    { humeur: 'accueil', dit: '**VA (Valeur Actuelle)** répond à une question simple : « combien vaut **aujourd\'hui** de l\'argent que je vais recevoir (ou verser) plus tard ? » Car 100 € dans 5 ans valent moins que 100 € aujourd\'hui : avec les intérêts, l\'argent « perd de la valeur » avec le temps.' },
    {
      humeur: 'pensif',
      dit: 'Une idée clé à valider. **Vrai ou faux ?**',
      visuel: { type: 'vraifaux', affirmation: 'Recevoir 100 € dans 5 ans, ça vaut aujourd\'hui un peu MOINS que 100 €.', bonne: true, explication: 'Vrai : c\'est le principe de la valeur actuelle. 100 € placés aujourd\'hui rapporteraient des intérêts, donc 100 € plus tard valent moins qu\'aujourd\'hui. C\'est ce que calcule VA.' },
    },
    { humeur: 'pensif', dit: 'Exemple concret : on te promet **200 € par mois pendant 3 ans** (36 mois), avec un taux de 4 % par an. Combien vaut cette promesse aujourd\'hui ? Réponse de VA : environ **6 769 €**.', visuel: { type: 'tableur', cols: ['A', 'B'], rows: [1, 2, 3, 4], cells: { A1: { t: 'Versement /mois', entete: true }, B1: { t: '200 €' }, A2: { t: 'Durée (mois)', entete: true }, B2: { t: '36' }, A3: { t: 'Taux annuel', entete: true }, B3: { t: '4 %' }, A4: { t: 'Valeur aujourd\'hui', entete: true }, B4: { t: '6 769 €', vert: true } }, formule: '=VA(B3/12;B2;-B1)', actif: 'B4', refsCouleur: { B3: 'bleu', B2: 'ambre', B1: 'violet' }, legende: 'Recevoir 200 €/mois pendant 3 ans, ça vaut ≈ 6 769 € aujourd\'hui.' } },
    { humeur: 'pensif', dit: 'Sa structure :', visuel: { type: 'formule', formule: '=VA(taux ; n_périodes ; vpm ; [vc] ; [type])' } },
    {
      humeur: 'pensif',
      dit: 'Ses arguments :',
      visuel: { type: 'encart', label: 'Les arguments de VA', liste: ['**Taux** : taux d\'intérêt par période (taux annuel ÷ 12 pour du mensuel).', '**N_périodes** : nombre total de paiements.', '**VPM** : montant de chaque paiement (négatif si c\'est une sortie d\'argent).', '**[VC]** et **[Type]** : facultatifs (valeur finale visée ; paiement en début ou fin de période).'] },
    },
    {
      humeur: 'pensif',
      dit: 'L\'erreur n°1 sur VA (et VPM, NPM) :',
      visuel: { type: 'encart', label: 'Toujours diviser le taux par 12 !', texte: 'Le taux est donné **par an**, mais les paiements sont **par mois**. Il faut donc le taux **par mois** : on divise le taux annuel par 12 (ex : 4 % par an → **4%/12**). Si tu oublies, Excel calcule comme si tu payais 4 % **chaque mois** (soit 48 % par an !), et le résultat n\'a plus aucun sens.' },
    },
    {
      humeur: 'pensif',
      dit: 'L\'erreur à ne jamais faire. **Vrai ou faux ?**',
      visuel: { type: 'vraifaux', affirmation: 'Pour des paiements mensuels avec un taux annuel de 4 %, on met directement 4 % comme argument Taux.', bonne: false, explication: 'Non : il faut le taux PAR MOIS, donc 4%/12. Mettre 4 % reviendrait à 4 % chaque mois (≈ 48 %/an), et le résultat serait absurde.' },
    },
    {
      humeur: 'accueil',
      dit: 'On la construit avec l\'assistant, pas à pas (c\'est une formule un peu costaude, autant être guidé·e).',
      visuel: {
        type: 'methode',
        titre: 'Construire VA avec l\'assistant',
        blocs: [
          { etapes: ['Clique sur la cellule du résultat, puis sur le bouton **fx**', 'Choisis la catégorie **Financières**, sélectionne **VA**, puis **OK**'] },
          { capture: { type: 'assistant', categorie: 'Financières', fonctions: ['TAUX', 'VA', 'VAN', 'VC', 'VPM'], selection: 1, signature: 'VA(taux;npm;vpm;[vc];[type])', description: 'Renvoie la valeur actuelle : ce que vaut aujourd\'hui une série de versements futurs.', focus: 'liste' } },
          { etapes: ['Renseigne les arguments (les **obligatoires** sont en gras), puis clique sur **OK**'], depart: 3 },
          { capture: { type: 'arguments', fonction: 'VA', args: [{ label: 'Taux', ref: '4%/12', valeur: '0,00333', obligatoire: true }, { label: 'Npm', ref: '36', valeur: '36', obligatoire: true }, { label: 'Vpm', ref: '-200', valeur: '-200', obligatoire: true }, { label: 'Vc', ref: '', valeur: 'facultatif' }, { label: 'Type', ref: '', valeur: 'facultatif' }], apercu: '6 769 €', description: 'Renvoie la valeur actuelle d\'un investissement.', resultat: '6 769 €', encadre: true } },
        ],
      },
    },
    { humeur: 'accueil', dit: '**NPM** calcule le **nombre de paiements** nécessaires pour rembourser un emprunt, quand tu connais la mensualité et le capital.', visuel: { type: 'formule', formule: '=NPM(taux ; vpm ; va ; [vc] ; [type])' } },
    { humeur: 'pensif', dit: 'Exemple : un prêt de 10 000 € à 2 %/an, remboursé 102,45 €/mois. On cherche la durée, en construisant NPM pas à pas.', visuel: tabNpm('') },
    { humeur: 'accueil', dit: 'Le résultat (la durée) ira sur la ligne « Durée (mois) ». **Clique la cellule qui va le recevoir.**', visuel: { type: 'cliquecible', support: 'tableur', consigne: 'Clique la cellule de la Durée', cols: ['A', 'B'], rows: [1, 2, 3, 4], cells: { A1: { t: 'Capital', entete: true }, B1: { t: '10 000 €' }, A2: { t: 'Taux annuel', entete: true }, B2: { t: '2 %' }, A3: { t: 'Mensualité', entete: true }, B3: { t: '-102,45 €' }, A4: { t: 'Durée (mois)', entete: true } }, cible: 'B4', explication: 'Oui, B4 : à droite de « Durée (mois) ». C\'est là qu\'on écrit =NPM(…).' } },
    {
      humeur: 'pensif',
      dit: 'Étape par étape, dans la cellule B4 :',
      visuel: {
        type: 'methode',
        titre: 'Construire NPM, pas à pas',
        blocs: [
          { etapes: ['Dans la cellule résultat (B4), tape **=NPM(**'] },
          { capture: tabNpm('=NPM(') },
          { etapes: ['**Le taux par mois** : clique sur le taux annuel (B2) et divise-le par 12, puis tape **;**'], depart: 2 },
          { capture: tabNpm('=NPM(B2/12;') },
          { etapes: ['**La mensualité** : clique sur B3 (en négatif, c\'est une sortie d\'argent), puis tape **;**'], depart: 3 },
          { capture: tabNpm('=NPM(B2/12;B3;') },
          { etapes: ['**Le capital emprunté** : clique sur B1'], depart: 4 },
          { capture: tabNpm('=NPM(B2/12;B3;B1') },
          { etapes: ['Ferme la parenthèse **)**, puis **Entrée** : il faut **107 mois**'], depart: 5 },
          { capture: tabNpm('=NPM(B2/12;B3;B1)', { t: '107', num: true, vert: true }) },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Un dernier réflexe. **Vrai ou faux ?**',
      visuel: { type: 'vraifaux', affirmation: 'Dans NPM (comme dans VPM), la mensualité doit être saisie en NÉGATIF.', bonne: true, explication: 'Vrai : la mensualité est une sortie d\'argent, donc négative (-102,45). Sans le signe moins, le calcul est faussé.' },
    },
    {
      humeur: 'pensif',
      dit: 'Les erreurs à éviter sur VA et NPM :',
      visuel: { type: 'encart', label: 'Erreurs à éviter', liste: ['Utiliser un **taux annuel non converti** : 2 % par an ÷ 12 pour du mensuel (2 % ≠ 2).', 'Oublier le **signe moins** sur la mensualité : sans lui, le résultat est faussé.'] },
    },
    {
      humeur: 'pensif',
      dit: 'Un argument commun aux trois (VPM, VA, NPM), bon à connaître :',
      visuel: { type: 'encart', label: 'Focus : l\'argument VC (valeur future)', texte: '**VC** = ce qu\'il reste à la fin. Par défaut **VC = 0** (prêt soldé). Exemple : tu finances une voiture 20 000 € sur 48 mois mais comptes la revendre 8 000 € à la fin → =VPM(5%/12 ; 48 ; -20000 ; 8000). Tu ne finances alors que les 12 000 € de différence, donc une mensualité plus basse.' },
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Quelle fonction donne le **nombre de mois** pour rembourser un prêt ?',
      visuel: { type: 'question', options: ['NPM', 'VPM'], bonne: 0, explication: 'NPM donne le Nombre de Périodes (de Mensualités). VPM, elle, donne le montant de la mensualité.' },
    },
    { humeur: 'fier', dit: 'VPM, VA, NPM : tu simules un prêt ou un investissement de A à Z. La ceinture bleue est à toi ! 🎉' },
  ],
}

// ======================================================================
// CHAPITRE 6 — Lier des feuilles & Tableaux de synthèse (ceinture marron)
// PARTIE 1 : gérer les feuilles + lier des cellules/feuilles.
// PARTIE 2 (à venir) : liaisons entre classeurs, calculs/références 3D, protection.
// ======================================================================
const U6 = (id) => `https://drive.google.com/file/d/${id}/view?usp=drivesdk`
const EX6 = {
  ex48: { titre: 'Exercice 48 · Gérer les feuilles', url: U6('1lSbCb39V-BvhlHPToOJlByuAGAVyRxtu') },
  ex49: { titre: 'Exercice 49 · Protéger les feuilles', url: U6('1BFYBd5KZemeTtWnh_dsRfhSlLGdCNJGK') },
  ex50: { titre: 'Exercice 50 · Protéger et verrouiller les feuilles', url: U6('18tDrAmtYmebzRMk4w1XAKwjYerBK4kuZ') },
  ex51: { titre: 'Exercice 51 · Les liaisons', url: U6('1NxxrVxepD465ZVXpB4KCOSXgR__Mlm8v') },
}

// --- Leçon 1 : Gérer les feuilles du classeur ---
const GERERFEUILLES = {
  id: 'fn-gererfeuilles',
  titre: 'Gérer les feuilles du classeur',
  exercices: [EX6.ex48],
  narration: [
    { humeur: 'accueil', dit: 'Un classeur Excel peut contenir plusieurs feuilles (les onglets, en bas). On va apprendre à les nommer, ajouter, supprimer, déplacer, copier et colorer, pour bien organiser ton travail.' },
    {
      humeur: 'pensif',
      dit: 'Le petit lexique pour s\'y retrouver :',
      visuel: { type: 'parties', items: [{ label: '**Feuille** : un onglet de calcul, en bas du classeur.' }, { label: '**Onglet** : l\'étiquette cliquable de la feuille (le mot « onglet » désigne aussi ceux du ruban : Accueil, Formules…).' }, { label: '**Classeur** : le fichier Excel (.xlsx) entier, qui contient une ou plusieurs feuilles.' }] },
    },
    {
      humeur: 'pensif',
      dit: 'Pour **renommer** une feuille, le plus rapide : le double-clic.',
      visuel: {
        type: 'methode',
        titre: 'Renommer : le double-clic',
        blocs: [
          { etapes: ['**Double-clique** sur l\'onglet de la feuille', 'Saisis le nouveau nom (31 caractères max)', 'Appuie sur **Entrée**'] },
          { capture: { type: 'renommeronglet' } },
          { note: 'Tu peux aussi faire **clic droit sur l\'onglet > Renommer**.' },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: 'Pour **ajouter** une feuille, le plus simple : le bouton **＋** en bas, à côté des onglets.',
      visuel: { type: 'ajouteronglet' },
    },
    {
      humeur: 'pensif',
      dit: 'Tu peux aussi insérer par le ruban ou le clic droit.',
      visuel: {
        type: 'methode',
        titre: 'Insérer une feuille',
        blocs: [
          { etapes: ['**Via le ruban** : Accueil > groupe **Cellules** > **Insérer** > Insérer une feuille'] },
          { capture: { type: 'ruban', actif: 'Accueil', groupeNom: 'Cellules', groupes: [{ icone: '⊞', label: 'Insérer', actif: true }, { icone: '⊟', label: 'Supprimer' }, { icone: '▤', label: 'Format' }] } },
          { capture: { type: 'menu', items: [{ label: 'Insérer des cellules…' }, { label: 'Insérer des lignes dans la feuille' }, { label: 'Insérer des colonnes dans la feuille' }, { icone: '📄', label: 'Insérer une feuille', actif: true }] } },
          { note: 'Ou **clic droit sur un onglet > Insérer**.' },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Pour **supprimer** une feuille devenue inutile.',
      visuel: {
        type: 'methode',
        titre: 'Supprimer une feuille',
        blocs: [
          { etapes: ['Sélectionne l\'onglet à supprimer', 'Accueil > groupe **Cellules** > la flèche de **Supprimer** > **Supprimer la feuille**'] },
          { capture: { type: 'ruban', actif: 'Accueil', groupeNom: 'Cellules', groupes: [{ icone: '⊞', label: 'Insérer' }, { icone: '⊟', label: 'Supprimer', actif: true }, { icone: '▤', label: 'Format' }] } },
          { note: 'Ou **clic droit sur l\'onglet > Supprimer**.' },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Une précaution avant de supprimer :',
      visuel: { type: 'encart', label: 'Attention', texte: 'La suppression d\'une feuille est **définitive** : Ctrl + Z ne la récupère pas. Vérifie bien qu\'elle ne contient pas de données importantes avant de valider.' },
    },
    {
      humeur: 'accueil',
      dit: 'Pour **réorganiser** l\'ordre des feuilles : le glisser-déposer.',
      visuel: {
        type: 'methode',
        titre: 'Déplacer une feuille',
        blocs: [
          { etapes: ['**Clique et maintiens** l\'onglet', 'Fais-le **glisser** à sa nouvelle position', 'Relâche la souris'] },
          { capture: { type: 'deplaceronglet' } },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: 'Pour **dupliquer** une feuille (garder l\'original et créer une copie).',
      visuel: {
        type: 'methode',
        titre: 'Dupliquer une feuille',
        blocs: [
          { etapes: ['**Méthode rapide** : maintiens **Ctrl** et fais glisser l\'onglet (sur Mac : **⌥ Option** + glisser)'] },
          { capture: { type: 'onglets', onglets: ['Janvier', 'Janvier (2)', 'Février'], actif: 'Janvier (2)', items: [], legende: 'Une copie « Janvier (2) » apparaît à côté de l\'original.' } },
          { etapes: ['**Méthode clic droit** : clic droit sur l\'onglet, puis « Déplacer ou copier… »'], depart: 2 },
          { capture: { type: 'menu', items: [{ label: 'Insérer…' }, { label: 'Supprimer' }, { label: 'Renommer' }, { icone: '📑', label: 'Déplacer ou copier…', actif: true }] } },
          { etapes: ['Dans la fenêtre, **coche « Créer une copie »**, choisis la position, puis **OK**'], depart: 3 },
          { capture: { type: 'deplacercopier', feuilles: ['Janvier', 'Février', '(en dernier)'], selection: 0, copie: true } },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: 'Pour t\'y retrouver d\'un coup d\'œil, tu peux **colorer** les onglets.',
      visuel: {
        type: 'methode',
        titre: 'Couleur d\'onglet',
        blocs: [
          { etapes: ['**Clic droit** sur l\'onglet, puis **Couleur d\'onglet**', 'Choisis une teinte dans la palette'] },
          { capture: { type: 'menu', items: [{ label: 'Insérer…' }, { label: 'Supprimer' }, { label: 'Renommer' }, { label: 'Couleur d\'onglet  ▸', actif: true }, '-', { label: 'Masquer' }] } },
          { capture: { type: 'palette', selection: 4 } },
          { capture: { type: 'onglets', onglets: ['Janvier', 'Février', 'Synthèse'], actif: 'Synthèse', items: [], couleurs: { Janvier: '#41c1ba', Février: '#d97706', Synthèse: '#8b5cf6' }, legende: 'Résultat : des onglets colorés pour repérer tes feuilles en un instant.' } },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Comment renommer le plus vite une feuille ?',
      visuel: { type: 'question', options: ['Double-clic sur l\'onglet, puis je tape le nom', 'Onglet Révision > Protéger la feuille'], bonne: 0, explication: 'Le double-clic sur l\'onglet permet de taper directement le nouveau nom, puis Entrée. (Le clic droit > Renommer marche aussi.)' },
    },
    { humeur: 'fier', dit: 'Nommer, ajouter, supprimer, déplacer, copier, colorer : ton classeur est bien rangé. Premier pas de la ceinture marron. Bravo ! 🎉' },
  ],
}

// --- Leçon 2 : Lier des cellules & des feuilles ---
const LIERFEUILLES = {
  id: 'fn-lierfeuilles',
  titre: 'Lier des cellules & des feuilles',
  exercices: [EX6.ex51],
  narration: [
    { humeur: 'accueil', dit: 'Lier une cellule, c\'est afficher dans une cellule la valeur d\'une autre cellule, qu\'elle soit sur la même feuille ou sur une autre. L\'énorme avantage : si la source change, le lien se met à jour tout seul.' },
    {
      humeur: 'pensif',
      dit: 'D\'abord, **lier dans la même feuille**.',
      visuel: {
        type: 'methode',
        titre: 'Lier dans la même feuille',
        blocs: [
          { etapes: ['Clique sur la cellule cible (celle qui affichera la valeur)', 'Tape **=**', 'Clique sur la cellule source, puis **Entrée**'] },
          { capture: { type: 'tableur', cols: ['A', 'B', 'C'], rows: [1, 2], cells: { A1: { t: 'Article', entete: true }, B1: { t: 'Prix', entete: true }, C1: { t: 'Rappel prix', entete: true }, A2: { t: 'Clavier' }, B2: { t: '30', num: true, ref: true }, C2: { t: '30', num: true, vert: true } }, formule: '=B2', actif: 'C2', legende: 'C2 affiche la valeur de B2. Si B2 change, C2 suit automatiquement.' } },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: 'Le plus utile : **lier entre deux feuilles**. Exemple : ramener le total de la feuille « Janvier » dans une feuille « Synthèse ».',
      visuel: {
        type: 'methode',
        titre: 'Lier entre deux feuilles',
        blocs: [
          { etapes: ['Place-toi sur la feuille de **destination** (Synthèse), dans la cellule cible, et tape **=**'] },
          { capture: { type: 'tableur', feuilles: ['Janvier', 'Février', 'Synthèse'], feuilleActive: 'Synthèse', cols: ['A', 'B'], rows: [1, 2], cells: { A1: { t: 'Mois', entete: true }, B1: { t: 'Total', entete: true }, A2: { t: 'Janvier' }, B2: { t: '=' } }, formule: '=', actif: 'B2', legende: 'On est sur « Synthèse », dans la cellule cible B2 : on tape =.' } },
          { etapes: ['Clique sur l\'**onglet** de la feuille **source** (Janvier)'], depart: 2 },
          { capture: { type: 'onglets', onglets: ['Janvier', 'Février', 'Synthèse'], actif: 'Janvier', items: [], legende: 'On clique sur l\'onglet « Janvier » : Excel bascule sur cette feuille.' } },
          { etapes: ['Sur « Janvier », clique la **cellule source** (B5), puis **Entrée**'], depart: 3 },
          { capture: { type: 'tableur', feuilles: ['Janvier', 'Février', 'Synthèse'], feuilleActive: 'Janvier', cols: ['A', 'B'], rows: [1, 2, 3, 4, 5], cells: { A1: { t: 'Semaine', entete: true }, B1: { t: 'CA', entete: true }, A2: { t: 'S1' }, B2: { t: '2 000', num: true }, A3: { t: 'S2' }, B3: { t: '2 300', num: true }, A4: { t: 'S3' }, B4: { t: '4 500', num: true }, A5: { t: 'Total' }, B5: { t: '8 800', num: true, ref: true } }, formule: '=Janvier!B5', actif: 'B5', legende: 'On est passé sur « Janvier » : on clique la cellule source B5 (le total).' } },
          { capture: { type: 'tableur', feuilles: ['Janvier', 'Février', 'Synthèse'], feuilleActive: 'Synthèse', cols: ['A', 'B'], rows: [1, 2], cells: { A1: { t: 'Mois', entete: true }, B1: { t: 'Total', entete: true }, A2: { t: 'Janvier' }, B2: { t: '8 800', vert: true } }, formule: '=Janvier!B5', actif: 'B2', legende: 'De retour sur « Synthèse » : B2 affiche le total de Janvier, et se met à jour tout seul.' } },
          { note: 'Excel écrit la référence sous la forme **NomDeLaFeuille!Cellule** (ex : =Janvier!B5). Le « ! » sépare la feuille de la cellule.' },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Pourquoi c\'est si pratique :',
      visuel: { type: 'parties', items: [{ label: '**Automatisation** : si la cellule source change, le lien se met à jour partout, tout seul.' }, { label: '**Organisation** : tu centralises tes résultats dans une feuille « Synthèse », sans recopier à la main.' }, { label: '**Clarté** : tu vois toujours d\'où vient chaque chiffre.' }] },
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Pour afficher dans « Synthèse » la cellule B5 de la feuille « Janvier », Excel écrit...',
      visuel: { type: 'question', options: ['=Janvier!B5', '=Janvier+B5'], bonne: 0, explication: 'Une référence à une autre feuille s\'écrit NomDeLaFeuille!Cellule, avec un point d\'exclamation : =Janvier!B5.' },
    },
    { humeur: 'fier', dit: 'Tes feuilles communiquent : une valeur saisie une fois, réutilisée partout. Bravo ! 🎉' },
  ],
}

// --- Leçon 3 : Travailler sur plusieurs feuilles à la fois ---
const GROUPEFEUILLES = {
  id: 'fn-groupefeuilles',
  titre: 'Travailler sur plusieurs feuilles',
  exercices: [],
  narration: [
    { humeur: 'accueil', dit: 'Parfois tu veux agir sur plusieurs feuilles d\'un coup (saisir, mettre en forme, imprimer les mêmes données), ou déplacer une feuille vers un autre fichier. Voyons les deux.' },
    {
      humeur: 'pensif',
      dit: 'Le **groupe de travail** : tu sélectionnes plusieurs feuilles, et tout ce que tu fais s\'applique à toutes en même temps. Trois façons de sélectionner.',
      visuel: {
        type: 'methode',
        titre: 'Sélectionner un groupe de feuilles',
        blocs: [
          { etapes: ['**Toutes les feuilles** : clic droit sur un onglet, puis « Sélectionner toutes les feuilles » (pas besoin d\'autre touche)'] },
          { capture: { type: 'menu', items: [{ label: 'Insérer…' }, { label: 'Supprimer' }, { label: 'Renommer' }, { label: 'Déplacer ou copier…' }, '-', { icone: '☑', label: 'Sélectionner toutes les feuilles', actif: true }] } },
          { capture: { type: 'onglets', onglets: ['Janvier', 'Février', 'Mars'], actifs: ['Janvier', 'Février', 'Mars'], items: [], legende: 'Résultat : les 3 feuilles sont sélectionnées (fond blanc), et [Groupe de travail] apparaît dans la barre de titre.' } },
          { etapes: ['**Feuilles côte à côte** : clique la première, maintiens **Shift**, clique la dernière'], depart: 2 },
          { capture: { type: 'touche', touches: ['⇧ Maj'], note: 'La touche Maj (aussi appelée Shift), tout en bas à gauche et à droite du clavier.' } },
          { capture: { type: 'onglets', onglets: ['Janvier', 'Février', 'Mars'], actifs: ['Janvier', 'Février', 'Mars'], items: [], legende: 'Shift prend la première, la dernière, ET tout ce qui est entre : ici les 3 feuilles.' } },
          { etapes: ['**Feuilles séparées** : maintiens **Ctrl** et clique chaque onglet voulu (sur Mac : **⌘** + clic)'], depart: 3 },
          { capture: { type: 'touche', touches: ['Ctrl'], note: 'La touche Ctrl (Contrôle), en bas du clavier. Sur Mac : la touche ⌘ Cmd.' } },
          { capture: { type: 'onglets', onglets: ['Janvier', 'Février', 'Mars'], actifs: ['Janvier', 'Mars'], items: [], legende: 'Ctrl prend SEULEMENT les feuilles cliquées : ici Janvier et Mars, pas Février.' } },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Shift ou Ctrl, quelle différence ? C\'est important, ce n\'est pas la même chose :',
      visuel: { type: 'encart', label: 'À retenir', liste: ['**Shift** = une **plage continue** : la première feuille, la dernière, et TOUT ce qui est entre les deux.', '**Ctrl** (⌘ sur Mac) = des feuilles **séparées** : seulement celles que tu cliques, une par une.'] },
    },
    {
      humeur: 'pensif',
      dit: 'À garder en tête quand tu es en groupe de travail :',
      visuel: { type: 'encart', label: 'Attention', texte: 'Tant que le groupe est actif, **tout ce que tu tapes ou mets en forme se répercute sur toutes les feuilles sélectionnées**. Très pratique, mais à manier avec soin pour ne pas écraser une feuille par erreur.' },
    },
    {
      humeur: 'accueil',
      dit: 'Pour **sortir** du groupe de travail (dissocier les feuilles).',
      visuel: {
        type: 'methode',
        titre: 'Dissocier les feuilles',
        blocs: [
          { etapes: ['**Clic droit** sur un onglet sélectionné, puis « Dissocier les feuilles »'] },
          { capture: { type: 'menu', items: [{ label: 'Insérer…' }, { label: 'Supprimer' }, { label: 'Renommer' }, { label: 'Déplacer ou copier…' }, '-', { label: 'Dissocier les feuilles', actif: true }] } },
          { note: 'Ou plus rapide : **double-clique sur un onglet non sélectionné** (n\'importe lequel). Chaque feuille redevient indépendante.' },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: 'Enfin, pour **déplacer ou copier une feuille vers un autre classeur** (un autre fichier).',
      visuel: {
        type: 'methode',
        titre: 'Déplacer ou copier vers un autre classeur',
        blocs: [
          { etapes: ['**Clic droit** sur l\'onglet, puis « Déplacer ou copier… »'] },
          { capture: { type: 'menu', items: [{ label: 'Insérer…' }, { label: 'Supprimer' }, { label: 'Renommer' }, '-', { icone: '📑', label: 'Déplacer ou copier…', actif: true }] } },
          { etapes: ['Dans la liste **« Dans le classeur »**, choisis le fichier de destination', 'Choisis la position, puis clique sur **OK**'], depart: 2 },
          { capture: { type: 'champs', titre: 'Déplacer ou copier', champs: [{ l: 'Dans le classeur', v: 'Budget 2026.xlsx  ▾', actif: true }, { l: 'Avant la feuille', v: '(en dernier)' }] } },
          { note: 'Coche **« Créer une copie »** pour garder l\'original dans le fichier de départ. Laisse décoché pour juste déplacer.', label: 'Bon à savoir' },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Pour sélectionner deux feuilles qui ne sont pas côte à côte, tu utilises...',
      visuel: { type: 'question', options: ['Ctrl + clic sur chaque onglet', 'Un double-clic sur un onglet'], bonne: 0, explication: 'Ctrl + clic sélectionne des feuilles séparées (non adjacentes). Shift, lui, sélectionne tout entre deux onglets côte à côte.' },
    },
    { humeur: 'fier', dit: 'Tu sais travailler sur plusieurs feuilles d\'un coup et les faire voyager entre fichiers. Bravo ! 🎉' },
  ],
}

// --- Leçon 4 : Lier des cellules entre deux classeurs (liaison externe) ---
const LIAISONSCLASSEURS = {
  id: 'fn-liaisonsclasseurs',
  titre: 'Les liaisons entre classeurs',
  exercices: [],
  narration: [
    { humeur: 'accueil', dit: 'Une liaison externe récupère la valeur d\'une cellule située dans un AUTRE fichier Excel. Idéal pour centraliser des synthèses même quand les données sont réparties dans plusieurs classeurs.' },
    {
      humeur: 'pensif',
      dit: 'Créons une liaison entre deux fichiers, pas à pas.',
      visuel: {
        type: 'methode',
        titre: 'Créer une liaison externe',
        blocs: [
          { etapes: ['Ouvre les **deux classeurs** : le fichier **source** (la donnée) et le fichier **cible** (où l\'afficher)'] },
          { capture: { type: 'deuxclasseurs', source: 'Ventes.xlsx', cible: 'Synthèse.xlsx' } },
          { etapes: ['Dans le classeur **cible**, clique sur la cellule où tu veux la valeur, et tape **=**'], depart: 2 },
          { capture: { type: 'tableur', classeur: 'Synthèse.xlsx', role: 'cible', feuilles: ['Synthèse'], feuilleActive: 'Synthèse', cols: ['A', 'B'], rows: [1, 2], cells: { A1: { t: 'Poste', entete: true }, B1: { t: 'Valeur', entete: true }, A2: { t: 'Total ventes' }, B2: { t: '=' } }, formule: '=', actif: 'B2', legende: 'On est dans le classeur CIBLE (Synthèse.xlsx), cellule B2 : on tape =.' } },
          { etapes: ['Passe dans le classeur **source** : Affichage > **Changer de fenêtre**, puis choisis-le'], depart: 3 },
          { capture: { type: 'ruban', actif: 'Affichage', groupeNom: 'Fenêtre', groupes: [{ icone: '⊞', label: 'Réorganiser\ntout' }, { icone: '🗗', label: 'Changer de\nfenêtre', actif: true }] } },
          { etapes: ['Clique sur la **cellule source** (ex : B5), puis appuie sur **Entrée**'], depart: 4 },
          { capture: { type: 'tableur', classeur: 'Ventes.xlsx', role: 'source', feuilles: ['Modèle'], feuilleActive: 'Modèle', cols: ['A', 'B'], rows: [1, 2], cells: { A1: { t: 'Poste', entete: true }, B1: { t: 'Total', entete: true }, A2: { t: 'Ventes' }, B2: { t: '8 800', num: true, ref: true } }, formule: '=[Ventes.xlsx]Modèle!$B$5', actif: 'B2', legende: 'On est passé sur le classeur SOURCE (Ventes.xlsx) : on clique la cellule source.' } },
          { capture: { type: 'tableur', classeur: 'Synthèse.xlsx', role: 'cible', feuilles: ['Synthèse'], feuilleActive: 'Synthèse', cols: ['A', 'B'], rows: [1, 2], cells: { A1: { t: 'Poste', entete: true }, B1: { t: 'Valeur', entete: true }, A2: { t: 'Total ventes' }, B2: { t: '8 800', vert: true } }, formule: '=[Ventes.xlsx]Modèle!$B$5', actif: 'B2', legende: 'De retour sur le classeur CIBLE : B2 affiche la valeur du fichier source, et se met à jour tout seul.' } },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Décortiquons la formule qu\'Excel écrit : **=[Ventes.xlsx]Modèle!$B$5**',
      visuel: { type: 'encart', label: 'Bon à savoir', liste: ['**[Ventes.xlsx]** entre crochets : le nom du classeur source.', '**Modèle** : la feuille dans ce classeur.', '**$B$5** : la cellule (les « $ » figent la référence).', 'Si le classeur source est fermé, Excel affiche en plus le chemin complet du fichier.'] },
    },
    {
      humeur: 'accueil',
      dit: 'Pour **vérifier ou modifier** tes liaisons (par exemple si un fichier a été déplacé).',
      visuel: {
        type: 'methode',
        titre: 'Gérer les liaisons',
        blocs: [
          { etapes: ['Va dans l\'onglet **Données** du ruban', 'Clique sur **« Liaisons de classeur »** (groupe Requêtes et connexions)'] },
          { capture: { type: 'ruban', actif: 'Données', groupeNom: 'Requêtes et connexions', groupes: [{ icone: '🔄', label: 'Actualiser\ntout' }, { icone: '🔗', label: 'Liaisons de\nclasseur', actif: true }] } },
          { capture: { type: 'liaisonsdialog', fichiers: [{ nom: 'Ventes.xlsx', statut: 'OK' }] } },
          { note: 'Pour chaque liaison, tu peux : **mettre à jour** les valeurs, **modifier la source** (changer de fichier), ou **rompre la liaison** (figer la valeur).', label: 'Bon à savoir' },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: 'Autre méthode pratique : le **collage spécial avec liaison**.',
      visuel: {
        type: 'methode',
        titre: 'Coller avec liaison',
        blocs: [
          { etapes: ['Copie la cellule source (**Ctrl + C**, sur Mac **⌘ + C**)', 'Dans le classeur cible, clique dans la cellule où coller'] },
          { capture: { type: 'touche', touches: ['Ctrl', 'C'], note: 'Le raccourci pour copier (sur Mac : ⌘ + C).' } },
          { etapes: ['**Clic droit** dans la cellule, puis **Collage spécial…**'], depart: 3 },
          { capture: { type: 'menu', items: [{ icone: '✂️', label: 'Couper' }, { icone: '📋', label: 'Copier' }, { icone: '📋', label: 'Coller' }, '-', { label: 'Collage spécial…', actif: true }] } },
          { etapes: ['Dans la fenêtre, clique sur **Coller avec liaison** (en bas à gauche)'], depart: 4 },
          { capture: { type: 'collagespecialdialog' } },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Comment Excel note-t-il une cellule liée à un autre fichier ?',
      visuel: { type: 'question', options: ['=[Ventes.xlsx]Modèle!$B$5', '=Ventes.xlsx + B5'], bonne: 0, explication: 'Le nom du classeur va entre crochets, suivi de la feuille, d\'un « ! » et de la cellule : =[Ventes.xlsx]Modèle!$B$5.' },
    },
    { humeur: 'fier', dit: 'Tes fichiers communiquent entre eux : une synthèse toujours à jour, sans copier-coller. Bravo ! 🎉' },
  ],
}

// Helpers pour les captures 3D : une feuille par département (avec son total en C10) + la Synthèse.
const feuillesDept = ['AIN', 'Allier', 'Hautes Alpes', 'Cantal', 'Synthèse']
const rowsDept = [1, '⋮', 10]
const cellsDept = (total) => ({ A1: { t: 'Mois', entete: true }, B1: { t: 'Zone', entete: true }, C1: { t: 'CA', entete: true }, A10: { t: 'Total' }, C10: { t: total, num: true, ref: true } })
const cellsSynth = (val, vert) => ({ A1: { t: 'Zone', entete: true }, B1: { t: 'Total', entete: true }, A2: { t: 'France' }, B2: vert ? { t: val, vert: true } : { t: val } })

// --- Leçon 5 : Calculs 3D & références 3D ---
const CALCULS3D = {
  id: 'fn-calculs3d',
  titre: 'Les calculs 3D & références 3D',
  exercices: [],
  narration: [
    { humeur: 'accueil', dit: 'Un calcul 3D regroupe automatiquement les MÊMES cellules situées sur plusieurs feuilles d\'un même classeur. Parfait pour consolider des ventes mensuelles ou des dépenses par projet, sans recopier feuille par feuille.' },
    {
      humeur: 'pensif',
      dit: 'Imaginons un classeur avec une feuille par département, et la cellule C10 (le total) à additionner sur chacune.',
      visuel: { type: 'tableur', classeur: 'Départements.xlsx', feuilles: feuillesDept, feuilleActive: 'AIN', cols: ['A', 'B', 'C'], rows: rowsDept, cells: cellsDept('3 000'), legende: 'Chaque département (AIN, Allier…) a son total en C10. On va tous les additionner dans la feuille « Synthèse » (les onglets en bas).' },
    },
    {
      humeur: 'pensif',
      dit: '**Méthode 1 : feuille par feuille.** Tu cliques chaque feuille et tu sépares par un point-virgule.',
      visuel: {
        type: 'methode',
        titre: 'Méthode 1 : le séparateur ;',
        blocs: [
          { etapes: ['Dans la cellule cible (feuille « Synthèse »), tape **=SOMME(**'] },
          { capture: { type: 'tableur', classeur: 'Départements.xlsx', feuilles: feuillesDept, feuilleActive: 'Synthèse', cols: ['A', 'B'], rows: [1, 2], cells: cellsSynth('=SOMME('), formule: '=SOMME(', actif: 'B2', legende: 'Sur « Synthèse », dans la cellule cible B2 : on tape =SOMME(' } },
          { etapes: ['Clique l\'onglet de la **1re feuille** (AIN), puis sa cellule **C10**'], depart: 2 },
          { capture: { type: 'tableur', classeur: 'Départements.xlsx', feuilles: feuillesDept, feuilleActive: 'AIN', cols: ['A', 'B', 'C'], rows: rowsDept, cells: cellsDept('3 000'), formule: '=SOMME(AIN!C10', actif: 'C10', legende: 'On est sur « AIN » : on clique sa cellule C10. La formule devient =SOMME(AIN!C10' } },
          { etapes: ['Tape **;** puis clique la **feuille suivante** (Allier) et sa cellule **C10**'], depart: 3 },
          { capture: { type: 'tableur', classeur: 'Départements.xlsx', feuilles: feuillesDept, feuilleActive: 'Allier', cols: ['A', 'B', 'C'], rows: rowsDept, cells: cellsDept('3 500'), formule: '=SOMME(AIN!C10;Allier!C10', actif: 'C10', legende: 'On est passé sur « Allier » : on tape ; puis on clique sa cellule C10.' } },
          { etapes: ['**Pareil pour les autres feuilles** (Hautes Alpes, Cantal), puis ferme la parenthèse **)** et **Entrée**'], depart: 4 },
          { capture: { type: 'tableur', classeur: 'Départements.xlsx', feuilles: feuillesDept, feuilleActive: 'Synthèse', cols: ['A', 'B'], rows: [1, 2], cells: cellsSynth('12 500', true), formule: '=SOMME(AIN!C10;Allier!C10;\'Hautes Alpes\'!C10;Cantal!C10)', actif: 'B2', legende: 'De retour sur « Synthèse » : la formule complète additionne les 4 départements = 12 500.' } },
          { note: 'Le point-virgule **;** sépare chaque feuille à additionner. La même méthode marche avec MOYENNE, MIN, MAX ou NB.', label: 'Bon à savoir' },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: '**Méthode 2 : la référence 3D.** Plus rapide quand les feuilles sont côte à côte : tu sélectionnes de la première à la dernière avec Shift.',
      visuel: {
        type: 'methode',
        titre: 'Méthode 2 : la référence 3D (Shift)',
        blocs: [
          { etapes: ['Dans la cellule cible (feuille « Synthèse »), tape **=SOMME(**'] },
          { capture: { type: 'tableur', classeur: 'Départements.xlsx', feuilles: feuillesDept, feuilleActive: 'Synthèse', cols: ['A', 'B'], rows: [1, 2], cells: cellsSynth('=SOMME('), formule: '=SOMME(', actif: 'B2', legende: 'Sur « Synthèse », dans la cellule cible B2 : on tape =SOMME(' } },
          { etapes: ['Clique l\'onglet de la **première** feuille (AIN)'], depart: 2 },
          { capture: { type: 'onglets', onglets: ['AIN', 'Allier', 'Hautes Alpes', 'Cantal', 'Synthèse'], actif: 'AIN', items: [], legende: 'On clique d\'abord l\'onglet « AIN » (la première feuille) : elle devient la feuille active.' } },
          { etapes: ['Maintiens **Shift** et clique l\'onglet de la **dernière** feuille (Cantal)'], depart: 3 },
          { capture: { type: 'onglets', onglets: ['AIN', 'Allier', 'Hautes Alpes', 'Cantal', 'Synthèse'], actifs: ['AIN', 'Allier', 'Hautes Alpes', 'Cantal'], items: [], legende: 'Shift sélectionne AIN, Cantal et toutes les feuilles entre les deux.' } },
          { etapes: ['Clique la cellule **C10**, ferme la parenthèse **)** et **Entrée**'], depart: 4 },
          { capture: { type: 'tableur', classeur: 'Départements.xlsx', feuilles: feuillesDept, feuilleActive: 'Synthèse', cols: ['A', 'B'], rows: [1, 2], cells: cellsSynth('12 500', true), formule: '=SOMME(AIN:Cantal!C10)', actif: 'B2', legende: 'Résultat sur « Synthèse » : la référence 3D =SOMME(AIN:Cantal!C10) additionne AIN à Cantal = 12 500.' } },
          { note: 'Les feuilles doivent être **côte à côte** : toutes celles situées entre AIN et Cantal sont incluses. Pour en exclure une, réorganise les onglets ou utilise la méthode 1 (le point-virgule).', label: 'Bon à savoir' },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Effet des modifications de feuilles sur une référence 3D, par exemple **=SOMME(Feuil2:Feuil6!C10)** :',
      visuel: { type: 'encart', label: 'Bon à savoir', liste: ['Une feuille **ajoutée ou glissée ENTRE** Feuil2 et Feuil6 est automatiquement **incluse** dans le calcul.', 'Une feuille ajoutée **avant Feuil2 ou après Feuil6** n\'est **pas** prise en compte.', 'Déplacer une feuille **hors** de la plage la retire du calcul.'] },
    },
    {
      humeur: 'pensif',
      dit: 'Voyons si la formule 3D n\'a plus de secret. **Vrai ou faux ?**',
      visuel: { type: 'vraifaux', affirmation: 'Une feuille ajoutée ENTRE « AIN » et « Cantal » entre automatiquement dans =SOMME(AIN:Cantal!C10).', bonne: true, explication: 'La référence 3D est vivante : tout ce qui se glisse entre les deux bornes est compté ; tout ce qui en sort est retiré.' },
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Pour additionner la cellule C10 de toutes les feuilles, de « Feuil2 » à « Feuil6 », on écrit...',
      visuel: { type: 'question', options: ['=SOMME(Feuil2:Feuil6!C10)', '=SOMME(Feuil2+Feuil6+C10)'], bonne: 0, explication: 'Une référence 3D s\'écrit =SOMME(PremièreFeuille:DernièreFeuille!Cellule). Le « : » couvre toutes les feuilles entre les deux.' },
    },
    { humeur: 'fier', dit: 'Tu consolides des dizaines de feuilles en une seule formule. Redoutable. Bravo ! 🎉' },
  ],
}

// --- Leçon 6 : Protéger une feuille ou un classeur ---
const PROTEGERFEUILLES = {
  id: 'fn-protegerfeuilles',
  titre: 'Protéger une feuille ou un classeur',
  exercices: [EX6.ex49, EX6.ex50],
  narration: [
    { humeur: 'accueil', dit: 'Protéger sert à empêcher les modifications : diffuser un modèle sans qu\'on casse sa structure, travailler à plusieurs sans tout altérer, sécuriser des données sensibles ou archiver un document final.' },
    {
      humeur: 'pensif',
      dit: 'D\'abord un point important : dans Excel, **toutes les cellules sont « Verrouillées » par défaut**. Mais ça ne bloque rien tant que la feuille n\'est pas protégée. Vérifions-le.',
      visuel: {
        type: 'methode',
        titre: 'Voir le verrouillage par défaut',
        blocs: [
          { etapes: ['Sélectionne une cellule (ex : **B3**)'] },
          { capture: { type: 'tableur', cols: ['A', 'B', 'C'], rows: [1, 2, 3], cells: {}, actif: 'B3', legende: 'On clique sur la cellule B3 pour la sélectionner.' } },
          { etapes: ['Accueil > **Format** > **Format de cellule…**'], depart: 2 },
          { capture: { type: 'ruban', actif: 'Accueil', groupeNom: 'Cellules', groupes: [{ icone: '⊞', label: 'Insérer' }, { icone: '⊟', label: 'Supprimer' }, { icone: '▤', label: 'Format', actif: true }] } },
          { etapes: ['Va dans l\'onglet **Protection**'], depart: 3 },
          { capture: { type: 'formatcellule', actif: 'Protection' } },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: 'Pour **protéger une feuille** (verrouiller ses cellules).',
      visuel: {
        type: 'methode',
        titre: 'Protéger la feuille',
        blocs: [
          { etapes: ['Va dans l\'onglet **Révision** du ruban', 'Clique sur **Protéger** > **Protéger la feuille**'] },
          { capture: { type: 'ruban', actif: 'Révision', groupeNom: 'Protéger', groupes: [{ icone: '🛡', label: 'Protéger\nla feuille', actif: true }, { icone: '🔒', label: 'Protéger\nle classeur' }, { icone: '✎', label: 'Autoriser la\nmodif. de plage' }] } },
          { etapes: ['Saisis un **mot de passe** (facultatif), coche les actions que tu autorises, puis **OK**'], depart: 3 },
          { capture: { type: 'protegerfeuilledialog' } },
          { note: 'Si tu mets un mot de passe, Excel te le redemande pour confirmer. Sans mot de passe, n\'importe qui pourra ôter la protection.', label: 'Bon à savoir' },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Tu veux laisser certaines cellules modifiables malgré la protection ? Utilise les **autorisations de plage** (facultatif).',
      visuel: {
        type: 'methode',
        titre: 'Autoriser la modification d\'une plage',
        blocs: [
          { etapes: ['Avant de protéger : Révision > **Protéger** > **Autoriser la modification des plages**'] },
          { capture: { type: 'ruban', actif: 'Révision', groupeNom: 'Protéger', groupes: [{ icone: '🛡', label: 'Protéger\nla feuille' }, { icone: '🔒', label: 'Protéger\nle classeur' }, { icone: '✎', label: 'Autoriser la\nmodif. des plages', actif: true }] } },
          { etapes: ['Clique **Nouvelle…**, donne un titre à la plage et indique les cellules (et un mot de passe si besoin)'], depart: 2 },
          { capture: { type: 'champs', titre: 'Nouvelle plage', champs: [{ l: 'Titre', v: 'Zone_de_saisie', actif: true }, { l: 'Fait référence aux cellules', v: '=$B$2:$B$10' }, { l: 'Mot de passe', v: '••••' }] } },
          { etapes: ['Valide, puis **protège la feuille** comme vu juste avant'], depart: 3 },
          { note: 'Ces cellules-là resteront modifiables ; tout le reste de la feuille sera verrouillé.' },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Feuille ou classeur, que protège-t-on au juste ? Deux choses différentes :',
      visuel: { type: 'encart', label: 'À retenir', liste: ['**Protéger la feuille** = verrouille les **cellules** d\'une feuille (on ne peut plus modifier son contenu).', '**Protéger le classeur** = verrouille la **structure** du fichier (on ne peut plus ajouter, supprimer, renommer ni déplacer les onglets).'] },
    },
    {
      humeur: 'accueil',
      dit: 'La **protection du classeur**, elle, verrouille la structure du fichier (impossible d\'ajouter, supprimer ou déplacer des onglets).',
      visuel: {
        type: 'methode',
        titre: 'Protéger le classeur',
        blocs: [
          { etapes: ['Onglet **Révision** > **Protéger le classeur**', 'Coche **Protéger la structure**, mets un mot de passe (facultatif), puis **OK**'] },
          { capture: { type: 'listedialog', titre: 'Protéger la structure et les fenêtres', cases: [{ label: 'Structure', coche: true }, { label: 'Fenêtres', coche: false }] } },
          { etapes: ['Pour **retirer** une protection : Révision > **Ôter la protection** (de la feuille ou du classeur)'], depart: 3 },
          { capture: { type: 'ruban', actif: 'Révision', groupeNom: 'Protéger', groupes: [{ icone: '🔓', label: 'Ôter la protection\nde la feuille', actif: true }, { icone: '🔒', label: 'Protéger\nle classeur' }] } },
          { note: 'Excel te redemande le mot de passe s\'il y en a un.', label: 'Bon à savoir' },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: 'Enfin, pour **masquer** une feuille des regards.',
      visuel: {
        type: 'methode',
        titre: 'Masquer une feuille',
        blocs: [
          { etapes: ['**Masquer** : clic droit sur l\'onglet > **Masquer**'] },
          { capture: { type: 'onglets', onglets: ['Janvier', 'Confidentiel', 'Synthèse'], actif: 'Confidentiel', items: ['Renommer', 'Couleur d\'onglet', '-', { label: 'Masquer' }, 'Afficher…'] } },
          { etapes: ['**Réafficher** : clic droit sur n\'importe quel onglet > **Afficher…**, puis choisis la feuille'], depart: 2 },
          { capture: { type: 'onglets', onglets: ['Janvier', 'Synthèse'], actif: 'Janvier', items: ['Renommer', 'Couleur d\'onglet', '-', 'Masquer', { label: 'Afficher…' }] } },
          { capture: { type: 'listedialog', titre: 'Afficher', intro: 'Afficher la feuille :', items: ['Confidentiel'], selection: 0 } },
          { note: 'Pour vraiment empêcher l\'accès, combine **masquer + protéger le classeur** (avec mot de passe) : la feuille masquée ne pourra plus être réaffichée sans le mot de passe.', label: 'Bon à savoir' },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Dans quel onglet du ruban se trouve la protection d\'une feuille ?',
      visuel: { type: 'question', options: ['Révision', 'Affichage'], bonne: 0, explication: 'La protection (feuille et classeur) est dans l\'onglet Révision, bouton Protéger.' },
    },
    { humeur: 'fier', dit: 'Tes feuilles sont sous bonne garde : structure protégée, données sensibles à l\'abri. Encore un cran vers la ceinture noire. Bravo ! 🎉' },
  ],
}

// ======================================================================
// CHAPITRE 7 — Exploiter une liste (ceinture verte)
// ======================================================================
const EX7 = {
  ex52: { titre: 'Exercice 52 · Figer/Libérer les volets', url: U6('18bvVTJ6qBCIcIL48V-QaGKFwa7BHntDa') },
  ex53: { titre: 'Exercice 53 · Les sauts de page', url: U6('1PnBhb4XI95uE2S-zhzwS6TO14Rdz-d-F') },
  ex54: { titre: 'Exercice 54 · Création de tableaux', url: U6('1rw9kW9D4pnqd2pquIE6MCiJFrPf2cYBF') },
  ex55: { titre: 'Exercice 55 · Le formulaire', url: U6('1sXHA54yo5MpbIB8ZHD4hDsKMqZ8ZUMGK') },
  ex56: { titre: 'Exercice 56 · Tris et filtres', url: U6('1Uj9AmixGKi9HUgyyIXOZS5f4SCyZXjD2') },
  ex57: { titre: 'Exercice 57 · Les sous-totaux', url: U6('1RM6WsBhY3nYP0l_Ho0ibyHG8H_kviq1q') },
  ex58: { titre: 'Exercice 58 · La fonction SOUS.TOTAL', url: U6('1Uc3I_2N2Sc-8OO6ucHbkCZB7RterbBVl') },
}
const LISTE_ENTETES = ['Vendeur', 'Ville', 'CA']
const LISTE_LIGNES = [['Marie', 'Lyon', '8 200 €'], ['Karim', 'Paris', '12 500 €'], ['Léa', 'Lyon', '6 400 €'], ['Tom', 'Marseille', '9 100 €']]

// --- Leçon 1 : Une liste bien construite + figer les volets ---
const REGLESLISTE = {
  id: 'fn-reglesliste',
  titre: 'Une liste bien construite',
  exercices: [EX7.ex52],
  narration: [
    { humeur: 'accueil', dit: 'Une **liste**, c\'est une suite d\'informations rangée en colonnes, avec une ligne d\'en-tête en haut. Avant de la trier, la filtrer ou la totaliser, elle doit être « propre ». Voici un exemple :', visuel: { type: 'tableaudonnees', brut: true, entetes: ['Date', 'Vendeur', 'Ville', 'CA'], lignes: [['05/03', 'Marie', 'Lyon', '8 200 €'], ['06/03', 'Karim', 'Paris', '12 500 €'], ['07/03', 'Léa', 'Lyon', '6 400 €'], ['08/03', 'Tom', 'Marseille', '9 100 €']], legende: 'Une ligne d\'en-tête (Date, Vendeur, Ville, CA), puis une ligne par enregistrement.' } },
    {
      humeur: 'pensif',
      dit: 'Avant toute explication, à ton avis : **lequel de ces trois tableaux** Excel reconnaîtra-t-il parfaitement comme une liste ? **Clique-le !**',
      visuel: {
        type: 'choixtableau',
        bonne: 2,
        explication: 'Le tableau C : des en-têtes complets et aucune ligne vide. Le A a une ligne entièrement vide au milieu (Excel croit que la liste s\'arrête là), le B a un en-tête manquant. Voyons les règles qui se cachent derrière !',
        options: [
          { titre: 'Tableau A', tableau: { entetes: ['Vendeur', 'Ville', 'CA'], lignes: [['Marie', 'Lyon', '8 200 €'], ['', '', ''], ['Karim', 'Paris', '12 500 €']] } },
          { titre: 'Tableau B', tableau: { entetes: ['Vendeur', '', 'CA'], lignes: [['Marie', 'Lyon', '8 200 €'], ['Karim', 'Paris', '12 500 €']] } },
          { titre: 'Tableau C', tableau: { entetes: ['Vendeur', 'Ville', 'CA'], lignes: [['Marie', 'Lyon', '8 200 €'], ['Karim', 'Paris', '12 500 €']] } },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Les 3 règles d\'une liste exploitable :',
      visuel: { type: 'parties', items: [{ label: '**Aucune ligne ni colonne entièrement vide** : Excel prend une ligne/colonne vide pour la fin du tableau.' }, { label: '**Les en-têtes sur une seule ligne** (ex : A1:C1), sans rien au-dessus : Excel repère la 1re ligne comme titres.' }, { label: '**Jamais de cellules fusionnées** dans le tableau : ça casse les tris automatiques.' }] },
    },
    {
      humeur: 'pensif',
      dit: 'Pourquoi c\'est si important :',
      visuel: { type: 'encart', label: 'Bon à savoir', texte: 'Une ligne ou une colonne vide **coupe** ta liste en deux : tris et filtres ne s\'appliqueront qu\'à la partie au-dessus. Une seule cellule vide par ligne est tolérée, mais jamais une ligne ou colonne entière.' },
    },
    {
      humeur: 'accueil',
      dit: 'Sur une longue liste, les titres disparaissent quand tu fais défiler. La solution : **figer les volets** pour garder les en-têtes à l\'écran.',
      visuel: {
        type: 'methode',
        titre: 'Figer les volets',
        blocs: [
          { etapes: ['Clique dans la liste, puis onglet **Affichage** > groupe **Fenêtre** > **Figer les volets**'] },
          { capture: { type: 'ruban', actif: 'Affichage', groupeNom: 'Fenêtre', groupes: [{ icone: '🗔', label: 'Nouvelle\nfenêtre' }, { icone: '⊟', label: 'Figer les\nvolets', actif: true }, { icone: '🗗', label: 'Changer de\nfenêtre' }] } },
          { capture: { type: 'menu', items: [{ label: 'Figer les volets', actif: true }, { label: 'Figer la ligne supérieure' }, { label: 'Figer la première colonne' }] } },
          { capture: { type: 'figervolets' } },
          { note: '**Figer les volets** = bloque tout ce qui est au-dessus et à gauche de la cellule active. **Figer la ligne supérieure** = juste la 1re ligne. **Figer la première colonne** = juste la 1re colonne.', label: 'Bon à savoir' },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: 'Pour tout débloquer, c\'est au même endroit.',
      visuel: {
        type: 'methode',
        titre: 'Libérer les volets',
        blocs: [
          { etapes: ['Onglet **Affichage** > groupe **Fenêtre** > **Figer les volets**'] },
          { capture: { type: 'ruban', actif: 'Affichage', groupeNom: 'Fenêtre', groupes: [{ icone: '🗔', label: 'Nouvelle\nfenêtre' }, { icone: '⊟', label: 'Figer les\nvolets', actif: true }, { icone: '🗗', label: 'Changer de\nfenêtre' }] } },
          { etapes: ['Clique **Libérer les volets**'], depart: 2 },
          { capture: { type: 'menu', items: [{ label: 'Libérer les volets', actif: true }, { label: 'Figer la ligne supérieure' }, { label: 'Figer la première colonne' }] } },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Pourquoi ne jamais laisser une colonne entièrement vide dans une liste ?',
      visuel: { type: 'question', options: ['Pour figer les volets', 'Pour conserver la continuité du tableau'], bonne: 1, explication: 'Une colonne (ou ligne) entièrement vide coupe la liste : Excel croit que le tableau s\'arrête là, et tes tris/filtres ne prennent qu\'une partie des données.' },
    },
    { humeur: 'fier', dit: 'Ta liste est propre et tes en-têtes restent visibles. La base d\'un bon tableau. Bravo ! 🎉' },
  ],
}

// --- Leçon 2 : Imprimer une longue liste (rappels) ---
const IMPRIMERLISTE = {
  id: 'fn-imprimerliste',
  titre: 'Imprimer une longue liste',
  exercices: [EX7.ex53],
  narration: [
    { humeur: 'accueil', dit: 'Une longue liste sur plusieurs pages pose deux soucis : les titres n\'apparaissent que sur la 1re page, et les coupures tombent mal. On règle ça.' },
    {
      humeur: 'pensif',
      dit: 'Pour que les **titres de colonnes se répètent** sur chaque page imprimée.',
      visuel: {
        type: 'methode',
        titre: 'Répéter les titres à l\'impression',
        blocs: [
          { etapes: ['Onglet **Mise en page** > **Imprimer les titres**'] },
          { capture: { type: 'ruban', actif: 'Mise en page', groupeNom: 'Mise en page', groupes: [{ icone: '🔲', label: 'Zone\nd\'impression' }, { icone: '📄', label: 'Imprimer\nles titres', actif: true }, { icone: '✂', label: 'Sauts de\npage' }] } },
          { etapes: ['Dans la fenêtre, remplis **Lignes à répéter en haut** (ex : $1:$1)'], depart: 2 },
          { capture: { type: 'champs', titre: 'Mise en page', champs: [{ l: 'Lignes à répéter en haut', v: '$1:$1', actif: true }, { l: 'Colonnes à répéter à gauche', v: '' }] } },
          { capture: { type: 'apercutitres' } },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: 'Pour voir et régler les coupures : le **mode Aperçu des sauts de page**.',
      visuel: {
        type: 'methode',
        titre: 'Gérer les sauts de page',
        blocs: [
          { etapes: ['Onglet **Affichage** > **Aperçu des sauts de page**'] },
          { capture: { type: 'ruban', actif: 'Affichage', groupeNom: 'Modes d\'affichage', groupes: [{ icone: '▦', label: 'Normal' }, { icone: '⧉', label: 'Aperçu des\nsauts de page', actif: true }, { icone: '📃', label: 'Mise en\npage' }] } },
          { capture: { type: 'sautspage' } },
          { etapes: ['Pour insérer, supprimer ou tout réinitialiser : Mise en page > **Sauts de page**'], depart: 2 },
          { capture: { type: 'menu', items: [{ label: 'Insérer un saut de page', actif: true }, { label: 'Supprimer le saut de page' }, { label: 'Réinitialiser tous les sauts de page' }] } },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: 'Enfin, pour n\'imprimer qu\'une partie : la **zone d\'impression**.',
      visuel: {
        type: 'methode',
        titre: 'Définir la zone d\'impression',
        blocs: [
          { etapes: ['Sélectionne la plage à imprimer'] },
          { capture: { type: 'tableaudonnees', brut: true, selection: true, entetes: ['Date', 'Vendeur', 'Ville', 'CA'], lignes: [['05/03', 'Marie', 'Lyon', '8 200 €'], ['06/03', 'Karim', 'Paris', '12 500 €']], legende: 'On sélectionne d\'abord les cellules à imprimer (contour bleu).' } },
          { etapes: ['Mise en page > **Zone d\'impression** > **Définir**'], depart: 2 },
          { capture: { type: 'ruban', actif: 'Mise en page', groupeNom: 'Mise en page', groupes: [{ icone: '🔲', label: 'Zone\nd\'impression', actif: true }, { icone: '📄', label: 'Imprimer\nles titres' }, { icone: '✂', label: 'Sauts de\npage' }] } },
          { etapes: ['Vérifie avec **Fichier > Imprimer** : l\'aperçu montre exactement ce qui sortira'], depart: 3 },
          { capture: { type: 'impressionapercu' } },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Pour répéter les titres de colonnes à l\'impression, on utilise...',
      visuel: { type: 'question', options: ['Mise en page > Imprimer les titres', 'Affichage > Figer les volets'], bonne: 0, explication: 'Figer les volets sert à l\'écran ; pour l\'impression, c\'est Mise en page > Imprimer les titres (lignes à répéter en haut).' },
    },
    { humeur: 'fier', dit: 'Tes longues listes s\'impriment proprement, titres compris. Bravo ! 🎉' },
  ],
}

// --- Leçon 3 : Créer un tableau de données ---
const CREERTABLEAU = {
  id: 'fn-creertableau',
  titre: 'Créer un tableau de données',
  exercices: [EX7.ex54],
  narration: [
    { humeur: 'accueil', dit: 'Transformer ta liste en « tableau de données » officiel te donne d\'un coup : mise en forme automatique, flèches de tri/filtre, et une extension qui suit tes ajouts. Voyons comment.' },
    {
      humeur: 'pensif',
      dit: 'Mettre ta liste sous forme de tableau, pas à pas.',
      visuel: {
        type: 'methode',
        titre: 'Mettre sous forme de tableau',
        blocs: [
          { etapes: ['Sélectionne tes données, **titres compris** (Ctrl + A à l\'intérieur, ⌘ + A sur Mac)'] },
          { capture: { type: 'tableaudonnees', brut: true, selection: true, entetes: LISTE_ENTETES, lignes: LISTE_LIGNES, legende: 'On sélectionne toute la liste, en-têtes inclus (contour bleu).' } },
          { etapes: ['Accueil > groupe **Styles** > **Mettre sous forme de tableau**, choisis un modèle'], depart: 2 },
          { capture: { type: 'ruban', actif: 'Accueil', groupeNom: 'Styles', groupes: [{ icone: '▦', label: 'Mise en forme\nconditionnelle' }, { icone: '▧', label: 'Mettre sous\nforme de tableau', actif: true }, { icone: '🎨', label: 'Styles de\ncellules' }] } },
          { etapes: ['Vérifie la plage, coche **« Mon tableau comporte des en-têtes »**, puis **OK**'], depart: 3 },
          { capture: { type: 'champs', titre: 'Créer un tableau', champs: [{ l: 'Où sont les données de votre tableau ?', v: '=$A$1:$C$5', actif: true }, { l: 'Mon tableau comporte des en-têtes', check: true }] } },
          { capture: { type: 'tableaudonnees', entetes: LISTE_ENTETES, lignes: LISTE_LIGNES, filtres: true, legende: 'Résultat : lignes en couleurs alternées et flèches de filtre dans chaque en-tête.' } },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Dès que tu cliques dans le tableau, un **onglet contextuel** apparaît à droite du ruban.',
      visuel: {
        type: 'methode',
        titre: 'L\'onglet « Création de tableau »',
        blocs: [
          { etapes: ['Clique dans le tableau : l\'onglet **Création de tableau** apparaît à droite du ruban (il disparaît dès que tu cliques en dehors)'] },
          { capture: { type: 'ruban', onglets: ['Fichier', 'Accueil', 'Insertion', 'Données', 'Création de tableau'], actif: 'Création de tableau', groupeNom: 'Styles de tableau', groupes: [{ icone: '✎', label: 'Nom du\ntableau' }, { icone: '🗑', label: 'Supprimer les\ndoublons' }, { icone: '▧', label: 'Styles de\ntableau', actif: true }] } },
          { note: 'Il donne accès à : les **styles de tableau**, le **nom du tableau** (réutilisable dans les formules), **supprimer les doublons**, et les **options de style** (ligne d\'en-tête, ligne de total, bandes de couleur).', label: 'Bon à savoir' },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: 'Le gros avantage : l\'**extension automatique**. Une nouvelle ligne saisie juste en dessous s\'intègre toute seule au tableau, avec la même mise en forme.',
      visuel: { type: 'extensiontableau' },
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Que se produit-il quand on met une plage « sous forme de tableau » ?',
      visuel: { type: 'question', options: ['Les lignes fusionnées sont conservées', 'Excel ajoute une mise en forme alternée et des flèches de filtre'], bonne: 1, explication: 'Le tableau applique une mise en forme en couleurs alternées et ajoute automatiquement les flèches de tri/filtre dans chaque en-tête.' },
    },
    { humeur: 'fier', dit: 'Ta liste est devenue un vrai tableau vivant, prêt à trier et filtrer. Bravo ! 🎉' },
  ],
}

// --- Leçon 4 : Saisir plus vite (semi-auto, liste déroulante, formulaire) ---
const SAISIRLISTE = {
  id: 'fn-saisirliste',
  titre: 'Saisir plus vite dans une liste',
  exercices: [EX7.ex55],
  narration: [
    { humeur: 'accueil', dit: 'Remplir une liste à la main, c\'est répétitif et source de fautes. Excel a trois aides : la saisie semi-automatique, la liste déroulante, et le formulaire.' },
    {
      humeur: 'pensif',
      dit: 'La **saisie semi-automatique** : dès que tu tapes le début d\'un mot déjà présent dans la colonne, Excel te le propose en gris.',
      visuel: {
        type: 'methode',
        titre: 'La saisie semi-automatique',
        blocs: [
          { etapes: ['Dans une cellule vide de la colonne, commence à taper un mot déjà utilisé plus haut', 'Excel affiche la suite en gris : appuie sur **Entrée** pour valider'] },
          { capture: { type: 'saisieauto' } },
          { note: 'Ça marche seulement si le mot existe déjà plus haut dans la MÊME colonne.' },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: 'Ou la **liste déroulante** des valeurs déjà saisies, pour choisir au lieu de taper.',
      visuel: {
        type: 'methode',
        titre: 'La liste déroulante de choix',
        blocs: [
          { etapes: ['Place-toi dans une cellule vide de la colonne'] },
          { etapes: ['Ouvre la liste : **clic droit** dans la cellule > **Liste déroulante de choix**'], depart: 2 },
          { capture: { type: 'menu', items: [{ icone: '✂️', label: 'Couper' }, { icone: '📋', label: 'Copier' }, '-', { label: 'Liste déroulante de choix', actif: true }] } },
          { note: 'Plus rapide au clavier : **Alt + ↓** (sur Mac : **⌥ + ↓**).', label: 'Astuce' },
          { etapes: ['Choisis une valeur dans la liste qui apparaît'], depart: 3 },
          { capture: { type: 'menu', items: [{ label: 'Marie' }, { label: 'Karim' }, { label: 'Léa', actif: true }, { label: 'Tom' }] } },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Pour une longue liste, le **Formulaire** transforme ton tableau en mini-application de saisie. D\'abord, ajoute-le à la barre d\'accès rapide.',
      visuel: {
        type: 'methode',
        titre: 'Ajouter le Formulaire à la barre d\'accès rapide',
        blocs: [
          { etapes: ['Repère la **barre d\'accès rapide** (tout en haut) et clique son **chevron ▾**, puis **Autres commandes…**'] },
          { capture: { type: 'barreaccesrapide' } },
          { capture: { type: 'menu', items: [{ label: 'Enregistrer' }, { label: 'Annuler la frappe' }, { label: 'Rétablir la frappe' }, '-', { label: 'Autres commandes…', actif: true }] } },
          { etapes: ['Choisis **Toutes les commandes**, sélectionne **Formulaire…**, clique **Ajouter**, puis **OK**'], depart: 2 },
          { capture: { type: 'listedialog', titre: 'Options Excel', intro: 'Choisir les commandes : Toutes les commandes', items: ['Fractionner', 'Formulaire…', 'Formules'], selection: 1 } },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: 'Ensuite, place-toi dans le tableau et clique sur l\'icône **Formulaire** : chaque colonne devient un champ. Ce que tu saisis s\'ajoute en bas du tableau.',
      visuel: {
        type: 'methode',
        titre: 'Saisir avec le formulaire',
        blocs: [
          { etapes: ['Clique **Nouveau**, remplis les champs (ils reprennent tes en-têtes), puis valide'] },
          { capture: { type: 'formulaire', champs: [{ l: 'Date', v: '09/03/2025' }, { l: 'Vendeur', v: 'Nina' }, { l: 'Ville', v: 'Paris' }, { l: 'CA', v: '7 300' }], index: 5, total: 5 } },
          { etapes: ['La nouvelle ligne s\'ajoute automatiquement à la fin du tableau'], depart: 2 },
          { capture: { type: 'tableaudonnees', entetes: ['Date', 'Vendeur', 'Ville', 'CA'], lignes: [['05/03', 'Marie', 'Lyon', '8 200 €'], ['06/03', 'Karim', 'Paris', '12 500 €'], ['07/03', 'Léa', 'Lyon', '6 400 €'], ['09/03', 'Nina', 'Paris', '7 300 €']], filtres: true, legende: 'La ligne « Nina » saisie au formulaire ci-dessus apparaît en bas du tableau.' } },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Dans le formulaire tu peux tout faire sans descendre dans la grille :',
      visuel: { type: 'encart', label: 'Bon à savoir', liste: ['**Nouveau** : ajoute un enregistrement (il se colle à la fin du tableau).', '**Précédente / Suivante** : navigue entre les lignes.', '**Supprimer** : efface la ligne affichée.', '**Critères** : tape un critère et ne navigue que parmi les lignes correspondantes (mini-recherche).'] },
    },
    {
      humeur: 'accueil',
      dit: 'À toi. La saisie semi-automatique s\'active dès que...',
      visuel: { type: 'question', options: ['Tu appuies sur Alt + ↓', 'Tu commences à taper un terme déjà présent dans la colonne'], bonne: 1, explication: 'La saisie semi-automatique se déclenche quand tu tapes le début d\'un mot déjà saisi plus haut dans la colonne. (Alt + ↓, lui, ouvre la liste déroulante.)' },
    },
    { humeur: 'fier', dit: 'Tu saisis plus vite et sans fautes, même sur de longues listes. Bravo ! 🎉' },
  ],
}

// --- Leçon 5 : Trier les données ---
const TRIERLISTE = {
  id: 'fn-trierliste',
  titre: 'Trier les données',
  exercices: [EX7.ex56],
  narration: [
    { humeur: 'accueil', dit: 'Trier, c\'est mettre en avant tes meilleurs clients/produits, repérer les valeurs extrêmes, ou préparer un filtre ou un graphique. Deux niveaux : simple et personnalisé.' },
    {
      humeur: 'pensif',
      dit: 'Le **tri simple** sur une colonne.',
      visuel: {
        type: 'methode',
        titre: 'Trier sur une colonne',
        blocs: [
          { etapes: ['Clique dans une cellule de la **colonne à trier** (ici la colonne **CA**)'] },
          { capture: { type: 'tableaudonnees', entetes: LISTE_ENTETES, lignes: LISTE_LIGNES, filtres: true, colSel: 2, legende: 'On clique dans la colonne CA (surlignée) : c\'est elle qu\'on va trier.' } },
          { etapes: ['Données > groupe **Trier et filtrer** > **A→Z** (croissant) ou **Z→A** (décroissant)'], depart: 2 },
          { capture: { type: 'ruban', actif: 'Données', groupeNom: 'Trier et filtrer', groupes: [{ icone: 'A↓', label: 'Trier de\nA à Z', actif: true }, { icone: 'Z↓', label: 'Trier de\nZ à A' }, { icone: '▽', label: 'Filtrer' }] } },
          { capture: { type: 'tableaudonnees', entetes: LISTE_ENTETES, lignes: [['Karim', 'Paris', '12 500 €'], ['Tom', 'Marseille', '9 100 €'], ['Marie', 'Lyon', '8 200 €'], ['Léa', 'Lyon', '6 400 €']], filtres: true, filtreCol: 2, legende: 'Trié par CA décroissant : Karim en tête. La flèche de la colonne triée change d\'aspect.' } },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: 'Le **tri personnalisé** combine plusieurs colonnes, avec un ordre de priorité.',
      visuel: {
        type: 'methode',
        titre: 'Trier sur plusieurs colonnes',
        blocs: [
          { etapes: ['Données > groupe **Trier et filtrer** > **Trier**'] },
          { capture: { type: 'ruban', actif: 'Données', groupeNom: 'Trier et filtrer', groupes: [{ icone: '⇅', label: 'Trier', actif: true }, { icone: '▽', label: 'Filtrer' }, { icone: '⌫', label: 'Effacer' }] } },
          { etapes: ['Dans la fenêtre, clique **Ajouter un niveau** pour chaque critère'], depart: 2 },
          { capture: { type: 'tridialog', niveaux: [{ colonne: 'Ville', ordre: 'De A à Z' }, { colonne: 'CA', ordre: 'Du plus grand au plus petit' }] } },
          { note: 'Chaque **niveau** est un critère, par ordre de **priorité** (une hiérarchie) : le Niveau 1 (Ville) trie d\'abord ; le Niveau 2 (CA) ne départage que les lignes de MÊME ville. Tu peux aussi choisir un ordre personnalisé (mois, jours) via Ordre > Liste personnalisée.', label: 'Bon à savoir' },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Pour revenir en arrière :',
      visuel: { type: 'encart', label: 'Astuce', liste: ['**Ctrl + Z** (⌘ + Z) juste après le tri annule immédiatement.', 'Données > Trier et filtrer > **Effacer** (l\'entonnoir barré) retire tris et filtres d\'un coup.'] },
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Quelle option permet de combiner plusieurs critères de tri ?',
      visuel: { type: 'question', options: ['Données > Trier > Ajouter un niveau', 'Données > Trier A→Z'], bonne: 0, explication: 'Le A→Z simple ne trie qu\'une colonne. Pour combiner plusieurs critères, on ouvre Données > Trier et on clique « Ajouter un niveau ».' },
    },
    { humeur: 'fier', dit: 'Tu ranges tes données comme tu veux, sur un ou plusieurs critères. Bravo ! 🎉' },
  ],
}

// --- Leçon 6 : Filtrer les données ---
const FILTRERLISTE = {
  id: 'fn-filtrerliste',
  titre: 'Filtrer les données',
  exercices: [EX7.ex56],
  narration: [
    { humeur: 'accueil', dit: 'Filtrer, c\'est n\'afficher que les lignes qui t\'intéressent, sans rien supprimer. Tu peux revenir en arrière et combiner plusieurs conditions à tout moment.' },
    {
      humeur: 'pensif',
      dit: 'Sur une liste classique (non mise en tableau), il faut **activer les filtres** toi-même.',
      visuel: {
        type: 'methode',
        titre: 'Activer les filtres',
        blocs: [
          { etapes: ['Clique dans une cellule de la liste', 'Données > groupe **Trier et filtrer** > **Filtrer**'] },
          { capture: { type: 'ruban', actif: 'Données', groupeNom: 'Trier et filtrer', groupes: [{ icone: 'A↓', label: 'Trier de\nA à Z' }, { icone: 'Z↓', label: 'Trier de\nZ à A' }, { icone: '▽', label: 'Filtrer', actif: true }] } },
          { capture: { type: 'tableaudonnees', entetes: LISTE_ENTETES, lignes: LISTE_LIGNES, filtres: true, legende: 'Une flèche de filtre apparaît dans chaque en-tête.' } },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: 'Clique sur la flèche d\'un en-tête pour ouvrir le menu du filtre.',
      visuel: {
        type: 'methode',
        titre: 'Filtrer une colonne',
        blocs: [
          { etapes: ['Clique la **flèche ▾** de l\'en-tête de la colonne (ex : **Ville**)'] },
          { capture: { type: 'tableaudonnees', entetes: LISTE_ENTETES, lignes: LISTE_LIGNES, filtres: true, filtreCol: 1, legende: 'On clique la petite flèche de l\'en-tête « Ville » (surlignée) pour ouvrir son filtre.' } },
          { etapes: ['Dans le menu, décoche/coche les valeurs à afficher, puis **OK**'], depart: 2 },
          { capture: { type: 'filtremenu', colonne: 'Ville', valeurs: [{ label: 'Lyon', coche: true }, { label: 'Marseille', coche: false }, { label: 'Paris', coche: false }] } },
          { capture: { type: 'tableaudonnees', entetes: LISTE_ENTETES, lignes: [['Marie', 'Lyon', '8 200 €'], ['Léa', 'Lyon', '6 400 €']], filtres: true, filtreCol: 1, legende: 'On ne garde que Lyon : les autres lignes sont masquées (pas supprimées).' } },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Le menu s\'adapte au **type** de la colonne. Selon les cas :',
      visuel: {
        type: 'methode',
        titre: 'Des filtres adaptés au type',
        blocs: [
          { etapes: ['**Colonne texte** : les cases à cocher, ou « Filtres textuels » (contient, commence par…)'] },
          { capture: { type: 'menu', items: [{ label: 'Filtres textuels', actif: true }, '-', { label: 'Est égal à…' }, { label: 'Contient…' }, { label: 'Commence par…' }] } },
          { etapes: ['**Colonne nombre** : « Filtres numériques » (supérieur, inférieur, entre…)'], depart: 2 },
          { capture: { type: 'menu', items: [{ label: 'Filtres numériques', actif: true }, '-', { label: 'Est supérieur à…' }, { label: 'Entre…' }, { label: '10 premiers…' }] } },
          { etapes: ['**Colonne date** : « Filtres chronologiques » (ce mois-ci, cette année, une période…)'], depart: 3 },
          { capture: { type: 'menu', items: [{ label: 'Filtres chronologiques', actif: true }, '-', { label: 'Ce mois-ci' }, { label: 'Cette année' }, { label: 'Entre…' }] } },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: 'Une colonne filtrée se repère à son **icône d\'entonnoir**. Pour tout retirer : Données > **Effacer**.',
      visuel: {
        type: 'methode',
        titre: 'Repérer et retirer un filtre',
        blocs: [
          { etapes: ['La colonne filtrée affiche un **entonnoir** à la place de la flèche'] },
          { capture: { type: 'tableaudonnees', entetes: LISTE_ENTETES, lignes: [['Marie', 'Lyon', '8 200 €'], ['Léa', 'Lyon', '6 400 €']], filtres: true, filtreCol: 1, legende: 'La colonne « Ville » est filtrée : son en-tête montre l\'entonnoir ▽ (pas la flèche ▾).' } },
          { etapes: ['Pour tout retrouver : Données > groupe **Trier et filtrer** > **Effacer**'], depart: 2 },
          { capture: { type: 'ruban', actif: 'Données', groupeNom: 'Trier et filtrer', groupes: [{ icone: 'A↓', label: 'Trier de\nA à Z' }, { icone: '▽', label: 'Filtrer' }, { icone: '⌫', label: 'Effacer', actif: true }] } },
          { note: 'Le filtre **masque** les lignes, il ne les supprime pas : Effacer retrouve tout instantanément.', label: 'Bon à savoir' },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Une croyance à vérifier. **Vrai ou faux ?**',
      visuel: { type: 'vraifaux', affirmation: 'Filtrer une liste supprime les lignes qui ne correspondent pas au critère.', bonne: false, explication: 'Les lignes sont seulement MASQUÉES, jamais supprimées. Données > Effacer, et elles réapparaissent toutes.' },
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Sur une liste classique, comment fais-tu apparaître les flèches de filtre ?',
      visuel: { type: 'question', options: ['Données > Trier et filtrer > Filtrer', 'Affichage > Figer les volets'], bonne: 0, explication: 'La commande Données > Filtrer ajoute les flèches de filtre dans chaque en-tête. (Un tableau de données, lui, les ajoute automatiquement.)' },
    },
    { humeur: 'fier', dit: 'Tu isoles n\'importe quelle information en deux clics, sans jamais abîmer tes données. Bravo ! 🎉' },
  ],
}

// --- Leçon 7 : Les sous-totaux & la fonction SOUS.TOTAL ---
const SOUSTOTAUX = {
  id: 'fn-soustotaux',
  titre: 'Les sous-totaux',
  exercices: [EX7.ex57, EX7.ex58],
  narration: [
    { humeur: 'accueil', dit: 'Les sous-totaux regroupent tes lignes par critère (par ville, par vendeur…) et calculent automatiquement un total à chaque changement de groupe. Fini les calculs à la main.' },
    {
      humeur: 'pensif',
      dit: 'Insérer des sous-totaux, pas à pas. Astuce : **trie d\'abord** par la colonne de regroupement.',
      visuel: {
        type: 'methode',
        titre: 'Insérer des sous-totaux',
        blocs: [
          { etapes: ['**Trie d\'abord** la liste par le critère de regroupement (ici **Ville**)'] },
          { capture: { type: 'tableaudonnees', entetes: LISTE_ENTETES, lignes: [['Léa', 'Lyon', '6 400 €'], ['Marie', 'Lyon', '8 200 €'], ['Tom', 'Marseille', '9 100 €'], ['Karim', 'Paris', '12 500 €']], filtres: true, colSel: 1, legende: 'Triée par Ville (colonne surlignée) : les villes identiques sont regroupées.' } },
          { etapes: ['Clique dans le tableau, puis Données > groupe **Plan** > **Sous-total**'], depart: 2 },
          { capture: { type: 'ruban', actif: 'Données', groupeNom: 'Plan', groupes: [{ icone: '⊞', label: 'Grouper' }, { icone: '⊟', label: 'Dissocier' }, { icone: 'Σ', label: 'Sous-total', actif: true }] } },
          { etapes: ['Choisis la colonne de regroupement, la fonction et la colonne à totaliser, puis **OK**'], depart: 3 },
          { capture: { type: 'soustotaldialog', changement: 'Ville', fonction: 'Somme', colonnes: ['CA'] } },
          { capture: { type: 'tableaudonnees', entetes: LISTE_ENTETES, lignes: [['Léa', 'Lyon', '6 400 €'], ['Marie', 'Lyon', '8 200 €'], ['', 'Total Lyon', '14 600 €'], ['Tom', 'Marseille', '9 100 €'], ['', 'Total Marseille', '9 100 €'], ['Karim', 'Paris', '12 500 €'], ['', 'Total Paris', '12 500 €']], total: ['', 'Total général', '36 200 €'], legende: 'Excel insère un sous-total à chaque changement de ville, plus le total général.' } },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'À gauche apparaissent les **boutons de plan** (1, 2, 3) pour changer de niveau de détail. Regarde :',
      visuel: { type: 'plan' },
    },
    {
      humeur: 'pensif',
      dit: 'Ce que fait chaque bouton :',
      visuel: { type: 'encart', label: 'À retenir', liste: ['**Bouton 1** : uniquement le **total général** (vue d\'ensemble).', '**Bouton 2** : les **sous-totaux** de chaque groupe + le total général.', '**Bouton 3** : **tout le détail**, ligne par ligne, avec les sous-totaux.'] },
    },
    {
      humeur: 'accueil',
      dit: 'Pour tout enlever : Données > Plan > Sous-total > **Supprimer tout**.',
      visuel: { type: 'encart', label: 'Astuce', texte: 'Tu retrouves ta liste d\'origine, sans les lignes de sous-total ni le plan.' },
    },
    {
      humeur: 'pensif',
      dit: 'Il existe aussi une **fonction** dédiée : SOUS.TOTAL. Sa force : elle peut **ignorer les lignes masquées par un filtre**, contrairement à SOMME qui additionne tout.',
      visuel: { type: 'formule', formule: '=SOUS.TOTAL(no_fonction;plage)' },
    },
    {
      humeur: 'pensif',
      dit: 'Le 1er argument (**no_fonction**) choisit le calcul ET s\'il inclut ou non les lignes masquées :',
      visuel: { type: 'parties', items: [{ label: '**1 à 11** : inclut les lignes masquées (ex : SOMME = **9**, MOYENNE = 1, NB = 2, MAX = 4).' }, { label: '**101 à 111** : ignore les lignes masquées (ex : SOMME = **109**, MOYENNE = 101, MAX = 104).' }] },
    },
    {
      humeur: 'accueil',
      dit: 'Exemple : sommer uniquement les lignes visibles après un filtre.',
      visuel: {
        type: 'methode',
        titre: 'Utiliser SOUS.TOTAL',
        blocs: [
          { etapes: ['Dans la cellule du résultat, tape **=SOUS.TOTAL(**'] },
          { capture: { type: 'autocomplete', cellule: 'E2', saisie: '=SOUS.TOTAL(', items: [{ nom: 'SOUS.TOTAL', desc: 'Renvoie un sous-total dans une liste (ignore les lignes masquées selon le code choisi).' }] } },
          { etapes: ['Mets **109** (la somme qui ignore les lignes masquées), puis **;**'], depart: 2 },
          { capture: { type: 'tableur', cols: ['D', 'E'], rows: [1, 2], cells: { D1: { t: 'Total participants', entete: true }, E1: { t: '', entete: true }, D2: { t: 'Visibles' }, E2: { t: '=SOUS.TOTAL(109;' } }, formule: '=SOUS.TOTAL(109;', actif: 'E2', legende: '109 = la somme, mais uniquement sur les lignes visibles.' } },
          { etapes: ['Sélectionne la **plage** (ex : E5:E15), ferme la parenthèse **)** et **Entrée**'], depart: 3 },
          { capture: { type: 'tableur', cols: ['D', 'E'], rows: [1, 2], cells: { D1: { t: 'Total participants', entete: true }, E1: { t: '', entete: true }, D2: { t: 'Visibles' }, E2: { t: '820', num: true, vert: true } }, formule: '=SOUS.TOTAL(109;E5:E15)', actif: 'E2', legende: 'Si tu filtres par région, le total se recalcule tout seul avec les seules lignes visibles.' } },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Quel numéro de fonction fait une SOMME qui ignore les lignes masquées ?',
      visuel: { type: 'question', options: ['9', '109'], bonne: 1, explication: 'Les codes 101 à 111 ignorent les lignes masquées : la somme, c\'est 109. Le code 9 (1 à 11) additionnerait aussi les lignes masquées.' },
    },
    { humeur: 'fier', dit: 'Tu synthétises tes listes en un clic et tu maîtrises SOUS.TOTAL. Tu décroches la ceinture verte. Bravo ! 🎉' },
  ],
}

// ===================== CHAPITRE 8 : LES GRAPHIQUES (ceinture verte-bleue) =====================
const U8 = (id) => `https://drive.google.com/file/d/${id}/view?usp=drivesdk`
const EX8 = {
  ex59: { titre: 'Exercice 59 · Les graphiques simples', url: U8('1uDZv2IHm9cJLabXOjyKnUkn3NdirIMDS') },
  ex60: { titre: 'Exercice 60 · Ajuster et déplacer les graphiques', url: U8('1uU4Wzf713BPAL4aole3v0MH9WJKIOjhO') },
  ex61: { titre: 'Exercice 61 · Modifier un graphique', url: U8('1S0UsABE9xqY0CrmGslOaofp3NjhKDigf') },
  ex62: { titre: 'Exercice 62 · Modifier les axes et les séries', url: U8('1vy7yz5epg9rKDu1FXUXsKOmIjdwyoIfd') },
  ex63: { titre: 'Exercice 63 · Intervertir les lignes/colonnes', url: U8('16gROGvwigLzb0CUmzhAQDTfyZbmm0T2X') },
  ex64: { titre: 'Exercice 64 · Déplacer et imprimer un graphique', url: U8('19rVXC94sgEj7M8Q-9nUjfn6j83v1S6-7') },
  ex65: { titre: 'Exercice 65 · Les graphiques mixtes ou combinés', url: U8('12ORIQGPvwm-b5C7ZQPezBz-rPns3vM1Y') },
  ex66: { titre: 'Exercice 66 · Les graphiques Sparklines', url: U8('1-Yyh64VoGeTuVboK9LHictSDi-jexdQZ') },
}
const GRAPH_MOIS = { cats: ['Jan', 'Fév', 'Mar', 'Avr'], series: [{ nom: 'Ventes', vals: [12, 19, 15, 24] }] }
const GRAPH_PRODUITS = { cats: ['T1', 'T2', 'T3'], series: [{ nom: 'Ebook Excel', couleur: '#41c1ba', vals: [12, 18, 24] }, { nom: 'Ebook Shaolin', couleur: '#0a335d', vals: [9, 15, 21] }] }
const GRAPH_MIXTE = { cats: ['T1', 'T2', 'T3'], series: [{ nom: 'CA (k€)', couleur: '#41c1ba', vals: [12, 18, 24] }, { nom: 'Nb ventes', couleur: '#e8853a', vals: [40, 55, 72] }] }
const TABLE_MOIS_LIGNES = [['Jan', '12 000 €'], ['Fév', '19 000 €'], ['Mar', '15 000 €'], ['Avr', '24 000 €']]

// --- Leçon 1 : Créer un graphique ---
const CREERGRAPHIQUE = {
  id: 'fn-creergraphique',
  titre: 'Créer un graphique',
  exercices: [EX8.ex59],
  narration: [
    { humeur: 'accueil', dit: 'Un **graphique** transforme un tableau de chiffres en image claire : on voit tout de suite les tendances. Voici la table de départ, elle deviendra un graphique.', visuel: { type: 'tableaudonnees', brut: true, entetes: ['Mois', 'Ventes'], lignes: TABLE_MOIS_LIGNES, legende: 'Ces 4 chiffres deviennent 4 barres : plus la barre est haute, plus la vente est grande.' } },
    {
      humeur: 'pensif',
      dit: 'Première étape : **sélectionner les données** à représenter, en-têtes compris.',
      visuel: {
        type: 'methode',
        titre: 'Sélectionner la plage',
        blocs: [
          { etapes: ['Clique une cellule **à l\'intérieur** de ton tableau.'] },
          { etapes: ['Appuie sur **Ctrl + A** (Mac : **⌘ + A**) : toute la plage collée se sélectionne.'], depart: 2 },
          { capture: { type: 'touche', touches: ['Ctrl', 'A'], note: 'Sur Mac : ⌘ + A. Sélectionne d\'un coup toute la plage de données autour de la cellule.' } },
          { capture: { type: 'tableaudonnees', brut: true, selection: true, entetes: ['Mois', 'Ventes'], lignes: TABLE_MOIS_LIGNES, legende: 'La plage entière est sélectionnée (contour bleu), titres inclus.' } },
          { note: 'À la main : clique la 1re cellule, puis **Shift + clic** sur le coin opposé de la plage.', label: 'Astuce' },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Deuxième étape : **insérer** le graphique depuis le ruban.',
      visuel: {
        type: 'methode',
        titre: 'Insérer le graphique',
        blocs: [
          { etapes: ['Va dans l\'onglet **Insertion**, groupe **Graphiques**.'] },
          { capture: { type: 'ruban', actif: 'Insertion', groupeNom: 'Graphiques', groupes: [{ icone: '📊', label: 'Histogramme', actif: true }, { icone: '📈', label: 'Courbe' }, { icone: '🥧', label: 'Secteurs' }, { icone: '⭐', label: 'Graphique\nrecommandé' }] } },
          { etapes: ['Clique le **type** voulu, puis un **sous-type** dans la galerie (ex. Histogramme groupé).'], depart: 2 },
          { capture: { type: 'galeriegraphiques' } },
          { etapes: ['Le graphique **apparaît** sur ta feuille, prêt à personnaliser.'], depart: 3 },
          { capture: { type: 'graphique', ...GRAPH_MOIS, titre: 'Ventes par mois', etiquettes: true, anime: true, legende: 'Et voilà ton histogramme, créé à partir du tableau.' } },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: 'Excel propose plusieurs **catégories** de graphiques. Chacune raconte une histoire différente :',
      visuel: { type: 'typesgraphiques' },
    },
    {
      humeur: 'pensif',
      dit: 'Une fois la catégorie choisie, Excel propose des **sous-types** (en miniatures). Exemple pour l\'histogramme :',
      visuel: { type: 'soustypesgraphiques' },
    },
    {
      humeur: 'pensif',
      dit: 'Pas sûre du type ? Laisse Excel te guider avec **Graphique recommandé**.',
      visuel: {
        type: 'methode',
        titre: 'Le graphique recommandé',
        blocs: [
          { etapes: ['Sélectionne ton tableau, puis onglet **Insertion** > groupe **Graphiques** > **Graphique recommandé**.'] },
          { capture: { type: 'ruban', actif: 'Insertion', groupeNom: 'Graphiques', groupes: [{ icone: '📊', label: 'Histogramme' }, { icone: '📈', label: 'Courbe' }, { icone: '⭐', label: 'Graphique\nrecommandé', actif: true }] } },
          { etapes: ['La fenêtre **Insérer un graphique** s\'ouvre : Excel analyse tes données et propose les **3 à 5 types les plus pertinents**. Clique une miniature pour l\'aperçu, puis **OK**.'], depart: 2 },
          { capture: { type: 'recommandedialog' } },
          { note: 'Parfait quand tu débutes : tu choisis parmi des propositions déjà adaptées à tes données.', label: 'Bon à savoir' },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Quel raccourci sélectionne d\'un coup toute la plage de données autour de ta cellule ?',
      visuel: { type: 'question', options: ['Ctrl + C (Mac : ⌘ + C)', 'Ctrl + A (Mac : ⌘ + A)', 'Ctrl + P (Mac : ⌘ + P)'], bonne: 1, explication: 'Ctrl + A (⌘ + A sur Mac), depuis une cellule du tableau, sélectionne toute la plage collée. Ctrl + C copie, Ctrl + P imprime.' } },
    { humeur: 'fier', dit: 'Tu sais créer un graphique et choisir le bon type. C\'est le point de départ de toute belle visualisation. Bravo ! 🎉' },
  ],
}

// --- Leçon 2 : Déplacer & redimensionner ---
const DEPLACERGRAPHIQUE = {
  id: 'fn-deplacergraphique',
  titre: 'Déplacer & redimensionner',
  exercices: [EX8.ex60],
  narration: [
    { humeur: 'accueil', dit: 'Un graphique est un **objet flottant** posé sur ta feuille : tu peux le déplacer et l\'agrandir librement, sans toucher aux données.', visuel: { type: 'graphique', ...GRAPH_MOIS, titre: 'Ventes par mois', poignees: true, legende: 'Le voilà, notre objet : sélectionné, avec son cadre et ses 8 poignées. On va apprendre à le manier.' } },
    {
      humeur: 'pensif',
      dit: 'Pour le **déplacer** : attrape-le par son bord.',
      visuel: {
        type: 'methode',
        titre: 'Déplacer le graphique',
        blocs: [
          { etapes: ['Survole le **bord** du graphique jusqu\'à voir le curseur à **4 flèches** (✥).'] },
          { etapes: ['Clique et **fais glisser** où tu veux, puis relâche.'], depart: 2 },
          { capture: { type: 'deplacergraphique' } },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Pour le **redimensionner** : utilise les poignées.',
      visuel: {
        type: 'methode',
        titre: 'Redimensionner le graphique',
        blocs: [
          { etapes: ['Clique le graphique : **8 poignées** apparaissent sur son cadre.'] },
          { etapes: ['Attrape une **poignée d\'angle** et fais-la glisser pour agrandir ou réduire.'], depart: 2 },
          { capture: { type: 'redimensionnergraphique' } },
          { note: '**Poignées d\'angle** : redimensionnent largeur ET hauteur ensemble (proportions). **Poignées latérales** (au milieu des côtés) : modifient une **seule** dimension.', label: 'Bon à savoir' },
          { etapes: ['Maintiens **Shift** pendant le glissement pour garder les **proportions**.'], depart: 3 },
          { capture: { type: 'touche', touches: ['Shift'], note: 'Maintenue pendant le glissement d\'une poignée d\'angle, la touche Shift garde le graphique bien proportionné (pas déformé).' } },
          { note: 'Pour une **taille précise** : onglet **Format** > groupe **Taille**, saisis la **Hauteur** et la **Largeur**.', label: 'Astuce' },
          { capture: { type: 'ruban', onglets: ['Fichier', 'Accueil', 'Insertion', 'Création de graphique', 'Format'], actif: 'Format', groupeNom: 'Taille', groupes: [{ icone: '↕', label: 'Hauteur', actif: true }, { icone: '↔', label: 'Largeur', actif: true }] } },
          { capture: { type: 'champs', titre: 'Taille', champs: [{ l: 'Hauteur', v: '7,62 cm', actif: true }, { l: 'Largeur', v: '12,7 cm', actif: true }] } },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Quelle touche maintenir pendant le glissement pour redimensionner sans déformer le graphique ?',
      visuel: { type: 'question', options: ['Alt (Mac : ⌥)', 'Ctrl (Mac : ⌘)', 'Shift', 'Tab'], bonne: 2, explication: 'Shift, maintenue en glissant une poignée d\'angle, conserve les proportions du graphique.' },
    },
    { humeur: 'fier', dit: 'Ton graphique se place et se dimensionne exactement où tu veux. Bravo ! 🎉' },
  ],
}

// --- Leçon 3 : Onglets contextuels & style ---
const MODIFIERGRAPHIQUE = {
  id: 'fn-modifiergraphique',
  titre: 'Onglets contextuels & style',
  exercices: [EX8.ex61],
  narration: [
    {
      humeur: 'accueil',
      dit: 'Dès que tu **sélectionnes** un graphique, deux onglets spéciaux apparaissent dans le ruban : **Création de graphique** et **Format**. Ils disparaissent quand tu cliques ailleurs.',
      visuel: { type: 'ongletscontextuels' },
    },
    {
      humeur: 'pensif',
      dit: 'Que fait chacun de ces deux onglets ?',
      visuel: { type: 'encart', label: 'Les deux onglets contextuels', liste: ['**Création de graphique** : choix du type de graphique, sélection ou modification de la source de données, déplacement et disposition générale.', '**Mise en forme (Format)** : application de styles et de thèmes, personnalisation des couleurs, des bordures et des effets, ajout ou retrait des éléments (titre, légende, axes, étiquettes…) et réglages précis de leur position et de leur format.'] },
    },
    {
      humeur: 'pensif',
      dit: 'Pour modifier **un élément précis** (une série, un axe, le titre…), voici le chemin complet.',
      visuel: {
        type: 'methode',
        titre: 'Mise en forme de la sélection',
        blocs: [
          { etapes: ['Voici le graphique de **départ** : la série est turquoise. On va la passer en orange.'] },
          { capture: { type: 'graphique', ...GRAPH_MOIS, titre: 'Ventes par mois', legende: 'AVANT : la série « Ventes » est turquoise.' } },
          { etapes: ['**Sélectionne ton graphique** (clique-le), puis ouvre l\'onglet **Format** (Mise en forme). **Tout à gauche** du ruban : le groupe **Sélection active**, avec sa grande **liste déroulante**.'], depart: 2 },
          { capture: { type: 'selectionactive', element: 'Série « Ventes »' } },
          { note: 'La liste déroulante affiche **toujours l\'élément en cours de sélection** : clique une barre du graphique, elle indiquera « Série « Ventes » ». **Sur Mac comme sur Windows**, ce groupe est tout à gauche de l\'onglet Format, dès que le graphique est sélectionné.', label: 'Où ça se trouve ?' },
          { etapes: ['Clique la **flèche ▾** de la liste : **tous les éléments** du graphique s\'affichent. Choisis **Série « Ventes »**.'], depart: 3 },
          { capture: { type: 'menu', items: [{ label: 'Zone de graphique' }, { label: 'Zone de traçage' }, { label: 'Série « Ventes »', actif: true }, { label: 'Axe vertical (Valeurs)' }, { label: 'Titre du graphique' }, { label: 'Légende' }] } },
          { etapes: ['Clique **Mise en forme de la sélection** : la fenêtre **Mettre en forme…** s\'ouvre à droite. Ajuste le **remplissage** (ici orange), la **bordure** ou les **effets 3D**.'], depart: 4 },
          { capture: { type: 'voletformat', titre: 'Mettre en forme la série', couleur: '#e8853a' } },
          { capture: { type: 'graphique', cats: ['Jan', 'Fév', 'Mar', 'Avr'], series: [{ nom: 'Ventes', couleur: '#e8853a', vals: [12, 19, 15, 24] }], titre: 'Ventes par mois', legende: 'APRÈS : la série a pris le remplissage orange choisi dans le volet. Compare avec le départ !' } },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Change l\'allure d\'un clic avec un **style prédéfini**.',
      visuel: {
        type: 'methode',
        titre: 'Changer le style',
        blocs: [
          { etapes: ['Sélectionne le graphique, onglet **Création de graphique** > groupe **Styles du graphique**.'] },
          { capture: { type: 'ruban', onglets: ['Fichier', 'Accueil', 'Insertion', 'Création de graphique', 'Format'], actif: 'Création de graphique', groupeNom: 'Styles du graphique', groupes: [{ icone: '▤', label: 'Style 1' }, { icone: '▥', label: 'Style 2', actif: true }, { icone: '▦', label: 'Style 3' }, { icone: '🎨', label: 'Modifier les\ncouleurs' }] } },
          { capture: { type: 'stylesgraphique' } },
          { etapes: ['**Survole** les vignettes pour un aperçu en direct, puis **clique** pour appliquer.'], depart: 2 },
          { capture: { type: 'graphique', ...GRAPH_MOIS, titre: 'Ventes par mois', legende: 'AVANT : le style par défaut (fond blanc).' } },
          { capture: { type: 'graphique', ...GRAPH_MOIS, titre: 'Ventes par mois', theme: 'sombre', legende: 'APRÈS : Style 3 appliqué, le même graphique change complètement d\'habillage (fond sombre, texte blanc).' } },
          { note: 'Pour changer seulement les **couleurs** : Création > **Modifier les couleurs** (palette Colorée ou Monochrome). Pour un réglage fin d\'un élément (remplissage, bordure, effets), utilise le volet **Mettre en forme…** (voir la leçon « Les axes »).', label: 'Astuce' },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'La **disposition** agence d\'un coup tous les éléments (titre, légende, étiquettes, axes) proprement.',
      visuel: {
        type: 'methode',
        titre: 'Modifier la disposition',
        blocs: [
          { etapes: ['Sélectionne le graphique, onglet **Création de graphique** > groupe **Dispositions du graphique** > **Disposition rapide**.'] },
          { capture: { type: 'ruban', onglets: ['Fichier', 'Accueil', 'Insertion', 'Création de graphique', 'Format'], actif: 'Création de graphique', groupeNom: 'Dispositions du graphique', groupes: [{ icone: '▚', label: 'Disposition\nrapide', actif: true }, { icone: '＋', label: 'Ajouter un\nélément' }] } },
          { note: 'Survole chaque miniature pour l\'aperçu, puis clique celle qui te plaît : tous les éléments se placent tout seuls.', label: 'Astuce' },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Tu peux aussi **mettre en forme le texte** (titre, étiquettes) comme dans une cellule.',
      visuel: {
        type: 'methode',
        titre: 'Mettre en forme le texte',
        blocs: [
          { etapes: ['Clique le texte à modifier (titre, étiquette), puis onglet **Accueil** > groupe **Police** : police, taille, gras.'] },
          { capture: { type: 'ruban', actif: 'Accueil', groupeNom: 'Police', groupes: [{ icone: 'A', label: 'Police' }, { icone: '↕', label: 'Taille' }, { icone: 'G', label: 'Gras', actif: true }] } },
          { etapes: ['Groupe **Alignement** : place le texte (gauche/centré/droite, haut/milieu/bas).'], depart: 2 },
          { capture: { type: 'ruban', actif: 'Accueil', groupeNom: 'Alignement', groupes: [{ icone: '↥', label: 'Haut' }, { icone: '≡', label: 'Centré', actif: true }, { icone: '↧', label: 'Bas' }] } },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Trois boutons flottants apparaissent à côté du graphique sélectionné. Le plus utile : le **＋**, pour ajouter ou retirer des éléments.',
      visuel: { type: 'boutonsgraphique' },
    },
    {
      humeur: 'pensif',
      dit: 'Le **＋** te donne accès à tous les éléments du graphique. Voici à quoi ils servent :',
      visuel: { type: 'encart', label: 'Éléments de graphique', liste: ['**Titre** : le nom affiché au-dessus du graphique.', '**Étiquettes de données** : la valeur exacte posée sur chaque barre ou point.', '**Table de données** : un mini-tableau des valeurs sous le graphique.', '**Quadrillage** : les lignes de fond alignées sur les graduations.', '**Légende** : la zone qui associe chaque couleur à sa série.', '**Courbe de tendance** : une ligne qui montre la tendance d\'une série.'] },
    },
    {
      humeur: 'pensif',
      dit: 'La 2e icône flottante, le **🖌 pinceau**, change le look en un clin d\'œil, sans quitter le graphique.',
      visuel: {
        type: 'methode',
        titre: 'Le raccourci pinceau',
        blocs: [
          { etapes: ['Sélectionne le graphique, puis clique le **🖌 pinceau** (2e icône flottante, juste à droite).'] },
          { capture: { type: 'boutonsgraphique', bouton: 'pinceau' } },
          { etapes: ['Deux onglets s\'ouvrent : **Style** (mise en forme globale) et **Couleur** (palette Colorée ou Monochrome). Survole pour tester, clique pour appliquer.'], depart: 2 },
          { capture: { type: 'pinceaugraphique' } },
          { capture: { type: 'graphique', cats: ['Jan', 'Fév', 'Mar', 'Avr'], series: [{ nom: 'Ventes', couleur: '#e8853a', vals: [12, 19, 15, 24] }], titre: 'Ventes par mois', legende: 'APRÈS : palette Monochrome orange appliquée via l\'onglet Couleur (avant, les barres étaient turquoise).' } },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'La 3e icône flottante, le **▽ filtre**, choisit ce qui s\'affiche, sans toucher aux données.',
      visuel: {
        type: 'methode',
        titre: 'Le raccourci filtre',
        blocs: [
          { etapes: ['Sélectionne le graphique, puis clique le **▽ filtre** (3e icône flottante, juste à droite).'] },
          { capture: { type: 'boutonsgraphique', bouton: 'filtre' } },
          { etapes: ['Onglet **Valeurs** : coche/décoche les **séries** et les **catégories** (ici on décoche Avr), puis **Appliquer**.'], depart: 2 },
          { capture: { type: 'filtregraphique' } },
          { capture: { type: 'graphique', cats: ['Jan', 'Fév', 'Mar'], series: [{ nom: 'Ventes', vals: [12, 19, 15] }], titre: 'Ventes par mois', legende: 'APRÈS : « Avr » est masqué du graphique (avant, il y avait 4 barres ; les données sources n\'ont pas bougé).' } },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Le **titre** se modifie directement.',
      visuel: {
        type: 'methode',
        titre: 'Modifier le titre',
        blocs: [
          { etapes: ['**Double-clique** le titre du graphique.'] },
          { etapes: ['Tape ton nouveau texte, puis clique ailleurs pour valider.'], depart: 2 },
          { capture: { type: 'titregraphique' } },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Les onglets « Création de graphique » et « Format » apparaissent seulement quand...',
      visuel: { type: 'question', options: ['tu ouvres le menu Fichier', 'tu sélectionnes une cellule vide', 'tu sélectionnes un graphique'], bonne: 2, explication: 'Ce sont des onglets contextuels : ils ne s\'affichent que lorsqu\'un graphique est sélectionné, et disparaissent dès que tu cliques ailleurs.' },
    },
    { humeur: 'fier', dit: 'Tu maîtrises les onglets contextuels, les styles et le bouton ＋. Ton graphique devient vraiment le tien. Bravo ! 🎉' },
  ],
}

// --- Leçon 4 : Les axes ---
const AXESGRAPHIQUE = {
  id: 'fn-axesgraphique',
  titre: 'Les axes',
  exercices: [EX8.ex62],
  narration: [
    { humeur: 'accueil', dit: 'Un graphique a deux **axes** : l\'axe **X** (horizontal) porte les catégories, l\'axe **Y** (vertical) porte les valeurs.', visuel: { type: 'graphique', ...GRAPH_MOIS, titre: 'Ventes par mois', annoterAxes: true, legende: 'Axe X en bas (les mois), axe Y à gauche (les euros).' } },
    {
      humeur: 'pensif',
      dit: 'Tu peux régler l\'**échelle** de l\'axe des valeurs pour mieux voir les écarts.',
      visuel: {
        type: 'methode',
        titre: 'Modifier l\'échelle d\'un axe',
        blocs: [
          { etapes: ['**Double-clique** l\'axe vertical (les chiffres) dans ton classeur.'] },
          { capture: { type: 'classeuraxe', volet: false } },
          { etapes: ['Le volet **Format de l\'axe** s\'ouvre **à droite** : ouvre **Options d\'axe**, puis règle **Minimum**, **Maximum** et **Unités**.'], depart: 2 },
          { capture: { type: 'classeuraxe', volet: true } },
          { note: 'Monter le **Minimum** (ex. démarrer à 10 au lieu de 0) « zoome » sur les écarts. Baisser l\'**Unité** ajoute des graduations.', label: 'Bon à savoir' },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Astuce de pro : pour sélectionner **précisément** un élément (surtout s\'il est petit), passe par la **Sélection active**.',
      visuel: {
        type: 'methode',
        titre: 'Choisir un élément avec la Sélection active',
        blocs: [
          { etapes: ['Voici le graphique de **départ** : on veut modifier l\'**axe vertical** (l\'échelle des valeurs), un élément fin, facile à rater à la souris.'] },
          { capture: { type: 'graphique', ...GRAPH_MOIS, titre: 'Ventes par mois', legende: 'AVANT : l\'axe vertical est fin et discret.' } },
          { etapes: ['Sélectionne le graphique, puis onglet **Format** (Mise en forme) : **tout à gauche** du ruban, le groupe **Sélection active** et sa grande **liste déroulante**.'], depart: 2 },
          { capture: { type: 'selectionactive', element: 'Axe vertical (Valeurs)' } },
          { etapes: ['Clique la **flèche ▾**, choisis **Axe vertical (Valeurs)** dans la liste, puis clique **Mise en forme de la sélection**.'], depart: 3 },
          { capture: { type: 'menu', items: [{ label: 'Zone de graphique' }, { label: 'Zone de traçage' }, { label: 'Axe horizontal (Catégories)' }, { label: 'Axe vertical (Valeurs)', actif: true }, { label: 'Titre du graphique' }, { label: 'Légende' }] } },
          { capture: { type: 'voletformat', titre: 'Mettre en forme la sélection' } },
          { etapes: ['Ajuste le remplissage ou la bordure : le changement s\'applique **en direct** sur l\'axe.'], depart: 4 },
          { capture: { type: 'graphique', ...GRAPH_MOIS, titre: 'Ventes par mois', surbrillance: 'axeY', legende: 'APRÈS : l\'axe vertical a pris la couleur turquoise et un trait plus épais, choisis dans le volet.' } },
          { note: 'Ce volet **Mettre en forme…** marche pour **n\'importe quel élément** (série, axe, titre, légende) : remplissage, bordure, effets. C\'est aussi comme ça qu\'on personnalise le **style** en profondeur.', label: 'Bon à savoir' },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Un dernier point sur l\'échelle. **Vrai ou faux ?**',
      visuel: { type: 'vraifaux', affirmation: 'Monter le Minimum de l\'axe (ex. démarrer à 10 au lieu de 0) permet de « zoomer » sur les écarts entre les barres.', bonne: true, explication: 'En partant de plus haut, la même différence occupe plus de hauteur : les écarts sautent aux yeux. À manier honnêtement, car ça amplifie visuellement les différences !' },
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Dans la boîte « Format de l\'axe », que peux-tu régler ?',
      visuel: { type: 'question', options: ['La couleur des barres uniquement', 'Le style de police uniquement', 'Les limites (min/max) et les unités'], bonne: 2, explication: 'Les Options d\'axe règlent surtout les limites (minimum, maximum) et les unités (principale, secondaire), c\'est-à-dire l\'échelle.' },
    },
    { humeur: 'fier', dit: 'Tu contrôles l\'échelle de tes axes : tes graphiques disent exactement ce que tu veux montrer. Bravo ! 🎉' },
  ],
}

// --- Leçon 5 : Les séries & intervertir ---
const SERIESGRAPHIQUE = {
  id: 'fn-seriesgraphique',
  titre: 'Les séries & intervertir',
  exercices: [EX8.ex62, EX8.ex63],
  narration: [
    { humeur: 'accueil', dit: 'Une **série** est une suite de valeurs issues d\'une même plage : ici, chaque ebook est une série, comparée trimestre par trimestre.', visuel: { type: 'graphique', ...GRAPH_PRODUITS, titre: 'Ventes des ebooks', montrerLegende: true, legende: 'Deux séries (Ebook Excel en turquoise, Ebook Shaolin en bleu) sur 3 trimestres.' } },
    {
      humeur: 'pensif',
      dit: 'Pour ajouter, retirer ou **réordonner** les séries : la source de données.',
      visuel: {
        type: 'methode',
        titre: 'Sélectionner des données',
        blocs: [
          { etapes: ['Voici les **données source** : chaque ligne (Ebook Excel, Ebook Shaolin) est une **série**.'] },
          { capture: { type: 'tableaudonnees', brut: true, entetes: ['Produit', 'T1', 'T2', 'T3'], lignes: [['Ebook Excel', '12', '18', '24'], ['Ebook Shaolin', '9', '15', '21']], legende: 'Le tableau derrière le graphique : 2 séries (les 2 produits) sur 3 trimestres.' } },
          { etapes: ['Onglet **Création de graphique** > groupe **Données** > **Sélectionner des données**.'], depart: 2 },
          { capture: { type: 'ruban', onglets: ['Fichier', 'Accueil', 'Insertion', 'Création de graphique', 'Format'], actif: 'Création de graphique', groupeNom: 'Données', groupes: [{ icone: '🔁', label: 'Intervertir les\nlignes/colonnes' }, { icone: '⊞', label: 'Sélectionner\ndes données', actif: true }] } },
          { capture: { type: 'selectionnerdonnees', series: ['Ebook Excel', 'Ebook Shaolin'], selection: 0 } },
          { etapes: ['Dans la fenêtre, utilise les flèches **↑ ↓** pour changer l\'ordre des séries.'], depart: 3 },
          { note: 'Les boutons **Ajouter / Modifier / Supprimer** (juste au-dessus de la liste des séries) gèrent les séries une à une : en ajouter une nouvelle, corriger une existante, en retirer une.', label: 'Astuce' },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Un clic magique : **intervertir les lignes et les colonnes** pour changer de point de vue.',
      visuel: {
        type: 'methode',
        titre: 'Intervertir les lignes/colonnes',
        blocs: [
          { etapes: ['Onglet **Création de graphique** > groupe **Données** > **Intervertir les lignes/colonnes**.'] },
          { capture: { type: 'ruban', onglets: ['Fichier', 'Accueil', 'Insertion', 'Création de graphique', 'Format'], actif: 'Création de graphique', groupeNom: 'Données', groupes: [{ icone: '🔁', label: 'Intervertir les\nlignes/colonnes', actif: true }, { icone: '⊞', label: 'Sélectionner\ndes données' }] } },
          { capture: { type: 'intervertirgraphique' } },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Gagne du temps : au lieu de chercher dans le ruban, **clique droit** directement sur un élément (barre, courbe, axe, titre).',
      visuel: {
        type: 'methode',
        titre: 'Le clic droit, ton raccourci',
        blocs: [
          { etapes: ['**Clique droit** sur une série (ou un axe, un titre…) : un menu avec ses commandes s\'ouvre juste à côté.'] },
          { capture: { type: 'clicdroitgraphique' } },
          { note: '**Sélection rapide** : cliquer un élément le sélectionne seul (ex. la série « Ebook Excel »), et le clic droit donne accès à SES commandes : modifier le type, sélectionner des données, étiquettes, courbe de tendance, mise en forme, supprimer.', label: 'Bon à savoir' },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Tu peux **changer le type** de tout le graphique (ou d\'une seule série) à tout moment.',
      visuel: {
        type: 'methode',
        titre: 'Modifier le type de graphique',
        blocs: [
          { etapes: ['Onglet **Création de graphique** > groupe **Type** > **Modifier le type de graphique**.'] },
          { capture: { type: 'ruban', onglets: ['Fichier', 'Accueil', 'Insertion', 'Création de graphique', 'Format'], actif: 'Création de graphique', groupeNom: 'Type', groupes: [{ icone: '🔄', label: 'Modifier le type\nde graphique', actif: true }] } },
          { etapes: ['À gauche, choisis la **catégorie** ; au centre, le **type/sous-type** ; puis **OK**.'], depart: 2 },
          { capture: { type: 'typegraphiquedialog', categorie: 0 } },
          { note: 'Passe la souris sur chaque vignette pour un **aperçu en direct** sur ton graphique avant de valider.', label: 'Astuce' },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Pour échanger ce qui est en abscisse et ce qui devient une série, on utilise...',
      visuel: { type: 'question', options: ['Clic droit > Inverser', 'Création > Intervertir les lignes/colonnes', 'Menu Fichier > Transposer'], bonne: 1, explication: 'Onglet Création de graphique > Intervertir les lignes/colonnes échange les catégories (abscisse) et les séries.' },
    },
    { humeur: 'fier', dit: 'Tu gères tes séries et tu changes de point de vue en un clic. Analyse de pro. Bravo ! 🎉' },
  ],
}

// --- Leçon 6 : Déplacer dans une feuille, imprimer, supprimer ---
const DEPLACERIMPRIMER = {
  id: 'fn-deplacerimprimer',
  titre: 'Déplacer dans une feuille, imprimer, supprimer',
  exercices: [EX8.ex64],
  narration: [
    {
      humeur: 'accueil',
      dit: 'Tu peux sortir le graphique sur sa **propre feuille**, pour le présenter en grand.',
      visuel: {
        type: 'methode',
        titre: 'Déplacer dans une autre feuille',
        blocs: [
          { etapes: ['Sélectionne le graphique, onglet **Création de graphique** > **Déplacer le graphique**.'] },
          { capture: { type: 'ruban', onglets: ['Fichier', 'Accueil', 'Insertion', 'Création de graphique', 'Format'], actif: 'Création de graphique', groupeNom: 'Emplacement', groupes: [{ icone: '↗', label: 'Déplacer le\ngraphique', actif: true }] } },
          { etapes: ['**Nouvelle feuille** : le graphique devient un **onglet à part entière**, sans cellules autour. Saisis son nom, puis **OK**.'], depart: 2 },
          { capture: { type: 'deplacergraphiquedialog', selection: 0 } },
          { etapes: ['**Objet dans** : le graphique reste **intégré** dans une feuille existante. Choisis la feuille dans la **liste déroulante**, puis **OK**.'], depart: 3 },
          { capture: { type: 'deplacergraphiquedialog', selection: 1 } },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Pour **imprimer** un graphique seul.',
      visuel: {
        type: 'methode',
        titre: 'Imprimer un graphique',
        blocs: [
          { etapes: ['**Sélectionne** le graphique : clique son **bord** (les poignées apparaissent).'] },
          { capture: { type: 'graphique', ...GRAPH_MOIS, titre: 'Ventes par mois', poignees: true, legende: 'Graphique sélectionné : son cadre et ses 8 poignées sont visibles.' } },
          { etapes: ['Clique l\'onglet **Fichier** (tout à gauche du ruban), puis **Imprimer** (raccourci **Ctrl + P**, Mac **⌘ + P**).'], depart: 2 },
          { capture: { type: 'ruban', actif: 'Fichier', groupeNom: 'Dans le menu Fichier', groupes: [{ icone: '🖨', label: 'Imprimer', actif: true }] } },
          { etapes: ['L\'écran **Imprimer** s\'ouvre en entier : le menu Fichier à gauche, les **Paramètres** au centre (vérifie **Imprimer la sélection**), et l\'**aperçu** à droite : on ne voit QUE ton graphique.'], depart: 3 },
          { capture: { type: 'backstageimprimer', parametre: 'Imprimer la sélection', legende: 'La vraie vue Fichier > Imprimer : le menu à gauche (Imprimer surligné), les paramètres au centre avec « Imprimer la sélection » (encadré), et l\'aperçu du graphique seul à droite (1 sur 1).' } },
          { note: 'Si **aucun** graphique n\'est sélectionné, le paramètre affiche « Imprimer les feuilles actives » : Excel imprime alors **toute la feuille** (données + graphique).', label: 'Bon à savoir' },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Pour **supprimer** un graphique.',
      visuel: {
        type: 'methode',
        titre: 'Supprimer un graphique',
        blocs: [
          { etapes: ['Clique le **bord** du graphique pour le sélectionner en entier.'] },
          { etapes: ['Appuie sur **Suppr**.'], depart: 2 },
          { capture: { type: 'touche', touches: ['Suppr'], note: 'Clique d\'abord le bord (tout le graphique). Si tu cliques un élément interne, Suppr n\'enlève que cet élément (ex. la légende).' } },
          { etapes: ['Si le graphique est sur sa **propre feuille** : clic droit sur l\'onglet de cette feuille (en bas) > **Supprimer**.'], depart: 3 },
          { capture: { type: 'clicdroitonglet' } },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Que fait « Déplacer le graphique > Nouvelle feuille » ?',
      visuel: { type: 'question', options: ['Il place le graphique sur sa propre feuille dédiée', 'Il supprime le graphique', 'Il change la couleur des barres'], bonne: 0, explication: '« Déplacer le graphique > Nouvelle feuille » sort le graphique sur une feuille à lui seul, idéale pour une présentation en grand.' },
    },
    { humeur: 'fier', dit: 'Déplacer sur une feuille dédiée, imprimer, supprimer : tu gères le cycle de vie complet d\'un graphique. Bravo ! 🎉' },
  ],
}

// --- Leçon 7 : Graphiques mixtes & sparklines ---
const MIXTESPARKLINE = {
  id: 'fn-mixtesparkline',
  titre: 'Graphiques mixtes & sparklines',
  exercices: [EX8.ex65, EX8.ex66],
  narration: [
    { humeur: 'accueil', dit: 'Dernière étape : deux graphiques spéciaux. D\'abord le **graphique mixte** (ou combiné) : il superpose deux types, avec un **axe secondaire** pour une grandeur d\'échelle différente.', visuel: { type: 'graphique', forme: 'mixte', ...GRAPH_MIXTE, titre: 'CA et volume', montrerLegende: true, anime: true, legende: 'Barres = CA en k€ (axe gauche), courbe = nombre de ventes (axe droit orange).' } },
    {
      humeur: 'pensif',
      dit: 'On le crée en un geste depuis le ruban.',
      visuel: {
        type: 'methode',
        titre: 'Créer un graphique mixte',
        blocs: [
          { etapes: ['Sélectionne **tout le tableau** (les deux séries : le CA et le nombre de ventes).'] },
          { capture: { type: 'tableaudonnees', brut: true, selection: true, entetes: ['Trimestre', 'CA (k€)', 'Nb ventes'], lignes: [['T1', '12', '40'], ['T2', '18', '55'], ['T3', '24', '72']], legende: 'Deux séries d\'échelles très différentes : le CA (12 à 24) et le nombre de ventes (40 à 72).' } },
          { etapes: ['Onglet **Insertion** > **Graphique combiné**.'], depart: 2 },
          { capture: { type: 'ruban', actif: 'Insertion', groupeNom: 'Graphiques', groupes: [{ icone: '📊', label: 'Histogramme' }, { icone: '📈', label: 'Courbe' }, { icone: '🔀', label: 'Graphique\ncombiné', actif: true }] } },
          { etapes: ['Pour chaque série, choisis le **type** (colonne, courbe…) et coche **Axe secondaire** pour celle qui a une autre unité (€, %).'], depart: 3 },
          { capture: { type: 'champs', titre: 'Type de graphique combiné', champs: [{ l: 'CA (k€) · Histogramme groupé', v: 'Axe principal', actif: true }, { l: 'Nb ventes · Courbe', v: 'Axe secondaire ✓', actif: true }] } },
          { etapes: ['Clique **OK** : les deux séries cohabitent proprement.'], depart: 3 },
          { capture: { type: 'graphique', forme: 'mixte', ...GRAPH_MIXTE, titre: 'CA et volume', montrerLegende: true, legende: 'Chaque série lit son propre axe : plus d\'écrasement.' } },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: 'Deuxième spécialité : le **sparkline**, un mini-graphique logé dans **une seule cellule**.',
      visuel: { type: 'sparklines' },
    },
    {
      humeur: 'pensif',
      dit: 'On l\'insère en quelques clics.',
      visuel: {
        type: 'methode',
        titre: 'Créer un sparkline',
        blocs: [
          { etapes: ['Sélectionne la **plage de valeurs** d\'une ligne (ex. B2:F2).'] },
          { capture: { type: 'tableaudonnees', brut: true, ligneSel: 0, entetes: ['Produit', 'Jan', 'Fév', 'Mar', 'Avr', 'Mai'], lignes: [['Ebook Excel', '8', '12', '10', '16', '22'], ['Ebook Shaolin', '20', '16', '17', '12', '9']], legende: 'On sélectionne les 5 valeurs de la 1re ligne (B2:F2, surlignées en bleu).' } },
          { etapes: ['Onglet **Insertion** > **Sparklines** > **Courbe** (ou Histogramme).'], depart: 2 },
          { capture: { type: 'ruban', actif: 'Insertion', groupeNom: 'Sparklines', groupes: [{ icone: '〰', label: 'Courbe', actif: true }, { icone: '▁▃▅', label: 'Histogramme' }, { icone: '±', label: 'Conclusion' }] } },
          { etapes: ['Indique la **plage de données** et la **cellule de destination**, puis **OK**.'], depart: 3 },
          { capture: { type: 'champs', titre: 'Créer des Sparklines', champs: [{ l: 'Plage de données', v: 'B2:F2', actif: true }, { l: 'Emplacement', v: '$G$2', actif: true }] } },
          { etapes: ['Le sparkline apparaît dans la cellule ; étire la **poignée de recopie** vers le bas pour l\'appliquer aux autres lignes. Voici le **rendu** :'], depart: 4 },
          { capture: { type: 'sparklines' } },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Un sparkline se **modifie** et se **supprime** facilement.',
      visuel: {
        type: 'methode',
        titre: 'Modifier ou supprimer un sparkline',
        blocs: [
          { etapes: ['Sélectionne la cellule du sparkline : l\'onglet **Sparkline** apparaît. Tu peux **Modifier les données** (la plage source), choisir un **style**, une **couleur**, ou ajouter des **marqueurs**.'] },
          { capture: { type: 'ruban', onglets: ['Fichier', 'Accueil', 'Insertion', 'Sparkline'], actif: 'Sparkline', groupeNom: 'Sparkline', groupes: [{ icone: '✎', label: 'Modifier les\ndonnées' }, { icone: '〰', label: 'Style' }, { icone: '🎨', label: 'Couleur' }, { icone: '●', label: 'Marqueurs', actif: true }] } },
          { capture: { type: 'sparklines', marqueurs: true } },
          { etapes: ['Pour **supprimer** : sélectionne la cellule puis **Suppr**, ou onglet Sparkline > **Supprimer** > **Supprimer les Sparklines**.'], depart: 2 },
          { capture: { type: 'menu', items: [{ label: 'Supprimer les Sparklines', actif: true }, { label: 'Supprimer les groupes de Sparklines' }] } },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Comment crée-t-on rapidement un sparkline ?',
      visuel: { type: 'question', options: ['Menu Affichage > Sparklines', 'Onglet Insertion > Sparklines, puis choisir le type et la plage', 'Clic droit sur une cellule vide > Insérer sparkline', 'Onglet Données > Sparklines'], bonne: 1, explication: 'Onglet Insertion > Sparklines > Courbe/Histogramme/Conclusion, puis on indique la plage et l\'emplacement.' },
    },
    { humeur: 'fier', dit: 'Graphiques mixtes et sparklines : tu vas au-delà du graphique classique. La ceinture verte-bleue est à ta portée. Bravo ! 🎉' },
  ],
}

// ===================== CHAPITRE 9 : CONSOLIDATION (ceinture bleue) =====================
const U9 = (id) => `https://drive.google.com/file/d/${id}/view?usp=drivesdk`
const EX9 = {
  ex67: { titre: 'Exercice 67 · La consolidation par position', url: U9('10pBsvSA3QfN-3BvARSWVf5mpc-3CY_05') },
  ex68: { titre: 'Exercice 68 · La consolidation par position', url: U9('1PXBbM1_qLtBxprYf9CzNNkD8oz-OKuzA') },
  ex69: { titre: 'Exercice 69 · La consolidation par catégorie', url: U9('1QZ11MHMtcHo8LL35SNHWPOb_nLXPTkyF') },
  ex70: { titre: 'Exercice 70 · La consolidation par TCD multi-tables', url: U9('16VhY98IzS703g0_-thhe6d7_OaZ4iyGU') },
  ex70c: { titre: 'Exercice 70 · TCD multi-tables — Correction', url: U9('1lQ8RwFBBSNEm--jGjSpWuEhLEWgwrCYQ') },
}
const CONSO_ENTETES = ['Produit', 'CA']
const CONSO_FEUILLES = ['Janvier', 'Février', 'Mars', 'Synthèse']
const CONSO_JAN = [['Ebook Excel', '12 400 €'], ['Ebook Shaolin', '9 100 €'], ['Formations', '7 300 €']]
const CONSO_FEV = [['Ebook Excel', '13 800 €'], ['Ebook Shaolin', '9 700 €'], ['Formations', '6 900 €']]
const CONSO_MARS = [['Ebook Excel', '12 000 €'], ['Ebook Shaolin', '9 700 €'], ['Formations', '7 700 €']]
const CONSO_VIDE = [['Ebook Excel', ''], ['Ebook Shaolin', ''], ['Formations', '']]
const CONSO_TOTAL = [['Ebook Excel', '38 200 €'], ['Ebook Shaolin', '28 500 €'], ['Formations', '21 900 €']]
const TCD_FEUILLES = ['Ventes', 'Zones Vente', 'Vendeurs']

// --- Leçon 1 : Rappel, la référence 3D ---
const RAPPEL3D = {
  id: 'fn-rappel3d',
  titre: 'Rappel : la référence 3D',
  exercices: [],
  narration: [
    { humeur: 'accueil', dit: 'Avant de consolider, un **rappel**. La **référence 3D** additionne (ou moyenne, compte…) la **même cellule** sur **plusieurs feuilles côte à côte**. C\'est la base de la consolidation.', visuel: { type: 'encart', label: 'Pourquoi c\'est utile', liste: ['**Consolider** des chiffres répartis sur plusieurs onglets (ventes mensuelles, dépenses…).', '**Une seule formule** au lieu de recopier feuille par feuille.', '**Mise à jour auto** : si une cellule source change, le total 3D suit.'] } },
    {
      humeur: 'pensif',
      dit: 'On la construit **pas à pas**, en cliquant les onglets.',
      visuel: {
        type: 'methode',
        titre: 'Construire une référence 3D',
        blocs: [
          { etapes: ['Sur la feuille **Synthèse**, dans la cellule cible, tape **=SOMME(**'] },
          { capture: { type: 'tableur', feuilles: feuillesDept, feuilleActive: 'Synthèse', cols: ['A', 'B'], rows: [1, 2], cells: cellsSynth('=SOMME('), formule: '=SOMME(', actif: 'B2', legende: 'Sur « Synthèse », on démarre la formule =SOMME(' } },
          { etapes: ['Clique l\'onglet de la **1re feuille** (AIN), maintiens **Shift**, clique l\'onglet de la **dernière** (Cantal).'], depart: 2 },
          { capture: { type: 'touche', touches: ['⇧ Maj'], note: 'Shift = plage CONTINUE : AIN, Cantal et toutes les feuilles entre les deux sont incluses.' } },
          { etapes: ['Clique la **cellule** (C10), ferme la parenthèse et **Entrée**.'], depart: 3 },
          { capture: { type: 'tableur', feuilles: feuillesDept, feuilleActive: 'AIN', cols: ['A', 'B', 'C'], rows: rowsDept, cells: cellsDept('3 000'), formule: '=SOMME(AIN:Cantal!C10', actif: 'C10', legende: 'On clique C10 : Excel écrit tout seul la plage 3D AIN:Cantal.' } },
          { capture: { type: 'tableur', feuilles: feuillesDept, feuilleActive: 'Synthèse', cols: ['A', 'B'], rows: [1, 2], cells: cellsSynth('12 500', true), formule: '=SOMME(AIN:Cantal!C10)', actif: 'B2', legende: 'Résultat sur « Synthèse » : =SOMME(AIN:Cantal!C10) additionne les 4 feuilles = 12 500.' } },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'La formule 3D reste **vivante** quand tu bouges des feuilles :',
      visuel: { type: 'encart', label: 'Effet des modifications de feuilles', liste: ['**Ajouter / copier** une feuille **entre** les bornes (AIN…Cantal) : elle est **incluse** automatiquement.', '**Déplacer une feuille hors** des bornes : elle est **retirée** du calcul.', '**Supprimer** une feuille entre les bornes : ses valeurs **sortent** du total.', '**Renommer une borne** (AIN ou Cantal) : Excel **met à jour** la référence tout seul.'] },
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Quelle formule additionne la cellule C10 de la feuille AIN à la feuille Cantal ?',
      visuel: { type: 'question', options: ['=SOMME(AIN;Cantal!C10)', '=SOMME(AIN:Cantal!C10)', '=SOMME(AIN:Cantal!C10:C10)'], bonne: 1, explication: 'Le deux-points entre les onglets (AIN:Cantal) fait la plage 3D, puis !C10 désigne la cellule. Le point-virgule, lui, sert à lister des feuilles non côte à côte.' } },
    { humeur: 'fier', dit: 'La référence 3D n\'a plus de secret pour toi. Direction la consolidation ! Bravo ! 🎉' },
  ],
}

// --- Leçon 2 : La consolidation par position ---
const CONSOPOSITION = {
  id: 'fn-consoposition',
  titre: 'La consolidation par position',
  exercices: [EX9.ex67, EX9.ex68],
  narration: [
    {
      humeur: 'accueil',
      dit: 'La **consolidation** fusionne plusieurs tableaux en une vue d\'ensemble. La version **par position** marche quand tes tableaux ont la **même structure** et la **même disposition** : seules les **valeurs** changent.',
      visuel: {
        type: 'methode',
        blocs: [
          { etapes: ['Voici le classeur : **3 feuilles sources** (Janvier, Février, Mars, regarde les onglets en bas) + une feuille **Synthèse**. Même structure partout, seules les valeurs changent.'] },
          { capture: { type: 'tableaudonnees', brut: true, entetes: CONSO_ENTETES, lignes: CONSO_JAN, feuilles: CONSO_FEUILLES, feuilleActive: 'Janvier', legende: 'La feuille « Janvier » (onglet actif en bas).' } },
          { capture: { type: 'tableaudonnees', brut: true, entetes: CONSO_ENTETES, lignes: CONSO_FEV, feuilles: CONSO_FEUILLES, feuilleActive: 'Février', legende: 'La feuille « Février » : même forme, d\'autres chiffres.' } },
          { capture: { type: 'tableaudonnees', brut: true, entetes: CONSO_ENTETES, lignes: CONSO_MARS, feuilles: CONSO_FEUILLES, feuilleActive: 'Mars', legende: 'La feuille « Mars » : même forme, d\'autres chiffres.' } },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Petit défi avant la méthode : cette version de « Février » a un **problème** qui fausserait la consolidation par position. **Clique la cellule fautive !**',
      visuel: {
        type: 'trouvererreur',
        consigne: 'Compare avec la feuille Janvier : Ebook Excel, Ebook Shaolin, Formations',
        entetes: ['Produit', 'CA'],
        lignes: [['Ebook Excel', '13 800 €'], ['Ebook Shaolin', '9 700 €'], ['Formation', '6 900 €']],
        erreur: { ligne: 2, col: 0 },
        indice: 'Regarde bien la 1re colonne : une étiquette a perdu une lettre…',
        explication: 'Il est écrit « Formation » au lieu de « Formations ». Par position, Excel additionne case par case SANS vérifier les étiquettes : la synthèse serait fausse en silence. D\'où la règle d\'or : mêmes étiquettes, mêmes positions, partout.',
      },
    },
    {
      humeur: 'pensif',
      dit: 'Bon à savoir avant de commencer :',
      visuel: { type: 'encart', label: 'Contexte', liste: ['Les en-têtes de **lignes et colonnes** doivent être **identiques** et **aux mêmes emplacements** sur chaque feuille.', 'Les sources peuvent être sur des **feuilles** différentes, plusieurs **classeurs** ouverts, ou une même feuille.', '**Sans liaison** : résultat figé. **Avec liaison** : mise à jour auto quand les sources changent.'] },
    },
    {
      humeur: 'pensif',
      dit: 'La méthode, **pas à pas**.',
      visuel: {
        type: 'methode',
        titre: 'Consolider par position',
        blocs: [
          { etapes: ['Sur la feuille **Synthèse**, prépare un tableau **vide** aux mêmes étiquettes et au même endroit, et clique la 1re cellule de résultat.'] },
          { capture: { type: 'tableaudonnees', brut: true, selection: true, entetes: CONSO_ENTETES, lignes: CONSO_VIDE, feuilles: CONSO_FEUILLES, feuilleActive: 'Synthèse', legende: 'Feuille « Synthèse » (onglet actif) : mêmes produits, colonne CA vide, prête à recevoir le total.' } },
          { etapes: ['Onglet **Données** > groupe **Outils de données** > **Consolider**.'], depart: 2 },
          { capture: { type: 'ruban', actif: 'Données', groupeNom: 'Outils de données', groupes: [{ icone: '🧬', label: 'Convertir' }, { icone: '⧉', label: 'Consolider', actif: true }, { icone: '🔗', label: 'Liaisons' }] } },
          { etapes: ['Dans la fenêtre, choisis la **Fonction** : **Somme** (champ encadré ci-dessous).'], depart: 3 },
          { capture: { type: 'consoliderdialog', fonction: 'Somme', focus: 'fonction' } },
          { etapes: ['Clique dans **Référence**, puis va sur la feuille **Janvier** et sélectionne la plage : Excel l\'encadre et écrit la référence tout seul.'], depart: 4 },
          { capture: { type: 'tableaudonnees', brut: true, selection: true, entetes: CONSO_ENTETES, lignes: CONSO_JAN, feuilles: CONSO_FEUILLES, feuilleActive: 'Janvier', legende: 'Sur « Janvier » : la plage sélectionnée (contour bleu) devient la référence Janvier!$B$2:$B$4.' } },
          { note: 'Le bouton **Parcourir…** de la fenêtre sert à aller chercher une source dans un **autre classeur** (un autre fichier Excel) : il ouvre l\'explorateur de fichiers pour le sélectionner.', label: 'À quoi sert « Parcourir… » ?' },
          { etapes: ['Clique **Ajouter**, puis répète pour **Février** et **Mars**.'], depart: 5 },
          { capture: { type: 'consoliderdialog', fonction: 'Somme', reference: 'Mars!$B$2:$B$4', refs: ['Janvier!$B$2:$B$4', 'Février!$B$2:$B$4', 'Mars!$B$2:$B$4'], focus: 'ajouter' } },
          { etapes: ['Coche **Lier aux données source** (recommandé), puis **OK**.'], depart: 6 },
          { capture: { type: 'consoliderdialog', fonction: 'Somme', refs: ['Janvier!$B$2:$B$4', 'Février!$B$2:$B$4', 'Mars!$B$2:$B$4'], lier: true } },
          { capture: { type: 'tableaudonnees', entetes: CONSO_ENTETES, lignes: CONSO_TOTAL, feuilles: CONSO_FEUILLES, feuilleActive: 'Synthèse', legende: 'APRÈS : le tableau consolidé sur « Synthèse » = la somme des 3 mois (ex. Ebook Excel : 12 400 + 13 800 + 12 000 = 38 200 €).' } },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Bonne nouvelle : tu peux aussi consolider **sans préparer de tableau vide** à l\'avance.',
      visuel: {
        type: 'methode',
        titre: 'Variante rapide : sans tableau préparé',
        blocs: [
          { etapes: ['Sur une feuille **vierge**, ouvre **Données > Consolider** et choisis la **fonction** (Somme).'] },
          { capture: { type: 'consoliderdialog', fonction: 'Somme', focus: 'fonction' } },
          { etapes: ['Sélectionne ta 1re plage source **avec les titres** (ex. Janvier A1:B4), clique **Ajouter**, et répète pour toutes les plages.'], depart: 2 },
          { capture: { type: 'tableaudonnees', brut: true, selection: true, entetes: CONSO_ENTETES, lignes: CONSO_JAN, feuilles: CONSO_FEUILLES, feuilleActive: 'Janvier', legende: 'Cette fois on sélectionne AUSSI les titres (Produit, CA) : la plage devient A1:B4.' } },
          { capture: { type: 'consoliderdialog', fonction: 'Somme', reference: 'Mars!$A$1:$B$4', refs: ['Janvier!$A$1:$B$4', 'Février!$A$1:$B$4', 'Mars!$A$1:$B$4'], focus: 'ajouter' } },
          { etapes: ['Coche **Ligne du haut** et **Colonne de gauche** (section Étiquettes), puis **OK**.'], depart: 3 },
          { capture: { type: 'consoliderdialog', fonction: 'Somme', refs: ['Janvier!$A$1:$B$4', 'Février!$A$1:$B$4', 'Mars!$A$1:$B$4'], ligneHaut: true, colGauche: true } },
          { capture: { type: 'tableaudonnees', entetes: CONSO_ENTETES, lignes: CONSO_TOTAL, feuilles: CONSO_FEUILLES, feuilleActive: 'Synthèse', legende: 'Excel crée le tableau consolidé à l\'emplacement actif, titres compris, sans préparation.' } },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Un dernier détail pratique : avec la liaison, des petits boutons **+ / –** apparaissent à gauche du résultat. C\'est le **plan**.',
      visuel: {
        type: 'methode',
        blocs: [
          { etapes: ['Clique **–** pour masquer le détail d\'un groupe, **+** pour le développer, ou les boutons **1 / 2** (en haut à gauche) pour changer le niveau de tout le tableau : niveau **1** = totaux seuls, niveau **2** = tout le détail.'] },
          { capture: { type: 'planconso' } },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: 'À toi. La consolidation par position exige que...',
      visuel: { type: 'question', options: ['les tableaux sources aient des structures différentes', 'les en-têtes soient identiques et placés aux mêmes coordonnées sur chaque feuille', 'on copie-colle manuellement chaque total'], bonne: 1, explication: 'Par position, Excel additionne « case par case » : il faut donc des en-têtes identiques, aux mêmes emplacements sur chaque feuille.' } },
    { humeur: 'fier', dit: 'Tu fusionnes des tableaux identiques en un clin d\'œil. Bravo ! 🎉' },
  ],
}

// --- Leçon 3 : La consolidation par catégorie ---
const CONSOCATEGORIE = {
  id: 'fn-consocategorie',
  titre: 'La consolidation par catégorie',
  exercices: [EX9.ex69],
  narration: [
    { humeur: 'accueil', dit: 'La consolidation **par catégorie** est plus souple : elle regroupe des tableaux dont les données ne sont **pas au même endroit** et qui peuvent avoir un **nombre de lignes/colonnes différent**. Excel regroupe par **libellés** (les titres).', visuel: { type: 'encart', label: 'Quand l\'utiliser', texte: 'Tes feuilles n\'ont pas les mêmes produits, ni dans le même ordre ? La consolidation par catégorie s\'appuie sur les **noms** (en-têtes) pour tout regrouper correctement.' } },
    {
      humeur: 'pensif',
      dit: 'La méthode ressemble à la précédente, avec **deux cases en plus**.',
      visuel: {
        type: 'methode',
        titre: 'Consolider par catégorie',
        blocs: [
          { etapes: ['Regarde d\'abord les **feuilles sources** : les dispositions **diffèrent** d\'une feuille à l\'autre.'] },
          { capture: { type: 'tableaudonnees', brut: true, entetes: CONSO_ENTETES, lignes: CONSO_JAN, feuilles: CONSO_FEUILLES, feuilleActive: 'Janvier', legende: 'Feuille « Janvier » : 3 produits.' } },
          { capture: { type: 'tableaudonnees', brut: true, entetes: CONSO_ENTETES, lignes: [['Coaching', '2 900 €'], ['Ebook Shaolin', '9 700 €'], ['Ebook Excel', '12 000 €']], feuilles: CONSO_FEUILLES, feuilleActive: 'Mars', legende: 'Feuille « Mars » : autre ordre, « Coaching » en plus, « Formations » absent. Par position, impossible ; par catégorie, aucun souci !' } },
          { etapes: ['Clique une cellule vide (feuille **Synthèse**), puis **Données** > **Consolider**.'], depart: 2 },
          { capture: { type: 'ruban', actif: 'Données', groupeNom: 'Outils de données', groupes: [{ icone: '🧬', label: 'Convertir' }, { icone: '⧉', label: 'Consolider', actif: true }, { icone: '🔗', label: 'Liaisons' }] } },
          { etapes: ['Choisis la **Fonction** : **Somme** (champ encadré).'], depart: 3 },
          { capture: { type: 'consoliderdialog', fonction: 'Somme', focus: 'fonction' } },
          { etapes: ['Clique dans **Référence** et sélectionne le 1er tableau **avec ses titres** (ex. Janvier A1:B4).'], depart: 4 },
          { capture: { type: 'tableaudonnees', brut: true, selection: true, entetes: CONSO_ENTETES, lignes: CONSO_JAN, feuilles: CONSO_FEUILLES, feuilleActive: 'Janvier', legende: 'Titres compris (Produit, CA) : c\'est grâce à eux qu\'Excel reconnaît les catégories.' } },
          { etapes: ['Clique **Ajouter**, répète pour chaque feuille.'], depart: 5 },
          { capture: { type: 'consoliderdialog', fonction: 'Somme', reference: 'Mars!$A$1:$B$4', refs: ['Janvier!$A$1:$B$4', 'Février!$A$1:$B$4', 'Mars!$A$1:$B$4'], focus: 'ajouter' } },
          { etapes: ['Coche **Ligne du haut** et **Colonne de gauche** (ce sont les catégories), puis **Lier aux données source** et **OK**.'], depart: 6 },
          { capture: { type: 'consoliderdialog', fonction: 'Somme', refs: ['Janvier!$A$1:$B$4', 'Février!$A$1:$B$4', 'Mars!$A$1:$B$4'], ligneHaut: true, colGauche: true, lier: true } },
          { capture: { type: 'tableaudonnees', entetes: CONSO_ENTETES, lignes: [['Ebook Excel', '38 200 €'], ['Ebook Shaolin', '28 500 €'], ['Formations', '14 200 €'], ['Coaching', '2 900 €']], feuilles: CONSO_FEUILLES, feuilleActive: 'Synthèse', legende: 'APRÈS : toutes les catégories regroupées par libellé. « Coaching » (présent seulement en Mars) apparaît quand même ; « Formations » (absent de Mars) est totalisé sur ses 2 mois.' } },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Dans une consolidation par catégorie, que se passe-t-il si une catégorie est absente d\'une feuille ?',
      visuel: { type: 'question', options: ['Elle génère une erreur #N/A', 'Elle est ignorée et laisse la cellule vide dans le résultat', 'Elle crée une ligne « Autres » automatiquement'], bonne: 1, explication: 'La catégorie apparaît quand même dans le résultat ; pour la feuille qui ne l\'a pas, la cellule reste simplement vide (pas d\'erreur).' } },
    { humeur: 'fier', dit: 'Même des tableaux en désordre, tu sais les réunir proprement. Bravo ! 🎉' },
  ],
}

// --- Leçon 4 : TCD multi-tables, préparer les tables ---
const TCDTABLES = {
  id: 'fn-tcdtables',
  titre: 'TCD multi-tables : préparer les tables',
  exercices: [],
  narration: [
    {
      humeur: 'accueil',
      dit: 'Troisième méthode de consolidation : le **tableau croisé dynamique (TCD) multi-tables**. Il relie plusieurs tables grâce à une **colonne commune** (une « clé »), puis résume tout dans un rapport interactif.',
      visuel: {
        type: 'methode',
        blocs: [
          { etapes: ['Voici le classeur de travail : **3 feuilles** (regarde les onglets en bas) = **3 tables** à relier.'] },
          { capture: { type: 'tableaudonnees', brut: true, entetes: ['Zones Vente', 'Montant'], lignes: [['Ohio', '8 200 €'], ['Texas', '12 500 €'], ['Ohio', '6 400 €']], feuilles: TCD_FEUILLES, feuilleActive: 'Ventes', legende: 'Feuille « Ventes » : chaque vente, avec sa zone et son montant.' } },
          { capture: { type: 'tableaudonnees', brut: true, entetes: ['Zones Vente', 'Bureau'], lignes: [['Ohio', 'Cleveland'], ['Texas', 'Dallas']], feuilles: TCD_FEUILLES, feuilleActive: 'Zones Vente', legende: 'Feuille « Zones Vente » : chaque zone et son bureau.' } },
          { capture: { type: 'tableaudonnees', brut: true, entetes: ['Vendeurs', 'Zones Vente', 'Grade'], lignes: [['Marie', 'Ohio', 'Senior'], ['Karim', 'Texas', 'Junior'], ['Léa', 'Ohio', 'Senior']], feuilles: TCD_FEUILLES, feuilleActive: 'Vendeurs', legende: 'Feuille « Vendeurs » : chaque vendeur, sa zone et son grade.' } },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Pour que le TCD combine ces trois tables, il faut au minimum une **clé partagée** :',
      visuel: { type: 'parties', items: [{ label: 'La colonne **Zones Vente** relie la feuille Ventes à la feuille Zones Vente.' }, { label: 'La colonne **Zones Vente** des Vendeurs les relie aussi aux ventes de leur zone.' }, { label: 'Une clé partagée = une colonne qui porte le **même nom** et les **mêmes valeurs** (Ohio, Texas…) dans les deux tables.' }] },
    },
    {
      humeur: 'pensif',
      dit: 'Étape indispensable : transformer chaque plage en **vrai Tableau** nommé.',
      visuel: {
        type: 'methode',
        titre: 'Transforme chaque plage en Table',
        blocs: [
          { etapes: ['Sélectionne le tableau de la feuille **Ventes** (regarde l\'onglet actif en bas).'] },
          { capture: { type: 'tableaudonnees', brut: true, selection: true, entetes: ['Zones Vente', 'Montant'], lignes: [['Ohio', '8 200 €'], ['Texas', '12 500 €'], ['Ohio', '6 400 €']], feuilles: TCD_FEUILLES, feuilleActive: 'Ventes', legende: 'Sur la feuille « Ventes » : on sélectionne la plage entière, titres compris.' } },
          { etapes: ['Onglet **Accueil** > **Mettre sous forme de tableau** (ou **Ctrl + L**, Mac **⌘ + L**), coche **« Ma table comporte des en-têtes »**.'], depart: 2 },
          { capture: { type: 'ruban', actif: 'Accueil', groupeNom: 'Styles', groupes: [{ icone: '▦', label: 'Mise en forme\nconditionnelle' }, { icone: '▧', label: 'Mettre sous\nforme de tableau', actif: true }, { icone: '🎨', label: 'Styles de\ncellules' }] } },
          { capture: { type: 'champs', titre: 'Créer un tableau', champs: [{ l: 'Où sont les données de votre tableau ?', v: '=$A$1:$B$4', actif: true }, { l: 'Ma table comporte des en-têtes', check: true }] } },
          { capture: { type: 'tableaudonnees', filtres: true, entetes: ['Zones Vente', 'Montant'], lignes: [['Ohio', '8 200 €'], ['Texas', '12 500 €'], ['Ohio', '6 400 €']], feuilles: TCD_FEUILLES, feuilleActive: 'Ventes', legende: 'APRÈS : la plage est devenue un vrai tableau Excel (lignes en couleurs alternées + flèches de filtre).' } },
          { etapes: ['Renomme la table via l\'onglet **Création de tableau** > **Nom du tableau** (ex. **T_ventes**).'], depart: 3 },
          { capture: { type: 'ruban', onglets: ['Fichier', 'Accueil', 'Insertion', 'Création de tableau'], actif: 'Création de tableau', groupeNom: 'Propriétés', groupes: [{ icone: '🏷', label: 'Nom du\ntableau', actif: true }] } },
          { capture: { type: 'champs', titre: 'Propriétés', champs: [{ l: 'Nom du tableau', v: 'T_ventes', actif: true }] } },
          { note: 'Fais pareil pour **chaque feuille** du classeur : la feuille Zones Vente devient **T_zones**, la feuille Vendeurs devient **T_vendeurs**. À la fin, tes **3 tables nommées** sont prêtes à être reliées.', label: 'Important' },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Parmi ces étapes, laquelle n\'est **pas** nécessaire pour un TCD multi-tables ?',
      visuel: { type: 'question', options: ['Transformer chaque plage en Tableau', 'Renommer chaque tableau (ex. T_ventes)', 'Cliquer sur Données > Consolider', 'Utiliser le « Modèle de données » à la création du TCD'], bonne: 2, explication: '« Données > Consolider », c\'est l\'autre méthode (par position/catégorie). Pour un TCD multi-tables, on passe par des Tables nommées + le Modèle de données, pas par Consolider.' } },
    { humeur: 'fier', dit: 'Tes tables sont prêtes et bien nommées. On peut maintenant les relier. Bravo ! 🎉' },
  ],
}

// --- Leçon 5 : TCD multi-tables, créer le TCD & les relations ---
const TCDRELATIONS = {
  id: 'fn-tcdrelations',
  titre: 'TCD multi-tables : créer le TCD & les relations',
  exercices: [EX9.ex70, EX9.ex70c],
  narration: [
    {
      humeur: 'pensif',
      dit: 'On crée le TCD en l\'ajoutant au **modèle de données** (c\'est lui qui permet de relier plusieurs tables).',
      visuel: {
        type: 'methode',
        titre: 'Créer le TCD à partir du modèle de données',
        blocs: [
          { etapes: ['Ajoute une **nouvelle feuille** (ex. « TCD ») et clique la **cellule** où poser le rapport.'] },
          { capture: { type: 'tableur', feuilles: ['Ventes', 'Zones Vente', 'Vendeurs', 'TCD'], feuilleActive: 'TCD', cols: ['A', 'B'], rows: [1, 2, 3], cells: {}, actif: 'A3', legende: 'Une feuille « TCD » toute neuve (onglet actif en bas) ; on clique la cellule A3.' } },
          { etapes: ['**Insertion** > **Tableau croisé dynamique** > **À partir d\'un tableau/plage**.'], depart: 2 },
          { capture: { type: 'ruban', actif: 'Insertion', groupeNom: 'Tableaux', groupes: [{ icone: '📊', label: 'Tableau croisé\ndynamique', actif: true }, { icone: '📋', label: 'Tableau' }] } },
          { etapes: ['Dans la fenêtre, choisis la **table** (T_ventes), puis coche **« Feuille de calcul existante »** pour placer le TCD dans la feuille que tu viens de créer (l\'emplacement indique la cellule cliquée).'], depart: 3 },
          { capture: { type: 'champs', titre: 'Tableau croisé dynamique', champs: [{ l: 'Table/plage', v: 'T_ventes', actif: true }, { l: 'Nouvelle feuille de calcul', check: false }, { l: 'Feuille de calcul existante', check: true }, { l: 'Emplacement', v: 'TCD!$A$3', actif: true }] } },
          { etapes: ['Coche **« Ajouter ces données au modèle de données »**, puis **OK**.'], depart: 4 },
          { capture: { type: 'champs', titre: 'Tableau croisé dynamique', champs: [{ l: 'Table/plage', v: 'T_ventes' }, { l: 'Feuille de calcul existante', check: true }, { l: 'Ajouter ces données au modèle de données', check: true }] } },
          { note: 'Cette case est **indispensable** pour un TCD **multi-tables** : c\'est le **modèle de données** qui permet de relier tes tables entre elles. Sans elle, pas de relations possibles.', label: 'Hyper important' },
          { etapes: ['Après **OK**, ton TCD est **prêt à être configuré** : la zone du rapport à gauche, et la fenêtre **Champs de tableau croisé dynamique** dockée à droite de la feuille.'], depart: 5 },
          { capture: { type: 'vuetcd', legende: 'La feuille entière : la zone du rapport (à gauche, encore vide) + la fenêtre des champs, à droite. C\'est là que tout va se jouer.' } },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'On récupère les 3 tables, puis on ouvre la **gestion des relations**.',
      visuel: {
        type: 'methode',
        titre: 'Relier les tables',
        blocs: [
          { etapes: ['Dans le volet **Champs de tableau croisé dynamique**, clique **Tous** : tes 3 tables apparaissent.'] },
          { capture: { type: 'champstcd', tables: [{ nom: 'T_ventes', champs: [{ nom: 'Zones Vente' }, { nom: 'Montant' }] }, { nom: 'T_zones', champs: [{ nom: 'Zones Vente' }, { nom: 'Bureau' }] }, { nom: 'T_vendeurs', champs: [{ nom: 'Vendeurs' }, { nom: 'Grade' }] }] } },
          { etapes: ['Sélectionne le TCD, onglet **Analyse du tableau croisé dynamique** > groupe **Calcul** > **Relations**.'], depart: 2 },
          { capture: { type: 'ruban', onglets: ['Fichier', 'Accueil', 'Insertion', 'Analyse du TCD', 'Création'], actif: 'Analyse du TCD', groupeNom: 'Calculs', groupes: [{ icone: '🔗', label: 'Relations', actif: true }, { icone: 'ƒ', label: 'Champs,\néléments' }] } },
          { etapes: ['Dans **Gérer les relations**, clique **Nouveau**.'], depart: 3 },
          { capture: { type: 'gererrelations', relations: [] } },
          { etapes: ['Définis la relation : **Table** (T_ventes) → **Colonne (externe)** (Zones Vente) → **Table associée** (T_zones) → **Colonne associée** (Zones Vente).'], depart: 4 },
          { capture: { type: 'relationdialog', table: 'T_ventes', colonne: 'Zones Vente', tableAssociee: 'T_zones', colonneAssociee: 'Zones Vente' } },
          { note: 'Une relation, c\'est un **pont** entre deux tables. **Table** = d\'où part le pont (T_ventes). **Colonne (externe)** = la colonne de départ qui contient le mot commun (Zones Vente). **Table associée** = où arrive le pont (T_zones). **Colonne associée** = la colonne d\'arrivée qui contient les **mêmes mots** (Ohio, Texas…). Ce mot commun, c\'est la **clé partagée** : grâce à lui, Excel sait que la vente « Ohio » et la zone « Ohio » parlent de la même chose.', label: 'Comprendre la relation' },
          { etapes: ['Valide par **OK**, puis **répète** (Nouveau) pour relier **T_vendeurs** à **T_zones** de la même façon. La fenêtre liste maintenant **tous les liens** entre tes tables.'], depart: 5 },
          { capture: { type: 'gererrelations', relations: ['T_ventes (Zones Vente)  →  T_zones (Zones Vente)', 'T_vendeurs (Zones Vente)  →  T_zones (Zones Vente)'] } },
          { etapes: ['Pressée ? **Détection automatique** demande à Excel de créer les liens tout seul, à partir des colonnes qui portent le **même nom**.'], depart: 6 },
          { capture: { type: 'gererrelations', relations: [], focusDetection: true } },
          { capture: { type: 'champs', titre: 'Détection automatique des relations', champs: [{ l: 'Détection terminée : 2 relations ont été créées', check: true }] } },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Dernière étape, la plus satisfaisante : **construire la vue** en glissant les champs.',
      visuel: {
        type: 'methode',
        titre: 'Construire ta vue consolidée',
        blocs: [
          { etapes: ['Glisse le champ **Vendeurs** (de T_vendeurs) dans la zone **Lignes**.'] },
          { capture: { type: 'glisserchamptcd' } },
          { etapes: ['Glisse le champ **Montant** (de T_ventes) dans la zone **Valeurs** (Excel calcule la **Somme de Montant**).'], depart: 2 },
          { capture: { type: 'champstcd', tables: [{ nom: 'T_ventes', champs: [{ nom: 'Zones Vente' }, { nom: 'Montant', coche: true }] }, { nom: 'T_vendeurs', champs: [{ nom: 'Vendeurs', coche: true }, { nom: 'Grade' }] }], lignes: ['Vendeurs'], valeurs: ['Somme de Montant'] } },
          { etapes: ['Admire le résultat : un **vrai tableau croisé dynamique**, avec son volet de champs.'], depart: 3 },
          { capture: { type: 'vuetcd', rapport: true, legende: 'La vue complète : à gauche le rapport TCD (Étiquettes de lignes ▾, Somme de Montant, Total général 41 500 €) ; à droite la fenêtre des champs (Vendeurs coché en Lignes, Somme de Montant en Valeurs).' } },
          { note: 'Regarde bien ce qui vient de se passer : **Vendeurs** vient de la table T_vendeurs, **Montant** vient de la table T_ventes. Ce rapport croise donc **deux tableaux différents**, et c\'est **grâce aux relations** (la clé partagée Zones Vente) qu\'Excel a pu les combiner. **Sans ces relations**, impossible de calculer les ventes **par vendeur** : on n\'aurait pu totaliser les montants que **par zone de vente** (la seule info présente dans la table Ventes).', label: 'La magie des relations' },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Tu as vu la magie opérer. **Vrai ou faux ?**',
      visuel: { type: 'vraifaux', affirmation: 'Sans les relations entre les tables, ce TCD n\'aurait pu totaliser les montants que par zone de vente, pas par vendeur.', bonne: true, explication: 'Le Montant vit dans T_ventes, qui ne connaît que la zone. C\'est la relation (clé Zones Vente) qui fait le pont jusqu\'aux vendeurs.' },
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Pour créer un TCD multi-tables, il est impératif de...',
      visuel: { type: 'question', options: ['définir des relations entre les tables dans le Modèle de données avant de créer le TCD', 'fusionner manuellement les plages avant', 'placer toutes les données dans la même feuille'], bonne: 0, explication: 'Le TCD multi-tables s\'appuie sur le Modèle de données et les relations entre tables (via une clé partagée) : c\'est ce qui lui permet de combiner les sources.' } },
    { humeur: 'fier', dit: 'Tu relies plusieurs tables et tu bâtis un rapport consolidé interactif. La ceinture bleue est à toi ! Bravo ! 🎉' },
  ],
}

// ===================== CHAPITRE 10 : FONCTIONS CONDITIONNELLES (ceinture bleue-marron) =====================
const U10 = (id) => `https://drive.google.com/file/d/${id}/view?usp=drivesdk`
const EX10 = {
  ex71: { titre: 'Exercice 71 · La mise en forme conditionnelle', url: U10('1pxcb_TevJZSOLe2CzDjbun4sGE-y43rW') },
  ex72: { titre: 'Exercice 72 · La fonction SI simple', url: U10('1xX0Nik_L4NRNArhkQpRWeYKCNikEAYcO') },
  ex73: { titre: 'Exercice 73 · La fonction SI imbriquée, ET, OU', url: U10('18Q9o1iM-L5onhnyPNiugW82GjbOiSCqp') },
  ex74: { titre: 'Exercice 74 · Les fonctions SI.ENS', url: U10('1eMcGOXxo2JQlkJU--0X_YGtAg0l_fiQq') },
  ex75: { titre: 'Exercice 75 · Les références semi-relatives', url: U10('1aNsWTtgeRmcWDvvCSTVFgQMbWTL0JLoC') },
  ex76: { titre: 'Exercice 76 · La gestion des erreurs', url: U10('1Rc6M4Bi4-jCR6d6fH_yLerRKD8VJe09q') },
}

// --- Leçon 1 : La mise en forme conditionnelle ---
const MFCONDITIONNELLE = {
  id: 'fn-mfconditionnelle',
  titre: 'La mise en forme conditionnelle',
  exercices: [EX10.ex71],
  narration: [
    { humeur: 'accueil', dit: 'La **mise en forme conditionnelle** applique automatiquement un style (couleur, icône, barre) à une cellule **selon son contenu**. En un coup d\'œil, tu repères les valeurs clés. Voici un tableau brut :', visuel: { type: 'mfctableau', avant: true, legende: 'AVANT : rien ne ressort. Difficile de repérer les faibles ou les fortes ventes.' } },
    {
      humeur: 'pensif',
      dit: 'Première famille : **colorer les cellules selon un seuil** (Règles de mise en surbrillance).',
      visuel: {
        type: 'methode',
        titre: 'Règles de mise en surbrillance',
        blocs: [
          { etapes: ['Sélectionne ta plage, puis onglet **Accueil** > groupe **Styles** > **Mise en forme conditionnelle**.'] },
          { capture: { type: 'ruban', actif: 'Accueil', groupeNom: 'Styles', groupes: [{ icone: '▦', label: 'Mise en forme\nconditionnelle', actif: true }, { icone: '▧', label: 'Mettre sous\nforme de tableau' }, { icone: '🎨', label: 'Styles de\ncellules' }] } },
          { etapes: ['Choisis **Règles de mise en surbrillance des cellules**, puis le type (ici **Inférieur à**).'], depart: 2 },
          { capture: { type: 'mfcmenu', actif: 0 } },
          { capture: { type: 'menu', items: [{ label: 'Supérieur à…' }, { label: 'Inférieur à…', actif: true }, { label: 'Entre…' }, { label: 'Égal à…' }, { label: 'Texte qui contient…' }, { label: 'Une date se situant…' }] } },
          { etapes: ['Saisis le **seuil** (7000), choisis un **style**, puis **OK**.'], depart: 3 },
          { capture: { type: 'mfcdialog', titre: 'Inférieur à', valeur: '7000' } },
          { capture: { type: 'mfctableau', style: 'surbrillance', seuil: 7000, legende: 'APRÈS : les ventes sous 7 000 € (Léa, Nina) ressortent en rouge. On voit tout de suite les plus basses.' } },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Deuxième famille : **mettre en avant les extrêmes** (valeurs hautes/basses).',
      visuel: {
        type: 'methode',
        titre: 'Valeurs de plage haute/basse',
        blocs: [
          { etapes: ['Mise en forme conditionnelle > **Règles des valeurs de plage haute/basse**.'] },
          { capture: { type: 'mfcmenu', actif: 1 } },
          { capture: { type: 'menu', items: [{ label: '10 valeurs les plus élevées…', actif: true }, { label: '10 valeurs les moins élevées…' }, { label: '10 % les plus élevés…' }, { label: 'Valeurs supérieures à la moyenne' }, { label: 'Valeurs inférieures à la moyenne' }] } },
          { note: 'Ajuste le nombre ou le pourcentage (ex. les **10 % les plus élevés**), choisis un format, puis **OK**. Parfait pour les meilleures ou pires performances.', label: 'Astuce' },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Troisième famille : les **nuances de couleurs**, un dégradé du plus bas au plus haut.',
      visuel: {
        type: 'methode',
        titre: 'Les nuances de couleurs (dégradés)',
        blocs: [
          { etapes: ['Sélectionne ta plage, puis Mise en forme conditionnelle > **Nuances de couleurs**.'] },
          { capture: { type: 'mfcmenu', actif: 3 } },
          { etapes: ['**Survole** les modèles pour voir l\'effet en direct sur ton tableau, puis **clique** celui qui te convient.'], depart: 2 },
          { capture: { type: 'menu', items: [{ label: 'Dégradé vert - jaune - rouge', actif: true }, { label: 'Dégradé rouge - jaune - vert' }, { label: 'Dégradé bicolore vert - blanc' }, { label: 'Dégradé bicolore blanc - rouge' }] } },
          { capture: { type: 'mfctableau', style: 'nuances', legende: 'APRÈS : chaque cellule prend sa teinte selon sa valeur, du vert (élevé) au rouge (bas), en passant par le jaune.' } },
          { note: 'Pour des comparaisons claires, privilégie un dégradé à **deux couleurs** (vert/rouge) : le vert pour les valeurs élevées, le rouge pour les basses.', label: 'Astuce' },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Quatrième famille : les **barres de données**, une barre proportionnelle à la valeur, directement dans la cellule.',
      visuel: {
        type: 'methode',
        titre: 'Les barres de données',
        blocs: [
          { etapes: ['Sélectionne ta plage, puis Mise en forme conditionnelle > **Barres de données**.'] },
          { capture: { type: 'mfcmenu', actif: 2 } },
          { etapes: ['Choisis un remplissage **dégradé** (fondu subtil) ou **uni** (bande pleine).'], depart: 2 },
          { capture: { type: 'menu', items: [{ label: 'Remplissage dégradé', actif: true }, { label: 'Remplissage uni' }] } },
          { capture: { type: 'mfctableau', style: 'barres', legende: 'APRÈS : plus la vente est grande, plus la barre est longue. Un mini-graphique directement dans le tableau !' } },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Cinquième famille : **classer visuellement avec des icônes** (flèches, feux…).',
      visuel: {
        type: 'methode',
        titre: 'Les jeux d\'icônes',
        blocs: [
          { etapes: ['Mise en forme conditionnelle > **Jeux d\'icônes**, puis choisis un style (ex. **3 flèches**).'] },
          { capture: { type: 'mfcmenu', actif: 4 } },
          { capture: { type: 'menu', items: [{ label: '3 flèches (colorées)', actif: true }, { label: '3 feux tricolores' }, { label: '5 formes géométriques' }] } },
          { capture: { type: 'mfctableau', style: 'icones', legende: 'Résultat : flèche verte ▲ pour les fortes ventes, jaune ▬ pour les moyennes, rouge ▼ pour les faibles.' } },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Tu peux **régler toi-même les seuils** d\'un jeu d\'icônes, pour coller à TES paliers.',
      visuel: {
        type: 'methode',
        titre: 'Modifier les plages d\'un jeu d\'icônes',
        blocs: [
          { etapes: ['Mise en forme conditionnelle > **Gérer les règles**.'] },
          { capture: { type: 'mfcmenu', actif: 7 } },
          { etapes: ['Sélectionne la règle, clique **Modifier la règle…**'], depart: 2 },
          { capture: { type: 'gestionregles', regles: [{ desc: 'Jeu d\'icônes (3 flèches)', plage: '=$B$2:$B$6' }], selection: 0 } },
          { etapes: ['Change les **valeurs** de chaque icône (ex. ▲ si ≥ 67, ▬ si ≥ 33, ▼ sinon), puis **OK** (2 fois).'], depart: 3 },
          { capture: { type: 'regleicones', lignes: [{ icone: '▲', c: '#1f9d57', op: '≥', val: '67' }, { icone: '▬', c: '#d9a406', op: '≥', val: '33' }, { icone: '▼', c: '#d33', op: '<', val: '33' }] } },
          { note: 'Adapter les seuils évite les interprétations trompeuses des bornes par défaut, et rend ta lecture instantanée.', label: 'Pourquoi c\'est utile' },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Sixième famille : la **règle basée sur une formule**, pour des critères sur mesure.',
      visuel: {
        type: 'methode',
        titre: 'Règle basée sur une formule',
        blocs: [
          { etapes: ['Sélectionne ta plage, puis Mise en forme conditionnelle > **Nouvelle règle…**'] },
          { capture: { type: 'mfcmenu', actif: 5 } },
          { etapes: ['Choisis **« Utiliser une formule pour déterminer pour quelles cellules le format sera appliqué »**.'], depart: 2 },
          { etapes: ['Écris une formule qui renvoie **VRAI ou FAUX** (ex. **=B2>=12000**), choisis le **Format…** (ici fond vert), puis **OK**.'], depart: 3 },
          { capture: { type: 'nouvelleregle', formule: '=B2>=12000' } },
          { capture: { type: 'mfctableau', style: 'formule', legende: 'APRÈS : la formule renvoie VRAI pour Karim (12 500 €) et Tom (15 800 €) : leurs cellules passent en vert.' } },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Septième famille : la **détection des doublons**, pour repérer les valeurs en double.',
      visuel: {
        type: 'methode',
        titre: 'Détecter les doublons',
        blocs: [
          { etapes: ['Sélectionne la colonne à vérifier, puis Mise en forme conditionnelle > Règles de mise en surbrillance > **Valeurs en double…**'] },
          { capture: { type: 'menu', items: [{ label: 'Supérieur à…' }, { label: 'Inférieur à…' }, { label: 'Texte qui contient…' }, { label: 'Valeurs en double…', actif: true }] } },
          { etapes: ['Choisis **en double** (ou **uniques** pour l\'inverse) et un style, puis **OK**.'], depart: 2 },
          { capture: { type: 'mfcdialog', titre: 'Valeurs en double', phrase: 'contenant des valeurs', valeur: 'en double' } },
          { capture: { type: 'mfctableau', style: 'doublons', data: [['Marie', '8 200 €', 8200], ['Karim', '12 500 €', 12500], ['Marie', '4 300 €', 4300], ['Tom', '15 800 €', 15800], ['Karim', '6 100 €', 6100]], legende: 'APRÈS : « Marie » et « Karim » apparaissent deux fois : toutes leurs occurrences ressortent en rouge. Pratique pour nettoyer une liste !' } },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Récap : les **7 familles** de règles disponibles.',
      visuel: { type: 'encart', label: 'Les familles de règles', liste: ['**Surbrillance des cellules** : supérieur/inférieur à, entre, égal à, texte qui contient, date.', '**Valeurs haute/basse** : X plus élevées/basses, X %, au-dessus/en-dessous de la moyenne.', '**Nuances de couleurs** : dégradé bicolore ou tricolore (du min au max).', '**Barres de données** : une barre proportionnelle à la valeur, dans la cellule.', '**Jeux d\'icônes** : 3 flèches, 3 feux, 5 formes… selon des seuils.', '**Règle basée sur une formule** : mise en forme dès qu\'une formule renvoie VRAI.', '**Détection des doublons** : surligne les valeurs en double (ou uniques).'] },
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Quelle mise en forme conditionnelle met en évidence les **valeurs extrêmes** (top/flop) ?',
      visuel: { type: 'question', options: ['Nuances de couleurs tricolores', 'Règles des valeurs de plage haute/basse', 'Barres de données'], bonne: 1, explication: 'Les « valeurs de plage haute/basse » ciblent précisément les extrêmes : X plus élevées/basses, X %, au-dessus/en-dessous de la moyenne.' },
    },
    { humeur: 'fier', dit: 'Tes tableaux parlent d\'eux-mêmes : d\'un regard, tu vois le bon, le moyen, le faible. Bravo ! 🎉' },
  ],
}

// --- Leçon 2 : Rappels express, références & noms ---
const RAPPELREFNOMS = {
  id: 'fn-rappelrefnoms',
  titre: 'Rappels express : références & noms',
  exercices: [],
  narration: [
    { humeur: 'accueil', dit: 'Avant les fonctions conditionnelles, deux **rappels** essentiels : les **références** (relatives/absolues) et les **noms**. Ils reviennent tout au long du chapitre.', visuel: { type: 'tableur', cols: ['A', 'B', 'C'], rows: [1, 2], cells: { A1: { t: 'Prix', entete: true }, B1: { t: 'Qté', entete: true }, C1: { t: 'Total', entete: true }, A2: { t: '25', ref: true }, B2: { t: '4', ref: true }, C2: { t: '=A2*B2' } }, refsCouleur: { A2: 'bleu', B2: 'ambre' }, formule: '=A2*B2', actif: 'C2', legende: 'Tout ce chapitre joue avec des formules comme celle-ci. Petit échauffement !' } },
    {
      humeur: 'pensif',
      dit: 'Une **référence relative** s\'adapte quand tu recopies la formule.',
      visuel: {
        type: 'methode',
        titre: 'Références relatives',
        blocs: [
          { etapes: ['En **D2**, tape **=B2*C2**. Tire la poignée vers le bas : Excel adapte tout seul.'] },
          { capture: { type: 'tableur', cols: ['B', 'C', 'D'], rows: [2, 3, 4], cells: { B2: { t: '10' }, C2: { t: '5' }, D2: { t: '=B2*C2', ref: true }, B3: { t: '8' }, C3: { t: '4' }, D3: { t: '=B3*C3', vert: true }, B4: { t: '6' }, C4: { t: '3' }, D4: { t: '=B4*C4', vert: true } }, legende: 'D3 devient =B3*C3, D4 devient =B4*C4 : les lignes suivent la recopie.' } },
          { note: 'Vers le **bas** : la ligne change (B2→B3). Vers la **droite** : la colonne change (B2→C2).', label: 'À retenir' },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Une **référence absolue** fige une cellule avec des **$**.',
      visuel: {
        type: 'methode',
        titre: 'Références absolues (F4)',
        blocs: [
          { etapes: ['Pour figer G10 : écris **$G$10**. Astuce : sélectionne la référence et appuie sur **F4** (Mac : **⌘ + T**, ou **Fn + F4**).'] },
          { capture: { type: 'touche', touches: ['F4'], note: 'Sur Mac : ⌘ + T (ou Fn + F4). Excel transforme G10 en $G$10 : la cellule ne bougera plus, où que tu copies la formule.' } },
          { capture: { type: 'reffiger' } },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Les **noms** rendent tes formules lisibles : **=Prix*Quantité** au lieu de =A1*B1.',
      visuel: {
        type: 'methode',
        titre: 'Utiliser les noms',
        blocs: [
          { etapes: ['**Nommer** : sélectionne la plage, clique la **zone Nom** (à gauche de la barre de formule), tape le nom (sans espace), **Entrée**.'] },
          { capture: { type: 'zonenom', nom: 'Prix', ref: 'B2' } },
          { etapes: ['**Créer d\'un coup** depuis les titres : Formules > Noms définis > **Créer à partir de la sélection** (coche Ligne du haut / Colonne de gauche).'], depart: 2 },
          { capture: { type: 'listedialog', titre: 'Créer des noms à partir de la sélection', cases: [{ label: 'Ligne du haut', coche: true }, { label: 'Colonne de gauche', coche: false }, { label: 'Ligne du bas', coche: false }, { label: 'Colonne de droite', coche: false }] } },
          { etapes: ['**Réutiliser** dans une formule : tape **=**, appuie sur **F3** > choisis le nom (ou tape ses premières lettres, il apparaît en haut de la liste).'], depart: 3 },
          { capture: { type: 'listedialog', titre: 'Coller un nom', items: ['Prix', 'Quantite', 'TVA'], selection: 0 } },
          { note: 'Règles du nom : commence par une lettre, **pas d\'espace**, pas de doublon, pas une adresse (B2), 255 caractères max. Gère tout via Formules > **Gestionnaire de noms**.', label: 'Syntaxe' },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Laquelle de ces notations **verrouille entièrement** la cellule B1 ?',
      visuel: { type: 'question', options: ['B$1', '$B1', '$B$1', 'B1'], bonne: 2, explication: '$B$1 fige la colonne B ET la ligne 1. B$1 ne fige que la ligne, $B1 que la colonne, B1 rien du tout.' },
    },
    { humeur: 'fier', dit: 'Références et noms bien en tête. Place aux fonctions conditionnelles. Bravo ! 🎉' },
  ],
}

// --- Leçon 3 : La fonction SI ---
const FONCTIONSI = {
  id: 'fn-fonctionsi',
  titre: 'La fonction SI',
  exercices: [EX10.ex72],
  narration: [
    { humeur: 'accueil', dit: 'La fonction **SI** teste une condition et renvoie une valeur si elle est **vraie**, une autre si elle est **fausse**. Sa syntaxe :', visuel: { type: 'formule', formule: '=SI(test_logique ; valeur_si_vrai ; valeur_si_faux)' } },
    {
      humeur: 'pensif',
      dit: 'Un exemple concret : afficher **OK** si la note dépasse 10, sinon **À refaire**.',
      visuel: { type: 'tableur', cols: ['A', 'B'], rows: [1, 2], cells: { A1: { t: '14', ref: true }, B1: { t: '=SI(A1>10;"OK";"À refaire")' }, A2: { t: '' }, B2: { t: 'OK', vert: true } }, formule: '=SI(A1>10;"OK";"À refaire")', actif: 'B1', legende: 'A1 = 14, donc 14 > 10 est vrai : Excel affiche « OK ». Le texte va toujours entre guillemets.' },
    },
    {
      humeur: 'pensif',
      dit: 'La condition s\'appuie sur des **opérateurs de comparaison** :',
      visuel: { type: 'operateurs', cols: 1, items: [{ s: '=', l: 'égal à' }, { s: '<>', l: 'différent de' }, { s: '>', l: 'supérieur à' }, { s: '>=', l: 'supérieur ou égal à' }, { s: '<', l: 'inférieur à' }, { s: '<=', l: 'inférieur ou égal à' }] },
    },
    {
      humeur: 'pensif',
      dit: 'Méthode 1 : avec l\'**assistant fonction** (fx), guidé.',
      visuel: {
        type: 'methode',
        titre: 'SI avec l\'assistant (fx)',
        blocs: [
          { etapes: ['Clique la cellule, tape **=**, puis le bouton **fx** de la barre de formule. Choisis la catégorie **Logique** > **SI** > OK.'] },
          { capture: { type: 'assistant', categorie: 'Logique', fonctions: ['NB.SI.ENS', 'OU', 'SI', 'SI.CONDITIONS', 'ET'], selection: 2, signature: 'SI(test_logique; valeur_si_vrai; valeur_si_faux)', description: 'Vérifie si une condition est respectée et renvoie une valeur si VRAI, une autre si FAUX.', focus: 'liste' } },
          { etapes: ['Remplis chaque **argument**, puis OK : Excel écrit la formule pour toi.'], depart: 2 },
          { capture: { type: 'arguments', fonction: 'SI', args: [{ label: 'test_logique', ref: 'A1>10', valeur: 'VRAI', obligatoire: true }, { label: 'valeur_si_vrai', ref: '"OK"', valeur: '"OK"', obligatoire: true }, { label: 'valeur_si_faux', ref: '"À refaire"', valeur: '"À refaire"', obligatoire: false }], apercu: 'OK', resultat: 'OK' } },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Méthode 2 : la **saisie directe**, pas à pas.',
      visuel: {
        type: 'methode',
        titre: 'SI en saisie directe',
        blocs: [
          { etapes: ['Dans la cellule, tape **=SI(**'] },
          { capture: { type: 'tableur', cols: ['A', 'B'], rows: [1], cells: { A1: { t: '14', ref: true }, B1: { t: '=SI(' } }, formule: '=SI(', actif: 'B1' } },
          { etapes: ['Écris le **test**, puis un point-virgule : **A1>10;**'], depart: 2 },
          { capture: { type: 'tableur', cols: ['A', 'B'], rows: [1], cells: { A1: { t: '14', ref: true }, B1: { t: '=SI(A1>10;' } }, formule: '=SI(A1>10;', actif: 'B1' } },
          { etapes: ['Le **résultat si vrai** entre guillemets, puis **;** : **"OK";**'], depart: 3 },
          { etapes: ['Le **résultat si faux**, ferme la parenthèse, **Entrée** : **"À refaire")**'], depart: 4 },
          { capture: { type: 'tableur', cols: ['A', 'B'], rows: [1], cells: { A1: { t: '14', ref: true }, B1: { t: 'OK', vert: true } }, formule: '=SI(A1>10;"OK";"À refaire")', actif: 'B1', legende: 'Formule complète, résultat « OK ».' } },
        ],
      },
    },
    {
      humeur: 'accueil',
      dit: 'À toi. La fonction **SI** simple renvoie...',
      visuel: { type: 'question', options: ['le compte des lignes qui remplissent un critère', 'une valeur_si_vrai ou valeur_si_faux selon le test logique', 'la somme des valeurs supérieures à un seuil'], bonne: 1, explication: 'SI teste UNE condition et renvoie une valeur si elle est vraie, une autre si elle est fausse. Compter, c\'est NB.SI ; sommer, c\'est SOMME.SI.' },
    },
    { humeur: 'fier', dit: 'Tu sais automatiser une décision avec SI. La brique de base de toute logique Excel. Bravo ! 🎉' },
  ],
}

// --- Leçon 4 : SI imbriquée & ET/OU/NON ---
const SIIMBRIQUE = {
  id: 'fn-siimbrique',
  titre: 'SI imbriquée, ET, OU',
  exercices: [EX10.ex73],
  narration: [
    {
      humeur: 'accueil',
      dit: 'La **SI imbriquée** teste **plusieurs paliers** dans une seule formule. Concrètement : tu veux commenter la **note** d\'un élève (en B2) selon 4 paliers :',
      visuel: { type: 'parties', items: [{ label: 'Note **supérieure à 90** : afficher « Excellent »' }, { label: 'Note **supérieure à 75** : afficher « Bien »' }, { label: 'Note **supérieure à 50** : afficher « Passable »' }, { label: '**Sinon** : afficher « Insuffisant »' }] },
    },
    {
      humeur: 'pensif',
      dit: 'Voici la formule qui fait ça. Excel lit de gauche à droite : dès qu\'un test est **faux**, il passe au SI **suivant** (jusqu\'à 64 niveaux possibles).',
      visuel: { type: 'formule', formule: '=SI(B2>90;"Excellent";SI(B2>75;"Bien";SI(B2>50;"Passable";"Insuffisant")))' },
    },
    {
      humeur: 'pensif',
      dit: 'Elle a l\'air longue ? On la construit **argument par argument**, calmement.',
      visuel: {
        type: 'methode',
        titre: 'La SI imbriquée, argument par argument',
        blocs: [
          { etapes: ['Place ton curseur dans la cellule de destination (C2) et tape **=SI(**'] },
          { capture: { type: 'tableur', cols: ['B', 'C'], rows: [1, 2], cells: { B1: { t: 'Note', entete: true }, C1: { t: 'Commentaire', entete: true }, B2: { t: '82', ref: true }, C2: { t: '=SI(' } }, formule: '=SI(', actif: 'C2' } },
          { etapes: ['Entre le **1er critère** suivi d\'un point-virgule : **B2>90;**'], depart: 2 },
          { capture: { type: 'formule', formule: '=SI(B2>90;' } },
          { etapes: ['Le texte à afficher **si c\'est vrai**, entre guillemets, puis **;** : **"Excellent";**'], depart: 3 },
          { capture: { type: 'formule', formule: '=SI(B2>90;"Excellent";' } },
          { etapes: ['À la place du « sinon », **relance un SI(** : c\'est ça, l\'imbrication.'], depart: 4 },
          { capture: { type: 'formule', formule: '=SI(B2>90;"Excellent";SI(' } },
          { etapes: ['2e palier, même séquence condition ; résultat : **B2>75;"Bien";**'], depart: 5 },
          { capture: { type: 'formule', formule: '=SI(B2>90;"Excellent";SI(B2>75;"Bien";' } },
          { etapes: ['3e palier : **SI(B2>50;"Passable";**'], depart: 6 },
          { capture: { type: 'formule', formule: '=SI(B2>90;"Excellent";SI(B2>75;"Bien";SI(B2>50;"Passable";' } },
          { etapes: ['Après le dernier SI, la **valeur si tout est faux** : **"Insuffisant"**, puis ferme **autant de parenthèses que de SI** : **)))**'], depart: 7 },
          { capture: { type: 'formule', formule: '=SI(B2>90;"Excellent";SI(B2>75;"Bien";SI(B2>50;"Passable";"Insuffisant")))' } },
          { etapes: ['Appuie sur **Entrée**, puis **étire** la formule pour les autres élèves.'], depart: 8 },
          { capture: { type: 'tableur', cols: ['B', 'C'], rows: [1, 2, 3], cells: { B1: { t: 'Note', entete: true }, C1: { t: 'Commentaire', entete: true }, B2: { t: '82', ref: true }, C2: { t: 'Bien', vert: true }, B3: { t: '45' }, C3: { t: 'Insuffisant', vert: true } }, formule: '=SI(B2>90;"Excellent";SI(B2>75;"Bien";SI(B2>50;"Passable";"Insuffisant")))', actif: 'C2', legende: '82 : pas > 90, mais > 75 → « Bien ». 45 : aucun test vrai → « Insuffisant ».' } },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Vérifions ton œil de logicienne. **Vrai ou faux ?**',
      visuel: {
        type: 'vraifaux',
        affirmation: '=SI(B2>90;"Excellent";…) affiche « Excellent » quand B2 vaut exactement 90.',
        bonne: false,
        explication: '90 n\'est pas STRICTEMENT supérieur à 90 : le test B2>90 est FAUX, Excel passe au palier suivant. Pour inclure 90, écris B2>=90. Ce détail piège tout le monde, retiens-le bien !',
      },
    },
    {
      humeur: 'pensif',
      dit: 'Pour tester **plusieurs conditions ensemble**, glisse **ET**, **OU** ou **NON** dans le SI.',
      visuel: { type: 'encart', label: 'ET / OU / NON', liste: ['**ET** : VRAI seulement si **toutes** les conditions sont vraies. =SI(ET(c1;c2);vrai;faux)', '**OU** : VRAI si **au moins une** condition est vraie. =SI(OU(c1;c2);vrai;faux)', '**NON** : **inverse** le résultat logique. =SI(NON(condition);vrai;faux)'] },
    },
    {
      humeur: 'pensif',
      dit: 'Exemple avec **ET** : « Validé » si le CA dépasse 100 000 € **ET** la satisfaction dépasse 90 %. Les deux à la fois !',
      visuel: {
        type: 'methode',
        titre: 'SI + ET, argument par argument',
        blocs: [
          { etapes: ['Voici les données : le CA en B2 (bleu), la satisfaction en C2 (orange). En D2, tape **=SI(**'] },
          { capture: { type: 'tableur', cols: ['A', 'B', 'C', 'D'], rows: [1, 2], cells: { A1: { t: 'Zone', entete: true }, B1: { t: 'CA', entete: true }, C1: { t: 'Satisf.', entete: true }, D1: { t: 'Bilan', entete: true }, A2: { t: 'Nord' }, B2: { t: '120 000', ref: true }, C2: { t: '95 %', ref: true }, D2: { t: '=SI(' } }, refsCouleur: { B2: 'bleu', C2: 'ambre' }, formule: '=SI(', actif: 'D2' } },
          { etapes: ['Insère la fonction **ET** et ouvre sa parenthèse : **ET(**'], depart: 2 },
          { capture: { type: 'formule', formule: '=SI(ET(' } },
          { etapes: ['Saisis ta **1re condition**, puis un point-virgule : **B2>100000;**'], depart: 3 },
          { capture: { type: 'formule', formule: '=SI(ET(B2>100000;' } },
          { etapes: ['Saisis ta **2e condition** : **C2>90%**'], depart: 4 },
          { capture: { type: 'formule', formule: '=SI(ET(B2>100000;C2>90%' } },
          { etapes: ['Ferme la parenthèse **du ET** : **)**'], depart: 5 },
          { capture: { type: 'formule', formule: '=SI(ET(B2>100000;C2>90%)' } },
          { etapes: ['La valeur **si VRAI** : **;"Validé"**'], depart: 6 },
          { capture: { type: 'formule', formule: '=SI(ET(B2>100000;C2>90%);"Validé"' } },
          { etapes: ['La valeur **si FAUX**, ferme la parenthèse du SI, **Entrée** : **;"À revoir")**'], depart: 7 },
          { capture: { type: 'tableur', cols: ['A', 'B', 'C', 'D'], rows: [1, 2], cells: { A1: { t: 'Zone', entete: true }, B1: { t: 'CA', entete: true }, C1: { t: 'Satisf.', entete: true }, D1: { t: 'Bilan', entete: true }, A2: { t: 'Nord' }, B2: { t: '120 000', ref: true }, C2: { t: '95 %', ref: true }, D2: { t: 'Validé', vert: true } }, refsCouleur: { B2: 'bleu', C2: 'ambre' }, formule: '=SI(ET(B2>100000;C2>90%);"Validé";"À revoir")', actif: 'D2', legende: 'Les DEUX conditions sont vraies (120 000 > 100 000 ET 95 % > 90 %) → « Validé ».' } },
          { note: 'N\'oublie pas le **%** dans C2>90% : sans lui, Excel comparerait 0,95 à 90 et le test serait toujours faux.', label: 'Attention' },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Même construction avec **OU** : cette fois, **une seule** condition vraie suffit. Regarde la zone Sud…',
      visuel: {
        type: 'methode',
        titre: 'SI + OU, argument par argument',
        blocs: [
          { etapes: ['Zone Sud : CA = 100 000 €, satisfaction = 90 %. En D2, tape **=SI(** puis insère **OU(**'] },
          { capture: { type: 'tableur', cols: ['A', 'B', 'C', 'D'], rows: [1, 2], cells: { A1: { t: 'Zone', entete: true }, B1: { t: 'CA', entete: true }, C1: { t: 'Satisf.', entete: true }, D1: { t: 'Bilan', entete: true }, A2: { t: 'Sud' }, B2: { t: '100 000', ref: true }, C2: { t: '90 %', ref: true }, D2: { t: '=SI(OU(' } }, refsCouleur: { B2: 'bleu', C2: 'ambre' }, formule: '=SI(OU(', actif: 'D2' } },
          { etapes: ['1re condition + point-virgule : **B2>100000;**'], depart: 2 },
          { capture: { type: 'formule', formule: '=SI(OU(B2>100000;' } },
          { etapes: ['2e condition, puis ferme la parenthèse **du OU** : **C2>90%)**'], depart: 3 },
          { capture: { type: 'formule', formule: '=SI(OU(B2>100000;C2>90%)' } },
          { etapes: ['Les 2 résultats, ferme, **Entrée** : **;"Validé";"À revoir")**'], depart: 4 },
          { capture: { type: 'tableur', cols: ['A', 'B', 'C', 'D'], rows: [1, 2], cells: { A1: { t: 'Zone', entete: true }, B1: { t: 'CA', entete: true }, C1: { t: 'Satisf.', entete: true }, D1: { t: 'Bilan', entete: true }, A2: { t: 'Sud' }, B2: { t: '100 000', ref: true }, C2: { t: '90 %', ref: true }, D2: { t: 'À revoir' } }, refsCouleur: { B2: 'bleu', C2: 'ambre' }, formule: '=SI(OU(B2>100000;C2>90%);"Validé";"À revoir")', actif: 'D2', legende: 'Surprise : « À revoir » ! Pourquoi ? Lis la suite…' } },
          { note: '100 000 n\'est **pas strictement supérieur** à 100 000, et 90 % n\'est **pas strictement supérieur** à 90 %. Les DEUX tests sont donc faux → OU renvoie FAUX → Excel affiche la partie « sinon » : « À revoir ». Pour inclure la valeur exacte, utilise **>=**.', label: 'En résumé' },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Alors, **ET ou OU** ? Retiens la différence avec une image simple.',
      visuel: { type: 'encart', label: 'ET ou OU ? La différence', liste: ['**ET**, c\'est le videur strict : il exige la carte d\'identité **ET** le billet. Une seule pièce manque ? Tu ne rentres pas (FAUX).', '**OU**, c\'est le videur cool : carte **OU** billet, n\'importe lequel des deux ouvre la porte (VRAI).', 'Mêmes données, résultats différents : CA 120 000 € et satisfaction 85 % → avec **ET** : « À revoir » (une condition rate) ; avec **OU** : « Validé » (une condition suffit).'] },
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Quelle fonction renvoie **VRAI seulement si les deux** conditions sont vraies ?',
      visuel: { type: 'question', options: ['OU(condition1; condition2)', 'SI(condition1; condition2; FAUX)', 'ET(condition1; condition2)'], bonne: 2, explication: 'ET exige que TOUTES les conditions soient vraies (le videur strict). OU se contente d\'une seule vraie (le videur cool).' },
    },
    { humeur: 'fier', dit: 'Paliers multiples, conditions combinées, pièges du strictement supérieur : ta logique devient redoutable. Bravo ! 🎉' },
  ],
}

// --- Leçon 5 : NB.SI.ENS ---
const NBSIENS = {
  id: 'fn-nbsiens',
  titre: 'La fonction NB.SI.ENS',
  exercices: [EX10.ex74],
  narration: [
    { humeur: 'accueil', dit: '**NB.SI.ENS** parcourt tout ton tableau et **compte** les lignes qui remplissent **plusieurs critères en même temps**, sans vérifier ligne à ligne.', visuel: { type: 'formule', formule: '=NB.SI.ENS(plage1 ; critère1 ; [plage2 ; critère2] ; …)' } },
    {
      humeur: 'pensif',
      dit: 'Chaque **paire plage/critère** ajoute une condition :',
      visuel: { type: 'parties', items: [{ label: '**Plage1** : la colonne à tester (ex. Genre).' }, { label: '**Critère1** : la condition (texte ou comparaison, ex. "Homme", ">50000").' }, { label: '**Plage2 / critère2, …** : des paires en plus pour affiner.' }] },
    },
    {
      humeur: 'pensif',
      dit: 'Exemple : combien d\'**hommes célibataires gagnent plus de 50 000 €** ?',
      visuel: {
        type: 'methode',
        titre: 'NB.SI.ENS pas à pas',
        blocs: [
          { etapes: ['Dans la cellule résultat, tape **=NB.SI.ENS(**'] },
          { etapes: ['1re paire : sélectionne la colonne **Genre** puis **;"Homme";**'], depart: 2 },
          { capture: { type: 'tableur', cols: ['B', 'C', 'D'], rows: [1, '⋮', 13], cells: { B1: { t: 'Genre', entete: true }, C1: { t: 'Situation', entete: true }, D1: { t: 'Revenu', entete: true }, B13: { t: '…', ref: true }, C13: { t: '…' }, D13: { t: '…' } }, refsCouleur: { B13: 'bleu' }, formule: '=NB.SI.ENS(B2:B13;"Homme";', actif: 'E2', legende: 'On sélectionne la colonne Genre (B2:B13, en bleu) puis on tape ;"Homme";' } },
          { etapes: ['2e paire : colonne **Situation** puis **;"Célibataire";** ; 3e paire : colonne **Revenu** puis **;">50000")**'], depart: 3 },
          { capture: { type: 'tableur', cols: ['B', 'C', 'D', 'E'], rows: [1, 2], cells: { B1: { t: 'Genre', entete: true }, C1: { t: 'Situation', entete: true }, D1: { t: 'Revenu', entete: true }, E1: { t: 'Résultat', entete: true }, B2: { t: '…' }, C2: { t: '…' }, D2: { t: '…' }, E2: { t: '2', vert: true } }, formule: '=NB.SI.ENS(B2:B13;"Homme";C2:C13;"Célibataire";D2:D13;">50000")', actif: 'E2', legende: 'Résultat = 2 : seules 2 lignes (Jean 60 000 €, Antoine 51 000 €) remplissent les 3 conditions à la fois.' } },
          { note: '**NB.SI** (sans ENS) ne gère qu\'**un seul** critère. Adopte NB.SI.ENS d\'emblée : il gère 1 ou plusieurs critères.', label: 'Bon à savoir' },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Vérifions ta logique. **Vrai ou faux ?**',
      visuel: { type: 'vraifaux', affirmation: 'NB.SI.ENS compte les lignes qui remplissent AU MOINS UN des critères.', bonne: false, explication: 'NB.SI.ENS exige TOUS les critères en même temps (une logique ET). Jean compte s\'il est homme ET célibataire ET gagne plus de 50 000 €.' },
    },
    {
      humeur: 'accueil',
      dit: 'À toi. La fonction **NB.SI.ENS** sert à...',
      visuel: { type: 'question', options: ['additionner toutes les valeurs d\'une colonne', 'compter les cellules selon plusieurs critères', 'appliquer une mise en forme conditionnelle'], bonne: 1, explication: 'NB.SI.ENS compte le nombre de lignes qui satisfont plusieurs critères. Pour additionner, c\'est SOMME.SI.ENS.' },
    },
    { humeur: 'fier', dit: 'Tu comptes des dizaines de lignes en une formule, selon autant de critères que tu veux. Bravo ! 🎉' },
  ],
}

// --- Leçon 6 : SOMME.SI.ENS & références semi-relatives ---
const SOMMESIENS = {
  id: 'fn-sommesiens',
  titre: 'SOMME.SI.ENS & semi-relatives',
  exercices: [EX10.ex75],
  narration: [
    { humeur: 'accueil', dit: '**SOMME.SI.ENS** fonctionne comme NB.SI.ENS, mais au lieu de compter, elle **additionne** les valeurs. Attention : ici, la **plage à totaliser vient en premier**.', visuel: { type: 'formule', formule: '=SOMME.SI.ENS(plage_somme ; plage_critères1 ; critère1 ; …)' } },
    {
      humeur: 'pensif',
      dit: 'Exemple : le CA d\'**Alice** dans la région **Est**.',
      visuel: {
        type: 'methode',
        titre: 'SOMME.SI.ENS pas à pas',
        blocs: [
          { etapes: ['Tape **=SOMME.SI.ENS(** puis sélectionne la **colonne à totaliser** (Chiffre d\'affaires) : **C2:C13;**'] },
          { capture: { type: 'tableur', cols: ['A', 'B', 'C'], rows: [1, '⋮', 13], cells: { A1: { t: 'Vendeur', entete: true }, B1: { t: 'Région', entete: true }, C1: { t: 'CA', entete: true }, A13: { t: '…' }, B13: { t: '…' }, C13: { t: '…', ref: true } }, refsCouleur: { C13: 'vert' }, formule: '=SOMME.SI.ENS(C2:C13;', actif: 'F2', legende: 'La plage_somme (CA, en vert) vient en PREMIER.' } },
          { etapes: ['1er critère : colonne **Vendeur** puis **;"Alice";** ; 2e critère : colonne **Région** puis **;"Est")**'], depart: 2 },
          { capture: { type: 'tableur', cols: ['A', 'B', 'C', 'F'], rows: [1, 2], cells: { A1: { t: 'Vendeur', entete: true }, B1: { t: 'Région', entete: true }, C1: { t: 'CA', entete: true }, F1: { t: 'Total Alice/Est', entete: true }, A2: { t: '…' }, B2: { t: '…' }, C2: { t: '…' }, F2: { t: '150 000 €', vert: true } }, formule: '=SOMME.SI.ENS(C2:C13;A2:A13;"Alice";B2:B13;"Est")', actif: 'F2', legende: 'Une seule ligne a Alice + Est : son CA = 150 000 €.' } },
          { note: 'Pour **recopier** cette formule dans un tableau de synthèse, **fige les plages** avec des $ (F4 / ⌘+T) : $C$2:$C$13, $A$2:$A$13… Elles ne bougeront plus.', label: 'Recopie sans erreur' },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Astuce : au lieu de taper le critère entre guillemets, **clique la cellule** du tableau de synthèse qui le contient. La formule s\'adapte à la recopie.',
      visuel: { type: 'encart', label: 'Critères depuis le tableau', texte: 'Positionne le curseur dans la zone Critère de la formule, puis **clique la cellule** (ex. E2 = « Alice »). Excel inscrit E2. En recopiant, il passe à E3, E4… pour prendre Bob, Claire…' },
    },
    {
      humeur: 'pensif',
      dit: 'Pour qu\'**une seule formule** remplisse tout un tableau croisé (vendeurs en lignes, régions en colonnes) : les **références semi-relatives**.',
      visuel: {
        type: 'methode',
        titre: 'Les références semi-relatives',
        blocs: [
          { etapes: ['Pour le vendeur, écris **$E2** : le **$E** fige la colonne (toujours les noms), la **ligne 2 libre** suit la recopie vers le bas ($E3, $E4…).'] },
          { capture: { type: 'reffiger', items: [{ code: '$E2', role: 'Colonne figée', detail: 'la ligne suit vers le bas' }] } },
          { etapes: ['Pour la région, écris **F$1** : le **$1** fige la ligne (toujours les en-têtes), la **colonne F libre** suit la recopie vers la droite (G$1, H$1…).'], depart: 2 },
          { capture: { type: 'reffiger', items: [{ code: 'F$1', role: 'Ligne figée', detail: 'la colonne suit vers la droite' }] } },
          { note: 'Placée en F2, la formule pointe sur $E2 (Alice) et F$1 (Est). Tirée vers le bas → $E3 (Bob). Tirée vers la droite → G$1 (Ouest). Une seule saisie, tout le tableau se remplit !', label: 'La magie du verrouillage' },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Et pour **un seul critère** ?',
      visuel: { type: 'encart', label: 'SOMME.SI / NB.SI', texte: '**SOMME.SI** additionne selon un seul critère : =SOMME.SI(plage ; critère ; [plage_somme]). Ici la plage à tester vient d\'abord, puis la plage à sommer, l\'inverse de SOMME.SI.ENS. **NB.SI** compte selon un seul critère.' },
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Quelle fonction **additionne** les valeurs selon **plusieurs** paires plage/critère ?',
      visuel: { type: 'question', options: ['SOMME(plage)', 'SOMME.SI(plage ; critère ; plage_somme)', 'SOMME.SI.ENS(plage_somme ; plage_critères1 ; critère1 ; …)'], bonne: 2, explication: 'SOMME.SI.ENS gère plusieurs critères (jusqu\'à 127) et met la plage à totaliser en premier. SOMME.SI ne gère qu\'un seul critère.' },
    },
    { humeur: 'fier', dit: 'Totaux multicritères et verrouillages intelligents : tu construis des tableaux de synthèse en une formule. Bravo ! 🎉' },
  ],
}

// --- Leçon 7 : SIERREUR & les erreurs Excel ---
const SIERREUR = {
  id: 'fn-sierreur',
  titre: 'SIERREUR & les erreurs Excel',
  exercices: [EX10.ex76],
  narration: [
    { humeur: 'accueil', dit: 'Quand une formule génère une **erreur** (division par zéro, recherche infructueuse…), **SIERREUR** l\'attrape et affiche ce que tu veux à la place, pour un tableau propre.', visuel: { type: 'formule', formule: '=SIERREUR(valeur ; valeur_si_erreur)' } },
    {
      humeur: 'pensif',
      dit: 'Ses deux arguments :',
      visuel: { type: 'parties', items: [{ label: '**valeur** : ta formule normale à tester (ex. A2/B2, une RECHERCHEV…).' }, { label: '**valeur_si_erreur** : ce qui s\'affiche en cas d\'erreur (ex. "-", 0, ou "" pour vide).' }] },
    },
    {
      humeur: 'pensif',
      dit: 'Exemple : protéger une division contre le **#DIV/0!**.',
      visuel: {
        type: 'methode',
        titre: 'SIERREUR pas à pas',
        blocs: [
          { etapes: ['Sans protection, **=A2/B2** plante quand B2 vaut 0 : Excel affiche **#DIV/0!**'] },
          { capture: { type: 'tableur', cols: ['A', 'B', 'C'], rows: [1, 2, 3], cells: { A1: { t: 'V1', entete: true }, B1: { t: 'V2', entete: true }, C1: { t: '=A/B', entete: true }, A2: { t: '100' }, B2: { t: '20' }, C2: { t: '5' }, A3: { t: '30' }, B3: { t: '0' }, C3: { t: '#DIV/0!' } }, legende: 'Ligne 3 : 30 ÷ 0 impossible → #DIV/0!' } },
          { etapes: ['En D2, tape **=SIERREUR(** puis ta formule **A2/B2** et un **;**'], depart: 2 },
          { capture: { type: 'tableur', cols: ['A', 'B', 'D'], rows: [1, 2], cells: { A1: { t: 'V1', entete: true }, B1: { t: 'V2', entete: true }, D1: { t: 'Protégé', entete: true }, A2: { t: '100', ref: true }, B2: { t: '20', ref: true }, D2: { t: '=SIERREUR(A2/B2;' } }, refsCouleur: { A2: 'bleu', B2: 'ambre' }, formule: '=SIERREUR(A2/B2;', actif: 'D2' } },
          { etapes: ['Écris ce que tu veux voir en cas d\'erreur, puis ferme : **"-")**. Étire vers le bas.'], depart: 3 },
          { capture: { type: 'tableur', cols: ['A', 'B', 'D'], rows: [1, 2, 3], cells: { A1: { t: 'V1', entete: true }, B1: { t: 'V2', entete: true }, D1: { t: 'Protégé', entete: true }, A2: { t: '100' }, B2: { t: '20' }, D2: { t: '5', vert: true }, A3: { t: '30' }, B3: { t: '0' }, D3: { t: '-', vert: true } }, formule: '=SIERREUR(A2/B2;"-")', actif: 'D2', legende: 'APRÈS : quand la division marche, on voit le résultat (5) ; quand elle plante, un simple tiret « - » au lieu de #DIV/0!.' } },
        ],
      },
    },
    {
      humeur: 'pensif',
      dit: 'Pour t\'aider à diagnostiquer, voici les **erreurs Excel** les plus courantes :',
      visuel: { type: 'erreursexcel' },
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Que fait la fonction **SIERREUR** ?',
      visuel: { type: 'question', options: ['Elle supprime définitivement la formule en erreur', 'Elle renvoie une valeur de remplacement si la formule génère une erreur', 'Elle empêche toute saisie d\'erreur dans la cellule'], bonne: 1, explication: 'SIERREUR teste ta formule : si elle marche, elle renvoie le résultat normal ; si elle plante, elle affiche la valeur de remplacement que tu as choisie (« - », 0, "" …).' },
    },
    { humeur: 'fier', dit: 'Tes tableaux restent propres même quand un calcul dérape. Et voilà, ceinture bleue-marron à portée de main. Bravo ! 🎉' },
  ],
}

// ===================== CHAPITRE 11 : LES FONCTIONS DE RECHERCHE (ceinture marron) =====================
const U11 = (id) => `https://drive.google.com/file/d/${id}/view?usp=drivesdk`
const EX11 = {
  ex77: { titre: 'Exercice 77 · La recherche V', url: U11('1ImjZcJYdbLED6cFJ-uYLdgsGtdSa8Rr-') },
  ex78: { titre: 'Exercice 78 · La recherche V', url: U11('1cEVDpasec3uz9h1uI95VPW_JTW-dmJJ4') },
  ex79: { titre: 'Exercice 79 · La recherche V', url: U11('1pOTcfkh3AsDBJMMMp2stssvWj7NNkLli') },
  ex80: { titre: 'Exercice 80 · La recherche X', url: U11('1mlK1qB-GuQ7JOz9cepQl2R4ghcO0QdHJ') },
  ex81: { titre: 'Exercice 81 · La recherche X à 2 critères', url: U11('1UsDUnk-UGJ9rapkepMLemeWaPXFNR04N') },
  ex82: { titre: 'Exercice 82 · La recherche H', url: U11('1dkTbFnEUwAMPnrSIy_WfnQYAjxc-0qX6') },
}

// Les deux tableaux fil rouge du chapitre : Commandes (principal) + Stock (référentiel).
const T11_COMMANDES = {
  titre: 'Tableau 1 · feuille Commandes',
  entetes: ['Code article', 'Produit', 'Prix'],
  lignes: [
    ['A1001', 'Clavier sans fil', '24,90 €'],
    ['A1002', 'Souris ergonomique', '39,90 €'],
    ['A1003', 'Écran 24 pouces', '149,00 €'],
  ],
  cle: 0,
}
const T11_STOCK = {
  titre: 'Tableau 2 · feuille Stock',
  entetes: ['Code article', 'Quantité'],
  lignes: [
    ['A1001', '5'],
    ['A1003', '12'],
    ['A1004', '8'],
    ['A1005', '20'],
  ],
  cle: 0,
  valeur: 1,
}

// --- Leçon 1 : Rappels — références & noms au service des recherches ---
const RAPPELSRECHERCHE = {
  id: 'fn-rappelsrecherche',
  titre: 'Rappels : références & noms',
  exercices: [],
  narration: [
    { humeur: 'accueil', dit: 'Avec les fonctions de recherche, Excel devient un **véritable détective** : il parcourt tes tableaux pour retrouver la bonne information en un éclair. Avant l\'enquête, deux rappels d\'échauffement : les **références** et les **noms**.', visuel: { type: 'tableur', cols: ['A', 'B', 'C'], rows: [1, 2], cells: { A1: { t: 'Code', entete: true }, B1: { t: 'Produit', entete: true }, C1: { t: 'Prix', entete: true }, A2: { t: 'A1001' }, B2: { t: 'Clavier sans fil' }, C2: { t: '24,90 €', num: true } }, legende: 'Tout le chapitre consiste à retrouver des infos comme celle-ci, automatiquement.' }, plus: ['Avec les fonctions de recherche, Excel devient un véritable détective : il parcourt tes tableaux pour retrouver la bonne information en un éclair.', 'Dans ce chapitre, tu vas travailler la RECHERCHEV, RECHERCHEX et RECHERCHEH, comprendre comment définir tes critères, et découvrir des astuces pour croiser tes données de manière fiable et rapide.', 'Idéal pour éviter les recherches manuelles interminables et travailler comme un(e) pro, même sur de gros fichiers. C\'est parti !'] },
    {
      humeur: 'pensif',
      dit: '**Les références relatives :** quand tu copies une formule, les cellules utilisées s\'ajustent automatiquement selon la nouvelle position.',
      visuel: {
        type: 'methode',
        titre: 'Recopier une formule',
        blocs: [
          { etapes: ['En **D2**, mets **=B2*C2** pour calculer le total de ventes d\'un produit', 'Tire la **poignée** vers le bas : Excel adapte la formule automatiquement'] },
          { capture: { type: 'tableur', cols: ['B', 'C', 'D'], rows: [2, 3, 4], cells: { B2: { t: '10', num: true }, C2: { t: '24,90 €', num: true }, D2: { t: '=B2*C2', ref: true }, B3: { t: '4', num: true }, C3: { t: '39,90 €', num: true }, D3: { t: '=B3*C3', vert: true }, B4: { t: '2', num: true }, C4: { t: '149,00 €', num: true }, D4: { t: '=B4*C4', vert: true } }, legende: 'D3 devient =B3*C3, D4 devient =B4*C4 : les lignes suivent la recopie.' } },
          { note: 'Vers le **bas** : la ligne change (=B2 → =B3, =B4…). Vers la **droite** : la colonne change (=B2 → =C2, =D2…).', label: 'À retenir' },
        ],
      },
      plus: ['Quand tu copies une formule dans Excel (avec la poignée ou en copier-coller), les cellules utilisées dans la formule s\'ajustent automatiquement selon la nouvelle position. C\'est ce qu\'on appelle une référence relative.', 'Si tu copies vers le bas : les lignes changent, mais la colonne reste la même. Exemple : =B2 devient =B3, puis =B4, etc.', 'Si tu copies vers la droite : les colonnes changent, mais la ligne reste la même. Exemple : =B2 devient =C2, puis =D2, etc.'],
    },
    {
      humeur: 'pensif',
      dit: 'Un point à connaître si tes formules semblent immobiles :',
      visuel: { type: 'encart', label: 'Bon à savoir', texte: 'Si le mode de calcul d\'Excel est défini sur **manuel**, les formules ne se recalculent pas automatiquement. **La solution :** va dans **Formules > Options de calcul > Automatique**.' },
    },
    {
      humeur: 'pensif',
      dit: '**Les références absolues :** parfois, une cellule doit rester **figée**. Exemple : tu veux calculer un pourcentage basé sur la cellule G10. En H2, tu écris =G2/G10… et en recopiant vers le bas, tu obtiens =G4/G11. Excel a tout décalé !',
      visuel: { type: 'tableur', cols: ['G', 'H'], rows: [2, 3, 4], cells: { G2: { t: '12 500', num: true }, H2: { t: '=G2/G10' }, G3: { t: '9 800', num: true }, H3: { t: '=G3/G11' }, G4: { t: '7 200', num: true }, H4: { t: '=G4/G12' } }, formule: '=G4/G12', actif: 'H4', legende: 'AVANT : G10 est devenu G11 puis G12, le diviseur a glissé à chaque ligne. Ce n\'est pas ce qu\'on veut !' },
      plus: ['Une référence absolue reste fixe, même si tu copies la formule ailleurs. C\'est utile quand tu veux toujours faire référence à la même cellule, comme un taux de TVA, un seuil, ou une valeur constante.', 'Tu veux calculer un pourcentage basé sur la cellule G10. En H2 : =G2/G10. Si tu recopies vers H4, tu obtiens =G4/G11. Ce n\'est pas ce qu\'on veut ! Solution : figer G10 → =G2/$G$10.'],
    },
    {
      humeur: 'content',
      dit: '**La solution :** figer G10 avec des dollars → **=G2/$G$10**. Les $ indiquent que ni la colonne G ni la ligne 10 ne doivent changer.',
      visuel: {
        type: 'methode',
        titre: 'Figer avec F4',
        blocs: [
          { etapes: ['Dans la formule, clique sur la référence **G10**', 'Appuie sur **F4** : Excel transforme G10 en **$G$10** (Mac : **⌘ + T**, ou **Fn + F4** sur certains claviers)'] },
          { capture: { type: 'touche', touches: ['F4'], note: 'Sur Mac : ⌘ + T (ou Fn + F4). La cellule ne bougera plus, où que tu copies la formule.' } },
          { capture: { type: 'tableur', cols: ['G', 'H'], rows: [2, 3, 4], cells: { G2: { t: '12 500', num: true }, H2: { t: '=G2/$G$10' }, G3: { t: '9 800', num: true }, H3: { t: '=G3/$G$10', vert: true }, G4: { t: '7 200', num: true }, H4: { t: '=G4/$G$10', vert: true } }, legende: 'APRÈS : G2 s\'adapte à chaque ligne, $G$10 reste figé. Exactement ce qu\'on veut.' } },
        ],
      },
      plus: ['$B$1 : les $ indiquent que ni la colonne B ni la ligne 1 ne doivent changer.', 'Appuie sur la touche F4 : Excel transforme B1 en $B$1. Si F4 ne fonctionne pas, essaye FN + F4 (sur certains claviers portables).'],
    },
    { humeur: 'pensif', dit: 'Ces références seront **cruciales** au moment d\'étirer tes formules de recherche : la plage du tableau de référence devra toujours être **verrouillée en absolu** ($A$2:$B$5). Garde ce réflexe, on s\'en sert tout le chapitre.', visuel: { type: 'reffiger' } },
    {
      humeur: 'pensif',
      dit: 'Deuxième rappel : **les noms**. Plutôt que d\'écrire =A1+B1, tu peux écrire **=Prix+Quantité**. Trois méthodes pour nommer une cellule ou une plage :',
      visuel: {
        type: 'methode',
        titre: 'Méthode 1 : la zone Nom',
        blocs: [
          { etapes: ['Sélectionne la cellule ou la plage à nommer', 'Clique dans la **zone Nom** (à gauche de la barre de formule)', 'Tape le nom (respecte la syntaxe, on la voit juste après)', 'Appuie sur **Entrée**'] },
          { capture: { type: 'zonenom', nom: 'PrixHT', saisie: true, formule: '24,90', legende: 'On tape « PrixHT » dans la zone Nom, puis Entrée : la cellule s\'appelle désormais PrixHT.' } },
          { note: 'Les pièges classiques : oublier d\'appuyer sur **Entrée** après avoir tapé le nom, mettre un **espace** dans le nom, ou reprendre un mot déjà utilisé par Excel (comme SOMME).', label: 'Erreurs à éviter' },
        ],
      },
      plus: ['Utiliser un nom dans une formule rend le fichier plus lisible. Plutôt que d\'écrire =A1+B1, tu peux écrire =Prix+Quantité. Cela facilite la compréhension, surtout si d\'autres personnes utilisent ton fichier.', '1. Sélectionne la cellule ou la plage à nommer. 2. Clique dans la zone Nom (à gauche de la barre de formule). 3. Tape le nom (respecte la syntaxe). 4. Appuie sur Entrée.', 'Erreurs à éviter : oublier d\'appuyer sur [Entrée] après avoir tapé un nom. Utiliser un espace dans le nom (Prix unitaire → erreur). Nommer une cellule avec un mot déjà utilisé dans Excel (comme SOMME).'],
    },
    {
      humeur: 'pensif',
      dit: '**Méthode 2 :** par le ruban, avec la fenêtre « Nouveau nom ». Elle permet en plus de choisir si le nom vaut pour **tout le classeur** ou pour **une seule feuille**.',
      visuel: {
        type: 'methode',
        titre: 'Méthode 2 : Définir un nom',
        blocs: [
          { etapes: ['Va dans l\'onglet **Formules > groupe Noms définis**', 'Clique sur **Définir un nom**'] },
          { capture: { type: 'ruban', actif: 'Formules', groupeNom: 'Noms définis', groupes: [{ icone: '🔖', label: 'Définir un nom', actif: true }, { icone: '📋', label: 'Gestionnaire de noms' }, { icone: '⊞', label: 'Créer depuis sélection' }] } },
          { etapes: ['Renseigne le **Nom** (respecte la syntaxe)', 'Choisis la **Zone** : classeur ou feuille', 'Vérifie la plage dans **Fait référence à**', 'Valide avec **OK**'], depart: 3 },
          { capture: { type: 'definirnom', nom: 'PrixHT', zone: 'Classeur', reference: '=Stock!$B$2:$B$5', focus: 'nom' } },
        ],
      },
      plus: ['1. Va dans l\'onglet Formules > groupe Noms définis. 2. Clique sur Créer un nom ou Définir un nom. 3. Renseigne : le Nom (respecte la syntaxe), le Champ (classeur ou feuille), la Zone (la plage à laquelle ce nom s\'applique). 4. Valide avec OK.'],
    },
    {
      humeur: 'pensif',
      dit: '**Méthode 3 :** à la souris, avec le clic droit.',
      visuel: {
        type: 'menu',
        titre: 'Méthode 3 : le clic droit',
        etapes: ['Sélectionne la cellule ou la plage à nommer', 'Fais un **clic droit** sur la sélection', 'Choisis **Définir un nom** dans le menu', 'Donne un nom explicite (ex : PrixHT), vérifie la référence, puis **OK**'],
        items: [{ icone: '✂', label: 'Couper' }, { icone: '📄', label: 'Copier' }, { icone: '📋', label: 'Coller' }, '-', { icone: '🔖', label: 'Définir un nom…', actif: true }, { icone: '🔗', label: 'Lien…' }],
      },
      plus: ['1. Sélectionne la cellule ou la plage que tu veux nommer. 2. Fais un clic droit sur la sélection. 3. Choisis Définir un nom dans le menu contextuel (ou « Nommer une plage » selon ta version d\'Excel). 4. Dans la fenêtre qui s\'ouvre : donne un nom explicite (ex : PrixHT), vérifie que la référence est correcte. Clique sur OK.'],
    },
    {
      humeur: 'pensif',
      dit: '**La syntaxe des noms**, les règles à suivre :',
      visuel: { type: 'parties', items: [{ label: 'Commence par une lettre : TotalVentes ✓, 1Ventes ✗' }, { label: 'Pas d\'espace : Prix_Unitaire ✓, Prix Unitaire ✗' }, { label: 'Pas une adresse de cellule : CA_mensuel ✓, A1 ✗' }, { label: 'Longueur max : 255 caractères, c\'est suffisant !' }, { label: 'Pas de doublon dans un classeur' }] },
      plus: ['Syntaxe des noms, les règles à suivre : le nom d\'une cellule doit commencer par une lettre. Pas d\'espace. Ne pas utiliser de référence (l\'adresse d\'une cellule). Longueur max : 255 caractères, c\'est suffisant ! Pas de doublon dans un classeur.', 'Astuce pratique : utilise des noms courts mais parlants : TVA, Client, Montant. Pour un tableau complexe, crée un tableau structuré avant de nommer les plages. Tu peux gérer tous les noms via l\'onglet Formules > Gestionnaire de noms.'],
    },
    {
      humeur: 'pensif',
      dit: 'Pour **supprimer un nom** (ou vérifier tous tes noms d\'un coup), direction le **Gestionnaire de noms**.',
      visuel: {
        type: 'methode',
        titre: 'Supprimer un nom',
        blocs: [
          { etapes: ['Va dans l\'onglet **Formules > groupe Noms définis**', 'Clique sur **Gestionnaire de noms**'] },
          { capture: { type: 'ruban', actif: 'Formules', groupeNom: 'Noms définis', groupes: [{ icone: '🔖', label: 'Définir un nom' }, { icone: '📋', label: 'Gestionnaire de noms', actif: true }, { icone: '⊞', label: 'Créer depuis sélection' }] } },
          { etapes: ['La fenêtre affiche **tous les noms du classeur**', 'Sélectionne le nom à supprimer', 'Clique sur **Supprimer**, puis confirme si une alerte s\'affiche'], depart: 3 },
          { capture: { type: 'gestionnairenoms', noms: [{ nom: 'PrixHT', ref: '=Stock!$B$2:$B$5', etendue: 'Classeur' }, { nom: 'Ancien_Tarif', ref: '=Stock!$D$2:$D$5', etendue: 'Classeur' }], selection: 1, focus: 'supprimer' } },
          { note: 'Si une formule utilise ce nom, elle renverra **#NOM ?** après la suppression. Vérifie que le nom n\'est plus utilisé avant de le supprimer.', label: 'Attention' },
        ],
      },
      plus: ['1. Va dans l\'onglet Formules > groupe Noms définis. 2. Clique sur Gestionnaire de noms. 3. Une fenêtre s\'ouvre : elle affiche tous les noms du classeur. 4. Sélectionne le nom que tu veux supprimer. 5. Clique sur le bouton Supprimer. 6. Confirme si une alerte s\'affiche.', 'Si une formule utilise ce nom, elle renverra une erreur (#NOM ?) après suppression. Vérifie que le nom n\'est plus utilisé avant de le supprimer.'],
    },
    {
      humeur: 'pensif',
      dit: 'Et pour **réutiliser** un nom au quotidien : naviguer, coller dans une formule, ou taper ses premières lettres.',
      visuel: {
        type: 'methode',
        titre: 'Réutiliser un nom',
        blocs: [
          { etapes: ['**Naviguer :** clique la flèche de la **zone Nom**, choisis le nom, Excel t\'emmène directement à la plage'] },
          { capture: { type: 'zonenom', nom: 'PrixHT', fleche: true, liste: ['PrixHT', 'Quantites', 'Table_Stock'], legende: 'La flèche ouvre la liste de tous tes noms : un clic et Excel t\'y conduit.' } },
          { etapes: ['**Dans une formule :** tape **=**, appuie sur **F3**, la boîte « Coller un nom » s\'affiche, choisis le nom puis **OK**'], depart: 2 },
          { capture: { type: 'listedialog', titre: 'Coller un nom', intro: 'Nom collé :', items: ['PrixHT', 'Quantites', 'Table_Stock'], selection: 0 } },
          { etapes: ['**Encore plus rapide :** tape = puis les **premières lettres** du nom (ex : =P), Excel propose fonctions + noms, double-clique sur le nom voulu'], depart: 3 },
          { note: 'Tes noms personnalisés apparaissent dans la liste juste après les fonctions Excel. Tu les reconnais facilement, surtout s\'ils sont bien nommés !', label: 'À savoir' },
        ],
      },
      plus: ['Les noms te permettent d\'atteindre rapidement une cellule ou une plage de cellules. 1. Clique sur la flèche de la zone Nom (à gauche de la barre de formule). 2. Choisis le nom dans la liste déroulante. 3. Excel te conduit automatiquement à la cellule ou la plage correspondante.', 'Méthode 1 avec le raccourci [F3] : 1. Tape = pour commencer une formule. 2. Appuie sur la touche [F3]. 3. Une boîte « Coller un nom » s\'affiche. 4. Clique sur le nom voulu > clique sur OK.', 'Méthode 2 en tapant les premières lettres : 1. Tape = puis les premières lettres du nom (ex : =C). 2. Excel affiche une liste de propositions (fonctions + noms). 3. Double-clique sur le nom souhaité.'],
    },
    {
      humeur: 'pensif',
      dit: 'Dernier réflexe : Excel peut créer des noms **tout seul** à partir des titres de ton tableau.',
      visuel: {
        type: 'methode',
        titre: 'Créer des noms depuis les étiquettes',
        blocs: [
          { etapes: ['Sélectionne **tout le tableau**, y compris les titres de colonnes ou de lignes', 'Va dans **Formules > Noms définis**', 'Clique sur **Créer à partir de la sélection**'] },
          { capture: { type: 'ruban', actif: 'Formules', groupeNom: 'Noms définis', groupes: [{ icone: '🔖', label: 'Définir un nom' }, { icone: '📋', label: 'Gestionnaire de noms' }, { icone: '⊞', label: 'Créer depuis sélection', actif: true }] } },
          { etapes: ['Coche **Ligne du haut** si les titres sont en haut (ou **Colonne de gauche** s\'ils sont à gauche)', 'Clique sur **OK**'], depart: 4 },
          { capture: { type: 'listedialog', titre: 'Créer des noms à partir de la sélection', intro: 'Créer les noms à partir des valeurs de :', cases: [{ label: 'Ligne du haut', coche: true }, { label: 'Colonne de gauche', coche: false }, { label: 'Ligne du bas', coche: false }, { label: 'Colonne de droite', coche: false }] } },
        ],
      },
      plus: ['Lorsque tu travailles avec un tableau bien structuré, Excel peut automatiquement créer des noms en se basant sur les titres de colonnes ou de lignes. C\'est rapide, clair, et très pratique !', '1. Sélectionne l\'ensemble du tableau, y compris les titres de colonnes ou de lignes. 2. Va dans l\'onglet Formules > groupe Noms définis. 3. Clique sur le bouton Créer à partir de la sélection. 4. Une boîte de dialogue s\'ouvre : coche la case Ligne du haut si les titres sont en haut, ou Colonne de gauche si les titres sont à gauche. 5. Puis clique sur OK.'],
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Lequel de ces noms de plage est **valide** ?',
      visuel: { type: 'question', options: ['Prix Unitaire', '1Ventes', 'CA_mensuel', 'A1'], bonne: 2, explication: 'CA_mensuel commence par une lettre et remplace l\'espace par un underscore. « Prix Unitaire » contient un espace, « 1Ventes » commence par un chiffre, et « A1 » est déjà une adresse de cellule.' },
    },
    { humeur: 'fier', dit: 'Références verrouillées, noms maîtrisés : ton matériel de détective est prêt. Place à la **RECHERCHEV** ! 🎉' },
  ],
}

// --- Leçon 2 : La RECHERCHEV ---
const RECHERCHEV = {
  id: 'fn-recherchev',
  titre: 'La RECHERCHEV',
  exercices: [EX11.ex77, EX11.ex78, EX11.ex79],
  narration: [
    { humeur: 'accueil', dit: 'La fonction **RECHERCHEV** (Recherche **V**erticale) cherche une **valeur-clé** dans la **première colonne** d\'un tableau, puis renvoie une donnée située **sur la même ligne**, à partir d\'un numéro de colonne donné. Sa syntaxe :', visuel: { type: 'formule', formule: '=RECHERCHEV(valeur_cherchée; table_matrice; no_index_colonne; [valeur_proche])' }, plus: ['La fonction RECHERCHEV (Recherche verticale) permet de chercher une valeur-clé dans la première colonne d\'un tableau, puis de renvoyer une donnée située dans la même ligne, à partir d\'un numéro de colonne donné.'] },
    {
      humeur: 'pensif',
      dit: '**Ses 4 arguments**, un par un :',
      visuel: { type: 'parties', items: [{ label: 'valeur_cherchée : la donnée clé commune aux 2 tableaux (ex. un code article)' }, { label: 'table_matrice : la plage contenant à la fois la clé ET les valeurs à récupérer' }, { label: 'no_index_colonne : le numéro de la colonne où se trouve la donnée à renvoyer (1 = clé, 2 = 1ʳᵉ valeur associée…)' }, { label: '[valeur_proche] : facultatif. VRAI ou omis = recherche approximative ; FAUX = correspondance exacte' }] },
      plus: ['Valeur_cherchée : la donnée clé commune aux 2 tableaux (ex. un code article).', 'Table_matrice : la plage de cellules contenant à la fois la clé et les valeurs à récupérer.', 'No_index_colonne : le numéro de la colonne dans table_matrice où se trouve la donnée à renvoyer (1 = clé, 2 = 1ᵉ valeur associée, etc.)', 'Valeur_proche : (facultatif) VRAI ou omis pour une recherche approximative ; FAUX pour une correspondance exacte.'],
    },
    {
      humeur: 'pensif',
      dit: 'Voici la situation type : **deux tableaux** qui partagent la même clé (le Code article). Je veux rapatrier la colonne **Quantité** du deuxième tableau dans le premier.',
      visuel: { type: 'deuxtableaux', t1: T11_COMMANDES, t2: T11_STOCK, legende: 'La clé commune (Code article) fait le pont entre les deux tableaux.' },
      plus: ['Voici deux tableaux partageant la même clé (Code article) ; leurs autres colonnes diffèrent. Pour rapatrier la colonne « Quantité » du deuxième tableau dans le premier, j\'utilise la fonction RECHERCHEV.'],
    },
    {
      humeur: 'pensif',
      dit: '**Les conditions d\'utilisation.** À toi de les découvrir : pour retrouver la Quantité à partir du Code article, lequel de ces deux tableaux peut servir de **table_matrice** ?',
      visuel: {
        type: 'choixtableau',
        options: [
          { titre: 'Tableau A', tableau: { entetes: ['Code article', 'Quantité'], lignes: [['A1001', '5'], ['A1003', '12'], ['A1004', '8']] } },
          { titre: 'Tableau B', tableau: { entetes: ['Quantité', 'Code article'], lignes: [['5', 'A1001'], ['12', 'A1003'], ['8', 'A1004']] } },
        ],
        bonne: 0,
        explication: 'Pour RECHERCHEV, la colonne de la clé (Code article) doit être la PREMIÈRE à gauche de la plage, et la valeur à extraire doit se trouver à sa droite. Dans le tableau B, la Quantité est à gauche de la clé : RECHERCHEV ne pourrait pas la récupérer.',
      },
      plus: ['1. Clé unique et commune : les deux tableaux doivent partager une colonne ou une ligne où chaque valeur n\'apparaît qu\'une seule fois (par exemple un « Code article » ou un « Matricule »).', '2. Position de la clé : pour RECHERCHEV, la colonne contenant la clé de recherche doit être la première à gauche du tableau cible.'],
    },
    {
      humeur: 'content',
      dit: 'Deux règles à retenir donc : **une clé unique et commune** aux deux tableaux, et **la clé en première colonne** de la table_matrice. Maintenant, la méthode complète, argument par argument.',
      visuel: { type: 'parties', items: [{ label: '1. Clé unique et commune : chaque code n\'apparaît qu\'une seule fois dans le référentiel' }, { label: '2. Position de la clé : la colonne clé doit être la première à gauche du tableau cible' }] },
    },
    {
      humeur: 'pensif',
      dit: '**On prépare le terrain.** Ouvre les deux tableaux, repère la clé commune, et ajoute la colonne qui va accueillir les données.',
      visuel: {
        type: 'methode',
        titre: 'Étapes 1 à 4 : préparer',
        blocs: [
          { etapes: ['**Ouvre** les deux tableaux', '**Identifie la clé commune :** repère la colonne « Code article » dans chaque tableau, et assure-toi que chaque code est **unique** dans le référentiel', 'Ajoute une colonne **Quantité** dans ton tableau principal', 'Sélectionne la cellule où le résultat doit apparaître : **D2**'] },
          { capture: { type: 'tableur', feuilles: ['Commandes', 'Stock'], feuilleActive: 'Commandes', cols: ['A', 'B', 'C', 'D'], rows: [1, 2, 3, 4], cells: { A1: { t: 'Code article', entete: true }, B1: { t: 'Produit', entete: true }, C1: { t: 'Prix', entete: true }, D1: { t: 'Quantité', entete: true }, A2: { t: 'A1001' }, B2: { t: 'Clavier sans fil' }, C2: { t: '24,90 €', num: true }, D2: { t: '' }, A3: { t: 'A1002' }, B3: { t: 'Souris ergonomique' }, C3: { t: '39,90 €', num: true }, A4: { t: 'A1003' }, B4: { t: 'Écran 24 pouces' }, C4: { t: '149,00 €', num: true } }, actif: 'D2', legende: 'La colonne D « Quantité » est prête, le curseur est en D2.' } },
        ],
      },
      plus: ['1. Ouvrir les deux tableaux. 2. Identifier la clé commune : repère la colonne « Code article » dans chaque tableau. Assure-toi que chaque code est unique dans le référentiel. 3. Ajoute une colonne dans ton tableau principal pour y importer les données issues du second tableau. 4. Sélectionne la cellule où le résultat doit apparaître (D2).'],
    },
    {
      humeur: 'pensif',
      dit: '**Étape 5 :** tape **=RECHERCHEV(** pour ouvrir la fonction.',
      visuel: { type: 'tableur', feuilles: ['Commandes', 'Stock'], feuilleActive: 'Commandes', cols: ['A', 'B', 'C', 'D'], rows: [1, 2], cells: { A1: { t: 'Code article', entete: true }, B1: { t: 'Produit', entete: true }, C1: { t: 'Prix', entete: true }, D1: { t: 'Quantité', entete: true }, A2: { t: 'A1001' }, B2: { t: 'Clavier sans fil' }, C2: { t: '24,90 €', num: true }, D2: { t: '=RECHERCHEV(' } }, formule: '=RECHERCHEV(', actif: 'D2' },
      plus: ['5. Tape =RECHERCHEV(.'],
    },
    {
      humeur: 'pensif',
      dit: '**Étapes 6 et 7 :** clique sur la cellule du code article, **A2**. C\'est ta **valeur_cherchée**, et elle doit se trouver **sur la même ligne** que ta formule. Puis verrouille l\'argument avec un **point-virgule**.',
      visuel: { type: 'tableur', feuilles: ['Commandes', 'Stock'], feuilleActive: 'Commandes', cols: ['A', 'B', 'C', 'D'], rows: [1, 2], cells: { A1: { t: 'Code article', entete: true }, B1: { t: 'Produit', entete: true }, C1: { t: 'Prix', entete: true }, D1: { t: 'Quantité', entete: true }, A2: { t: 'A1001', ref: true }, B2: { t: 'Clavier sans fil' }, C2: { t: '24,90 €', num: true }, D2: { t: '=RECHERCHEV(A2;' } }, formule: '=RECHERCHEV(A2;', actif: 'D2', refsCouleur: { A2: 'bleu' }, legende: 'A2 (la clé de cette ligne) s\'affiche en bleu dans la formule.' },
      plus: ['6. Clique sur la cellule du code article (A2). C\'est ta valeur_cherchée et elle doit se trouver sur la même ligne où tu vas entrer la formule RECHERCHEV. 7. Verrouille l\'argument avec un point-virgule.'],
    },
    {
      humeur: 'pensif',
      dit: '**Étape 8 :** direction le deuxième tableau ! Sur la feuille **Stock**, sélectionne la plage qui inclut la **colonne de la clé** ET la **colonne de la valeur** à rapatrier : A2:B5.',
      visuel: { type: 'tableur', feuilles: ['Commandes', 'Stock'], feuilleActive: 'Stock', cols: ['A', 'B'], rows: [1, 2, 3, 4, 5], cells: { A1: { t: 'Code article', entete: true }, B1: { t: 'Quantité', entete: true }, A2: { t: 'A1001', sel: true }, B2: { t: '5', num: true, sel: true }, A3: { t: 'A1003', sel: true }, B3: { t: '12', num: true, sel: true }, A4: { t: 'A1004', sel: true }, B4: { t: '8', num: true, sel: true }, A5: { t: 'A1005', sel: true }, B5: { t: '20', num: true, sel: true } }, formule: '=RECHERCHEV(A2;Stock!A2:B5', actif: 'D2', legende: 'On est passé sur la feuille Stock : la plage A2:B5 est sélectionnée, clé en premier.' },
      plus: ['8. Dans le deuxième tableau, sélectionne la plage incluant la colonne de la clé commune (Code article) ainsi que la colonne contenant la valeur à rapatrier.', 'N\'oublie pas : commence toujours par sélectionner la colonne de la clé commune, et assure-toi que la colonne contenant la valeur à rapatrier se trouve obligatoirement à droite de cette clé.'],
    },
    {
      humeur: 'pensif',
      dit: 'Tu remarques le **Stock!** devant la plage ? Quand ta table_matrice se trouve sur un **autre onglet**, Excel préfixe la référence par le nom de cet onglet suivi d\'un **point d\'exclamation**.',
      visuel: { type: 'encart', label: 'Bon à savoir', texte: '**Stock!A2:B5** signifie « regarde la plage A2:B5 sur l\'onglet Stock ». Sans ce préfixe, Excel chercherait A2:B5 dans l\'onglet où tu es, et le résultat ne correspondrait pas.' },
      plus: ['Lorsque ta plage de recherche (table_matrice) se trouve sur un autre onglet que le tableau principal, Excel préfixe la référence par le nom de cet onglet, suivi d\'un point d\'exclamation : Feuil2!B1:C6 ← table_matrice située sur l\'onglet « Feuil2 ». Feuil2! indique donc « regarde sur l\'onglet Feuil2 ». Sans ce préfixe, Excel chercherait B1:C6 dans l\'onglet où tu es, et renverrait une erreur si la plage n\'existe pas.'],
    },
    {
      humeur: 'pensif',
      dit: '**Étapes 9 à 12 :** ajoute un **point-virgule** pour valider la matrice. Puis **compte les colonnes** depuis la clé jusqu\'à la valeur à extraire : Code article = colonne **1**, Quantité = colonne **2**. Place ce **2** dans la formule, puis un point-virgule.',
      visuel: { type: 'tableur', feuilles: ['Commandes', 'Stock'], feuilleActive: 'Stock', cols: ['A', 'B'], rows: [1, 2, 3], cells: { A1: { t: 'Code article ①', entete: true }, B1: { t: 'Quantité ②', entete: true }, A2: { t: 'A1001' }, B2: { t: '5', num: true }, A3: { t: 'A1003' }, B3: { t: '12', num: true } }, formule: '=RECHERCHEV(A2;Stock!A2:B5;2;', actif: 'D2', legende: 'On compte : ① la clé, ② la Quantité. Le no_index_colonne est donc 2.' },
      plus: ['9. Ajoute un point-virgule pour valider la matrice. 10. Compte les colonnes depuis la sélection jusqu\'à la colonne portant la valeur à extraire : ici, on compte 2 colonnes. 11. Place le numéro de colonne correspondant dans l\'argument de ta fonction c\'est-à-dire 2. 12. Insère un point-virgule pour verrouiller l\'argument.'],
    },
    {
      humeur: 'pensif',
      dit: '**Étapes 13 à 15 :** tape **FAUX** pour une correspondance **exacte**, ferme la **parenthèse**, et appuie sur **Entrée**.',
      visuel: { type: 'tableur', feuilles: ['Commandes', 'Stock'], feuilleActive: 'Commandes', cols: ['A', 'B', 'C', 'D'], rows: [1, 2], cells: { A1: { t: 'Code article', entete: true }, B1: { t: 'Produit', entete: true }, C1: { t: 'Prix', entete: true }, D1: { t: 'Quantité', entete: true }, A2: { t: 'A1001', ref: true }, B2: { t: 'Clavier sans fil' }, C2: { t: '24,90 €', num: true }, D2: { t: '=RECHERCHEV(A2;Stock!A2:B5;2;FAUX)' } }, formule: '=RECHERCHEV(A2;Stock!A2:B5;2;FAUX)', actif: 'D2', refsCouleur: { A2: 'bleu' }, legende: 'Tu peux aussi remplacer FAUX par 0 : même effet, correspondance exacte.' },
      plus: ['13. Tape « FAUX » pour une correspondance exacte. Tu peux aussi remplacer FAUX par 0 pour obtenir une correspondance exacte. 14. Ferme la parenthèse. 15. Tape sur ENTREE pour valider la formule.'],
    },
    {
      humeur: 'content',
      dit: '**Étapes 16 et 17 :** te voilà automatiquement de retour sur le tableau principal. Vérifie que la cellule affiche bien la donnée attendue : **5**, la quantité du code A1001. La clé a fait le pont !',
      visuel: { type: 'tableur', feuilles: ['Commandes', 'Stock'], feuilleActive: 'Commandes', cols: ['A', 'B', 'C', 'D'], rows: [1, 2], cells: { A1: { t: 'Code article', entete: true }, B1: { t: 'Produit', entete: true }, C1: { t: 'Prix', entete: true }, D1: { t: 'Quantité', entete: true }, A2: { t: 'A1001' }, B2: { t: 'Clavier sans fil' }, C2: { t: '24,90 €', num: true }, D2: { t: '5', vert: true, num: true } }, formule: '=RECHERCHEV(A2;Stock!A2:B5;2;FAUX)', actif: 'D2', legende: 'D2 affiche 5 : la quantité du clavier, rapatriée depuis la feuille Stock.' },
      plus: ['16. Tu es automatiquement renvoyé vers le tableau principal. 17. Vérifie que la cellule affiche bien la donnée attendue (par ex. « 5 »).'],
    },
    {
      humeur: 'pensif',
      dit: '**Étapes 18 et 19 :** avant d\'étirer, **fige la plage** du second tableau en références absolues avec des **$** (F4, ou **⌘ + T** sur Mac). Puis étire la formule vers le bas.',
      visuel: { type: 'tableur', feuilles: ['Commandes', 'Stock'], feuilleActive: 'Commandes', cols: ['A', 'B', 'C', 'D'], rows: [1, 2, 3, 4], cells: { A1: { t: 'Code article', entete: true }, B1: { t: 'Produit', entete: true }, C1: { t: 'Prix', entete: true }, D1: { t: 'Quantité', entete: true }, A2: { t: 'A1001' }, B2: { t: 'Clavier sans fil' }, C2: { t: '24,90 €', num: true }, D2: { t: '5', vert: true, num: true }, A3: { t: 'A1002' }, B3: { t: 'Souris ergonomique' }, C3: { t: '39,90 €', num: true }, D3: { t: '#N/A', rouge: true }, A4: { t: 'A1003' }, B4: { t: 'Écran 24 pouces' }, C4: { t: '149,00 €', num: true }, D4: { t: '12', vert: true, num: true } }, formule: '=RECHERCHEV(A2;Stock!$A$2:$B$5;2;FAUX)', actif: 'D2', legende: 'Grâce aux $, la plage Stock!$A$2:$B$5 reste figée sur toutes les lignes. Mais que se passe-t-il en D3 ?' },
      plus: ['18. Avant d\'étirer la formule, convertis la plage du second tableau en références absolues c\'est-à-dire fixe la plage du deuxième tableau en utilisant $ pour bloquer les cellules afin de préserver l\'exactitude des données. 19. Étire la formule.'],
    },
    {
      humeur: 'pensif',
      dit: '**#N/A en D3 ?** Bien vu. La valeur d\'erreur **#N/A** apparaît quand une valeur n\'est **pas disponible** : le code A1002 n\'existe pas dans la feuille Stock, et en correspondance exacte, RECHERCHEV le signale. **Comment corriger ?**',
      visuel: { type: 'parties', items: [{ label: '1. Vérifie que le code figure bien dans la colonne clé du second tableau' }, { label: '2. Ajuste ta plage pour exclure l\'en-tête si besoin (Stock!$A$2:$B$5)' }, { label: '3. Si certaines références peuvent manquer : enveloppe dans SIERREUR(… ; "Non trouvé") pour un affichage plus propre' }] },
      plus: ['Pour la ligne 3, A3 = « A1002 ». Comme « A1002 » n\'existe pas dans la plage de recherche, RECHERCHEV, en mode correspondance exacte (0), renvoie #N/A.', 'La valeur d\'erreur #N/A apparaît lorsque une valeur n\'est pas disponible pour une fonction ou une formule.', 'Comment corriger ? 1. Vérifie que « A1002 » figure bien dans la colonne clé du second tableau. 2. Ajuste ta plage pour exclure l\'en-tête si besoin. 3. Si certaines références peuvent manquer, enveloppe dans un SIERREUR(…; "Non trouvé") pour un affichage plus propre.'],
    },
    {
      humeur: 'pensif',
      dit: '**La RECHERCHEV, à retenir :**',
      visuel: { type: 'parties', items: [{ label: 'Clé en première colonne : la valeur-clé doit être la plus à gauche de ta plage' }, { label: 'Index de colonne : le numéro de la colonne (à droite de la clé) à renvoyer' }, { label: 'Références absolues : fige la plage ($A$2:$C$10) avant de recopier' }, { label: 'Correspondance exacte : FAUX ou 0 pour une égalité stricte' }, { label: 'Gestion des erreurs : SIERREUR(… ; "Texte") pour remplacer les #N/A' }] },
      plus: ['Clé en première colonne : la colonne contenant la valeur-clé doit être la plus à gauche de ta plage (table_matrice).', 'Index de colonne : tu indiques le numéro de la colonne (à droite de la clé) à renvoyer ; si la donnée est à gauche, RECHERCHEV ne peut pas la récupérer.', 'Références absolues : fige la plage ($A$2:$C$10) avant de recopier la formule pour éviter les décalages.', 'Correspondance exacte : utilise FAUX ou 0 pour une égalité stricte (sinon Excel fait une recherche approchée sur un tableau trié).', 'Gestion des erreurs : enveloppe dans SIERREUR(...;"Texte") pour remplacer les #N/A par un message plus lisible.'],
    },
    {
      humeur: 'pensif',
      dit: 'Une croyance à vérifier. **Vrai ou faux ?**',
      visuel: { type: 'vraifaux', affirmation: 'RECHERCHEV peut renvoyer une valeur située à GAUCHE de la colonne clé.', bonne: false, explication: 'RECHERCHEV cherche toujours la clé dans la PREMIÈRE colonne de la plage et ne renvoie que des colonnes situées à sa DROITE. C\'est sa grande limite.' },
    },
    {
      humeur: 'pensif',
      dit: 'C\'est **la limite** de la RECHERCHEV : elle ne peut pas « regarder à gauche ». Si ta donnée se trouve à gauche de la clé, deux solutions :',
      visuel: { type: 'parties', items: [{ label: 'Repositionner les colonnes : déplace la colonne cible à droite de la clé (simple, mais modifie la structure du tableau)' }, { label: 'Basculer vers la RECHERCHEX : elle cherche dans les deux sens, sans toucher à la structure (leçon suivante !)' }] },
      plus: ['La RECHERCHEV ne peut pas « regarder à gauche » : elle cherche toujours la clé dans la première colonne de la table et ne renvoie qu\'une colonne à droite de cette clé.', 'Le problème : si tu cherches à extraire la Quantité alors que ta clé commune (Code article) est en colonne B et que la Quantité se trouve en colonne A, une formule du type =RECHERCHEV(B2; A2:C6; 1; FAUX) échouera ou renverra la clé elle-même, mais jamais la valeur de Quantité située à gauche.', 'Les solutions possibles : repositionner les colonnes (simple : déplace la colonne cible pour qu\'elle soit à droite de la colonne clé, puis applique RECHERCHEV normalement ; inconvénient : modifie la structure de ton tableau) ou basculer vers la RECHERCHEX.'],
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Dans =RECHERCHEV(A2;Stock!$A$2:$B$5;**2**;FAUX), que désigne le **2** ?',
      visuel: { type: 'question', options: ['Le numéro de la colonne à renvoyer dans la plage (ici, la Quantité)', 'Le nombre de résultats à afficher', 'La ligne où chercher la clé'], bonne: 0, explication: 'C\'est le no_index_colonne : colonne 1 = la clé (Code article), colonne 2 = la Quantité. Excel renvoie la valeur de la 2ᵉ colonne de la plage, sur la ligne où il a trouvé la clé.' },
    },
    { humeur: 'fier', dit: 'Tu sais croiser deux tableaux avec la RECHERCHEV, gérer les #N/A et verrouiller tes plages. Le détective est en piste ! 🎉' },
  ],
}

// --- Leçon 3 : La RECHERCHEX ---
const RECHERCHEX = {
  id: 'fn-recherchex',
  titre: 'La RECHERCHEX',
  exercices: [EX11.ex80],
  narration: [
    { humeur: 'accueil', dit: 'La **RECHERCHEX** révolutionne la RECHERCHEV avec une approche ultra-flexible : tu peux chercher dans n\'importe quelle colonne ou ligne… **même vers la gauche** ! La correspondance **exacte** est activée d\'office. Et elle intègre directement ton message « Non trouvé », sans SIERREUR.', visuel: { type: 'formule', formule: '=RECHERCHEX(valeur_cherchée; plage_recherche; plage_retour; [si_non_trouvé]; [mode_correspondance]; [mode_recherche])' }, plus: ['La RECHERCHEX révolutionne RECHERCHEV avec une approche ultra-flexible et simple : tu peux chercher dans n\'importe quelle colonne ou ligne… même vers la gauche ! La correspondance exacte est activée d\'office, fini les faux-positifs. Intègre directement ton message « Non trouvé » si la clé manque, sans recourir à la formule SIERREUR !'] },
    {
      humeur: 'pensif',
      dit: '**Ses 6 arguments** (les 3 premiers suffisent souvent) :',
      visuel: { type: 'parties', items: [{ label: 'valeur_cherchée : la valeur ou référence à rechercher (ex. B2)' }, { label: 'plage_recherche : la colonne ou la ligne où Excel doit chercher cette valeur' }, { label: 'plage_retour : la colonne ou la ligne contenant la donnée à renvoyer' }, { label: '[si_non_trouvé] : texte ou valeur renvoyée si la clé n\'est pas trouvée (ex. "Non trouvé")' }, { label: '[mode_correspondance] : 0 pour correspondance exacte, 1 pour valeur approchée' }, { label: '[mode_recherche] : 1 pour chercher du début vers la fin, -1 de la fin vers le début' }] },
      plus: ['Valeur_cherchée : la valeur ou référence à rechercher (ex. B2).', 'Plage_recherche : la colonne ou la ligne où Excel doit chercher cette valeur (ex. Réf!$A$2:$A$6).', 'Plage_retour : la colonne ou la ligne contenant la donnée à renvoyer (ex. Réf!$C$2:$C$6).', '[si_non_trouvé] : texte ou valeur renvoyée si la clé n\'est pas trouvée (ex. "Non trouvé").', '[mode_correspondance] : 0 pour correspondance exacte, 1 pour valeur approchée.', '[mode_recherche] : 1 pour rechercher du début vers la fin, -1 du fin vers le début.'],
    },
    {
      humeur: 'pensif',
      dit: '**Les conditions d\'utilisation :** la clé doit toujours être **unique et commune**. Mais contrairement à la RECHERCHEV, **aucune contrainte de position** : tu choisis chaque plage indépendamment, sans compter les colonnes, à gauche comme à droite.',
      visuel: { type: 'deuxtableaux', t1: T11_COMMANDES, t2: T11_STOCK, legende: 'Mêmes tableaux : cette fois je sélectionne SÉPARÉMENT la colonne clé et la colonne Quantité.' },
      plus: ['1. Clé unique et commune : comme pour RECHERCHEV, la valeur_cherchée doit être une clé unique et non dupliquée dans la plage de recherche (Ex. : un code article, un matricule ou un identifiant client).', '2. Pas de contrainte sur la position relative : contrairement à la RECHERCHEV, tu choisis chaque plage indépendamment : pas besoin de compter la position relative des colonnes. Tu peux extraire des données situées à gauche ou à droite de la clé.', 'Bien qu\'elle améliore grandement la souplesse de la RECHERCHEV, la RECHERCHEX repose toujours sur quelques règles fondamentales.'],
    },
    {
      humeur: 'pensif',
      dit: '**On démarre pareil :** deux tableaux ouverts, clé repérée, colonne Quantité ajoutée, cellule D2 sélectionnée. Puis tape **=RECHERCHEX(**.',
      visuel: { type: 'tableur', feuilles: ['Commandes', 'Stock'], feuilleActive: 'Commandes', cols: ['A', 'B', 'C', 'D'], rows: [1, 2], cells: { A1: { t: 'Code article', entete: true }, B1: { t: 'Produit', entete: true }, C1: { t: 'Prix', entete: true }, D1: { t: 'Quantité', entete: true }, A2: { t: 'A1001' }, B2: { t: 'Clavier sans fil' }, C2: { t: '24,90 €', num: true }, D2: { t: '=RECHERCHEX(' } }, formule: '=RECHERCHEX(', actif: 'D2' },
      plus: ['1. Ouvrir les deux tableaux. 2. Identifier la clé commune : repère la colonne « Code article » dans chaque tableau. Assure-toi que chaque code est unique dans le référentiel. 3. Ajoute une colonne dans ton tableau principal pour y importer les données issues du second tableau. 4. Sélectionne la cellule où le résultat doit apparaître (D2). 5. Tape =RECHERCHEX(.'],
    },
    {
      humeur: 'pensif',
      dit: '**La valeur cherchée :** clique sur **A2** (comme pour la RECHERCHEV, elle doit être sur la même ligne que ta formule), puis verrouille avec un **point-virgule**.',
      visuel: { type: 'tableur', feuilles: ['Commandes', 'Stock'], feuilleActive: 'Commandes', cols: ['A', 'B', 'C', 'D'], rows: [1, 2], cells: { A1: { t: 'Code article', entete: true }, B1: { t: 'Produit', entete: true }, C1: { t: 'Prix', entete: true }, D1: { t: 'Quantité', entete: true }, A2: { t: 'A1001', ref: true }, B2: { t: 'Clavier sans fil' }, C2: { t: '24,90 €', num: true }, D2: { t: '=RECHERCHEX(A2;' } }, formule: '=RECHERCHEX(A2;', actif: 'D2', refsCouleur: { A2: 'bleu' } },
      plus: ['6. Clique sur la cellule du code article (A2). Comme pour la rechercheV, c\'est ta valeur_cherchée et elle doit se trouver sur la même ligne où tu vas entrer la formule RECHERCHEX. 7. Verrouille l\'argument avec un point-virgule.'],
    },
    {
      humeur: 'pensif',
      dit: '**La plage de recherche :** sur la feuille Stock, sélectionne **uniquement la colonne de la clé** (A2:A5), puis ajoute un **point-virgule**.',
      visuel: { type: 'tableur', feuilles: ['Commandes', 'Stock'], feuilleActive: 'Stock', cols: ['A', 'B'], rows: [1, 2, 3, 4, 5], cells: { A1: { t: 'Code article', entete: true }, B1: { t: 'Quantité', entete: true }, A2: { t: 'A1001', sel: true }, B2: { t: '5', num: true }, A3: { t: 'A1003', sel: true }, B3: { t: '12', num: true }, A4: { t: 'A1004', sel: true }, B4: { t: '8', num: true }, A5: { t: 'A1005', sel: true }, B5: { t: '20', num: true } }, formule: '=RECHERCHEX(A2;Stock!A2:A5;', actif: 'D2', legende: 'Seule la colonne clé est sélectionnée : c\'est la plage_recherche.' },
      plus: ['8. Dans le deuxième tableau, sélectionne d\'abord la colonne de la clé commune (Code article), puis séparément la colonne contenant la Quantité à rapatrier.', '9. Après avoir sélectionné la première colonne (clé commune), ajoute un point-virgule (;).'],
    },
    {
      humeur: 'pensif',
      dit: '**La plage de retour :** sélectionne maintenant, **séparément**, la colonne d\'où tu veux extraire la donnée (B2:B5). Les deux plages n\'ont pas besoin d\'être côte à côte !',
      visuel: { type: 'tableur', feuilles: ['Commandes', 'Stock'], feuilleActive: 'Stock', cols: ['A', 'B'], rows: [1, 2, 3, 4, 5], cells: { A1: { t: 'Code article', entete: true }, B1: { t: 'Quantité', entete: true }, A2: { t: 'A1001' }, B2: { t: '5', num: true, sel: true }, A3: { t: 'A1003' }, B3: { t: '12', num: true, sel: true }, A4: { t: 'A1004' }, B4: { t: '8', num: true, sel: true }, A5: { t: 'A1005' }, B5: { t: '20', num: true, sel: true } }, formule: '=RECHERCHEX(A2;Stock!A2:A5;Stock!B2:B5', actif: 'D2', legende: 'La colonne Quantité est la plage_retour : c\'est elle qu\'Excel renverra.' },
      plus: ['10. Sélectionne ensuite la colonne d\'où tu veux extraire la donnée.', 'N\'oublie pas : commence toujours par sélectionner la colonne de la clé commune. Avec la RECHERCHEX, tu choisis chaque plage indépendamment : la colonne de recherche et la colonne de retour n\'ont pas à être côte à côte.'],
    },
    {
      humeur: 'pensif',
      dit: '**Le filet de sécurité :** point-virgule, puis écris directement entre guillemets le message à afficher si la clé est absente : **"Non trouvé"**. Plus besoin de FAUX ni de SIERREUR ! Ferme la parenthèse et appuie sur **Entrée**.',
      visuel: { type: 'tableur', feuilles: ['Commandes', 'Stock'], feuilleActive: 'Commandes', cols: ['A', 'B', 'C', 'D'], rows: [1, 2], cells: { A1: { t: 'Code article', entete: true }, B1: { t: 'Produit', entete: true }, C1: { t: 'Prix', entete: true }, D1: { t: 'Quantité', entete: true }, A2: { t: 'A1001', ref: true }, B2: { t: 'Clavier sans fil' }, C2: { t: '24,90 €', num: true }, D2: { t: '=RECHERCHEX(A2;Stock!A2:A5;Stock!B2:B5;"Non trouvé")' } }, formule: '=RECHERCHEX(A2;Stock!A2:A5;Stock!B2:B5;"Non trouvé")', actif: 'D2', refsCouleur: { A2: 'bleu' }, legende: 'La correspondance exacte est déjà active par défaut : pas d\'argument FAUX à ajouter.' },
      plus: ['11. Ajoute un point-virgule pour valider la matrice. 12. Avec la RECHERCHEX, tu n\'as plus besoin de mettre 0 ou FAUX pour une correspondance exacte ; pour éviter les #N/A, écris directement entre guillemets le message à afficher (par ex. "Non trouvé") si aucune correspondance n\'est trouvée. 13. Ferme la parenthèse.'],
    },
    {
      humeur: 'content',
      dit: '**Vérifie et étire :** D2 affiche **5**. Fige les deux plages avec des **$** (F4, Mac : **⌘ + T**), puis étire. Et regarde la ligne du code manquant…',
      visuel: { type: 'tableur', feuilles: ['Commandes', 'Stock'], feuilleActive: 'Commandes', cols: ['A', 'B', 'C', 'D'], rows: [1, 2, 3, 4], cells: { A1: { t: 'Code article', entete: true }, B1: { t: 'Produit', entete: true }, C1: { t: 'Prix', entete: true }, D1: { t: 'Quantité', entete: true }, A2: { t: 'A1001' }, B2: { t: 'Clavier sans fil' }, C2: { t: '24,90 €', num: true }, D2: { t: '5', vert: true, num: true }, A3: { t: 'A1002' }, B3: { t: 'Souris ergonomique' }, C3: { t: '39,90 €', num: true }, D3: { t: 'Non trouvé', vert: true }, A4: { t: 'A1003' }, B4: { t: 'Écran 24 pouces' }, C4: { t: '149,00 €', num: true }, D4: { t: '12', vert: true, num: true } }, formule: '=RECHERCHEX(A2;Stock!$A$2:$A$5;Stock!$B$2:$B$5;"Non trouvé")', actif: 'D2', legende: 'APRÈS : le code A1002 absent affiche « Non trouvé » au lieu de #N/A. Propre et lisible.' },
      plus: ['15. Tu es automatiquement renvoyé vers le tableau principal. 16. Vérifie que la cellule affiche bien la donnée attendue (par ex. « 5 »). 17. Avant d\'étirer la formule, convertis la plage du second tableau en références absolues c\'est-à-dire fixe la plage du deuxième tableau en utilisant $ pour bloquer les cellules afin de préserver l\'exactitude des données. 18. Étire la formule.', 'Sur la ligne 3, le code article A1002 n\'existe pas dans le tableau de référence ; RECHERCHEX renvoie donc la valeur que tu as précisée dans son 4ᵉ argument (ici "non trouvé") au lieu de l\'erreur #N/A. Tu peux personnaliser ce message pour qu\'il soit plus explicite (ex. "Code introuvable"), ce qui rend ton tableau plus lisible et évite les #N/A.'],
    },
    {
      humeur: 'pensif',
      dit: 'Une croyance à vérifier. **Vrai ou faux ?**',
      visuel: { type: 'vraifaux', affirmation: 'RECHERCHEX peut extraire une donnée située à GAUCHE de la colonne où se trouve la clé.', bonne: true, explication: 'C\'est justement sa force : plage_recherche et plage_retour sont indépendantes. La donnée peut être à gauche, à droite, ou même sur une autre feuille.' },
    },
    {
      humeur: 'pensif',
      dit: '**La RECHERCHEX, à retenir :**',
      visuel: { type: 'parties', items: [{ label: 'Deux plages indépendantes : plage de recherche (clé) et plage de retour (donnée), sans index numérique' }, { label: 'Bidirectionnelle : recherche à gauche comme à droite' }, { label: 'Correspondance exacte par défaut : [mode_correspondance] vaut 0 automatiquement' }, { label: 'Gestion native des erreurs : le 4ᵉ argument [si_non_trouvé] remplace SIERREUR' }, { label: 'Multi-critères : combine plusieurs conditions par concaténation (leçon suivante !)' }] },
      plus: ['Deux plages indépendantes : tu sélectionnes séparément la plage de recherche (clé) et la plage de retour (donnée), sans contrainte de position ni besoin d\'index numérique.', 'Bidirectionnel : recherche à gauche, à droite, plus de limitation « clé à gauche ».', 'Correspondance exacte par défaut : l\'argument [mode_correspondance] vaut 0 automatiquement ; tu peux choisir 1 pour une recherche approchée si la plage est triée.', 'Gestion native des erreurs : le 4ᵉ argument ([si_non_trouvé]) permet de définir le message à afficher en cas d\'absence, sans recourir à SIERREUR.', 'Cas multi-critères : combine plusieurs conditions via la concaténation (Colonne1&Colonne2) pour créer un tableau et rechercher simultanément deux (ou plusieurs) critères.'],
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Si tu omets l\'argument [mode_correspondance], quel type de correspondance utilise RECHERCHEX **par défaut** ?',
      visuel: { type: 'question', options: ['La correspondance exacte', 'La correspondance approximative', 'La recherche inversée'], bonne: 0, explication: 'Contrairement à RECHERCHEV, la RECHERCHEX applique la correspondance EXACTE d\'office (mode 0). Fini les faux positifs par oubli du FAUX !' },
    },
    { humeur: 'fier', dit: 'Recherche dans les deux sens, message d\'absence intégré : la RECHERCHEX est ton nouvel outil favori. 🎉' },
  ],
}

// --- Leçon 4 : La RECHERCHEX à 2 critères ---
const RECHERCHEXDEUX = {
  id: 'fn-recherchexdeux',
  titre: 'La RECHERCHEX à 2 critères',
  exercices: [EX11.ex81],
  narration: [
    { humeur: 'accueil', dit: 'La **RECHERCHEX à deux critères** croise **simultanément deux conditions** pour extraire, en une seule formule, la donnée qui correspond à leur combinaison. Imagine un catalogue où chaque article existe en plusieurs tailles : tu veux le prix du couple **Produit + Taille**, sans tableau auxiliaire.', visuel: { type: 'tableur', cols: ['A', 'B', 'C', 'D'], rows: [1, 2, 3, 4, 5, 6, 7], cells: { A1: { t: 'Produit', entete: true }, B1: { t: 'Coloris', entete: true }, C1: { t: 'Taille', entete: true }, D1: { t: 'Prix', entete: true }, A2: { t: 'Tshirt' }, B2: { t: 'Blanc' }, C2: { t: 'S' }, D2: { t: '15 €', num: true }, A3: { t: 'Tshirt' }, B3: { t: 'Blanc' }, C3: { t: 'M' }, D3: { t: '17 €', num: true }, A4: { t: 'Sweat' }, B4: { t: 'Gris' }, C4: { t: 'S' }, D4: { t: '25 €', num: true }, A5: { t: 'Sweat' }, B5: { t: 'Gris' }, C5: { t: 'M' }, D5: { t: '27 €', num: true }, A6: { t: 'Hoodie' }, B6: { t: 'Noir' }, C6: { t: 'S' }, D6: { t: '29 €', num: true }, A7: { t: 'Hoodie' }, B7: { t: 'Noir' }, C7: { t: 'M' }, D7: { t: '32 €', num: true } }, legende: 'Le catalogue : « Hoodie » apparaît 2 fois. Seul le couple Produit + Taille est unique.' }, plus: ['La RECHERCHEX à deux critères permet de croiser simultanément deux conditions de recherche pour extraire en une seule formule la donnée précise qui correspond à leur combinaison.', 'Imaginons que tu gères un catalogue de produits où chaque article existe en plusieurs tailles. Tu souhaites afficher automatiquement le prix correspondant au couple Produit + Taille choisi par l\'utilisateur, sans créer de tableaux auxiliaires compliqués.'] },
    {
      humeur: 'pensif',
      dit: '**Comment ça marche ?** Au lieu de chercher une seule valeur-clé, tu **combines** deux conditions en créant une **clé combinée**. Chaque ligne du tableau reçoit sa clé (ex. Produit+Taille = « HoodieS »), et la RECHERCHEX cherche la correspondance parfaite dans ce nouvel ensemble.',
      visuel: { type: 'formule', formule: '=RECHERCHEX(clé1 & clé2 ; plage1 & plage2 ; plage_retour)' },
      plus: ['Au lieu de rechercher une seule valeur-clé, tu combines deux (ou plusieurs) conditions en créant un critère unique, puis tu demandes à la RECHERCHEX de repérer cette combinaison.', 'Concrètement, chaque ligne de ton tableau de référence se voit attribuer une « clé combinée » (par exemple Produit+Taille), et la RECHERCHEX cherche la parfaite correspondance dans ce nouvel ensemble pour extraire la donnée souhaitée.'],
    },
    {
      humeur: 'pensif',
      dit: '**Le décor :** l\'utilisateur choisit son produit en G9 et sa taille en H9. Le prix doit apparaître en I9. On sélectionne la cellule de destination, puis on tape **=RECHERCHEX(**.',
      visuel: { type: 'tableur', cols: ['G', 'H', 'I'], rows: [8, 9], cells: { G8: { t: 'Produit', entete: true }, H8: { t: 'Taille', entete: true }, I8: { t: 'Prix', entete: true }, G9: { t: 'Hoodie' }, H9: { t: 'S' }, I9: { t: '=RECHERCHEX(' } }, formule: '=RECHERCHEX(', actif: 'I9', legende: 'La zone de choix : Hoodie + S. Le prix attendu viendra en I9.' },
      plus: ['1. Commence par sélectionner ta cellule de destination. 2. Tape =RECHERCHEX.'],
    },
    {
      humeur: 'pensif',
      dit: '**La clé combinée côté choix :** clique sur **G9** (le Produit), tape le signe **&**, puis clique sur **H9** (la Taille). Termine par un **point-virgule**.',
      visuel: { type: 'tableur', cols: ['G', 'H', 'I'], rows: [8, 9], cells: { G8: { t: 'Produit', entete: true }, H8: { t: 'Taille', entete: true }, I8: { t: 'Prix', entete: true }, G9: { t: 'Hoodie', ref: true }, H9: { t: 'S', ref: true }, I9: { t: '=RECHERCHEX(G9&H9;' } }, formule: '=RECHERCHEX(G9&H9;', actif: 'I9', refsCouleur: { G9: 'bleu', H9: 'ambre' }, legende: 'G9&H9 fabrique la clé « HoodieS » : les deux critères collés l\'un à l\'autre.' },
      plus: ['3. Clique sur G9 (Produit). 4. Tape le signe & pour ensuite sélectionner la deuxième clé. 5. Clique sur H9 (Taille). 6. Termine par un point-virgule pour passer à l\'argument suivant.'],
    },
    {
      humeur: 'pensif',
      dit: '**La clé combinée côté catalogue :** sélectionne la plage des produits **A2:A7**, tape **&**, puis la plage des tailles **C2:C7**. Excel fabrique la même clé combinée pour chaque ligne du catalogue. Point-virgule pour valider.',
      visuel: { type: 'tableur', cols: ['A', 'B', 'C', 'D'], rows: [1, 2, 3, 6, 7], cells: { A1: { t: 'Produit', entete: true }, B1: { t: 'Coloris', entete: true }, C1: { t: 'Taille', entete: true }, D1: { t: 'Prix', entete: true }, A2: { t: 'Tshirt', sel: true }, B2: { t: 'Blanc' }, C2: { t: 'S', sel: true }, D2: { t: '15 €', num: true }, A3: { t: 'Tshirt', sel: true }, B3: { t: 'Blanc' }, C3: { t: 'M', sel: true }, D3: { t: '17 €', num: true }, A6: { t: 'Hoodie', sel: true }, B6: { t: 'Noir' }, C6: { t: 'S', sel: true }, D6: { t: '29 €', num: true }, A7: { t: 'Hoodie', sel: true }, B7: { t: 'Noir' }, C7: { t: 'M', sel: true }, D7: { t: '32 €', num: true } }, formule: '=RECHERCHEX(G9&H9;A2:A7&C2:C7;', actif: 'I9', legende: 'A2:A7 & C2:C7 : chaque ligne devient « TshirtS », « TshirtM », … « HoodieS », « HoodieM ».' },
      plus: ['7. Définis la plage de recherche combinée : sélectionne la plage contenant la clé combinée, dans l\'exemple c\'est la colonne Produit. 8. Tape le signe &. 9. Définis la plage de recherche combinée : sélectionne la 2ème plage contenant la clé combinée, dans l\'exemple c\'est la colonne « Taille ». 10. Tape le signe &. 11. Termine par un point-virgule pour passer à l\'argument suivant.'],
    },
    {
      humeur: 'pensif',
      dit: '**La plage de retour :** sélectionne la colonne des prix, **D2:D7**, puis ferme la parenthèse et appuie sur **Entrée**.',
      visuel: { type: 'tableur', cols: ['A', 'B', 'C', 'D'], rows: [1, 2, 6, 7], cells: { A1: { t: 'Produit', entete: true }, B1: { t: 'Coloris', entete: true }, C1: { t: 'Taille', entete: true }, D1: { t: 'Prix', entete: true }, A2: { t: 'Tshirt' }, B2: { t: 'Blanc' }, C2: { t: 'S' }, D2: { t: '15 €', num: true, sel: true }, A6: { t: 'Hoodie' }, B6: { t: 'Noir' }, C6: { t: 'S' }, D6: { t: '29 €', num: true, sel: true }, A7: { t: 'Hoodie' }, B7: { t: 'Noir' }, C7: { t: 'M' }, D7: { t: '32 €', num: true, sel: true } }, formule: '=RECHERCHEX(G9&H9;A2:A7&C2:C7;D2:D7)', actif: 'I9', legende: 'D2:D7 est la plage de retour : le prix correspondant à la clé combinée trouvée.' },
      plus: ['12. Définis la plage de retour, c\'est-à-dire la plage de cellules où la formule ira chercher la valeur à renvoyer. Ici, il s\'agit de la colonne des prix. 13. Ferme la parenthèse. 14. Tape sur ENTREE pour valider la formule.'],
    },
    {
      humeur: 'content',
      dit: '**Le résultat :** I9 affiche **29 €**, le prix du Hoodie taille S, trouvé grâce à la chaîne « HoodieS » et à la correspondance exacte. Une seule formule, deux critères croisés !',
      visuel: { type: 'tableur', cols: ['G', 'H', 'I'], rows: [8, 9], cells: { G8: { t: 'Produit', entete: true }, H8: { t: 'Taille', entete: true }, I8: { t: 'Prix', entete: true }, G9: { t: 'Hoodie' }, H9: { t: 'S' }, I9: { t: '29 €', vert: true, num: true } }, formule: '=RECHERCHEX(G9&H9;A2:A7&C2:C7;D2:D7)', actif: 'I9', legende: 'Et voilà ! Change G9 en « Sweat » et le prix se met à jour tout seul : 25 €.' },
      plus: ['Le 29 qui apparaît en I9 est le prix du Hoodie S, trouvé grâce à la recherche de la chaîne "HoodieS" dans ton tableau de référence et à la correspondance exacte.', 'Et voilà ! Tu sais maintenant comment faire une recherche X multi-critères sans tableaux auxiliaires : simple, clair et efficace !'],
    },
    {
      humeur: 'pensif',
      dit: 'Le secret de cette technique tient en un seul caractère :',
      visuel: { type: 'encart', label: 'Le rôle du &', texte: 'Le signe **&** colle deux contenus l\'un à l\'autre (c\'est la **concaténation**). « Hoodie » & « S » = « HoodieS ». Appliqué aux plages, il fabrique une colonne virtuelle de clés combinées, sans rien ajouter dans ta feuille.' },
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Pour croiser **Produit ET Taille** dans une RECHERCHEX, quelle écriture est la bonne ?',
      visuel: { type: 'question', options: ['=RECHERCHEX(G9&H9; A2:A7&C2:C7; D2:D7)', '=RECHERCHEX(G9+H9; A2:A7+C2:C7; D2:D7)', '=RECHERCHEX(G9;H9; A2:A7;C2:C7; D2:D7)'], bonne: 0, explication: 'Le & concatène les critères (« HoodieS ») et les plages, pour comparer clé combinée à clé combinée. Le + tenterait une addition, et les points-virgules créeraient des arguments en trop.' },
    },
    { humeur: 'fier', dit: 'Recherche multi-critères sans colonne auxiliaire : tu utilises Excel comme un pro. 🎉' },
  ],
}

// --- Leçon 5 : La RECHERCHEH ---
const RECHERCHEH = {
  id: 'fn-rechercheh',
  titre: 'La RECHERCHEH',
  exercices: [EX11.ex82],
  narration: [
    { humeur: 'accueil', dit: 'La fonction **RECHERCHEH** (Recherche **H**orizontale) agit comme RECHERCHEV, mais sur un tableau disposé **en lignes** plutôt qu\'en colonnes : elle cherche la clé sur la **première ligne** et renvoie une valeur située **dans la même colonne**. Sa syntaxe :', visuel: { type: 'formule', formule: '=RECHERCHEH(valeur_cherchée; table_matrice; no_index_ligne; [valeur_proche])' }, plus: ['La fonction RECHERCHEH (Recherche horizontale) agit comme RECHERCHEV, mais sur un tableau disposé en lignes plutôt qu\'en colonnes : RECHERCHEV cherche une clé en colonne 1 et renvoie une valeur dans la même ligne. RECHERCHEH cherche une clé en ligne 1 et renvoie une valeur dans la même colonne.'] },
    {
      humeur: 'pensif',
      dit: '**Ses 4 arguments :**',
      visuel: { type: 'parties', items: [{ label: 'valeur_cherchée : la donnée-clé à rechercher dans la PREMIÈRE LIGNE de table_matrice' }, { label: 'table_matrice : la plage contenant la ligne de la clé (ligne 1) et la ligne de données à extraire' }, { label: 'no_index_ligne : le numéro de la ligne à renvoyer (1 = ligne de la clé, 2 = 1ʳᵉ ligne de données, 3 = 2ᵉ ligne…)' }, { label: '[valeur_proche] : FAUX ou 0 pour la correspondance exacte ; VRAI ou omis pour l\'approchée (ligne 1 triée)' }] },
      plus: ['Valeur_cherchée : la donnée-clé à rechercher dans la première ligne de table_matrice (ex. un Code article).', 'Table_matrice : la plage contenant la ligne de la clé (ligne 1) et la ligne de données à extraire.', 'No_index_ligne : le numéro de la ligne à renvoyer dans table_matrice : 1 = ligne de la clé, 2 = 1ʳᵉ ligne de données, 3 = 2ᵉ ligne de données, etc.', '[Valeur proche] : (facultatif) FAUX ou 0 pour forcer une correspondance exacte ; VRAI ou omis pour une correspondance approchée (nécessite une ligne 1 triée).'],
    },
    {
      humeur: 'pensif',
      dit: 'Avant d\'aller plus loin. **Vrai ou faux ?**',
      visuel: { type: 'vraifaux', affirmation: 'Pour RECHERCHEH, la clé doit se trouver dans la première COLONNE de la plage.', bonne: false, explication: 'C\'est l\'inverse de RECHERCHEV : pour RECHERCHEH (Horizontale), la clé doit être sur la première LIGNE de la plage, et la donnée à extraire en dessous, dans la même colonne.' },
    },
    {
      humeur: 'pensif',
      dit: '**Le décor :** mon tableau principal est vertical, et mon référentiel est **horizontal** : les codes articles sur la première ligne, le prix et la quantité en dessous.',
      visuel: { type: 'deuxtableaux', t1: { titre: 'Tableau 1 · feuille Commandes', entetes: ['Produit', 'Code article', 'Quantité'], lignes: [['Clavier sans fil', 'A1001', ''], ['Souris ergonomique', 'A1002', ''], ['Écran 24 pouces', 'A1003', '']], cle: 1 }, t2: { titre: 'Tableau 2 · feuille Réf (horizontal)', horizontal: true, entetes: ['Code article', 'A1001', 'A1002', 'A1003', 'A1004'], lignes: [['Prix', '24,90 €', '39,90 €', '149,00 €', '89,00 €'], ['Quantité', '20', '7', '12', '8']], cle: 0, valeur: 2 }, legende: 'Même logique que la RECHERCHEV, mais le référentiel est couché : clé en ligne 1, données en dessous.' },
      plus: ['Comme pour la RECHERCHEV, j\'ai deux tableaux liés par le Code article. Avec RECHERCHEH, je sélectionne juste la ligne clé (code article) et la ligne Quantité, sans toucher à la structure.', 'Conditions d\'utilisation : 1. Clé unique en ligne 1 : la valeur recherchée doit apparaître une seule fois dans la première ligne du tableau (ex. codes produits). 2. Table_matrice horizontale : doit inclure la ligne-clé et les lignes de données à extraire (ex. ligne 1 = codes, ligne 3 = quantités). 3. Correspondance exacte : utilise FAUX ou 0 pour une recherche exacte ; sans cet argument, Excel fera une correspondance rapprochée sur un tableau trié.'],
    },
    {
      humeur: 'pensif',
      dit: '**On prépare :** repère la clé dans les deux tableaux (colonne « Code article » dans le premier, **ligne** « Code article » dans le second), ajoute la colonne Quantité, et sélectionne **C2**. Puis tape **=RECHERCHEH(**.',
      visuel: { type: 'tableur', feuilles: ['Commandes', 'Réf'], feuilleActive: 'Commandes', cols: ['A', 'B', 'C'], rows: [1, 2, 3], cells: { A1: { t: 'Produit', entete: true }, B1: { t: 'Code article', entete: true }, C1: { t: 'Quantité', entete: true }, A2: { t: 'Clavier sans fil' }, B2: { t: 'A1001' }, C2: { t: '=RECHERCHEH(' }, A3: { t: 'Souris ergonomique' }, B3: { t: 'A1002' } }, formule: '=RECHERCHEH(', actif: 'C2' },
      plus: ['1. Ouvrir les deux tableaux. 2. Identifier la clé commune : repère la colonne « Code article » dans le 1er tableau et ligne « code article » dans le second tableau. Assure-toi que chaque code est unique dans le référentiel. 3. Si ce n\'est pas déjà fait, ajoute une colonne dans ton tableau principal pour y importer les données issues du second tableau. 4. Sélectionne la cellule où le résultat doit apparaître (C2). 5. Tape =RECHERCHEH(.'],
    },
    {
      humeur: 'pensif',
      dit: '**La valeur cherchée :** clique sur **B2** (le code de cette ligne), puis verrouille avec un **point-virgule**.',
      visuel: { type: 'tableur', feuilles: ['Commandes', 'Réf'], feuilleActive: 'Commandes', cols: ['A', 'B', 'C'], rows: [1, 2], cells: { A1: { t: 'Produit', entete: true }, B1: { t: 'Code article', entete: true }, C1: { t: 'Quantité', entete: true }, A2: { t: 'Clavier sans fil' }, B2: { t: 'A1001', ref: true }, C2: { t: '=RECHERCHEH(B2;' } }, formule: '=RECHERCHEH(B2;', actif: 'C2', refsCouleur: { B2: 'bleu' } },
      plus: ['6. Clique sur la cellule du code article (B2). C\'est ta valeur_cherchée et elle doit se trouver sur la même ligne où tu vas entrer la formule RECHERCHEH. 7. Verrouille l\'argument avec un point-virgule.'],
    },
    {
      humeur: 'pensif',
      dit: '**La table matrice :** sur la feuille Réf, sélectionne la plage qui **commence par la ligne de la clé** et **descend jusqu\'à la ligne à rapatrier** (la Quantité) : B1:E3. La ligne de la valeur doit impérativement se trouver **en dessous** de la ligne clé.',
      visuel: { type: 'tableur', feuilles: ['Commandes', 'Réf'], feuilleActive: 'Réf', cols: ['A', 'B', 'C', 'D', 'E'], rows: [1, 2, 3], cells: { A1: { t: 'Code article', entete: true }, B1: { t: 'A1001', sel: true }, C1: { t: 'A1002', sel: true }, D1: { t: 'A1003', sel: true }, E1: { t: 'A1004', sel: true }, A2: { t: 'Prix', entete: true }, B2: { t: '24,90 €', num: true, sel: true }, C2: { t: '39,90 €', num: true, sel: true }, D2: { t: '149,00 €', num: true, sel: true }, E2: { t: '89,00 €', num: true, sel: true }, A3: { t: 'Quantité', entete: true }, B3: { t: '20', num: true, sel: true }, C3: { t: '7', num: true, sel: true }, D3: { t: '12', num: true, sel: true }, E3: { t: '8', num: true, sel: true } }, formule: '=RECHERCHEH(B2;Réf!B1:E3', actif: 'C2', legende: 'La plage B1:E3 englobe la ligne des codes (clé) ET la ligne Quantité, en un bloc rectangulaire.' },
      plus: ['8. Dans le tableau de référence, sélectionne la plage qui englobe la ligne de la clé commune (ligne 1, Code article) et la ligne de la donnée à rapatrier (par ex. ligne 3, Quantité).', 'N\'oublie pas : pense toujours à commencer par la ligne de la clé, puis à inclure la ligne de la valeur, qui doit impérativement se trouver en dessous de la ligne clé.', 'Lorsque ta plage de recherche (table_matrice) se trouve sur un autre onglet que le tableau principal, Excel préfixe la référence par le nom de cet onglet, suivi d\'un point d\'exclamation.'],
    },
    {
      humeur: 'pensif',
      dit: '**Le numéro de ligne :** point-virgule, puis **compte les lignes** entre la ligne clé et celle de la donnée : ligne 1 = codes, ligne 2 = Prix, ligne 3 = **Quantité**. Place ce **3**, puis un point-virgule.',
      visuel: { type: 'tableur', feuilles: ['Commandes', 'Réf'], feuilleActive: 'Réf', cols: ['A', 'B', 'C'], rows: [1, 2, 3], cells: { A1: { t: 'Code article ①', entete: true }, B1: { t: 'A1001' }, C1: { t: 'A1002' }, A2: { t: 'Prix ②', entete: true }, B2: { t: '24,90 €', num: true }, C2: { t: '39,90 €', num: true }, A3: { t: 'Quantité ③', entete: true }, B3: { t: '20', num: true }, C3: { t: '7', num: true } }, formule: '=RECHERCHEH(B2;Réf!B1:E3;3;', actif: 'C2', legende: 'On compte : ① la clé, ② le Prix, ③ la Quantité. Le no_index_ligne est donc 3.' },
      plus: ['9. Ajoute un point-virgule pour valider la matrice. 10. Calcule le nombre de lignes entre la ligne clé et celle de la donnée à extraire : ici, on compte 3 lignes. 11. Place le numéro de ligne correspondant dans l\'argument de ta fonction c\'est-à-dire 3. 12. Insère un point-virgule pour verrouiller l\'argument.'],
    },
    {
      humeur: 'pensif',
      dit: '**On termine :** tape **FAUX** (ou 0) pour la correspondance exacte, ferme la **parenthèse**, puis **Entrée**.',
      visuel: { type: 'tableur', feuilles: ['Commandes', 'Réf'], feuilleActive: 'Commandes', cols: ['A', 'B', 'C'], rows: [1, 2], cells: { A1: { t: 'Produit', entete: true }, B1: { t: 'Code article', entete: true }, C1: { t: 'Quantité', entete: true }, A2: { t: 'Clavier sans fil' }, B2: { t: 'A1001', ref: true }, C2: { t: '=RECHERCHEH(B2;Réf!B1:E3;3;FAUX)' } }, formule: '=RECHERCHEH(B2;Réf!B1:E3;3;FAUX)', actif: 'C2', refsCouleur: { B2: 'bleu' } },
      plus: ['13. Tape « FAUX » ou 0 pour une correspondance exacte. 14. Ferme la parenthèse. 15. Tape sur ENTREE pour valider la formule.'],
    },
    {
      humeur: 'content',
      dit: '**Vérifie, fige, étire :** de retour sur le tableau principal, C2 affiche **20** (la quantité du code A1001). Avant d\'étirer, fige la plage avec des **$** (F4, Mac : **⌘ + T**), puis étire la formule.',
      visuel: { type: 'tableur', feuilles: ['Commandes', 'Réf'], feuilleActive: 'Commandes', cols: ['A', 'B', 'C'], rows: [1, 2, 3, 4], cells: { A1: { t: 'Produit', entete: true }, B1: { t: 'Code article', entete: true }, C1: { t: 'Quantité', entete: true }, A2: { t: 'Clavier sans fil' }, B2: { t: 'A1001' }, C2: { t: '20', vert: true, num: true }, A3: { t: 'Souris ergonomique' }, B3: { t: 'A1002' }, C3: { t: '7', vert: true, num: true }, A4: { t: 'Écran 24 pouces' }, B4: { t: 'A1003' }, C4: { t: '12', vert: true, num: true } }, formule: '=RECHERCHEH(B2;Réf!$B$1:$E$3;3;FAUX)', actif: 'C2', legende: 'APRÈS : la plage Réf!$B$1:$E$3 figée, la formule étirée remplit toute la colonne juste.' },
      plus: ['16. Tu es automatiquement renvoyé vers le tableau principal. 17. Vérifie que la cellule affiche bien la donnée attendue (par ex. « 20 »). 18. Avant d\'étirer la formule, convertis la plage du second tableau en références absolues c\'est-à-dire fixe la plage du deuxième tableau en utilisant $ (F4) pour bloquer les cellules afin de préserver l\'exactitude des données. 19. Étire la formule.'],
    },
    {
      humeur: 'pensif',
      dit: '**La RECHERCHEH, à retenir :**',
      visuel: { type: 'parties', items: [{ label: 'Clé en première ligne : la valeur-clé doit être sur la ligne du haut de la plage' }, { label: 'Index de ligne : la donnée recherchée doit se trouver EN DESSOUS de la clé, dans la même plage' }, { label: 'Plage 2D continue : toujours un bloc rectangulaire (ex. $A$1:$D$4), jamais deux plages séparées' }, { label: 'Correspondance exacte : comme pour RECHERCHEV, précise FAUX ou 0' }, { label: 'Évite les doublons : si la première ligne contient des clés répétées, Excel ne renvoie que la première' }] },
      plus: ['Clé en première ligne : la valeur-clé doit être sur la ligne du haut de ta plage (table_matrice).', 'Index de ligne : indique le numéro de la ligne à renvoyer ; la donnée recherchée doit se trouver en dessous de la clé, dans la même plage rectangulaire.', 'Plage 2D continue : sélectionne toujours un bloc rectangulaire (ex. $A$1:$D$4) ; pas de sélection en deux plages séparées.', 'Correspondance exacte : comme pour RECHERCHEV, précise FAUX ou 0 pour forcer l\'égalité.', 'Évite les doublons : si ta première ligne contient des clés répétées, Excel ne renverra que la première occurrence.'],
    },
    {
      humeur: 'pensif',
      dit: 'Dernière astuce du chapitre : avant de lancer tes recherches, fais un tour au **Gestionnaire de noms** (Formules > Gestionnaire de noms) pour vérifier tes plages nommées.',
      visuel: { type: 'gestionnairenoms', noms: [{ nom: 'Table_Produits', ref: '=Stock!$A$2:$C$100', etendue: 'Classeur' }, { nom: 'Table_Stocks', ref: '=Réf!$B$1:$E$3', etendue: 'Classeur' }, { nom: 'Codes', ref: '=Stock!$A$2:$A$100', etendue: 'Classeur' }, { nom: 'Prix', ref: '=Stock!$C$2:$C$100', etendue: 'Classeur' }], selection: 0, note: 'Vérifie que chaque nom pointe vers la bonne plage, corrige les adresses obsolètes, et renomme clairement (Clients, Produits, Prix).' },
      plus: ['Dans Formules > Gestionnaire de noms, parcoure la liste de tes plages nommées pour : vérifier que chaque nom pointe bien vers la bonne plage de cellules, corriger immédiatement toute adresse erronée ou obsolète, renommer clairement tes plages pour qu\'elles soient intuitives (ex. Clients, Produits, Prix).'],
    },
    {
      humeur: 'pensif',
      dit: '**Pourquoi c\'est crucial pour tes recherches ?**',
      visuel: { type: 'parties', items: [{ label: 'RECHERCHEV : remplace A2:C100 par un nom (Table_Produits) pour la table_matrice, fini les erreurs de plage quand tu ajoutes des lignes' }, { label: 'RECHERCHEH : un nom (Table_Stocks) simplifie la sélection des lignes horizontales' }, { label: 'RECHERCHEX : deux noms (Codes, Prix) pour la plage_recherche et la plage_retour, formule lisible et robuste' }] },
      plus: ['RECHERCHEV : remplace A2:C100 par un nom (Table_Produits) pour la table_matrice, évitant les erreurs de plage lors d\'ajouts de lignes.', 'RECHERCHEH : utilise un nom (Table_Stocks) pour la table_matrice, simplifiant la sélection de lignes horizontales.', 'RECHERCHEX : référence directement deux noms (Codes, Prix) pour la plage_recherche et la plage_retour, rendant ta formule plus lisible et robuste.', 'Cette vérification garantit que tes recherches V, H ou X fonctionnent sans accroc, même après modification de tes tableaux !'],
    },
    {
      humeur: 'accueil',
      dit: 'À toi. Dans =RECHERCHEH(B2;Réf!$B$1:$E$3;**3**;FAUX), que désigne le **3** ?',
      visuel: { type: 'question', options: ['Le numéro de la LIGNE à renvoyer dans la plage (ici, la Quantité)', 'Le nombre de colonnes de la plage', 'La position de la clé sur la première ligne'], bonne: 0, explication: 'C\'est le no_index_ligne : ligne 1 = les codes (la clé), ligne 2 = le Prix, ligne 3 = la Quantité. Excel renvoie la valeur de la 3ᵉ ligne, dans la colonne où il a trouvé la clé.' },
    },
    { humeur: 'fier', dit: 'V, X, H : les trois recherches n\'ont plus de secret pour toi. Le détective Excel est diplômé, la ceinture marron t\'attend ! 🎉' },
  ],
}

export const LECONS_FONCTIONS = { calculs: CALCULS, saisie: SAISIE, recopie: RECOPIE, series: SERIES, deplacer: DEPLACER, collage: COLLAGE, somme: SOMME, assistant: ASSISTANT, references: REFERENCES, si: SI, lignescolonnes: LIGNESCOLONNES, miseenforme: MISEENFORME, couleurs: COULEURS, nombres: NOMBRES, pinceaustyles: PINCEAUSTYLES, miseenpage: MISEENPAGE, impression: IMPRESSION, fonctionssimples: FONCTIONSSIMPLES, fonctionscomplexes: FONCTIONSCOMPLEXES, recopierformules: RECOPIERFORMULES, nomsformules: NOMSFORMULES, argumentsvpm: ARGUMENTSVPM, rechercherremplacer: RECHERCHERREMPLACER, convertir: CONVERTIR, fonctionsparticulieres: FONCTIONSPARTICULIERES, arrondis: ARRONDIS, fonctionsdate: FONCTIONSDATE, fonctionstexte: FONCTIONSTEXTE, fonctionsfinancieres: FONCTIONSFINANCIERES, gererfeuilles: GERERFEUILLES, lierfeuilles: LIERFEUILLES, groupefeuilles: GROUPEFEUILLES, liaisonsclasseurs: LIAISONSCLASSEURS, calculs3d: CALCULS3D, protegerfeuilles: PROTEGERFEUILLES, reglesliste: REGLESLISTE, imprimerliste: IMPRIMERLISTE, creertableau: CREERTABLEAU, saisirliste: SAISIRLISTE, trierliste: TRIERLISTE, filtrerliste: FILTRERLISTE, soustotaux: SOUSTOTAUX, creergraphique: CREERGRAPHIQUE, deplacergraphique: DEPLACERGRAPHIQUE, modifiergraphique: MODIFIERGRAPHIQUE, axesgraphique: AXESGRAPHIQUE, seriesgraphique: SERIESGRAPHIQUE, deplacerimprimer: DEPLACERIMPRIMER, mixtesparkline: MIXTESPARKLINE, rappel3d: RAPPEL3D, consoposition: CONSOPOSITION, consocategorie: CONSOCATEGORIE, tcdtables: TCDTABLES, tcdrelations: TCDRELATIONS, mfconditionnelle: MFCONDITIONNELLE, rappelrefnoms: RAPPELREFNOMS, fonctionsi: FONCTIONSI, siimbrique: SIIMBRIQUE, nbsiens: NBSIENS, sommesiens: SOMMESIENS, sierreur: SIERREUR, rappelsrecherche: RAPPELSRECHERCHE, recherchev: RECHERCHEV, recherchex: RECHERCHEX, recherchexdeux: RECHERCHEXDEUX, rechercheh: RECHERCHEH }
