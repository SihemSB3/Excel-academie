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
      dit: 'À quoi ça sert, dans la vraie vie :',
      visuel: { type: 'parties', items: [{ label: 'Afficher des prix ou des totaux proprement' }, { label: 'Exprimer une tendance ou une part en %' }, { label: 'Préparer un document pour l\'impression ou un client' }, { label: 'Comparer des valeurs alignées, avec cohérence' }] },
    },
    {
      humeur: 'pensif',
      dit: 'Les pièges classiques du format des nombres :',
      visuel: { type: 'encart', label: 'Erreurs fréquentes', liste: ['Oublier le format « % » : un 0,45 sera mal interprété (0,45 au lieu de 45 %).', 'Mélanger les formats dans une même colonne (du nombre et du texte).', 'Mettre trop de décimales : une surcharge visuelle inutile.'] },
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
      humeur: 'pensif',
      dit: 'Un détail bien pratique avec le pinceau :',
      visuel: { type: 'encart', label: 'Bon à savoir', liste: ['Tu cliques sur le pinceau puis **fais glisser** sur plusieurs cellules → la mise en forme s\'applique à **toute la plage**.', 'Tu cliques **une seule fois** → elle s\'applique à **une seule** cellule.'] },
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
      humeur: 'pensif',
      dit: 'Un point à savoir sur ces zones :',
      visuel: { type: 'encart', label: 'Bon à savoir', texte: 'Ces zones ne sont **pas visibles** à l\'écran en édition normale. Elles apparaissent en **mode Page**, dans l\'**aperçu avant impression**, et sur la **version papier**.' },
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
    { humeur: 'accueil', dit: 'On va la construire pas à pas dans la cellule B2. Le but : afficher « OK » si la note en A2 dépasse 10, sinon « À refaire ».', visuel: tabSI4({ t: '12' }) },
    { humeur: 'pensif', dit: '**Étape 1 :** clique dans B2 et tape **=**. Il s\'écrit dans la cellule et dans la barre de formule.', visuel: tabSI4({ t: '12' }, '=') },
    { humeur: 'pensif', dit: '**Étape 2 :** écris **SI** et ouvre une parenthèse.', visuel: tabSI4({ t: '12' }, '=SI(') },
    { humeur: 'accueil', dit: '**Argument 1, la condition :** on teste si A2 (la case bleue) est supérieur à 10.', visuel: tabSI4({ t: '12', ref: true }, '=SI(A2>10') },
    { humeur: 'pensif', dit: 'Un point-virgule **;** puis **argument 2, le résultat si VRAI**, entre guillemets.', visuel: tabSI4({ t: '12' }, '=SI(A2>10;"OK"') },
    { humeur: 'pensif', dit: 'Encore un **;** puis **argument 3, le résultat si FAUX**.', visuel: tabSI4({ t: '12' }, '=SI(A2>10;"OK";"À refaire"') },
    { humeur: 'pensif', dit: 'On ferme la parenthèse **)**. La formule complète est dans B2 et dans la barre de formule.', visuel: tabSI4({ t: '12' }, '=SI(A2>10;"OK";"À refaire")') },
    { humeur: 'fier', dit: 'On appuie sur **Entrée** : 12 > 10 ? Oui → B2 affiche **OK**.', visuel: tabSI4({ t: '12' }, '=SI(A2>10;"OK";"À refaire")', { t: 'OK', vert: true }) },
    { humeur: 'pensif', dit: 'Et si la note avait été 7 ? 7 > 10 ? Non → B2 affiche **À refaire**.', visuel: tabSI4({ t: '7' }, '=SI(A2>10;"OK";"À refaire")', { t: 'À refaire', rouge: true }) },
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
    { humeur: 'accueil', dit: '**Argument 1, le nombre :** clique sur A2 (la case bleue), la valeur à arrondir.', visuel: tabARR('=ARRONDI(A2') },
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
      dit: 'Un piège classique avec les relatives :',
      visuel: { type: 'encart', label: 'Bon à savoir', texte: 'Si tes formules ne se recalculent pas toutes seules, le mode de calcul est sûrement réglé sur « manuel ». Solution : **Formules > Options de calcul > Automatique**.' },
    },
    { humeur: 'accueil', dit: '**Les références absolues.** Parfois, une cellule doit rester fixe, même en recopiant : un taux de TVA, un seuil, une constante. Ici, le taux est en E2 et on veut le garder. On écrit =B2*$E$2.', visuel: tabREF4({ C2: { t: '=B2*$E$2' } }, '=B2*$E$2', 'C2', 'Les $ verrouillent E2 : le taux restera figé en recopiant.', { refsCouleur: { B2: 'bleu', E2: 'ambre' } }) },
    { humeur: 'fier', dit: 'En recopiant vers le bas, B2 s\'adapte (B3…) mais $E$2 reste figé. Tous les calculs tombent juste.', visuel: tabREF4({ C2: { t: '36', vert: true }, C3: { t: '24', vert: true } }, '=B3*$E$2', 'C3', 'B3 a changé (bleu), mais $E$2 (orange) est resté le même.', { refsCouleur: { B3: 'bleu', E2: 'ambre' } }) },
    {
      humeur: 'pensif',
      dit: 'Le raccourci pour mettre les $ sans les taper :',
      visuel: { type: 'encart', label: 'Astuce clavier', texte: 'Clique sur la cellule dans ta formule, puis appuie sur **F4** : Excel transforme B1 en $B$1. Si F4 ne marche pas tout seul, essaie **Fn + F4** (claviers portables). Sur **Mac**, utilise **⌘ + T**.' },
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
  formule: resultat ? '=VPM(B2/12;B3;-B1)' : '=VPM(B2/12;B3;-B1)',
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
      dit: 'Maintenant qu\'on sait ce que fait VPM, on la construit avec l\'**assistant fonction**.',
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

export const LECONS_FONCTIONS = { calculs: CALCULS, saisie: SAISIE, recopie: RECOPIE, series: SERIES, deplacer: DEPLACER, collage: COLLAGE, somme: SOMME, assistant: ASSISTANT, references: REFERENCES, si: SI, lignescolonnes: LIGNESCOLONNES, miseenforme: MISEENFORME, couleurs: COULEURS, nombres: NOMBRES, pinceaustyles: PINCEAUSTYLES, miseenpage: MISEENPAGE, impression: IMPRESSION, fonctionssimples: FONCTIONSSIMPLES, fonctionscomplexes: FONCTIONSCOMPLEXES, recopierformules: RECOPIERFORMULES, nomsformules: NOMSFORMULES, argumentsvpm: ARGUMENTSVPM }
