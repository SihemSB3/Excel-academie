import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// fs.allow permet d'importer les fichiers chapitre-*.json situés un niveau au-dessus
// (la source de vérité du contenu vit dans livrables/excel-dojo/, pas dans app/)
export default defineConfig({
  plugins: [react()],
  server: {
    fs: { allow: ['..', '.'] },
  },
})
