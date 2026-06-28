import { createClient } from '@supabase/supabase-js'

// Les clés viennent du fichier .env (jamais commité). Voir .env.example.
// L'anon key est conçue pour le frontend : elle est publique et sans danger.
const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Tant que les clés ne sont pas renseignées, supabase reste null et l'app
// continue de marcher en mode local (localStorage). On bascule en cloud dès
// que le .env est rempli.
export const supabase = url && anonKey ? createClient(url, anonKey) : null
export const supabaseActif = Boolean(supabase)
