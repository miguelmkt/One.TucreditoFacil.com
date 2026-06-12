'use client'
import { useState, useEffect, useRef } from 'react'
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
const IcoCode = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
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
const IcoUpload = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
)
const IcoGlobe = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <circle cx="12" cy="12" r="9" /><path strokeLinecap="round" strokeLinejoin="round" d="M3.6 9h16.8M3.6 15h16.8M12 3a15 15 0 010 18M12 3a15 15 0 000 18" />
  </svg>
)

/* 4 prefixos fixos — ES sempre na raiz */
const PREFIXES = [
  { value: 'es', label: 'Espanhol',      prefix: '/',     badge: 'ES' },
  { value: 'pt', label: 'Portugues',     prefix: '/pt/',  badge: 'PT' },
  { value: 'en', label: 'Ingles',        prefix: '/en/',  badge: 'EN' },
  { value: 'fr', label: 'Frances',       prefix: '/fr/',  badge: 'FR' },
]

/* ── Image section ──────────────────────────────────────────── */
function ImageSection({ uploadPreview, onFileChange, uploadRef }) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700">Imagem do Artigo</label>
      <div>
        <input
          ref={uploadRef}
          type="file"
          accept="image/*"
          onChange={onFileChange}
          className="hidden"
        />
        {uploadPreview ? (
          <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-100" style={{ height: 160 }}>
            <img src={uploadPreview} alt="Preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => uploadRef.current?.click()}
              className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity text-white text-sm font-semibold gap-2"
            >
              <IcoUpload />
              Trocar imagem
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => uploadRef.current?.click()}
            className="w-full border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-xl py-8 flex flex-col items-center gap-2 text-gray-400 hover:text-blue-500 transition-colors"
          >
            <IcoUpload />
            <span className="text-sm font-semibold">Clique para selecionar uma imagem</span>
            <span className="text-xs">JPG, PNG, WebP — recomendado 700x350px</span>
          </button>
        )}
      </div>
    </div>
  )
}

