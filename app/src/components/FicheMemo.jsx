import { useEffect, useRef } from 'react'
import { useProgressCtx } from '../store/ProgressContext'
import { Bouton } from './ui'

export default function FicheMemo({ module, onTermine }) {
  const { validerEcran } = useProgressCtx()
  const ref = useRef(null)

  const terminer = () => {
    validerEcran(module.id, module.xp_completion || 0)
    onTermine()
  }

  // Apparition des fonctions au fur et à mesure du scroll
  useEffect(() => {
    const els = ref.current ? ref.current.querySelectorAll('.reveal') : []
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('reveal-visible'))
      return
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('reveal-visible')
            obs.unobserve(e.target)
          }
        })
      },
      { threshold: 0.15 },
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [module])

  // Télécharge la fiche seule (ouvre une vue propre prête à enregistrer en PDF)
  const telecharger = () => {
    const w = window.open('', '_blank')
    if (!w) return
    const lignes = module.fonctions
      .map(
        (f) => `
        <div class="f">
          <div class="h"><span class="nom">${f.nom}</span><code>${f.syntaxe}</code></div>
          <div class="but">${f.but}</div>
          <div class="ex">Ex : ${f.exemple}</div>
        </div>`,
      )
      .join('')
    w.document.write(`<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Fiche memo - Fonctions Excel essentielles</title>
      <style>
        body{font-family:system-ui,-apple-system,sans-serif;background:#f5f0e8;color:#0a335d;margin:0;padding:28px;}
        .sub{color:#41c1ba;font-weight:800;text-transform:uppercase;font-size:11px;letter-spacing:.06em;}
        h1{font-size:22px;margin:2px 0 18px;}
        .f{border:1px solid rgba(10,51,93,.12);border-radius:12px;padding:12px 14px;margin-bottom:10px;background:#fff;}
        .h{display:flex;justify-content:space-between;align-items:baseline;gap:8px;}
        .nom{color:#41c1ba;font-weight:800;font-size:17px;}
        code{background:#f5f0e8;border-radius:4px;padding:2px 7px;font-size:12px;font-family:ui-monospace,monospace;}
        .but{margin-top:5px;font-size:14px;}
        .ex{color:rgba(10,51,93,.5);font-size:12px;margin-top:1px;}
        .foot{margin-top:18px;color:rgba(10,51,93,.5);font-size:11px;text-align:center;}
        @media print{body{background:#fff;padding:12px;}}
      </style></head><body>
        <div class="sub">L'Art du Digital &middot; Excel Académie</div>
        <h1>Fiche mémo &ndash; Les fonctions essentielles</h1>
        ${lignes}
        <div class="foot">Excel Académie &middot; Astuce : enregistre cette page en PDF pour la garder sur ton téléphone.</div>
        <script>window.onload=function(){setTimeout(function(){window.print()},350)}</script>
      </body></html>`)
    w.document.close()
  }

  return (
    <div ref={ref} className="animate-fade-up px-5 py-6">
      <p className="text-xs font-bold uppercase tracking-wide text-mint">Fiche mémo</p>
      <h2 className="mt-1 font-display text-3xl text-navy">Les fonctions essentielles</h2>
      <button
        onClick={telecharger}
        className="mt-3 inline-flex items-center gap-2 rounded-full bg-mint/15 px-4 py-2 text-sm font-bold text-mint transition hover:bg-mint/25"
      >
        📥 Télécharger la fiche (PDF)
      </button>
      <div className="mt-4 space-y-2">
        {module.fonctions.map((f) => (
          <div key={f.nom} className="reveal rounded-xl border border-navy/10 bg-navy/5 p-3">
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-display text-lg text-mint">{f.nom}</span>
              <code className="rounded bg-cream px-2 py-0.5 text-xs text-navy/80">{f.syntaxe}</code>
            </div>
            <p className="mt-1 text-sm text-navy/80">{f.but}</p>
            <p className="text-xs text-navy/45">Ex : {f.exemple}</p>
          </div>
        ))}
      </div>
      <div className="mt-7">
        <Bouton onClick={terminer}>J'ai ma fiche, je continue</Bouton>
      </div>
    </div>
  )
}
