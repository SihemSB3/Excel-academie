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
    { humeur: 'accueil', dit: 'Voici trois prix. On veut leur total dans la case B5.', visuel: tabS() },
    { humeur: 'pensif', dit: '**Étape 1 :** dans B5, toute formule commence par le signe =.', visuel: tabS('=') },
    { humeur: 'pensif', dit: '**Étape 2 :** on écrit SOMME et on ouvre une parenthèse.', visuel: tabS('=SOMME(') },
    { humeur: 'accueil', dit: '**Étape 3 :** on sélectionne la plage à additionner, de B2 à B4 (en bleu).', visuel: tabS('=SOMME(B2:B4', null, ['B2', 'B3', 'B4']) },
    { humeur: 'pensif', dit: '**Étape 4 :** on ferme la parenthèse. La formule complète est dans la case.', visuel: tabS('=SOMME(B2:B4)') },
    { humeur: 'fier', dit: 'On appuie sur Entrée : la case affiche 30 + 20 + 150 = 200.', visuel: tabS('=SOMME(B2:B4)', { t: '200', vert: true }) },
    {
      humeur: 'pensif',
      dit: 'Une astuce à retenir.',
      visuel: { type: 'encart', label: 'Astuce', texte: 'Encore plus rapide : sélectionne la colonne et clique sur le bouton **∑ Somme automatique**. Excel écrit la formule pour toi.' },
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
    { humeur: 'pensif', dit: '**Étape 1 :** on clique dans B2 et on tape =. Il s\'écrit dans la case et dans la barre de formule.', visuel: tabSI({ t: '12' }, '=') },
    { humeur: 'pensif', dit: '**Étape 2 :** on écrit SI et on ouvre une parenthèse.', visuel: tabSI({ t: '12' }, '=SI(') },
    { humeur: 'accueil', dit: '**Argument 1, la condition :** on teste si A2 (la case bleue) est supérieur à 10.', visuel: tabSI({ t: '12', ref: true }, '=SI(A2>10') },
    { humeur: 'pensif', dit: 'Point-virgule ; puis **argument 2, le résultat si c\'est VRAI**, entre guillemets.', visuel: tabSI({ t: '12' }, '=SI(A2>10;"OK"') },
    { humeur: 'pensif', dit: 'Encore un point-virgule ; puis **argument 3, le résultat si c\'est FAUX**.', visuel: tabSI({ t: '12' }, '=SI(A2>10;"OK";"À refaire"') },
    { humeur: 'accueil', dit: 'On ferme la parenthèse. La formule complète est dans la case et dans la barre.', visuel: tabSI({ t: '12' }, fSI) },
    { humeur: 'fier', dit: 'On appuie sur Entrée : 12 > 10 ? Oui → la case affiche OK.', visuel: tabSI({ t: '12' }, fSI, { t: 'OK', vert: true }) },
    { humeur: 'pensif', dit: 'Et si la note avait été 7 ? 7 > 10 ? Non → la case affiche À refaire.', visuel: tabSI({ t: '7' }, fSI, { t: 'À refaire', rouge: true }) },
    {
      humeur: 'pensif',
      dit: 'Une astuce à garder en tête.',
      visuel: { type: 'encart', label: 'Astuce', texte: 'Le texte (comme **OK** ou **À refaire**) va toujours **entre guillemets**. C\'est comme ça qu\'Excel le reconnaît comme du texte.' },
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

const CALCULS = {
  id: 'fn-calculs',
  titre: 'Faire des calculs',
  exercices: [
    { titre: 'Exercice 5 · Les calculs avec les opérateurs', url: 'https://drive.google.com/file/d/1OI37AtYGKyXyn8yLMxrtGoqx3qRh32ic/view?usp=drivesdk' },
  ],
  narration: [
    { humeur: 'accueil', dit: 'Excel, c\'est une super calculatrice : tu fais tes calculs directement dans les cellules.' },
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
    { humeur: 'accueil', dit: 'Un exemple : un prix (A2) multiplié par une quantité (B2). On veut le total dans C2.', visuel: tabC({}) },
    { humeur: 'pensif', dit: '**Étape 1 :** dans C2, on commence par =.', visuel: tabC({}, '=') },
    { humeur: 'accueil', dit: '**Étape 2 :** on clique sur le prix, la cellule A2 (en bleu).', visuel: tabC({ A2ref: true }, '=A2') },
    { humeur: 'accueil', dit: '**Étape 3 :** on tape l\'opérateur de multiplication, la touche *.', visuel: tabC({ A2ref: true }, '=A2*') },
    { humeur: 'accueil', dit: '**Étape 4 :** on clique sur la quantité, la cellule B2.', visuel: tabC({ B2ref: true }, '=A2*B2') },
    { humeur: 'fier', dit: 'On appuie sur Entrée : Excel calcule 10 × 3 = 30.', visuel: tabC({}, '=A2*B2', { t: '30', vert: true }) },
    {
      humeur: 'pensif',
      dit: 'Retiens bien cette règle.',
      visuel: { type: 'encart', label: 'Règle de calcul', texte: 'La **multiplication** et la **division** passent toujours avant l\'**addition** et la **soustraction**. Ce n\'est pas propre à Excel : c\'est la règle de priorité des opérations, comme en maths.' },
      plus: ['* et / ont la même priorité (calculés en premier). + et - aussi (calculés après). Si tu imbriques des calculs de même priorité, le calcul se fera de la gauche vers la droite. Les parenthèses permettent de contrôler l\'ordre du calcul.', 'Deux façons d\'écrire un calcul : avec des valeurs directes (=5*12) ou avec des cellules (=A1+B1, le contenu des cellules sera utilisé).'],
    },
    { humeur: 'accueil', dit: 'Exemple : dans =5+2*3, on calcule d\'abord 2×3 = 6, puis on ajoute 5 → 11. Avec des parenthèses, =(5+2)*3 fait d\'abord 5+2 = 7, puis ×3 → 21.', visuel: { type: 'formule', formule: '=5+2*3' } },
    {
      humeur: 'accueil',
      dit: 'À toi. Combien fait =2+3*4 ?',
      visuel: { type: 'question', options: ['14', '20'], bonne: 0, explication: '× passe avant + : on fait d\'abord 3×4 = 12, puis on ajoute 2 = 14.' },
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
      humeur: 'pensif',
      dit: 'Si une colonne est trop étroite, Excel affiche #####. À toi de l\'élargir !',
      visuel: { type: 'elargir' },
    },
    { humeur: 'accueil', dit: 'Et voilà, le nombre réapparaît. Aucune inquiétude, donc : ##### veut juste dire « élargis-moi ».' },
    { humeur: 'pensif', dit: 'Pour une date, écris-la avec des / ou des - (ex : 11/05/2025). Excel la reconnaît comme une vraie date.', visuel: { type: 'tableur', cols: ['A', 'B'], rows: [1, 2], cells: { A1: { t: 'Tâche', entete: true }, B1: { t: 'Date', entete: true }, A2: { t: 'Réunion' }, B2: { t: '11/05/2025', num: true } } } },
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
    { humeur: 'accueil', dit: 'Exemple : en D2, tu écris =B2*C2 pour le total de la première ligne.', visuel: tabRec({ D2: { t: '=B2*C2' } }, '=B2*C2', 'D2', 'Chaque cellule de la formule prend une couleur, comme dans Excel : B2 en bleu, C2 en orange.', { refsCouleur: { B2: 'bleu', C2: 'ambre' } }) },
    { humeur: 'pensif', dit: 'Tu tires la poignée vers le bas : Excel adapte la formule à chaque ligne. Regarde le détail : =B2*C2 devient =B3*C3, puis =B4*C4.', visuel: { type: 'recopieanim' } },
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
    { humeur: 'pensif', dit: 'Ici, on veut le Prix TTC = Prix HT × le taux (en C2). En B2, on écrit =A2*C2.', visuel: tabRef({ B2: { t: '=A2*C2' }, A2: { t: '30' }, C2: { t: '1,2' } }, '=A2*C2', 'B2', 'Prix HT (A2) en bleu, Taux (C2) en orange, comme dans Excel.', { refsCouleur: { A2: 'bleu', C2: 'ambre' } }) },
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
      dit: '**Méthode 2, le clic droit :** clic droit sur la cellule > **Copier**, puis clic droit sur la destination > **Coller**.',
      visuel: { type: 'menu', items: [{ icone: '✂', label: 'Couper' }, { icone: '📄', label: 'Copier', actif: true }, { icone: '📋', label: 'Coller', actif: true }, { label: 'Collage spécial…' }, '-', { label: 'Insérer…' }, { label: 'Supprimer…' }] },
    },
    {
      humeur: 'accueil',
      dit: '**Méthode 3, les raccourcis clavier** (les plus rapides). Sur Mac, utilise ⌘ à la place de Ctrl.',
      visuel: { type: 'operateurs', items: [{ s: 'Ctrl + C', l: 'copier' }, { s: 'Ctrl + X', l: 'couper (pour déplacer)' }, { s: 'Ctrl + V', l: 'coller' }] },
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
    { humeur: 'accueil', dit: 'Cas très utile : en D2 tu as un total calculé par une formule, =B2*C2, qui affiche 10.', visuel: tabCol({ D2: { t: '=B2*C2' }, B2: { t: '2', num: true, ref: true }, C2: { t: '5', num: true, ref: true } }, '=B2*C2', 'D2') },
    { humeur: 'pensif', dit: 'Avec **Collage spécial > Valeurs**, tu colles le résultat **10** tout seul, sans la formule. Pratique pour figer un résultat.', visuel: tabCol({ D2: { t: '10', num: true, vert: true } }, null, 'D2') },
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
      dit: 'Voici la boîte « Insérer une fonction ». Tu sélectionnes la fonction, ici **MOYENNE**. En bas, Excel explique à quoi elle sert.',
      visuel: { type: 'assistant', categorie: 'Les dernières utilisées', fonctions: ['SI', 'RECHERCHEX', 'RECHERCHEV', 'SOMME.SI.ENS', 'MOYENNE', 'SOMME', 'LIEN_HYPERTEXTE'], selection: 4, signature: 'MOYENNE(nombre1;nombre2;...)', description: 'Renvoie la moyenne (arithmétique) des arguments, qui peuvent être des nombres, des noms ou des plages.', focus: 'liste' },
    },
    {
      humeur: 'pensif',
      dit: 'Tu cliques sur **OK** : Excel ouvre les arguments. Tu cliques les cellules une par une (B2, B3, B4), et **Nombre4 reste vide** (tous les arguments ne sont pas obligatoires). En bas, l\'aperçu du résultat et la définition s\'affichent.',
      visuel: { type: 'arguments', fonction: 'MOYENNE', args: [{ label: 'Nombre1', ref: 'B2', valeur: '14' }, { label: 'Nombre2', ref: 'B3', valeur: '16' }, { label: 'Nombre3', ref: 'B4', valeur: '12' }, { label: 'Nombre4', ref: '', valeur: 'nombre' }], apercu: '14', description: 'Renvoie la moyenne (arithmétique) des arguments.', resultat: '14', encadre: true },
    },
    { humeur: 'fier', dit: 'Un dernier OK, et Excel place =MOYENNE(B2;B3;B4) dans la cellule. Résultat : 14. 🎉', visuel: tabAss('=MOYENNE(B2;B3;B4)', { t: '14', num: true, vert: true }) },
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
    { humeur: 'pensif', dit: 'Pour une **date** : tape 01/05/2025, tire, et Excel ajoute un jour à chaque cellule. (La cellule doit être au format date.)', visuel: tabSerie({ A1: { t: '01/05/2025' }, B1: { t: '02/05/2025', vert: true }, C1: { t: '03/05/2025', vert: true } }, 'A1') },
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
    { humeur: 'accueil', dit: 'Pour une suite de **nombres** avec un écart : tape les deux premiers (1 puis 3), sélectionne-les, et tire. Excel comprend « +2 ».', visuel: tabSerie({ A1: { t: '1', num: true }, B1: { t: '3', num: true }, C1: { t: '5', num: true, vert: true }, D1: { t: '7', num: true, vert: true }, E1: { t: '9', num: true, vert: true } }, 'B1'), plus: ['Tu veux 1, 2, 3, 4, 5… ? ou une série avec un écart (par exemple +2) ? Tape les deux premiers chiffres de ta suite dans deux cellules consécutives (ex : 1 puis 3), sélectionne les deux cellules, puis tire la poignée de recopie. Excel détecte la logique (ici, +2) et continue automatiquement : 5, 7, 9…', 'Pour une suite simple 1, 2, 3 : tape 1 dans une cellule, puis tire la poignée en maintenant la touche CTRL.'] },
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
      dit: '**Insérer une ligne ou une colonne, méthode 1, le ruban :** sélectionne une cellule, va dans l\'onglet **Accueil > groupe Cellules**, clique sur **Insérer**, puis choisis Insérer des lignes (ou des colonnes).',
      visuel: { type: 'ruban', actif: 'Accueil', groupeNom: 'Cellules', groupes: [{ icone: '⊞', label: 'Insérer', actif: true }, { icone: '⊟', label: 'Supprimer' }, { icone: '▤', label: 'Format' }] },
      plus: ['Méthode 1 : via le ruban. 1. Sélectionne une cellule. 2. Va dans l\'onglet Accueil, groupe Cellules. 3. Clique sur Insérer (icône en forme de petit tableau avec une flèche). 4. Choisis : Insérer des lignes dans la feuille, ou Insérer des colonnes dans la feuille.'],
    },
    {
      humeur: 'pensif',
      dit: '**Méthode 2, le clic droit :** clique droit sur l\'**en-tête** de la ligne (le chiffre) ou de la colonne (la lettre), puis choisis **Insérer** dans le menu.',
      visuel: { type: 'menu', items: [{ icone: '✂', label: 'Couper' }, { icone: '📄', label: 'Copier' }, { icone: '📋', label: 'Coller' }, '-', { icone: '⊞', label: 'Insérer', actif: true }, { icone: '⊟', label: 'Supprimer' }] },
      plus: ['Méthode 2 : clic droit. 1. Clique droit sur l\'en-tête de la ligne ou de la colonne (lettre ou chiffre). 2. Choisis Insérer dans le menu contextuel.'],
    },
    {
      humeur: 'accueil',
      dit: '**Supprimer**, c\'est la même logique : sélectionne la ligne ou la colonne, puis **Accueil > Cellules > Supprimer**, ou bien **clic droit sur l\'en-tête > Supprimer**.',
      visuel: { type: 'menu', items: [{ icone: '✂', label: 'Couper' }, { icone: '📄', label: 'Copier' }, '-', { icone: '⊞', label: 'Insérer' }, { icone: '⊟', label: 'Supprimer', actif: true }] },
      plus: ['Supprimer des lignes ou des colonnes. Méthode 1, via le ruban : 1. Sélectionne la ligne ou la colonne à supprimer. 2. Onglet Accueil > groupe Cellules > bouton Supprimer. 3. Choisis : Supprimer des lignes, ou Supprimer des colonnes.', 'Méthode 2 : clic droit sur l\'en-tête de la ligne ou de la colonne, puis Supprimer.'],
    },
    {
      humeur: 'pensif',
      dit: 'Une astuce pour aller plus vite :',
      visuel: { type: 'encart', label: 'Astuce', texte: 'Pour insérer ou supprimer **plusieurs** lignes ou colonnes d\'un coup, commence par en **sélectionner plusieurs** (clique-glisse sur les en-têtes), puis utilise une des deux méthodes.' },
    },
    {
      humeur: 'accueil',
      dit: '**Adapter la largeur d\'une colonne à la main :** place ta souris sur la **limite droite** de l\'en-tête de colonne (le curseur devient une double flèche), puis clique-glisse vers la droite pour l\'élargir. À toi d\'essayer !',
      visuel: { type: 'elargir' },
      plus: ['Personnaliser manuellement la taille. Largeur de colonne : 1. Place ta souris sur la limite droite de l\'en-tête de colonne (ex : entre C et D). 2. Clique-glisse vers la droite ou la gauche pour élargir ou réduire.', 'Hauteur de ligne : 1. Place ta souris sur la limite inférieure de l\'en-tête de ligne (ex : entre la ligne 5 et 6). 2. Clique-glisse vers le haut ou le bas.'],
    },
    {
      humeur: 'accueil',
      dit: '**Astuce rapide :** double-clique sur la limite droite de l\'en-tête de colonne, et Excel ajuste **automatiquement** la largeur au contenu le plus long.',
      visuel: { type: 'tableur', cols: ['A', 'B', 'C'], rows: [1, 2, 3], cells: { A1: { t: 'Produit', entete: true }, B1: { t: 'Désignation complète', entete: true }, C1: { t: 'Prix', entete: true }, A2: { t: 'Clavier' }, B2: { t: 'Clavier mécanique' }, C2: { t: '30 €', num: true }, A3: { t: 'Écran' }, B3: { t: 'Écran 27 pouces' }, C3: { t: '150 €', num: true } }, legende: 'Double-clic sur le bord droit de l\'en-tête : la colonne s\'ajuste toute seule au texte le plus long.' },
    },
    {
      humeur: 'pensif',
      dit: '**La commande Format**, pour une taille précise et identique : sélectionne les colonnes (ou lignes), va dans **Accueil > Cellules > Format**, puis choisis Largeur de colonne (valeur exacte) ou Ajuster la largeur de colonne (automatique).',
      visuel: { type: 'ruban', actif: 'Accueil', groupeNom: 'Cellules', groupes: [{ icone: '⊞', label: 'Insérer' }, { icone: '⊟', label: 'Supprimer' }, { icone: '▤', label: 'Format', actif: true }] },
      plus: ['Utiliser la commande "Format" : 1. Sélectionne les colonnes ou lignes à modifier. 2. Va dans Accueil > Cellules > Format. 3. Choisis : Ajuster la largeur de colonne, ou Ajuster la hauteur de ligne.', 'Astuce pratique : sélectionne plusieurs en-têtes de colonnes (ou de lignes) et modifie la taille de l\'une d\'elles : toutes prendront la même taille. Et utilise le double-clic pour aller vite.'],
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
      plus: ['Dans Excel, l\'onglet Accueil te permet d\'accéder rapidement à toutes les options de mise en forme des cellules. Ces outils sont accessibles via le ruban, sous forme d\'icônes. Quand tu survoles une option, Excel affiche un aperçu instantané pour te montrer le résultat avant même de cliquer.'],
    },
    {
      humeur: 'accueil',
      dit: 'Ce que tu peux formater depuis le ruban :',
      visuel: { type: 'parties', items: [{ label: 'La police : taille, couleur, gras, italique' }, { label: 'L\'alignement du texte dans la cellule' }, { label: 'Les bordures et la couleur de fond' }, { label: 'Le format des nombres (€, %, décimales)' }] },
    },
    {
      humeur: 'pensif',
      dit: '**Pour tout régler au même endroit**, ouvre la boîte de dialogue Format de cellule :',
      visuel: { type: 'etapes', items: ['Sélectionne une cellule ou une plage', 'Onglet Accueil > clique sur le petit lanceur (la flèche en bas à droite) du groupe Nombre', 'Une fenêtre s\'ouvre avec plusieurs onglets'] },
      plus: ['La boîte de dialogue permet d\'accéder à toutes les options de mise en forme au même endroit, pour personnaliser précisément l\'affichage des cellules.', 'Comment ouvrir la boîte de dialogue ? 1. Sélectionne une cellule ou une plage. 2. Clique sur le lanceur de boîte de dialogue dans le groupe Nombre de l\'onglet Accueil (petite flèche en bas à droite). 3. Une fenêtre s\'ouvre avec plusieurs onglets.'],
    },
    {
      humeur: 'accueil',
      dit: 'La voici. Elle a **6 onglets** : chacun gère une famille de réglages.',
      visuel: { type: 'formatcellule', actif: 'Nombre' },
    },
    {
      humeur: 'pensif',
      dit: 'À quoi sert chaque onglet :',
      visuel: { type: 'parties', items: [{ label: 'Nombre : choisir un format (date, heure, pourcentage, monétaire...)' }, { label: 'Alignement : centrer, justifier, orienter, retour à la ligne' }, { label: 'Police : taille, couleur, police de caractères' }, { label: 'Bordure : cadres autour ou à l\'intérieur des cellules' }, { label: 'Remplissage : couleur d\'arrière-plan' }, { label: 'Protection : empêcher la modification de certaines cellules' }] },
      plus: ['Onglet Nombre : choisir un format (date, heure, pourcentage, monétaire, etc.). Onglet Alignement : centrer, justifier, orienter le texte, gérer le retour à la ligne. Onglet Police : modifier la taille, la couleur ou la police de caractères. Onglet Bordure : ajouter des cadres autour ou à l\'intérieur des cellules. Onglet Remplissage : changer la couleur d\'arrière-plan. Onglet Protection : empêcher la modification de certaines cellules.'],
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
      dit: '**Encadrer avec des bordures, méthode rapide :** sélectionne ta plage, clique sur l\'icône **Bordures** dans **Accueil > groupe Police**, puis choisis un style (ex : Toutes les bordures).',
      visuel: { type: 'borduresfond', menu: true },
      plus: ['Encadrer les cellules avec des bordures. Méthode rapide : 1. Sélectionne ta plage de cellules. 2. Clique sur l\'icône Bordures dans l\'onglet Accueil > groupe Police. 3. Choisis un style (ex : Toutes les bordures).'],
    },
    {
      humeur: 'pensif',
      dit: '**Méthode avancée, personnalisée :** clic droit > **Format de cellule** > onglet **Bordure**. Là, tu choisis le style du trait, la couleur, et les côtés à appliquer (haut, bas, intérieur...).',
      visuel: { type: 'formatcellule', actif: 'Bordure' },
      plus: ['Méthode avancée (personnalisée) : 1. Clic droit > Format de cellule. 2. Onglet Bordure. 3. Choisis : le style du trait, la couleur, les côtés à appliquer (haut, bas, intérieur...).'],
    },
    {
      humeur: 'accueil',
      dit: '**Modifier la couleur de fond :** sélectionne tes cellules, clique sur le bouton **Remplissage** (le pot de peinture) dans **Accueil > groupe Police**, et choisis une couleur.',
      visuel: { type: 'borduresfond' },
      plus: ['Modifier la couleur de fond : 1. Sélectionne ta ou tes cellules. 2. Clique sur le bouton Remplissage dans l\'onglet Accueil > groupe Police. 3. Choisis une couleur.'],
    },
    {
      humeur: 'accueil',
      dit: '**Modifier la couleur du texte :** sélectionne la cellule, clique sur l\'icône **Couleur de police** (le A coloré) dans **Accueil > Police**, puis choisis la couleur.',
      visuel: { type: 'tableur', cols: ['A', 'B'], rows: [1, 2], cells: { A1: { t: 'Produit', entete: true }, B1: { t: 'État', entete: true }, A2: { t: 'Clavier' }, B2: { t: 'Soldes' } }, refsCouleur: { B2: 'violet' }, legende: 'La couleur de police met un mot en valeur (ici « Soldes » en couleur).' },
      plus: ['Modifier la couleur du texte. Étapes pas à pas : 1. Sélectionne la cellule ou le texte. 2. Clique sur l\'icône couleur de police dans l\'onglet Accueil > Police. 3. Choisis la couleur désirée.'],
    },
    {
      humeur: 'pensif',
      dit: 'Attention, le piège du « trop » :',
      visuel: { type: 'encart', label: 'Erreurs à éviter', texte: 'Trop de couleurs vives diminue la lisibilité. Pas de contraste entre le fond et le texte rend la lecture difficile. Trop de styles de bordures donne un effet fouillis.' },
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
      dit: '**Méthode complète, la boîte Format de cellule :** sélectionne tes cellules de nombres, ouvre Format de cellule (le lanceur du groupe **Nombre**), et choisis un format : Standard, Nombre, Monétaire, Comptabilité, Pourcentage...',
      visuel: { type: 'formatcellule', actif: 'Nombre', categorieActive: 'Monétaire', categories: ['Standard', 'Nombre', 'Monétaire', 'Comptabilité', 'Pourcentage', 'Personnalisé'], titreDroite: 'Aperçu :', types: ['1 234,50 €', '1 234,50 $', '1 234,50'] },
      plus: ['Utiliser la boîte "Format de cellule". Les étapes pour accéder à la fenêtre : 1. Sélectionne une ou plusieurs cellules avec des nombres. 2. Onglet Accueil > clique sur le petit lanceur dans le groupe Nombre. 3. Dans la fenêtre, choisis un format : Standard, Nombre, Monétaire, Comptabilité, Pourcentage, Scientifique, Personnalisé...'],
    },
    {
      humeur: 'accueil',
      dit: '**Plus rapide, via le ruban :** dans **Accueil > groupe Nombre**, des boutons changent le format en un clic. La même valeur s\'affiche alors différemment :',
      visuel: { type: 'formatnombre' },
      plus: ['Raccourcis rapides via l\'onglet Accueil : 1. Sélectionne une ou plusieurs cellules avec des nombres. 2. Va dans l\'onglet Accueil > groupe Nombre. 3. Clique sur la liste déroulante pour changer de format : Monétaire (ex : 1 000,00 €), Pourcentage (ex : 0,75 devient 75 %), Séparateur de milliers (ex : 1000 → 1 000), Ajouter une décimale, Supprimer une décimale.'],
    },
    {
      humeur: 'accueil',
      dit: 'À quoi ça sert, dans la vraie vie :',
      visuel: { type: 'parties', items: [{ label: 'Afficher des prix ou des totaux proprement' }, { label: 'Exprimer une tendance ou une part en %' }, { label: 'Préparer un document pour l\'impression ou un client' }, { label: 'Comparer des valeurs alignées, avec cohérence' }] },
    },
    {
      humeur: 'pensif',
      dit: 'Les pièges classiques du format des nombres :',
      visuel: { type: 'encart', label: 'Erreurs fréquentes', texte: 'Oublier le format « % » : un 0,45 sera mal interprété (0,45 au lieu de 45 %). Mélanger les formats dans une même colonne (du nombre et du texte). Mettre trop de décimales : une surcharge visuelle inutile.' },
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
      dit: '**Le pinceau (Reproduire la mise en forme) :** clique sur la cellule **modèle**, clique sur l\'icône **Pinceau** dans **Accueil > Presse-papiers**, puis clique sur la cellule à repeindre. Pour l\'éteindre, re-clique sur l\'icône ou appuie sur **Échap**.',
      visuel: { type: 'pinceau' },
      plus: ['Utilise l\'outil "Reproduire la mise en forme", aussi appelé pinceau magique. 1. Sélectionne la cellule source (celle qui a le style que tu veux copier). 2. Clique sur l\'icône Pinceau dans l\'onglet Accueil > groupe Presse-papiers. 3. Clique sur la cellule que tu veux modifier. 4. Pour désactiver le pinceau, clique à nouveau sur l\'icône ou appuie sur Échap.'],
    },
    {
      humeur: 'pensif',
      dit: 'Un détail bien pratique avec le pinceau :',
      visuel: { type: 'encart', label: 'Bon à savoir', texte: 'Si tu cliques sur le pinceau puis que tu **fais glisser** ta souris sur plusieurs cellules, la mise en forme s\'applique à **toute la plage**. Si tu cliques une seule fois, elle s\'applique à **une seule** cellule.' },
    },
    {
      humeur: 'accueil',
      dit: '**Les styles de cellule** sont des mises en forme prêtes à l\'emploi (police, taille, couleur, alignement, bordure regroupés). Pour en appliquer un : **Accueil > groupe Style > Styles de cellule**, survole pour l\'aperçu, puis clique.',
      visuel: { type: 'styles' },
      plus: ['Un style de cellule regroupe plusieurs éléments de mise en forme : Police, Taille, Couleur, Alignement, Bordure.', 'Étapes pour appliquer un style : 1. Sélectionne la ou les cellules à formater. 2. Va dans Accueil > groupe Style. 3. Clique sur Styles de cellule. 4. Survole les styles proposés pour voir un aperçu. 5. Clique sur le style souhaité.'],
    },
    {
      humeur: 'accueil',
      dit: 'Pourquoi utiliser les styles :',
      visuel: { type: 'parties', items: [{ label: 'Gagner du temps avec une mise en forme homogène, sans la choisir à la main' }, { label: 'Structurer visuellement les tableaux (titres, totaux, alertes)' }] },
    },
    {
      humeur: 'pensif',
      dit: '**Créer ton propre style** (pratique pour tes devis ou factures) : **Accueil > Styles de cellule > Nouveau style de cellule**, nomme-le, clique sur **Format** pour définir police, bordures, fond, alignement, puis valide.',
      visuel: { type: 'etapes', items: ['Accueil > Styles de cellule > Nouveau style de cellule', 'Nomme ton style', 'Clique sur Format pour définir : police, bordures, couleur de fond, alignement', 'Valide une première fois, puis OK'] },
      plus: ['Créer ton propre style : 1. Va dans l\'onglet Accueil > Styles de cellule > Nouveau style de cellule. 2. Nomme ton style. 3. Clique sur Format pour définir : Police, Bordures, Couleur de fond, Alignement. 4. Valide une première fois, puis OK.', 'Astuce pratique : tu peux utiliser les styles personnalisés dans le fichier en cours (ils y sont mémorisés). Pour les réutiliser dans d\'autres fichiers, enregistre ton document comme modèle Excel (.xltx).'],
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
      dit: '**Les thèmes :** un thème applique à **tout le classeur** une palette de couleurs, une police cohérente et des effets unifiés. Va dans **Mise en page > groupe Thèmes**, survole pour prévisualiser, clique pour appliquer.',
      visuel: { type: 'ruban', actif: 'Mise en page', groupeNom: 'Thèmes', groupes: [{ icone: '🎨', label: 'Thèmes', actif: true }, { icone: 'A', label: 'Polices' }, { icone: '🎨', label: 'Couleurs' }] },
      plus: ['Un thème permet d\'appliquer à tout ton classeur : une palette de couleurs, une police cohérente, des effets graphiques unifiés. Pour appliquer un thème : 1. Va dans l\'onglet Mise en page > groupe Thèmes. 2. Survole les thèmes pour prévisualiser le rendu. 3. Clique pour appliquer.', 'Bon à savoir : le thème s\'applique à tout le classeur, pas à une seule feuille.'],
    },
    {
      humeur: 'accueil',
      dit: '**Le mode Page** te montre la feuille telle qu\'elle sera imprimée (marges, en-têtes, sauts de page). **L\'aperçu des sauts de page** montre où ça coupera à l\'impression.',
      visuel: { type: 'apercuimpression', orientation: 'portrait', legende: 'Le mode Page affiche la feuille telle qu\'elle sera imprimée, avec ses marges et ses zones.' },
      plus: ['Aperçu des sauts de page : pour visualiser où se fera la coupure à l\'impression. Mode Page : pour voir toutes les pages imprimables et régler les marges, en-têtes, pieds de page.', 'Via le ruban : 1. Clique sur l\'onglet Affichage. 2. Dans le groupe Mode Affichage, clique sur Mise en page. 3. Tu vois désormais : les sauts de page en pointillés ou en bleu, les zones en-tête et pied de page, le découpage exact des pages. Tu peux revenir au mode normal à tout moment via Affichage > Mode Normal.'],
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
      dit: '**L\'orientation :** portrait (vertical) ou paysage (horizontal), selon la largeur de ton tableau. Un tableau large respire mieux en paysage.',
      visuel: { type: 'apercuimpression', orientation: 'paysage', legende: 'Paysage : idéal quand le tableau a beaucoup de colonnes.' },
    },
    {
      humeur: 'pensif',
      dit: '**La zone d\'impression** définit quelles cellules seront imprimées : sélectionne la plage, puis **Mise en page > Zone d\'impression > Définir**.',
      visuel: { type: 'tableur', cols: ['A', 'B', 'C'], rows: [1, 2, 3], cells: { A1: { t: 'Produit', entete: true }, B1: { t: 'Prix', entete: true }, C1: { t: 'Note' }, A2: { t: 'Clavier', ref: true }, B2: { t: '30', ref: true }, C2: { t: 'interne' }, A3: { t: 'Souris', ref: true }, B3: { t: '20', ref: true }, C3: { t: 'interne' } }, legende: 'La plage sélectionnée (en bleu) est la seule qui sera imprimée. Vérifie avec Fichier > Imprimer.' },
      plus: ['Définir une zone d\'impression : la zone d\'impression détermine quelles cellules seront imprimées. 1. Sélectionne la plage de cellules à imprimer. 2. Va dans le groupe Mise en page > Zone d\'impression > Définir. Pour vérifier que la zone a bien été définie, clique sur Fichier, puis sur Imprimer : l\'aperçu à droite te montre exactement la partie qui sera imprimée.'],
    },
    {
      humeur: 'accueil',
      dit: '**Répéter les titres :** pour que les en-têtes de colonnes apparaissent sur **chaque page**, va dans **Mise en page > Imprimer les titres**, et choisis les lignes à répéter en haut.',
      visuel: { type: 'etapes', items: ['Va dans Mise en page', 'Clique sur Imprimer les titres', 'Dans la fenêtre, sélectionne : Lignes à répéter en haut, Colonnes à répéter à gauche'] },
      plus: ['Répéter les titres à l\'impression : idéal pour que les titres de colonnes apparaissent sur chaque page imprimée. 1. Va dans Mise en page. 2. Clique sur Imprimer les titres. 3. Dans la fenêtre qui s\'ouvre, sélectionne : Lignes à répéter en haut, Colonnes à répéter à gauche.'],
    },
    {
      humeur: 'pensif',
      dit: '**La mise à l\'échelle** ajuste ton tableau pour qu\'il tienne sur une page : **Mise en page > Mise à l\'échelle > « 1 page de large sur 1 page de haut »**.',
      visuel: { type: 'encart', label: 'Attention à la lisibilité', texte: 'La mise à l\'échelle est pratique, mais Excel **réduit la taille de la police** si le tableau est trop grand. Vérifie toujours que ça reste lisible.' },
      plus: ['Mise à l\'échelle automatique : pour ajuster ton tableau à une ou plusieurs pages, sans couper les colonnes. 1. Va dans l\'onglet Mise en page > groupe Mise à l\'échelle. 2. Choisis : "1 page de large sur 1 page de haut". 3. Le texte sera automatiquement redimensionné. Attention à la lisibilité ! Excel réduit la taille de police si le tableau est trop grand.'],
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
      dit: '**L\'en-tête** est la zone en **haut** de chaque page imprimée (titre, nom de l\'auteur ou de l\'entreprise, date, logo...). **Le pied de page** est en **bas** (numéro de page, date, mention de confidentialité, contact...).',
      visuel: { type: 'apercuimpression', zones: true, legende: 'En-tête en haut, pied de page en bas, répétés sur chaque page imprimée.' },
      plus: ['En-tête : c\'est la zone située en haut de chaque page imprimée. On y ajoute souvent des informations importantes comme le titre du document, le nom de l\'auteur ou de l\'entreprise, la date ou le nom de la feuille, un logo...', 'Pied de page : c\'est la zone située en bas de chaque page imprimée. Elle sert à afficher par exemple : le numéro de page, une date d\'impression, une mention de confidentialité, une URL ou un contact.'],
    },
    {
      humeur: 'accueil',
      dit: 'À quoi ça sert, un en-tête/pied de page :',
      visuel: { type: 'parties', items: [{ label: 'Donner un aspect professionnel et structuré au document' }, { label: 'Faciliter la lecture quand on imprime plusieurs pages' }, { label: 'Ajouter des repères utiles (numéro de page, date, nom de la feuille)' }] },
      plus: ['Ces zones ne sont pas visibles à l\'écran pendant l\'édition normale, mais elles apparaissent : en mode page, dans l\'aperçu avant impression, et sur la version papier du document.'],
    },
    {
      humeur: 'pensif',
      dit: '**Pour insérer un en-tête ou un pied de page :** onglet **Mise en page** > petite **flèche** (lanceur) du groupe Mise en page > onglet **En-tête/Pied de page** > choisis un modèle.',
      visuel: { type: 'etapes', items: ['Clique sur l\'onglet Mise en page', 'Clique sur la petite flèche (lanceur) en bas à droite du groupe', 'Choisis l\'onglet En-tête/Pied de page', 'Sélectionne un modèle : En-tête (haut) ou Pied de page (bas)'] },
      plus: ['Pour insérer un en-tête ou un pied de page : 1. Clique sur l\'onglet Mise en page. 2. Clique sur la petite flèche (lanceur de boîte de dialogue) en bas à droite du groupe. 3. Une fenêtre s\'ouvre : choisis l\'onglet En-tête/Pied de page. 4. Sélectionne un modèle dans En-tête (haut de page) ou Pied de page (bas de page).'],
    },
    {
      humeur: 'accueil',
      dit: 'Tu peux aussi **personnaliser**. Clique sur **Personnalisé** pour ajouter :',
      visuel: { type: 'etapes', items: ['Date, Heure', 'Nom de l\'auteur', 'Titre du fichier', 'Numéro de page', 'Image ou logo', 'Puis clique sur OK pour valider'] },
      plus: ['Tu peux également personnaliser ton en-tête ou pied de page ! 1. Clique sur Personnalisé pour ajouter : Date, Heure, Nom de l\'auteur, Titre du fichier, Numéro de page, Image ou logo. 2. Clique sur OK pour valider.'],
    },
    {
      humeur: 'accueil',
      dit: '**Imprimer :** menu **Fichier > Imprimer**. Choisis l\'imprimante, ce que tu imprimes, ajuste, vérifie l\'aperçu, puis imprime.',
      visuel: { type: 'etapes', items: ['Menu Fichier > Imprimer', 'Choisis ton imprimante', 'Choisis quoi imprimer : feuilles actives, tout le classeur, ou sélection', 'Ajuste : format papier (A4, Paysage...), nombre de copies, pages', 'Vérifie dans l\'aperçu avant impression', 'Clique sur Imprimer'] },
      plus: ['Méthode : impression. 1. Menu Fichier > clique sur Imprimer. 2. Choisis ton imprimante. 3. Choisis ce que tu veux imprimer : Feuilles actives, Tout le classeur, Sélection uniquement. 4. Ajuste : le format papier (A4, Paysage...), le nombre de copies, les pages à imprimer. 5. Vérifie dans l\'aperçu avant impression. 6. Clique sur Imprimer.'],
    },
    {
      humeur: 'pensif',
      dit: 'Avant de cliquer, **vérifie toujours l\'aperçu** à droite : tu vois exactement ce qui sortira sur le papier.',
      visuel: { type: 'apercuimpression', orientation: 'portrait', legende: 'L\'aperçu, à droite de Fichier > Imprimer : ton document tel qu\'il sera imprimé.' },
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

export const LECONS_FONCTIONS = { calculs: CALCULS, saisie: SAISIE, recopie: RECOPIE, series: SERIES, deplacer: DEPLACER, collage: COLLAGE, somme: SOMME, assistant: ASSISTANT, references: REFERENCES, si: SI, lignescolonnes: LIGNESCOLONNES, miseenforme: MISEENFORME, couleurs: COULEURS, nombres: NOMBRES, pinceaustyles: PINCEAUSTYLES, miseenpage: MISEENPAGE, impression: IMPRESSION }
