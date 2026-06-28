// Petit "ding" généré à la volée (Web Audio), sans fichier son à charger.
let actx

export function ding() {
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)()
    const notes = [660, 880]
    notes.forEach((freq, i) => {
      const o = actx.createOscillator()
      const g = actx.createGain()
      o.connect(g)
      g.connect(actx.destination)
      o.type = 'sine'
      o.frequency.value = freq
      const t = actx.currentTime + i * 0.12
      g.gain.setValueAtTime(0.0001, t)
      g.gain.exponentialRampToValueAtTime(0.18, t + 0.02)
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.32)
      o.start(t)
      o.stop(t + 0.34)
    })
  } catch (e) {
    /* audio indisponible : on ignore */
  }
}
