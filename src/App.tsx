import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ArticlePage from './pages/ArticlePage';
import P1Page from './pages/P1Page';
import NotFoundPage from './pages/NotFoundPage';
import TerminosPage from './pages/TerminosPage';
import PrivacidadPage from './pages/PrivacidadPage';
import QuienesSomosPage from './pages/QuienesSomosPage';
import ContactoPage from './pages/ContactoPage';
import EspecialistasPage from './pages/EspecialistasPage';
import AuthorPage from './pages/AuthorPage';
import { Helmet } from 'react-helmet';
import { siteConfig, brandColors } from './config/siteConfig';
import { LangProvider } from './i18n/LangContext';
import { SUPPORTED_LANGS } from './i18n/translations';

function SpanishLayout() {
  return (
    <LangProvider forceLang="es">
      <Header />
      <div className="flex-1"><Outlet /></div>
      <Footer />
      <CookieBanner />
    </LangProvider>
  );
}

function LangLayout() {
  const pathLang = window.location.pathname.split('/')[1];
  if (!(SUPPORTED_LANGS as string[]).includes(pathLang)) return <Navigate to="/" replace />;
  return (
    <LangProvider>
      <Header />
      <div className="flex-1"><Outlet /></div>
      <Footer />
      <CookieBanner />
    </LangProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <>
        <style>{`
          :root {
            --brand-primary: ${brandColors.primary};
            --brand-nav-bg: ${brandColors.navBg};
            --brand-nav-text: ${brandColors.navText};
            --brand-footer-text: ${brandColors.footerText};
            --brand-footer-link: ${brandColors.footerLink};
            --brand-header-nav-hover: ${brandColors.headerNavHover};
            --brand-bg-gray: ${brandColors.bgGray};
            --brand-secondary: ${brandColors.secondary};
          }
        `}</style>
        <Helmet>
          <link rel="icon" type="image/png" href={siteConfig.favicon} />
        </Helmet>
<div className="min-h-screen flex flex-col" style={{ backgroundColor: brandColors.bgGray }}>
          <Routes>
            {/* Root Spanish routes (no prefix) */}
            <Route element={<SpanishLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/c/:categorySlug" element={<CategoryPage />} />
              <Route path="/p/:slug" element={<ArticlePage />} />
              <Route path="/l/:slug" element={<P1Page />} />
              <Route path="/terminos-de-uso" element={<TerminosPage />} />
              <Route path="/politica-de-privacidad" element={<PrivacidadPage />} />
              <Route path="/quienes-somos" element={<QuienesSomosPage />} />
              <Route path="/contacto" element={<ContactoPage />} />
              <Route path="/especialistas" element={<EspecialistasPage />} />
              <Route path="/a/:authorSlug" element={<AuthorPage />} />
            </Route>

            {/* Language-prefixed routes (/pt /en /fr) */}
            <Route path="/:lang" element={<LangLayout />}>
              <Route index element={<HomePage />} />
              <Route path="c/:categorySlug" element={<CategoryPage />} />
              <Route path="p/:slug" element={<ArticlePage />} />
              <Route path="l/:slug" element={<P1Page />} />
              {/* pt slugs */}
              <Route path="termos-de-uso" element={<TerminosPage />} />
              <Route path="politica-de-privacidade" element={<PrivacidadPage />} />
              <Route path="quem-somos" element={<QuienesSomosPage />} />
              <Route path="contato" element={<ContactoPage />} />
              <Route path="especialistas" element={<EspecialistasPage />} />
              {/* en slugs */}
              <Route path="terms-of-use" element={<TerminosPage />} />
              <Route path="privacy-policy" element={<PrivacidadPage />} />
              <Route path="about-us" element={<QuienesSomosPage />} />
              <Route path="contact" element={<ContactoPage />} />
              <Route path="specialists" element={<EspecialistasPage />} />
              {/* fr slugs */}
              <Route path="conditions-utilisation" element={<TerminosPage />} />
              <Route path="politique-de-confidentialite" element={<PrivacidadPage />} />
              <Route path="qui-sommes-nous" element={<QuienesSomosPage />} />
              <Route path="specialistes" element={<EspecialistasPage />} />
              {/* legacy es slugs under lang prefix */}
              <Route path="terminos-de-uso" element={<TerminosPage />} />
              <Route path="politica-de-privacidad" element={<PrivacidadPage />} />
              <Route path="quienes-somos" element={<QuienesSomosPage />} />
              <Route path="contacto" element={<ContactoPage />} />
              <Route path="a/:authorSlug" element={<AuthorPage />} />
            </Route>

            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </>
    </BrowserRouter>
  );
}

export default App;
