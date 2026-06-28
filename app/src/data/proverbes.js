// Maximes du Shifu, dans l'esprit Shaolin de Sihem (« tu manques de méthode, pas de motivation »).
export const PROVERBES = [
  'Un geste répété mille fois devient un réflexe.',
  "La maîtrise n'est pas un sprint, c'est un entraînement quotidien.",
  'Chaque erreur enseigne. Le maître a chuté plus souvent que l\'élève n\'a essayé.',
  'Avance d\'un pas chaque jour, et la montagne sera gravie.',
  'Ce n\'est pas la motivation qui te manque, c\'est la méthode.',
  'Le calme et la régularité valent mieux que la force.',
  'Le débutant et le maître font les mêmes gestes. Le maître les a juste faits plus souvent.',
]

// Un proverbe stable sur la journée (change chaque jour)
export const proverbeDuJour = () => PROVERBES[new Date().getDate() % PROVERBES.length]