/* ── Main component ─────────────────────────────────────────── */
export default function ArticleGenerator({ onGenerated }) {
  const [step, setStep]     = useState(1)
  const [sites, setSites]   = useState([])
  const [form, setForm]     = useState({ title: '', siteId: '', category: '', language: 'es' })
  const [uploadFile, setUploadFile] = useState(null) // File object
  const [uploadPreview, setUploadPreview] = useState('') // object URL for preview
  const uploadRef = useRef(null)

  const [article, setArticle]   = useState(null)
  const [error, setError]       = useState('')
  const [publishing, setPublishing] = useState(false)
  const [published, setPublished]   = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)

  // Editor state
  const [editTitle, setEditTitle]     = useState('')
  const [editContent, setEditContent] = useState('')
  const [editorMode, setEditorMode]   = useState('split')
  const [savingEdit, setSavingEdit]   = useState(false)
  const [savedEdit, setSavedEdit]     = useState(false)

  // Inline image controls in editor
  const [inlineImageUrl, setInlineImageUrl] = useState('')
  const inlineUploadRef = useRef(null)
  const contentTextareaRef = useRef(null)

  useEffect(() => {
    fetch('/api/sites').then(r => r.json()).then(d => {
      const arr = Array.isArray(d) ? d : []
      setSites(arr)
      if (arr.length > 0) setForm(f => ({ ...f, siteId: arr[0].id }))
    }).catch(() => {})
  }, [])

  const selectedSite = sites.find(s => s.id === form.siteId) || null
  const siteCategories = selectedSite?.categories || []

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadFile(file)
    const url = URL.createObjectURL(file)
    setUploadPreview(url)
  }

  // Convert file to base64 data URL
  function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = e => resolve(e.target.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  async function uploadInlineImageFile(file) {
    const dataUrl = await fileToDataUrl(file)
    const res = await fetch('/api/upload-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dataUrl, filename: file.name }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Falha ao enviar imagem')
    return data.url
  }

  function insertImageIntoContent(url) {
    if (!url) return
    const clean = String(url).trim()
    if (!clean) return

    const imgBlock = `\n<p><img src="${clean}" alt="" loading="lazy" /></p>\n`
    const el = contentTextareaRef.current

    if (!el) {
      setEditContent(prev => (prev || '') + imgBlock)
      return
    }

    const start = el.selectionStart ?? editContent.length
    const end = el.selectionEnd ?? start
    const before = editContent.slice(0, start)
    const after = editContent.slice(end)
    const next = before + imgBlock + after
    setEditContent(next)

    // Keep caret after inserted block on next paint.
    requestAnimationFrame(() => {
      const pos = start + imgBlock.length
      el.focus()
      el.setSelectionRange(pos, pos)
    })
  }

  async function handleGenerate(e) {
    e.preventDefault()
    if (!form.category) return setError('Selecione uma categoria')
    setError('')
    setStep(2)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: form.title, category: form.category, language: form.language, siteId: form.siteId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro ao gerar')

      // If user selected upload: replace imageUrl with the uploaded file
      if (uploadFile) {
        const dataUrl = await fileToDataUrl(uploadFile)
        await fetch('/api/articles', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: data.id, updates: { imageUrl: dataUrl, imageCode: null } }),
        })
        data.imageUrl  = dataUrl
        data.imageCode = null
      }

      setArticle(data)
      setEditTitle(data.title   || '')
      setEditContent(data.content || '')
      setStep(3)
    } catch (e) {
      setError(e.message)
      setStep(1)
    }
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
    setPublishing(true)
    try {
      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId: article.id, siteId: form.siteId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro ao publicar')
      setArticle(a => ({ ...a, status: 'published' }))
      setPublished(true)
    } catch (e) {
      alert('Erro ao publicar: ' + e.message)
    }
    setPublishing(false)
  }

  function resetFlow() {
    setStep(1)
    setForm(f => ({ title: '', siteId: f.siteId, category: '', language: 'es' }))
    setArticle(null)
    setError('')
    setPublished(false)
    setEditorMode('split')
    setUploadFile(null)
    setUploadPreview('')
    setInlineImageUrl('')
  }

  /* ── STEP 1: Configure ──────────────────────────────────── */
  if (step === 1) return (
    <div className="max-w-xl">
      <form onSubmit={handleGenerate} className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600"><IcoSparkle /></div>
          <div>
            <h2 className="font-bold text-gray-900 text-lg">Gerar com IA</h2>
            <p className="text-sm text-gray-400">Preencha os dados abaixo para gerar seu artigo</p>
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
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Selecione...</option>
                {siteCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            )}
          </div>
        </div>

        {/* Title (optional) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Titulo ou Tema <span className="text-gray-400 font-normal">(opcional)</span></label>
          <input
            type="text"
            placeholder="Ex: Como sair das dividas em 2025"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-400 mt-1">Deixe em branco para a IA escolher o tema dentro da categoria</p>
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
                className={`flex flex-col items-center gap-1 py-3 rounded-xl border text-xs font-semibold transition-colors ${form.language === p.value ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600'}`}
              >
                <span className="flex items-center gap-1">
                  <IcoGlobe />
                  <span className="text-sm font-black">{p.badge}</span>
                </span>
                <span className={`font-mono text-xs px-1.5 py-0.5 rounded ${form.language === p.value ? 'bg-blue-500 text-blue-100' : 'bg-gray-100 text-gray-500'}`}>
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

        {/* Image section */}
        <ImageSection
          uploadPreview={uploadPreview}
          onFileChange={handleFileChange}
          uploadRef={uploadRef}
        />

        <button
          type="submit"
          disabled={!form.category || sites.length === 0}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm text-base"
        >
          <IcoSparkle />
          Gerar Artigo com IA
        </button>
      </form>
    </div>
  )

  /* ── STEP 2: Generating ─────────────────────────────────── */
  if (step === 2) return (
    <div className="max-w-lg">
      <div className="bg-white border border-gray-200 rounded-2xl p-12 shadow-sm text-center">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-6">
          <div className="w-8 h-8 border-blue-600 border-t-transparent rounded-full animate-spin" style={{ borderWidth: 3, borderStyle: 'solid' }} />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Gerando seu artigo...</h2>
        <p className="text-sm text-gray-400">A IA esta escrevendo o artigo. Aguarde alguns segundos.</p>
        <div className="mt-8 flex flex-col gap-2 text-left">
          {[
            'Gerando conteudo com Gemini AI',
            'Otimizando para SEO',
            uploadFile ? 'Aplicando imagem enviada' : 'Sem imagem inicial',
            'Salvando rascunho',
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-3 text-sm text-gray-500">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />
              {s}
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  /* ── STEP 3: Review & Publish ───────────────────────────── */
  return (
    <div className="space-y-5">

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={resetFlow}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 border border-gray-200 bg-white rounded-lg px-3 py-1.5 transition-colors"
          >
            <IcoChevronLeft />
            Novo artigo
          </button>
          <span className="inline-flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            Artigo gerado
          </span>
          {article?.category && (
            <span className="text-xs bg-purple-50 text-purple-600 border border-purple-100 font-medium px-2.5 py-1 rounded-full">{article.category}</span>
          )}
          {article?.language && (
            <span className="text-xs bg-gray-100 text-gray-600 font-mono font-bold px-2.5 py-1 rounded-full uppercase">{article.language}</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={saveEdits}
            disabled={savingEdit}
            className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 transition-colors disabled:opacity-60"
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

          <button
            onClick={() => setPreviewOpen(true)}
            className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 transition-colors"
          >
            <IcoEye />
            Ver preview
          </button>

          {published ? (
            <span className="flex items-center gap-2 bg-green-100 text-green-800 border border-green-200 text-sm font-semibold px-4 py-2 rounded-lg">
              <IcoCheck />
              Publicado com sucesso
            </span>
          ) : (
            <button
              onClick={handlePublish}
              disabled={publishing}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-2 rounded-lg transition-colors disabled:opacity-60 shadow-sm"
            >
              {publishing ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <IcoSend />
              )}
              Publicar no GitHub
            </button>
          )}
        </div>
      </div>

      {/* Single hidden file input used by all upload buttons in step 3 */}
      <input
        ref={uploadRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async e => {
          const file = e.target.files?.[0]
          if (!file || !article) return
          const dataUrl = await fileToDataUrl(file)
          await fetch('/api/articles', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: article.id, updates: { imageUrl: dataUrl, imageCode: null } }),
          })
          setArticle(a => ({ ...a, imageUrl: dataUrl, imageCode: null }))
          e.target.value = ''
        }}
      />

      {/* Image panel */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Imagem</span>
          {article?.imageCode && (
            <span className="font-mono text-xs bg-indigo-50 text-indigo-500 border border-indigo-100 px-2 py-0.5 rounded">
              IMG-{article.imageCode}
            </span>
          )}
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => uploadRef.current?.click()}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 text-gray-600 transition-colors"
            >
              <IcoUpload />
              Trocar imagem
            </button>
          </div>
        </div>

        {/* Image display */}
        <div className="relative bg-gray-100" style={{ aspectRatio: '3/2' }}>
          {article?.imageUrl ? (
            <img
              src={article.imageUrl}
              alt=""
              className="w-full h-full object-cover"
              onError={e => { e.currentTarget.style.opacity = '0' }}
            />
          ) : (
            <button
              onClick={() => uploadRef.current?.click()}
              className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-300 hover:text-blue-400 transition-colors"
            >
              <IcoUpload />
              <span className="text-xs font-semibold">Clique para adicionar imagem</span>
            </button>
          )}
        </div>
      </div>

      {/* Title editing */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Titulo do Artigo</label>
        <input
          type="text"
          value={editTitle}
          onChange={e => setEditTitle(e.target.value)}
          className="w-full text-lg font-bold text-gray-900 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
          placeholder="Titulo do artigo"
        />
        {article?.slug && (
          <p className="text-xs text-gray-400 font-mono mt-2">{article.slug}</p>
        )}
      </div>

      {/* Content editor */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-1 border-b border-gray-100 px-4 py-2.5">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wide mr-3">Editor</span>
          <div className="flex bg-gray-100 rounded-lg p-0.5 gap-0.5">
            {[
              { key: 'split',   label: 'Split',   icon: null },
              { key: 'html',    label: 'HTML',    icon: <IcoCode /> },
              { key: 'preview', label: 'Preview', icon: <IcoEye /> },
            ].map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setEditorMode(key)}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md transition-colors ${editorMode === key ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Inline image inserter */}
        <div className="px-4 py-2.5 border-b border-gray-100 bg-white flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-gray-600">Imagem no conteudo</span>
          <input
            type="text"
            value={inlineImageUrl}
            onChange={e => setInlineImageUrl(e.target.value)}
            placeholder="Cole URL da imagem e clique em Inserir"
            className="flex-1 min-w-[220px] border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => insertImageIntoContent(inlineImageUrl)}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 transition-colors"
          >
            Inserir URL
          </button>
          <input
            ref={inlineUploadRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async e => {
              const file = e.target.files?.[0]
              if (!file) return
              try {
                const url = await uploadInlineImageFile(file)
                setInlineImageUrl(url)
                insertImageIntoContent(url)
              } catch (err) {
                alert('Erro ao enviar imagem: ' + (err?.message || 'falha desconhecida'))
              }
              e.target.value = ''
            }}
          />
          <button
            type="button"
            onClick={() => inlineUploadRef.current?.click()}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 transition-colors"
          >
            <IcoUpload />
            Upload e inserir
          </button>
        </div>

        {/* Editor panes */}
        <div className={`flex ${editorMode === 'split' ? 'divide-x divide-gray-100' : ''}`} style={{ minHeight: 480 }}>
          {/* HTML pane */}
          {(editorMode === 'html' || editorMode === 'split') && (
            <div className={`flex flex-col ${editorMode === 'split' ? 'w-1/2' : 'w-full'}`}>
              <div className="px-3 py-2 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                <IcoCode />
                <span className="text-xs text-gray-500 font-semibold">HTML Fonte</span>
                <span className="ml-auto text-xs text-gray-400">{editContent.length} chars</span>
              </div>
              <textarea
                ref={contentTextareaRef}
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
                spellCheck={false}
                className="flex-1 w-full font-mono text-xs text-gray-700 bg-gray-50 px-4 py-4 focus:outline-none resize-none leading-relaxed"
                style={{ minHeight: 440 }}
              />
            </div>
          )}

          {/* Preview pane */}
          {(editorMode === 'preview' || editorMode === 'split') && (
            <div className={`flex flex-col ${editorMode === 'split' ? 'w-1/2' : 'w-full'}`}>
              <div className="px-3 py-2 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                <IcoEye />
                <span className="text-xs text-gray-500 font-semibold">Preview</span>
              </div>
              <div
                className="flex-1 overflow-y-auto px-6 py-5 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: editContent }}
              />
            </div>
          )}
        </div>
      </div>

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
