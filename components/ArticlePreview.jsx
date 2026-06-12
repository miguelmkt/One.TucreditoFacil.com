'use client'
import { useRef, useState } from 'react'

export default function ArticlePreview({ article, onClose, onImageUpdate }) {
  const [imageUrl, setImageUrl]   = useState(article.imageUrl || null)
  const [imageCode, setImageCode] = useState(article.imageCode || null)
  const [imgErr, setImgErr]       = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [saved, setSaved]         = useState(false)
  const [manualUrl, setManualUrl] = useState('')
  const [savingManual, setSavingManual] = useState(false)
  const uploadRef = useRef(null)

  async function saveImage(newUrl, newCode = null) {
    await fetch('/api/articles', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: article.id, updates: { imageUrl: newUrl, imageCode: newCode } }),
    })
    setImageUrl(newUrl)
    setImageCode(newCode)
    setImgErr(false)
    setImgLoaded(false)
    setSaved(true)
    onImageUpdate && onImageUpdate(article.id, newUrl, newCode)
  }

  function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = e => resolve(e.target.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  async function uploadImageFile(file) {
    const dataUrl = await fileToDataUrl(file)
    const res = await fetch('/api/upload-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dataUrl, filename: file.name }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Falha no upload')
    return data.url
  }

  async function handleManualUrlSave() {
    const url = manualUrl.trim()
    if (!url) return
    setSavingManual(true)
    setSaved(false)
    try {
      await saveImage(url, null)
      setManualUrl('')
    } catch {
      alert('Erro ao salvar URL da imagem')
    } finally {
      setSavingManual(false)
    }
  }

  async function handleUploadChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setSavingManual(true)
    setSaved(false)
    try {
      const url = await uploadImageFile(file)
      await saveImage(url, null)
      setManualUrl(url)
    } catch (err) {
      alert('Erro ao enviar imagem: ' + (err?.message || 'falha desconhecida'))
    } finally {
      setSavingManual(false)
      e.target.value = ''
    }
  }

  if (!article) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 overflow-auto"
      style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose?.() }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mb-8" onClick={e => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className="flex items-start justify-between px-7 py-5 border-b border-gray-100">
          <div className="flex-1 pr-4">
            <h2 className="font-bold text-gray-900 text-lg leading-snug">{article.title}</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {article.language && (
                <span className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded font-medium">
                  {article.language.toUpperCase()}
                </span>
              )}
              {article.category && (
                <span className="bg-purple-50 text-purple-700 text-xs px-2 py-0.5 rounded">{article.category}</span>
              )}
              {article.slug && (
                <code className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">{article.slug}</code>
              )}
              {article.createdAt && (
                <span className="text-gray-400 text-xs">
                  {new Date(article.createdAt).toLocaleDateString('pt-BR')}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 flex-shrink-0"
          >×</button>
        </div>

        {/* ── Featured Image ── */}
        <div className="relative bg-gray-100 border-b border-gray-100" style={{ aspectRatio: '3/2', maxHeight: 480 }}>
          {imageUrl && !imgErr ? (
            <>
              {!imgLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-400 text-sm">
                  <div className="w-7 h-7 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                  <span>Carregando imagem...</span>
                </div>
              )}
              <img
                src={imageUrl}
                alt={article.title}
                className={`w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImgLoaded(true)}
                onError={() => { setImgErr(true); setImgLoaded(true) }}
              />
              {/* Code badge over image */}
              {imageCode && imgLoaded && !imgErr && (
                <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-mono px-2.5 py-1 rounded-full backdrop-blur-sm">
                  IMG-{imageCode}
                </span>
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 gap-2">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21h18M3.75 3h16.5M3.75 3a.75.75 0 00-.75.75v16.5c0 .414.336.75.75.75h16.5a.75.75 0 00.75-.75V3.75a.75.75 0 00-.75-.75H3.75z" />
              </svg>
              <span className="text-sm">Sem imagem gerada</span>
            </div>
          )}
        </div>

        {/* ── Image Controls ── */}
        <div className="flex items-center gap-3 px-7 py-3 bg-gray-50 border-b border-gray-100">
          <div className="flex-1 min-w-0">
            {imageCode ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Código da imagem:</span>
                <code className="text-xs font-mono bg-white border border-gray-200 text-gray-800 px-2 py-0.5 rounded select-all">
                  IMG-{imageCode}
                </code>
                {saved && <span className="text-xs text-green-600 font-medium">✓ Salvo</span>}
              </div>
            ) : (
              <span className="text-xs text-gray-400 italic">Nenhuma imagem definida</span>
            )}
          </div>
          <input
            ref={uploadRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUploadChange}
          />
          <button
            onClick={() => uploadRef.current?.click()}
            disabled={savingManual}
            className="flex items-center gap-2 bg-white hover:bg-gray-100 border border-gray-200 disabled:opacity-60 text-gray-700 text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            {savingManual ? 'Enviando...' : 'Upload'}
          </button>
        </div>

        <div className="px-7 py-3 bg-gray-50 border-b border-gray-100 flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={manualUrl}
            onChange={e => setManualUrl(e.target.value)}
            placeholder="Cole a URL da imagem para trocar manualmente"
            className="flex-1 min-w-[240px] border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
          <button
            onClick={handleManualUrlSave}
            disabled={savingManual || !manualUrl.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Salvar URL
          </button>
        </div>

        {/* ── Article Body ── */}
        <div
          className="px-8 py-6 article-preview overflow-auto"
          style={{ maxHeight: '55vh' }}
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </div>
    </div>
  )
}

