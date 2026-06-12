import { siteConfig, brandColors } from '../config/siteConfig';
import { useLang } from '../i18n/LangContext';

interface PageMeta { h1: string; subtitle: string; authorsTitle: string; }
interface Specialist { nombre: string; titulo: string; descripcion: string; }

const pageMeta: Record<string, PageMeta> = {
  es: { h1: 'Nuestros Especialistas', subtitle: 'Especialistas en crédito, periodistas económicos y planificadores financieros traducen números en estrategias simples y efectivas.', authorsTitle: 'Autores' },
  pt: { h1: 'Nossos Especialistas', subtitle: 'Especialistas em crédito, jornalistas econômicos e planejadores financeiros traduzem números em estratégias simples e eficazes.', authorsTitle: 'Autores' },
  en: { h1: 'Our Specialists', subtitle: 'Credit specialists, economic journalists and financial planners translate numbers into simple and effective strategies.', authorsTitle: 'Authors' },
  fr: { h1: 'Nos Spécialistes', subtitle: 'Des spécialistes du crédit, des journalistes économiques et des planificateurs financiers traduisent les chiffres en stratégies simples et efficaces.', authorsTitle: 'Auteurs' },
};

const teamData: Record<string, Specialist[]> = {
  es: [
    { nombre: 'Miguel Freitas', titulo: 'Economista & Planificadora Financiera', descripcion: `Miguel Freitas, de 38 años, es economista especializada en planificación financiera personal. Lidera la estrategia editorial de ${siteConfig.siteName}, ayudando a familias a crear presupuestos sólidos y planes de ahorro efectivos.` },
    { nombre: 'Carlos Almeida', titulo: 'Analista Financiero Certificado (CFA)', descripcion: `Carlos Almeida, de 41 años, es analista financiero certificado y uno de los principales columnistas de ${siteConfig.siteName}, donde comparte sus conocimientos sobre planificación financiera, crédito personal y estrategias de inversión accesibles.` },
    { nombre: 'Lucas Moraes', titulo: 'Asesora Crediticia Certificada', descripcion: `Lucas Moraes, de 34 años, es redactora en ${siteConfig.siteName}, con un enfoque especial en finanzas para mujeres y familias que buscan alcanzar la independencia financiera.` },
    { nombre: 'Felipe Pires', titulo: 'Asesor Fiscal y Tributario', descripcion: `Felipe Pires, de 37 años, es columnista en ${siteConfig.siteName}, especializado en crédito personal, inversiones y estrategias financieras a largo plazo.` },
  ],
  pt: [
    { nombre: 'Miguel Freitas', titulo: 'Economista & Planejadora Financeira', descripcion: `Miguel Freitas, de 38 anos, é economista especializada em planejamento financeiro pessoal. Lidera a estratégia editorial do ${siteConfig.siteName}, ajudando famílias a criar orçamentos sólidos e planos de poupança eficazes.` },
    { nombre: 'Carlos Almeida', titulo: 'Analista Financeiro Certificado (CFA)', descripcion: `Carlos Almeida, de 41 anos, é analista financeiro certificado e um dos principais colunistas do ${siteConfig.siteName}, onde compartilha seus conhecimentos sobre planejamento financeiro, crédito pessoal e estratégias de investimento acessíveis.` },
    { nombre: 'Lucas Moraes', titulo: 'Consultora de Crédito Certificada', descripcion: `Lucas Moraes, de 34 anos, é redatora no ${siteConfig.siteName}, com foco especial em finanças para mulheres e famílias que buscam alcançar a independência financeira.` },
    { nombre: 'Felipe Pires', titulo: 'Consultor Fiscal e Tributário', descripcion: `Felipe Pires, de 37 anos, é colunista no ${siteConfig.siteName}, especializado em crédito pessoal, investimentos e estratégias financeiras de longo prazo.` },
  ],
  en: [
    { nombre: 'Miguel Freitas', titulo: 'Economist & Financial Planner', descripcion: `Miguel Freitas, 38, is an economist specialized in personal financial planning. She leads the editorial strategy at ${siteConfig.siteName}, helping families build solid budgets and effective savings plans.` },
    { nombre: 'Carlos Almeida', titulo: 'Certified Financial Analyst (CFA)', descripcion: `Carlos Almeida, 41, is a certified financial analyst and one of the main columnists at ${siteConfig.siteName}, where he shares expertise on financial planning, personal credit and accessible investment strategies.` },
    { nombre: 'Lucas Moraes', titulo: 'Certified Credit Advisor', descripcion: `Lucas Moraes, 34, is a writer at ${siteConfig.siteName}, with a special focus on finances for women and families seeking financial independence.` },
    { nombre: 'Felipe Pires', titulo: 'Tax and Fiscal Advisor', descripcion: `Felipe Pires, 37, is a columnist at ${siteConfig.siteName}, specialized in personal credit, investments and long-term financial strategies.` },
  ],
  fr: [
    { nombre: 'Miguel Freitas', titulo: 'Économiste & Planificatrice Financière', descripcion: `Miguel Freitas, 38 ans, est économiste spécialisée en planification financière personnelle. Elle dirige la stratégie éditoriale de ${siteConfig.siteName}, aidant les familles à créer des budgets solides et des plans d'épargne efficaces.` },
    { nombre: 'Carlos Almeida', titulo: 'Analyste Financier Certifié (CFA)', descripcion: `Carlos Almeida, 41 ans, est analyste financier certifié et l'un des principaux chroniqueurs de ${siteConfig.siteName}, où il partage ses connaissances en planification financière, crédit personnel et stratégies d'investissement accessibles.` },
    { nombre: 'Lucas Moraes', titulo: 'Conseillère en Crédit Certifiée', descripcion: `Lucas Moraes, 34 ans, est rédactrice chez ${siteConfig.siteName}, avec un focus particulier sur les finances pour les femmes et les familles cherchant l'indépendance financière.` },
    { nombre: 'Felipe Pires', titulo: 'Conseiller Fiscal et Tributaire', descripcion: `Felipe Pires, 37 ans, est chroniqueur chez ${siteConfig.siteName}, spécialisé en crédit personnel, investissements et stratégies financières à long terme.` },
  ],
};

