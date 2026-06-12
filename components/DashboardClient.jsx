'use client'
import { useState, useEffect } from 'react'
import ArticleGenerator from './ArticleGenerator'
import ArticleTable from './ArticleTable'
import SiteManager from './SiteManager'
import ArticlePreview from './ArticlePreview'
import AISettings from './AISettings'
import BulkArticleGenerator from './BulkArticleGenerator'
import MoneyPostGenerator from './MoneyPostGenerator'
import MoneyPostList from './MoneyPostList'
import MoneyPostPresell from './MoneyPostPresell'

/* ── Icons ─────────────────────────────────────────────────── */
function IcoHome() {
  return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
}
function IcoPlus() {
  return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
}
function IcoDoc() {
  return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
}
function IcoGlobe() {
  return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><circle cx="12" cy="12" r="9" /><path strokeLinecap="round" strokeLinejoin="round" d="M3.6 9h16.8M3.6 15h16.8M12 3a15 15 0 010 18M12 3a15 15 0 000 18" /></svg>
}
function IcoSettings() {
  return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
}
function IcoBulk() {
  return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
}
function IcoChevron({ collapsed }) {
  return <svg className={`w-5 h-5 transition-transform ${collapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
}
function IcoArrow() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
}
function IcoImage() {
  return <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}><rect x="3" y="3" width="18" height="18" rx="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M3 16l5-5 4 4 3-3 6 6" /><circle cx="8.5" cy="8.5" r="1.5" /></svg>
}
function IcoPencil() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 11l6.364-6.364a2 2 0 012.828 0l1.172 1.172a2 2 0 010 2.828L13 15H9v-4z" /></svg>
}
function IcoExternalLink() {
  return <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
}
function IcoDollar() {
  return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
}

const NAV = [
  { id: 'overview', icon: IcoHome,     label: 'Visao Geral' },
  { id: 'new',      icon: IcoPlus,     label: 'Novo Artigo' },
  { id: 'money',    icon: IcoDollar,   label: 'Money Post' },
  { id: 'moneyposts', icon: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, label: 'Money Posts Geradas' },
  { id: 'bulk',     icon: IcoBulk,     label: 'Geracao em Massa' },
  { id: 'articles', icon: IcoDoc,      label: 'Meus Artigos' },
  { id: 'sites',    icon: IcoGlobe,    label: 'Sites' },
  { id: 'settings', icon: IcoSettings, label: 'Configuracoes' },
]

const PAGE_META = {
  overview: { title: 'Visao Geral',       sub: 'Resumo completo da sua operacao de conteudo' },
  new:      { title: 'Novo Artigo',        sub: 'Gere um artigo SEO completo com IA em segundos' },
  moneyposts: { title: 'Money Posts Gerados', sub: 'Gerencie e visualize todos os seus Money Posts criados' },
  money:    { title: 'Money Post',         sub: 'Crie posts monetizados com presell (P1) + money post (P2)' },
  'money-generate': { title: 'Gerar Money Post', sub: 'Configure e gere o Money Post com IA — pagina P2' },
  bulk:     { title: 'Geracao em Massa',   sub: 'Gere multiplos artigos por categoria com Gemini AI' },
  articles: { title: 'Meus Artigos',       sub: 'Gerencie, edite e publique seus artigos no GitHub' },
  sites:    { title: 'Sites',              sub: 'Configure sites e credenciais GitHub para publicacao' },
  settings: { title: 'Configuracoes',      sub: 'Configure sua chave Gemini AI para geracao de conteudo' },
}

/* ── Stat Card ─────────────────────────────────────────────── */
function StatCard({ label, value, sub, accent, icon: Icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-2xl p-5 text-left hover:shadow-md transition-all w-full group"
    >
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent.bg}`}>
          <span className={accent.icon}><Icon /></span>
        </div>
        <svg className="w-4 h-4 text-gray-300 group-hover:text-gray-400 transition-colors mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
      <p className="text-3xl font-black text-gray-900 mt-3">{value ?? 0}</p>
      <p className="text-sm font-semibold text-gray-700 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </button>
  )
}

