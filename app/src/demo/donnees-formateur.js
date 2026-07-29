// Jeu de données FICTIF pour la démonstration commerciale de l'espace formateur.
// Aucun lien avec de vraies personnes ni avec la base Supabase : ce fichier sert
// uniquement à montrer à un prospect (école, organisme de formation) ce qu'il
// verra quand ses apprenants seront réellement inscrits.
//
// Volontairement figé (pas de tirage aléatoire) : une démo doit afficher les
// mêmes chiffres à chaque fois, sinon impossible de préparer son discours.

export const ORGANISATION = {
  nom: 'ESC Rive Gauche',
  groupe: 'Bachelor 2, groupe A',
  formateur: 'C. Rousseau',
  licences: 30,
  periode: 'du 15 septembre au 20 décembre',
}

// Date fictive à laquelle on se place pour la démonstration. Dans le produit réel,
// ce sera la date du jour. Elle sert à savoir quelle échéance est déjà passée,
// donc combien de chapitres sont attendus aujourd'hui.
export const DATE_DEMO = '2026-11-18'

// Le rythme fixé par le formateur : à chaque échéance, le nombre de chapitres que
// ses apprenants doivent avoir terminés. C'est ce qui définit « en retard ».
// Dates au format AAAA-MM-JJ, modifiables depuis l'écran.
export const JALONS = [
  { id: 'j1', date: '2026-10-15', chapitres: 2 },
  { id: 'j2', date: '2026-11-15', chapitres: 4 },
  { id: 'j3', date: '2026-12-20', chapitres: 6 },
]

// katas : nombre d'entraînements consignés dans le journal (donnée réellement suivie).
// dernierAccesJours : nombre de jours depuis la dernière connexion.
// quiz : moyenne aux quiz de validation, sur 100.
// tempsMin : temps passé dans le parcours, en minutes.
export const APPRENANTS = [
  { id: 1, prenom: 'Inès', nom: 'Berthier', chapitres: 13, quiz: 94, tempsMin: 812, dernierAccesJours: 1, katas: 91 },
  { id: 2, prenom: 'Malik', nom: 'Ferrand', chapitres: 11, quiz: 91, tempsMin: 690, dernierAccesJours: 1, katas: 78 },
  { id: 3, prenom: 'Chloé', nom: 'Vasseur', chapitres: 9, quiz: 88, tempsMin: 570, dernierAccesJours: 2, katas: 63 },
  { id: 4, prenom: 'Antoine', nom: 'Deschamps', chapitres: 8, quiz: 85, tempsMin: 505, dernierAccesJours: 1, katas: 55 },
  { id: 5, prenom: 'Léa', nom: 'Marchetti', chapitres: 8, quiz: 90, tempsMin: 498, dernierAccesJours: 3, katas: 57 },
  { id: 6, prenom: 'Youssef', nom: 'Amrani', chapitres: 7, quiz: 82, tempsMin: 441, dernierAccesJours: 2, katas: 48 },
  { id: 7, prenom: 'Camille', nom: 'Fontaine', chapitres: 7, quiz: 87, tempsMin: 455, dernierAccesJours: 4, katas: 50 },
  { id: 8, prenom: 'Nathan', nom: 'Leroy', chapitres: 7, quiz: 79, tempsMin: 430, dernierAccesJours: 1, katas: 46 },
  { id: 9, prenom: 'Sarah', nom: 'Benali', chapitres: 6, quiz: 86, tempsMin: 388, dernierAccesJours: 2, katas: 42 },
  { id: 10, prenom: 'Lucas', nom: 'Perrin', chapitres: 6, quiz: 81, tempsMin: 372, dernierAccesJours: 5, katas: 40 },
  { id: 11, prenom: 'Manon', nom: 'Girard', chapitres: 6, quiz: 84, tempsMin: 366, dernierAccesJours: 3, katas: 41 },
  { id: 12, prenom: 'Théo', nom: 'Nguyen', chapitres: 6, quiz: 88, tempsMin: 359, dernierAccesJours: 1, katas: 43 },
  { id: 13, prenom: 'Emma', nom: 'Costa', chapitres: 6, quiz: 77, tempsMin: 381, dernierAccesJours: 6, katas: 39 },
  { id: 14, prenom: 'Hugo', nom: 'Barbier', chapitres: 6, quiz: 80, tempsMin: 344, dernierAccesJours: 4, katas: 40 },
  { id: 15, prenom: 'Jade', nom: 'Moreau', chapitres: 6, quiz: 83, tempsMin: 351, dernierAccesJours: 2, katas: 41 },
  { id: 16, prenom: 'Rayan', nom: 'Chaouch', chapitres: 6, quiz: 78, tempsMin: 337, dernierAccesJours: 7, katas: 38 },
  { id: 17, prenom: 'Alice', nom: 'Lemoine', chapitres: 5, quiz: 75, tempsMin: 292, dernierAccesJours: 9, katas: 33 },
  { id: 18, prenom: 'Ethan', nom: 'Roussel', chapitres: 5, quiz: 72, tempsMin: 281, dernierAccesJours: 12, katas: 31 },
  { id: 19, prenom: 'Nina', nom: 'Delaunay', chapitres: 4, quiz: 69, tempsMin: 228, dernierAccesJours: 16, katas: 25 },
  { id: 20, prenom: 'Samuel', nom: 'Ortiz', chapitres: 4, quiz: 74, tempsMin: 241, dernierAccesJours: 3, katas: 27 },
  { id: 21, prenom: 'Louise', nom: 'Aubert', chapitres: 3, quiz: 71, tempsMin: 176, dernierAccesJours: 19, katas: 19 },
  { id: 22, prenom: 'Adam', nom: 'Sissoko', chapitres: 3, quiz: 65, tempsMin: 168, dernierAccesJours: 5, katas: 18, bloqueChapitre: 4 },
  { id: 23, prenom: 'Clara', nom: 'Vidal', chapitres: 2, quiz: 62, tempsMin: 104, dernierAccesJours: 23, katas: 11 },
  { id: 24, prenom: 'Tom', nom: 'Rivière', chapitres: 1, quiz: 58, tempsMin: 47, dernierAccesJours: 11, katas: 5, bloqueChapitre: 2 },
]

export const SEUIL_INACTIF_JOURS = 14