export default function EspecialistasPage() {
  const { lang } = useLang();
  const pc = pageMeta[lang] ?? pageMeta.es;
  const team = teamData[lang] ?? teamData.es;

  return (
    <main className="min-h-screen py-10 px-4" style={{ backgroundColor: brandColors.bgGray }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{pc.h1}</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">{pc.subtitle}</p>
        </div>
        <h2 className="text-xl font-bold text-gray-900 text-center mb-6 pb-4 border-b border-gray-200">{pc.authorsTitle}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {team.map((esp) => {
            const avatarSlug = esp.nombre.toLowerCase().replace(/\s+/g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            const avatar = `/imagens/avatar-author/${avatarSlug}.svg`;
            const authorUrl = lang === 'es' ? `/a/${avatarSlug}/` : `/${lang}/a/${avatarSlug}/`;
            return (
                <a key={esp.nombre} href={authorUrl} className="bg-white rounded-sm p-4 flex flex-col items-center text-center hover:shadow-lg transition-shadow no-underline" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.07)', border: '1px solid #f3f4f6' }}>
                  <div className="rounded-full p-0.5 sm:p-1 mb-3" style={{ border: '0.5px solid #111', background: '#fff' }}>
                    <div className="w-32 h-32 sm:w-24 sm:h-24 rounded-full overflow-hidden">
                      <img src={avatar} alt={esp.nombre} className="w-full h-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                    </div>
                  </div>
                  <p className="font-bold text-gray-900 text-base mb-1 leading-snug">{esp.nombre}</p>
                  <p className="text-gray-500 text-sm leading-relaxed mb-2">{esp.descripcion}</p>
                  <div className="flex items-center gap-3 mt-2 text-secondary">
                    <a href={authorUrl} target="_blank" rel="noopener noreferrer" aria-label="facebook">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                    </a>
                    <a href={authorUrl} target="_blank" rel="noopener noreferrer" aria-label="instagram">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                    </a>
                    <a href={authorUrl} target="_blank" rel="noopener noreferrer" aria-label="linkedin">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                    </a>
                    <a href={authorUrl} target="_blank" rel="noopener noreferrer" aria-label="twitter">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                    </a>
                  </div>
                </a>
            );
          })}
        </div>
      </div>
    </main>
  );
}