/* ── Overview ─────────────────────────────────────────────── */
function Overview({ onNavigate, onView }) {
  const [stats, setStats]     = useState(null)
  const [recent, setRecent]   = useState({ articles: [], moneyPosts: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/articles').then(r => r.json()).catch(() => []),
      fetch('/api/sites').then(r => r.json()).catch(() => []),
    ]).then(([articles, sites]) => {
      const arr = Array.isArray(articles) ? articles : []
      const sts = Array.isArray(sites)    ? sites    : []
      const moneyPosts = arr.filter(a => a.excerpt) // money posts têm excerpt
      setStats({
        total:     arr.length,
        drafts:    arr.filter(a => a.status === 'draft').length,
        published: arr.filter(a => a.status === 'published').length,
        sites:     sts.length,
        withImg:   arr.filter(a => a.imageUrl).length,
        moneyPosts: moneyPosts.length,
      })
      const allRecent = [
        ...arr.map(a => ({ ...a, type: 'article' }))
      ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      const moneyPostsRecent = moneyPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3)
      setRecent({
        articles: allRecent.slice(0, 6),
        moneyPosts: moneyPostsRecent,
      })
      setLoading(false)
    })
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-48">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const imgPct = stats.total ? Math.round((stats.withImg / stats.total) * 100) : 0

  return (
    <div className="space-y-8 max-w-6xl">

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
        <StatCard
          label="Total de Artigos" value={stats.total}
          accent={{ bg: 'bg-blue-50', icon: 'text-blue-600' }}
          icon={IcoDoc}
          onClick={() => onNavigate('articles')}
        />
        <StatCard
          label="Rascunhos" value={stats.drafts} sub="Aguardando publicacao"
          accent={{ bg: 'bg-amber-50', icon: 'text-amber-600' }}
          icon={() => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>}
          onClick={() => onNavigate('articles')}
        />
        <StatCard
          label="Publicados" value={stats.published} sub="No ar nos seus sites"
          accent={{ bg: 'bg-green-50', icon: 'text-green-600' }}
          icon={() => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          onClick={() => onNavigate('articles')}
        />
        <StatCard
          label="Money Posts" value={stats.moneyPosts} sub="Posts monetizados"
          accent={{ bg: 'bg-emerald-50', icon: 'text-emerald-600' }}
          icon={() => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          onClick={() => onNavigate('money')}
        />
        <StatCard
          label="Sites Conectados" value={stats.sites} sub="Com credenciais GitHub"
          accent={{ bg: 'bg-purple-50', icon: 'text-purple-600' }}
          icon={IcoGlobe}
          onClick={() => onNavigate('sites')}
        />
      </div>

      {/* Image coverage */}
      {stats.total > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-800">Cobertura de Imagens</h3>
              <p className="text-xs text-gray-400 mt-0.5">Artigos com imagem definida</p>
            </div>
            <span className="text-sm font-bold text-indigo-600 tabular-nums">{stats.withImg} / {stats.total}</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-700"
              style={{ width: `${imgPct}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-400">{imgPct}% com imagem</span>
            {stats.withImg < stats.total && (
              <span className="text-xs text-indigo-500">{stats.total - stats.withImg} sem imagem — gere novos artigos para cobrir</span>
            )}
          </div>
        </div>
      )}

      {/* Recent articles */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-gray-800 text-lg">Artigos Recentes</h3>
          <button
            onClick={() => onNavigate('articles')}
            className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-semibold"
          >
            Ver todos
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        {recent.articles.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-200 rounded-2xl py-16 text-center">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-300">
              <IcoDoc />
            </div>
            <p className="font-semibold text-gray-700 text-lg">Nenhum artigo ainda</p>
            <p className="text-sm text-gray-400 mt-1 mb-6">Comece gerando seu primeiro artigo com IA</p>
            <button
              onClick={() => onNavigate('new')}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              <IcoPlus />
              Novo Artigo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {recent.articles.map(a => (
              <button
                key={a.id}
                onClick={() => onView(a)}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden text-left hover:shadow-md transition-all group"
              >
                <div className="relative bg-gray-100 overflow-hidden" style={{ aspectRatio: '3/2' }}>
                  {a.imageUrl ? (
                    <img
                      src={a.imageUrl}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                      loading="lazy"
                      onError={e => {
                        const el = e.currentTarget.parentElement
                        el.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-200"><svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 16l5-5 4 4 3-3 6 6"/><circle cx="8.5" cy="8.5" r="1.5"/></svg></div>'
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-200">
                      <IcoImage />
                    </div>
                  )}
                  <span className={`absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-full ${a.status === 'published' ? 'bg-green-600 text-white' : 'bg-amber-500 text-white'}`}>
                    {a.status === 'published' ? 'Publicado' : 'Rascunho'}
                  </span>
                  {a.imageCode && (
                    <span className="absolute bottom-2 right-2 font-mono text-white bg-black/50 rounded px-1.5 py-0.5 backdrop-blur-sm" style={{ fontSize: 9 }}>
                      IMG-{a.imageCode}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <p className="font-semibold text-gray-800 text-sm leading-snug line-clamp-2 mb-2">{a.title}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{new Date(a.createdAt).toLocaleDateString('pt-BR')}</span>
                    {a.category && (
                      <span className="text-xs bg-purple-50 text-purple-600 font-medium px-2 py-0.5 rounded-full truncate max-w-28">{a.category}</span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Money Posts section */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-gray-800 text-lg">Money Posts Criados</h3>
          {stats.moneyPosts > 0 && (
            <button
              onClick={() => onNavigate('money')}
              className="flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-700 font-semibold"
            >
              Ver todos ({stats.moneyPosts})
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          )}
        </div>

        {stats.moneyPosts === 0 ? (
          <div className="bg-white border border-dashed border-gray-200 rounded-2xl py-16 text-center">
            <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-600">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <p className="font-semibold text-gray-700 text-lg">Nenhum Money Post criado</p>
            <p className="text-sm text-gray-400 mt-1 mb-6">Gere seu primeiro Money Post otimizado para monetização</p>
            <button
              onClick={() => onNavigate('money')}
              className="inline-flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
              style={{ backgroundColor: '#62be66' }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              Gerar Money Post
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {recent.moneyPosts.map(a => (
              <button
                key={a.id}
                onClick={() => onView(a)}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden text-left hover:shadow-md transition-all group"
              >
                <div className="relative bg-gray-100 overflow-hidden" style={{ aspectRatio: '3/2' }}>
                  {a.imageUrl ? (
                    <img
                      src={a.imageUrl}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                      loading="lazy"
                      onError={e => {
                        const el = e.currentTarget.parentElement
                        el.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-200"><svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 16l5-5 4 4 3-3 6 6"/><circle cx="8.5" cy="8.5" r="1.5"/></svg></div>'
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}><rect x="3" y="3" width="18" height="18" rx="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M3 16l5-5 4 4 3-3 6 6" /><circle cx="8.5" cy="8.5" r="1.5" /></svg>
                    </div>
                  )}
                  <span className={`absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-full ${a.status === 'published' ? 'bg-green-600 text-white' : 'bg-amber-500 text-white'}`}>
                    {a.status === 'published' ? 'Publicado' : 'Rascunho'}
                  </span>
                  <span className="absolute top-2 right-2 bg-emerald-600/90 text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Money
                  </span>
                </div>
                <div className="p-4">
                  <p className="font-semibold text-gray-800 text-sm leading-snug line-clamp-2 mb-2">{a.title}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{new Date(a.createdAt).toLocaleDateString('pt-BR')}</span>
                    {a.category && (
                      <span className="text-xs bg-emerald-50 text-emerald-600 font-medium px-2 py-0.5 rounded-full truncate max-w-28">{a.category}</span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-7 text-white">
        <h3 className="font-bold text-xl mb-1">Acoes Rapidas</h3>
        <p className="text-blue-200 text-sm mb-6">Comece agora a produzir conteudo de qualidade</p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onNavigate('new')}
            className="flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors shadow-sm"
          >
            <IcoPencil />
            Novo Artigo
          </button>
          <button
            onClick={() => onNavigate('money')}
            className="flex items-center gap-2 bg-white text-emerald-700 hover:bg-emerald-50 font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Money Post
          </button>
          <button
            onClick={() => onNavigate('bulk')}
            className="flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors border border-white/20"
          >
            <IcoBulk />
            Geracao em Massa
          </button>
          <button
            onClick={() => onNavigate('sites')}
            className="flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors border border-white/20"
          >
            <IcoGlobe />
            Gerenciar Sites
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Main Dashboard ─────────────────────────────────────────── */
export default function DashboardClient() {
  const [page, setPage]         = useState('overview')
  const [preview, setPreview]   = useState(null)
  const [tableKey, setTableKey] = useState(0)
  const [collapsed, setCollapsed] = useState(false)

  function goArticles(article) {
    setTableKey(k => k + 1)
    if (article) setPreview(article)
    setPage('articles')
  }

  function handleImageUpdate(id, imageUrl, imageCode) {
    setPreview(p => p && p.id === id ? { ...p, imageUrl, imageCode } : p)
    setTableKey(k => k + 1)
  }

  const meta = PAGE_META[page] || PAGE_META.overview

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* Sidebar */}
      <aside
        className="flex flex-col bg-gray-950 text-white flex-shrink-0 transition-all duration-200"
        style={{ width: collapsed ? 60 : 220 }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-[18px] border-b border-white/10 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center font-black text-sm flex-shrink-0 select-none">
            AI
          </div>
          {!collapsed && <span className="font-bold text-sm leading-tight truncate">Gerador de<br />Artigos</span>}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
          {NAV.map(({ id, icon: Icon, label }) => {
            const active = page === id
            return (
              <button
                key={id}
                onClick={() => setPage(id)}
                title={label}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${active ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/8'}`}
              >
                <span className="flex-shrink-0"><Icon /></span>
                {!collapsed && <span className="truncate">{label}</span>}
              </button>
            )
          })}
        </nav>

        {/* Collapse */}
        <div className="px-2 pb-4 pt-3 border-t border-white/10 flex-shrink-0">
          <button
            onClick={() => setCollapsed(c => !c)}
            title={collapsed ? 'Expandir menu' : 'Recolher menu'}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/8 text-sm transition-colors"
          >
            <span className="flex-shrink-0"><IcoChevron collapsed={collapsed} /></span>
            {!collapsed && <span>Recolher</span>}
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-lg font-bold text-gray-900">{meta.title}</h1>
            <p className="text-xs text-gray-400 mt-0.5">{meta.sub}</p>
          </div>
          {page !== 'new' && (
            <button
              onClick={() => setPage('new')}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              <IcoArrow />
              Novo Artigo
            </button>
          )}
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {page === 'overview' && <Overview onNavigate={setPage} onView={setPreview} />}
          {page === 'new'      && <ArticleGenerator onGenerated={goArticles} />}
          {page === 'moneyposts' && <MoneyPostList onNavigate={setPage} onView={setPreview} />}
          {page === 'money'    && <MoneyPostPresell onGenerate={() => setPage('money-generate')} onViewPosts={() => setPage('moneyposts')} />}
          {page === 'money-generate' && <MoneyPostGenerator onGenerated={goArticles} />}
          {page === 'bulk'     && <BulkArticleGenerator onView={setPreview} />}
          {page === 'articles' && (
            <ArticleTable key={tableKey} onView={setPreview} onRefresh={() => setTableKey(k => k + 1)} />
          )}
          {page === 'sites'    && <SiteManager />}
          {page === 'settings' && <AISettings />}
        </main>
      </div>

      {preview && (
        <ArticlePreview
          article={preview}
          onClose={() => setPreview(null)}
          onImageUpdate={handleImageUpdate}
        />
      )}
    </div>
  )
}
