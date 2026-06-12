import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { siteConfig } from './config/siteConfig'

// Favicon dinâmico — troque siteConfig.favicon para mudar em todo o site
const faviconEl = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
if (faviconEl) faviconEl.href = siteConfig.favicon

createRoot(document.getElementById('root')!).render(
  <App />,
)
