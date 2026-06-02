import { useState, useRef } from 'react'

const CHIPS = [
  'caffeine', 'cholesterol', 'aspirin', 'dopamine', 'serotonin',
  'glucose', 'ATP', 'resveratrol', 'pterostilbene', 'melatonin', 'glycine',
]

const MAX = 5

export default function App() {
  const [compounds, setCompounds] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const errorTimer = useRef(null)

  function flashError(msg) {
    setError(msg)
    clearTimeout(errorTimer.current)
    errorTimer.current = setTimeout(() => setError(''), 2000)
  }

  async function fetchByCid(cid) {
    const res = await fetch(
      `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/property/IUPACName,MolecularFormula,MolecularWeight/JSON`
    )
    if (!res.ok) throw new Error('not found')
    const data = await res.json()
    const props = data.PropertyTable.Properties[0]
    return {
      cid,
      name: props.IUPACName || `CID ${cid}`,
      formula: props.MolecularFormula,
      mw: parseFloat(props.MolecularWeight).toFixed(2),
      imgUrl: `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/PNG?image_size=400x400`,
      pageUrl: `https://pubchem.ncbi.nlm.nih.gov/compound/${cid}`,
    }
  }

  async function lookup(searchTerm = query) {
    const term = searchTerm.trim()
    if (!term) return
    setLoading(true)
    setError('')
    try {
      let cid
      const isCid = /^\d+$/.test(term)

      if (isCid) {
        cid = parseInt(term, 10)
      } else {
        const cidRes = await fetch(
          `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(term)}/cids/JSON`
        )
        if (!cidRes.ok) throw new Error('not found')
        const cidData = await cidRes.json()
        cid = cidData.IdentifierList.CID[0]
      }

      if (compounds.some(c => c.cid === cid)) {
        flashError(`${term} is already in the list.`)
        return
      }

      const compound = await fetchByCid(cid)
      if (!isCid) {
        compound.name = term.charAt(0).toUpperCase() + term.slice(1)
      }

      setCompounds(prev => {
        const next = [compound, ...prev]
        return next.length > MAX ? next.slice(0, MAX) : next
      })
      setQuery('')
    } catch {
      setError(`"${term}" not found. Try a different name, spelling, or CID number.`)
    } finally {
      setLoading(false)
    }
  }

  function remove(cid) {
    setCompounds(prev => prev.filter(c => c.cid !== cid))
    setError('')
  }

  function quickLook(name) {
    setQuery(name)
    lookup(name)
  }

  return (
    <div className="page">
      <h1>PubChem Structure Lookup</h1>
      <p className="subtitle">Search by name, IUPAC name, abbreviation, or CID — up to {MAX} compounds</p>

      <div className="search-row">
        <input
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setError('') }}
          onKeyDown={e => e.key === 'Enter' && lookup()}
          placeholder="e.g. caffeine, cholesterol, ATP, or a CID number…"
          disabled={loading}
        />
        <button onClick={() => lookup()} disabled={loading}>
          {loading ? 'Loading…' : 'Add'}
        </button>
      </div>

      <div className="chips">
        {CHIPS.map(c => (
          <span key={c} className="chip" onClick={() => quickLook(c)}>{c}</span>
        ))}
      </div>

      {error && <p className="error">{error}</p>}

      {compounds.length === 0 && !error && (
        <p className="placeholder">Enter a compound name or CID above</p>
      )}

      <div className="compound-grid">
        {compounds.map(c => (
          <div key={c.cid} className="compound-card">
            <button className="remove-btn" onClick={() => remove(c.cid)} title="Remove">×</button>
            <img className="compound-img" src={c.imgUrl} alt={`2D structure of ${c.name}`} />
            <p className="compound-name">{c.name}</p>
            <p className="compound-meta">{c.formula}&nbsp;·&nbsp;MW: {c.mw} g/mol</p>
            <a className="pubchem-link" href={c.pageUrl} target="_blank" rel="noreferrer">
              View on PubChem ↗
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
