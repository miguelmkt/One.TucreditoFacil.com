'use client'
import { useState, useEffect } from 'react'
import ArticlePreview from './ArticlePreview'

/* ── Icons ─────────────────────────────────────────────────── */
const IcoSparkle = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
)
const IcoSend = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
  </svg>
)
const IcoEye = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
)
const IcoSave = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
  </svg>
)
const IcoCheck = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
)
const IcoChevronLeft = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
)
const IcoGlobe = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <circle cx="12" cy="12" r="9" /><path strokeLinecap="round" strokeLinejoin="round" d="M3.6 9h16.8M3.6 15h16.8M12 3a15 15 0 010 18M12 3a15 15 0 000 18" />
  </svg>
)

const PREFIXES = [
  { value: 'es', label: 'Espanhol',      prefix: '/',     badge: 'ES' },
  { value: 'pt', label: 'Portugues',     prefix: '/pt/',  badge: 'PT' },
  { value: 'en', label: 'Ingles',        prefix: '/en/',  badge: 'EN' },
  { value: 'fr', label: 'Frances',       prefix: '/fr/',  badge: 'FR' },
]

/* ── Main component ─────────────────────────────────────────── */
export default function MoneyPostGenerator({ onGenerated }) {
  const [step, setStep]     = useState(1)
  const [sites, setSites]   = useState([])
  const [form, setForm]     = useState({ siteId: '', category: '', language: 'es', prompt: '', ctaUrl: '' })

  const [article, setArticle]   = useState(null)
  const [presell, setPresell]   = useState(null)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [published, setPublished]   = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)

  // Money post editor state
  const [editTitle, setEditTitle]     = useState('')
  const [editContent, setEditContent] = useState('')
  const [expanded, setExpanded]       = useState(true)
  const [savingEdit, setSavingEdit]   = useState(false)
  const [savedEdit, setSavedEdit]     = useState(false)
  const [pubState, setPubState]       = useState('idle') // idle | loading | done | error

  // Presell editor state
  const [presellEditTitle, setPresellEditTitle]     = useState('')
  const [presellEditContent, setPresellEditContent] = useState('')
  const [presellExpanded, setPresellExpanded]       = useState(false)
  const [savingPresellEdit, setSavingPresellEdit]   = useState(false)
  const [savedPresellEdit, setSavedPresellEdit]     = useState(false)
  const [presellPubState, setPresellPubState]       = useState('idle')
  const [p1Error, setP1Error]   = useState('')
  const [retryingP1, setRetryingP1] = useState(false)

  useEffect(() => {
    fetch('/api/sites').then(r => r.json()).then(d => {
      const arr = Array.isArray(d) ? d : []
      setSites(arr)
      if (arr.length > 0) setForm(f => ({ ...f, siteId: arr[0].id }))
    }).catch(() => {})
  }, [])

  const selectedSite = sites.find(s => s.id === form.siteId) || null
  const siteCategories = selectedSite?.categories || []
  const secondaryColor = selectedSite?.secondaryColor || '#62be66'


  async function handleGenerate(e) {
    e.preventDefault()
    if (!form.category) return setError('Selecione uma categoria')
    setError('')
    setLoading(true)
    setStep(2)
    try {
      const res = await fetch('/api/generate-money-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          category: form.category, 
          siteId: form.siteId,
          language: form.language,
          prompt: form.prompt.trim() || undefined,
          ctaUrl: form.ctaUrl.trim() || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro ao gerar')

      // Support both new { moneyPost, presell } and legacy flat format
      const moneyPostData = data.moneyPost || data
      const presellData   = data.presell   || null

      setArticle(moneyPostData)
      setEditTitle(moneyPostData.title || '')
      const rawContent = moneyPostData.content || ''
      setEditContent(rawContent)
      setPubState('idle')

      setPresell(presellData)
      setPresellEditTitle(presellData?.title || '')
      setPresellEditContent(presellData?.content || '')
      setPresellPubState('idle')
      setP1Error(data.p1Error || '')

      setPublished(false)
      setStep(3)
    } catch (e) {
      setError(e.message)
      setStep(1)
    }
    setLoading(false)
  }

  async function saveEdits() {
    if (!article) return
    setSavingEdit(true)
    try {
      const res = await fetch('/api/articles', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: article.id, updates: { title: editTitle, content: editContent } }),
      })
      if (!res.ok) throw new Error('Falha ao salvar')
      setArticle(a => ({ ...a, title: editTitle, content: editContent }))
      setSavedEdit(true)
      setTimeout(() => setSavedEdit(false), 2500)
    } catch (e) {
      alert('Erro ao salvar: ' + e.message)
    }
    setSavingEdit(false)
  }

  async function handlePublish() {
    if (pubState === 'done') return
    setPubState('loading')
    try {
      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId: article.id, siteId: form.siteId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro ao publicar')
      setArticle(a => ({ ...a, status: 'published' }))
      setPubState('done')
    } catch (e) {
      alert('Erro ao publicar: ' + e.message)
      setPubState('error')
    }
  }

  function resetFlow() {
    setStep(1)
    setForm(f => ({ siteId: f.siteId, category: '', language: 'es', prompt: '', ctaUrl: '' }))
    setArticle(null)
    setPresell(null)
    setError('')
    setPublished(false)
    setPubState('idle')
    setPresellPubState('idle')
    setExpanded(true)
    setPresellExpanded(false)
    setP1Error('')
  }

  async function retryGenerateP1() {
    if (!article) return
    setRetryingP1(true)
    setP1Error('')
    try {
      const res = await fetch('/api/generate-money-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: article.category,
          siteId: form.siteId,
          language: article.language,
          ctaUrl: article.ctaUrl || undefined,
          _p1Only: true,
          _moneyPostTitle: article.title,
          _moneyPostSlug: article.slug,
          _moneyPostId: article.id,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro ao gerar P1')
      if (data.p1Error) throw new Error(data.p1Error)
      const p = data.presell
      if (!p) throw new Error('P1 não foi gerada na resposta')
      setPresell(p)
      setPresellEditTitle(p.title || '')
      setPresellEditContent(p.content || '')
      setPresellPubState('idle')
    } catch (e) {
      setP1Error(e.message)
    }
    setRetryingP1(false)
  }

  async function savePresellEdits() {
    if (!presell) return
    setSavingPresellEdit(true)
    try {
      const res = await fetch('/api/articles', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: presell.id, updates: { title: presellEditTitle, content: presellEditContent } }),
      })
      if (!res.ok) throw new Error('Falha ao salvar')
      setPresell(p => ({ ...p, title: presellEditTitle, content: presellEditContent }))
      setSavedPresellEdit(true)
      setTimeout(() => setSavedPresellEdit(false), 2500)
    } catch (e) {
      alert('Erro ao salvar presell: ' + e.message)
    }
    setSavingPresellEdit(false)
  }

  async function handlePublishPresell() {
    if (presellPubState === 'done' || !presell) return
    setPresellPubState('loading')
    try {
      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId: presell.id, siteId: form.siteId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro ao publicar')
      setPresell(p => ({ ...p, status: 'published' }))
      setPresellPubState('done')
    } catch (e) {
      alert('Erro ao publicar presell: ' + e.message)
      setPresellPubState('error')
    }
  }

  /* ── STEP 1: Configure ──────────────────────────────────── */
  if (step === 1) return (
    <div className="max-w-xl">
      <form onSubmit={handleGenerate} className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: secondaryColor }}>
            <IcoSparkle />
          </div>
          <div>
            <h2 className="font-bold text-gray-900 text-lg">Money Post Generator</h2>
            <p className="text-sm text-gray-400">Gere posts otimizados para monetização</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>
        )}

        {/* Site + Category */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Site</label>
            {sites.length === 0 ? (
              <div className="border border-amber-200 bg-amber-50 text-amber-700 text-xs rounded-xl px-3 py-2.5">
                Nenhum site cadastrado. Adicione um site primeiro.
              </div>
            ) : (
              <select
                value={form.siteId}
                onChange={e => setForm(f => ({ ...f, siteId: e.target.value, category: '' }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-offset-0"
                style={{'--tw-ring-color': secondaryColor}}
              >
                {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Categoria</label>
            {siteCategories.length === 0 ? (
              <div className="border border-gray-200 bg-gray-50 text-gray-400 text-xs rounded-xl px-3 py-2.5">
                {form.siteId ? 'Site sem categorias cadastradas' : 'Selecione um site'}
              </div>
            ) : (
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                required
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-offset-0"
                style={{'--tw-ring-color': secondaryColor}}
              >
                <option value="">Selecione...</option>
                {siteCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            )}
          </div>
        </div>

        {/* Prefix / Language — 4 sempre fixos */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Prefixo de Idioma
          </label>
          <div className="grid grid-cols-4 gap-2">
            {PREFIXES.map(p => (
              <button
                key={p.value}
                type="button"
                onClick={() => setForm(f => ({ ...f, language: p.value }))}
                className={`flex flex-col items-center gap-1 py-3 rounded-xl border text-xs font-semibold transition-colors ${form.language === p.value ? 'text-white' : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-700'}`}
                style={form.language === p.value ? { backgroundColor: secondaryColor, borderColor: secondaryColor } : {}}
              >
                <span className="flex items-center gap-1">
                  <IcoGlobe />
                  <span className="text-sm font-black">{p.badge}</span>
                </span>
                <span className={`font-mono text-xs px-1.5 py-0.5 rounded ${form.language === p.value ? 'bg-opacity-50' : 'bg-gray-100 text-gray-500'}`} style={form.language === p.value ? { backgroundColor: secondaryColor + '30' } : {}}>
                  {p.prefix}
                </span>
                <span className="text-xs">{p.label}</span>
              </button>
            ))}
          </div>
          {form.language === 'es' && (
            <p className="text-xs text-indigo-500 mt-1.5">Espanhol publicado na raiz do site (sem prefixo de idioma na URL)</p>
          )}
        </div>

        {/* Custom Prompt */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Prompt Customizado <span className="text-gray-400 font-normal">(opcional)</span></label>
          <textarea
            placeholder="Ex: Foque em benefícios para autônomos, mencione taxa de juros competitiva e rapidez de aprovação..."
            value={form.prompt}
            onChange={e => setForm(f => ({ ...f, prompt: e.target.value }))}
            rows={3}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-offset-0 focus:border-transparent"
            style={{'--tw-ring-color': secondaryColor}}
          />
          <p className="text-xs text-gray-400 mt-1">Instruções extras para customizar o conteúdo gerado</p>
        </div>

        {/* CTA URL */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">URL do Botão CTA <span className="text-gray-400 font-normal">(opcional)</span></label>
          <input
            type="url"
            placeholder="https://seu-link.com/acessar"
            value={form.ctaUrl}
            onChange={e => setForm(f => ({ ...f, ctaUrl: e.target.value }))}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-offset-0 focus:border-transparent"
            style={{'--tw-ring-color': secondaryColor}}
          />
          <p className="text-xs text-gray-400 mt-1">URL que será usada no botão "ACESSAR SITE OFICIAL"</p>
        </div>

        <button
          type="submit"
          disabled={!form.category || sites.length === 0 || loading}
          className="w-full flex items-center justify-center gap-2 text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm text-base disabled:opacity-60"
          style={{ backgroundColor: secondaryColor }}
        >
          <IcoSparkle />
          {loading ? 'Gerando Money Post...' : 'Gerar Money Post com IA'}
        </button>
      </form>
    </div>
  )

  /* ── STEP 2: Generating ─────────────────────────────────── */
  if (step === 2) return (
    <div className="max-w-lg">
      <div className="bg-white border border-gray-200 rounded-2xl p-12 shadow-sm text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: secondaryColor + '15' }}>
          <div className="w-8 h-8 border-4 rounded-full animate-spin" style={{ borderColor: secondaryColor, borderTopColor: 'transparent' }} />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Gerando seu Money Post...</h2>
        <p className="text-sm text-gray-400">A IA esta escrevendo o conteudo. Aguarde alguns segundos.</p>
        <div className="mt-8 flex flex-col gap-2 text-left">
          {[
            'Gerando Money Post com Gemini AI',
            'Gerando pagina de presell (P1)',
            'Otimizando para monetizacao',
            'Salvando rascunhos',
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-3 text-sm text-gray-500">
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: secondaryColor, animationDelay: `${i * 150}ms` }} />
              {s}
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  /* ── STEP 3: Review & Publish (matches BulkArticleGenerator style) ── */
  // Helper: build URL label for an article
  const presellLang = article?.language || 'es'
  const presellSlug = article?.slug || ''
  const p1UrlLabel = presellLang === 'es' ? `/l/${presellSlug}` : `/${presellLang}/l/${presellSlug}`
  const p2UrlLabel = presellLang === 'es' ? `/p/${presellSlug}` : `/${presellLang}/p/${presellSlug}`

  return (
    <div className="space-y-4 max-w-5xl">

      {/* Back + status bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={resetFlow}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 border border-gray-200 bg-white rounded-lg px-3 py-1.5 transition-colors"
          >
            <IcoChevronLeft />
            Novo Money Post
          </button>
          <span className="inline-flex items-center gap-1.5 border rounded-full text-xs font-semibold px-2.5 py-1" style={{ backgroundColor: secondaryColor + '15', borderColor: secondaryColor, color: secondaryColor }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: secondaryColor }} />
            {presell ? '2 páginas geradas (P1 + P2)' : 'Money Post gerado'}
          </span>
        </div>
      </div>

      {/* ── P1 error / retry banner ── */}
      {!presell && p1Error && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex items-start gap-4">
          <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-amber-800">P1 não foi gerada</p>
            <p className="text-xs text-amber-700 mt-0.5 break-words">{p1Error}</p>
          </div>
          <button
            onClick={retryGenerateP1}
            disabled={retryingP1}
            className="flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-white border border-amber-300 text-amber-700 hover:bg-amber-100 rounded-lg transition-colors disabled:opacity-60"
          >
            {retryingP1 ? (
              <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            )}
            {retryingP1 ? 'Gerando P1...' : 'Tentar novamente'}
          </button>
        </div>
      )}

      {/* ── P1 Presell card ── */}
      {presell && (
        <div className={`bg-white border rounded-2xl overflow-hidden transition-all ${presellPubState === 'done' ? 'border-blue-300 ring-2 ring-blue-100' : 'border-gray-200'}`}>
          {/* Header row */}
          <div className="flex items-center gap-3 p-4">
            <div className={`w-5 h-5 flex-shrink-0 rounded-full flex items-center justify-center ${presellPubState === 'done' ? 'bg-green-500 text-white' : 'bg-blue-100 text-blue-600'}`}>
              {presellPubState === 'done' ? <IcoCheck /> : <span className="text-xs font-black">P1</span>}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="inline-block text-xs bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded-full">PRESELL</span>
                <span className="font-mono text-xs text-gray-400">{p1UrlLabel}</span>
              </div>
              <p className="font-semibold text-gray-800 text-sm truncate">{presellEditTitle || presell?.title}</p>
              <p className="text-xs text-gray-400 font-mono truncate">{presell?.slug}</p>
            </div>

            <div className="flex-shrink-0 flex items-center gap-2">
              {presellPubState === 'done' && (
                <span className="inline-flex items-center gap-1 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  Publicado
                </span>
              )}
              {presellPubState === 'error' && (
                <span className="text-xs text-red-600 font-medium">Erro</span>
              )}

              <button
                onClick={handlePublishPresell}
                disabled={presellPubState === 'loading' || presellPubState === 'done'}
                title="Publicar presell no GitHub"
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-60 ${presellPubState === 'done' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-gray-200 text-gray-700 hover:border-blue-400 hover:text-blue-600'}`}
              >
                {presellPubState === 'loading' ? (
                  <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : presellPubState === 'done' ? (
                  <IcoCheck />
                ) : (
                  <IcoSend />
                )}
                {presellPubState === 'done' ? 'Publicado' : 'Publicar P1'}
              </button>

              <button
                onClick={() => setPresellExpanded(v => !v)}
                title="Editar conteudo do presell"
                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${presellExpanded ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'}`}
              >
                <svg className={`w-4 h-4 transition-transform ${presellExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Expanded presell editor */}
          {presellExpanded && (
            <div className="border-t border-gray-100">
              <div className="px-5 pt-4 pb-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">Titulo</label>
                <input
                  type="text"
                  value={presellEditTitle}
                  onChange={e => setPresellEditTitle(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-100 border-t border-gray-100" style={{ minHeight: 280 }}>
                <div className="flex flex-col">
                  <div className="flex items-center px-4 py-2 bg-gray-50 border-b border-gray-100 gap-2">
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                    <span className="text-xs font-semibold text-gray-500">HTML Fonte — Presell</span>
                    <span className="ml-auto text-xs text-gray-400">{presellEditContent.length} chars</span>
                  </div>
                  <textarea
                    value={presellEditContent}
                    onChange={e => setPresellEditContent(e.target.value)}
                    spellCheck={false}
                    className="flex-1 font-mono text-xs text-gray-700 bg-gray-50 px-4 py-3 focus:outline-none resize-none leading-relaxed"
                    style={{ minHeight: 240 }}
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center px-4 py-2 bg-gray-50 border-b border-gray-100 gap-2">
                    <IcoEye />
                    <span className="text-xs font-semibold text-gray-500">Preview</span>
                  </div>
                  <div
                    className="flex-1 overflow-y-auto px-5 py-4 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: presellEditContent }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 px-5 py-3 bg-gray-50 border-t border-gray-100">
                <button
                  onClick={savePresellEdits}
                  disabled={savingPresellEdit}
                  className="flex items-center gap-2 text-sm font-semibold px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors disabled:opacity-60"
                >
                  {savingPresellEdit ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : savedPresellEdit ? (
                    <IcoCheck />
                  ) : (
                    <IcoSave />
                  )}
                  {savedPresellEdit ? 'Salvo!' : 'Salvar edicoes'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── P2 Money Post card ── */}
      <div className={`bg-white border rounded-2xl overflow-hidden transition-all ${pubState === 'done' ? 'border-green-300 ring-2 ring-green-100' : 'border-gray-200'}`}>
        {/* Header row */}
        <div className="flex items-center gap-3 p-4">
          {/* Status indicator */}
          <div className={`w-5 h-5 flex-shrink-0 rounded-full flex items-center justify-center ${pubState === 'done' ? 'bg-green-500 text-white' : 'bg-emerald-100 text-emerald-600'}`}>
            {pubState === 'done' ? <IcoCheck /> : <span className="text-xs font-black">P2</span>}
          </div>

          {/* Title area */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="inline-block text-xs bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5 rounded-full">MONEY POST</span>
              <span className="font-mono text-xs text-gray-400">{p2UrlLabel}</span>
            </div>
            <p className="font-semibold text-gray-800 text-sm truncate">{editTitle || article?.title}</p>
            <p className="text-xs text-gray-400 font-mono truncate">{article?.slug}</p>
            <div className="flex items-center gap-2 mt-0.5">
              {article?.category && (
                <span className="inline-block text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">{article.category}</span>
              )}
              {article?.language && (
                <span className="inline-block text-xs bg-gray-100 text-gray-600 font-mono font-bold px-2 py-0.5 rounded-full uppercase">{article.language}</span>
              )}
              {article?.author && (
                <span className="inline-block text-xs text-gray-400">{article.author}</span>
              )}
            </div>
          </div>

          {/* Status + actions */}
          <div className="flex-shrink-0 flex items-center gap-2">
            {pubState === 'done' && (
              <span className="inline-flex items-center gap-1 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                Publicado
              </span>
            )}
            {pubState === 'error' && (
              <span className="text-xs text-red-600 font-medium">Erro</span>
            )}

            <button
              onClick={() => setPreviewOpen(true)}
              title="Visualizar artigo"
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <IcoEye />
            </button>

            <button
              onClick={handlePublish}
              disabled={pubState === 'loading' || pubState === 'done'}
              title="Publicar no GitHub"
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-60 ${pubState === 'done' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-gray-200 text-gray-700 hover:border-blue-400 hover:text-blue-600'}`}
            >
              {pubState === 'loading' ? (
                <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : pubState === 'done' ? (
                <IcoCheck />
              ) : (
                <IcoSend />
              )}
              {pubState === 'done' ? 'Publicado' : 'Publicar P2'}
            </button>

            <button
              onClick={() => setExpanded(v => !v)}
              title="Editar conteudo"
              className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${expanded ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'}`}
            >
              <svg className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Expanded editor — same layout as BulkArticleGenerator */}
        {expanded && (
          <div className="border-t border-gray-100">
            {/* Title */}
            <div className="px-5 pt-4 pb-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">Titulo</label>
              <input
                type="text"
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              />
            </div>

            {/* HTML editor + preview side-by-side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-100 border-t border-gray-100" style={{ minHeight: 320 }}>
              <div className="flex flex-col">
                <div className="flex items-center px-4 py-2 bg-gray-50 border-b border-gray-100 gap-2">
                  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  <span className="text-xs font-semibold text-gray-500">HTML Fonte</span>
                  <span className="ml-auto text-xs text-gray-400">{editContent.length} chars</span>
                </div>
                <textarea
                  value={editContent}
                  onChange={e => setEditContent(e.target.value)}
                  spellCheck={false}
                  className="flex-1 font-mono text-xs text-gray-700 bg-gray-50 px-4 py-3 focus:outline-none resize-none leading-relaxed"
                  style={{ minHeight: 280 }}
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center px-4 py-2 bg-gray-50 border-b border-gray-100 gap-2">
                  <IcoEye />
                  <span className="text-xs font-semibold text-gray-500">Preview</span>
                </div>
                <div
                  className="flex-1 overflow-y-auto px-5 py-4 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: editContent }}
                />
              </div>
            </div>

            {/* Save bar */}
            <div className="flex items-center justify-end gap-3 px-5 py-3 bg-gray-50 border-t border-gray-100">
              <button
                onClick={saveEdits}
                disabled={savingEdit}
                className="flex items-center gap-2 text-sm font-semibold px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors disabled:opacity-60"
              >
                {savingEdit ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : savedEdit ? (
                  <IcoCheck />
                ) : (
                  <IcoSave />
                )}
                {savedEdit ? 'Salvo!' : 'Salvar edicoes'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ArticlePreview modal */}
      {previewOpen && article && (
        <ArticlePreview
          article={{ ...article, title: editTitle, content: editContent }}
          onClose={() => setPreviewOpen(false)}
          onImageUpdate={(id, imageUrl, imageCode) => {
            setArticle(a => ({ ...a, imageUrl, imageCode }))
          }}
        />
      )}
    </div>
  )
}
