// Coloration syntaxique légère d'une formule Excel (partagée par plusieurs écrans).
export function coloreFormule(str) {
  const re = /(\$?[A-Z]+\$?\d+(?::\$?[A-Z]+\$?\d+)?)|([A-Z]{2,})(?=\()|("[^"]*")|(=)/g
  const out = []
  let last = 0
  let k = 0
  let m
  while ((m = re.exec(str)) !== null) {
    if (m.index > last) out.push(<span key={k++}>{str.slice(last, m.index)}</span>)
    let c = ''
    if (m[1]) c = 'text-sky-600'
    else if (m[2]) c = 'text-amber-600'
    else if (m[3]) c = 'text-emerald-600'
    else if (m[4]) c = 'text-mint font-bold'
    out.push(
      <span key={k++} className={c}>
        {m[0]}
      </span>,
    )
    last = m.index + m[0].length
  }
  if (last < str.length) out.push(<span key={k++}>{str.slice(last)}</span>)
  return out
}
