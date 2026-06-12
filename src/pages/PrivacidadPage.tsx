import { useLang } from '../i18n/LangContext';
import { brandColors } from '../config/siteConfig';

interface PrivacySection { id: string; title: string; content: string; }
interface PrivacyLang { pageTitle: string; intro: string; sections: PrivacySection[]; }

const privacyContent: Record<string, PrivacyLang> = {
  es: {
    pageTitle: 'Política de Privacidad',
    intro: 'Tu privacidad es importante para nosotros. Esta política explica cómo recopilamos, utilizamos y protegemos tu información personal cuando visitas nuestro sitio web.',
    sections: [
      { id: 'recopilacion', title: '1. Información que Recopilamos', content: 'Podemos recopilar información personal como tu nombre y correo electrónico cuando te contactas con nosotros, así como datos técnicos como dirección IP, tipo de navegador y páginas visitadas a través de cookies y tecnologías de rastreo.' },
      { id: 'uso', title: '2. Cómo Usamos tu Información', content: 'Utilizamos la información recopilada para: mejorar la experiencia del usuario en nuestro sitio, responder a tus consultas, enviar comunicaciones si nos has dado tu consentimiento, y analizar el uso del sitio para mejorar nuestro contenido.' },
      { id: 'cookies', title: '3. Cookies y Tecnologías de Rastreo', content: 'Usamos cookies propias y de terceros para personalizar tu experiencia y mostrar publicidad relevante. Puedes configurar tu navegador para rechazar cookies, aunque algunas funciones del sitio pueden no funcionar correctamente.' },
      { id: 'publicidad', title: '4. Publicidad de Terceros', content: 'Este sitio puede mostrar anuncios de terceros como Google AdSense. Estos proveedores pueden usar cookies para mostrar anuncios relevantes basados en tus visitas a este y otros sitios web. Puedes optar por no participar en publicidad personalizada en las preferencias de anuncios de Google.' },
      { id: 'derechos', title: '5. Tus Derechos', content: 'Tienes derecho a acceder, rectificar y eliminar tus datos personales. También puedes oponerte al tratamiento de tus datos para fines de marketing. Para ejercer estos derechos, contáctanos a través de nuestra página de contacto.' },
      { id: 'cambios', title: '6. Cambios en esta Política', content: 'Nos reservamos el derecho de actualizar esta política en cualquier momento. Te notificaremos de cambios significativos publicando la nueva versión en esta página con la fecha de actualización.' },
    ],
  },
  pt: {
    pageTitle: 'Política de Privacidade',
    intro: 'Sua privacidade é importante para nós. Esta política explica como coletamos, utilizamos e protegemos suas informações pessoais quando você visita nosso site.',
    sections: [
      { id: 'coleta', title: '1. Informações que Coletamos', content: 'Podemos coletar informações pessoais como seu nome e e-mail quando você nos contata, além de dados técnicos como endereço IP, tipo de navegador e páginas visitadas por meio de cookies e tecnologias de rastreamento.' },
      { id: 'uso', title: '2. Como Usamos suas Informações', content: 'Utilizamos as informações coletadas para: melhorar a experiência do usuário em nosso site, responder às suas consultas, enviar comunicações se você nos deu seu consentimento, e analisar o uso do site para aprimorar nosso conteúdo.' },
      { id: 'cookies', title: '3. Cookies e Tecnologias de Rastreamento', content: 'Usamos cookies próprios e de terceiros para personalizar sua experiência e exibir publicidade relevante. Você pode configurar seu navegador para recusar cookies, embora algumas funções do site possam não funcionar corretamente.' },
      { id: 'publicidade', title: '4. Publicidade de Terceiros', content: 'Este site pode exibir anúncios de terceiros como o Google AdSense. Esses provedores podem usar cookies para mostrar anúncios relevantes com base em suas visitas a este e a outros sites. Você pode desativar a publicidade personalizada nas preferências de anúncios do Google.' },
      { id: 'direitos', title: '5. Seus Direitos', content: 'Você tem o direito de acessar, retificar e excluir seus dados pessoais. Você também pode se opor ao tratamento de seus dados para fins de marketing. Para exercer esses direitos, entre em contato conosco por meio de nossa página de contato.' },
      { id: 'mudancas', title: '6. Alterações nesta Política', content: 'Reservamo-nos o direito de atualizar esta política a qualquer momento. Notificaremos você sobre alterações significativas publicando a nova versão nesta página com a data de atualização.' },
    ],
  },
  en: {
    pageTitle: 'Privacy Policy',
    intro: 'Your privacy is important to us. This policy explains how we collect, use, and protect your personal information when you visit our website.',
    sections: [
      { id: 'collection', title: '1. Information We Collect', content: 'We may collect personal information such as your name and email when you contact us, as well as technical data such as IP address, browser type, and pages visited through cookies and tracking technologies.' },
      { id: 'use', title: '2. How We Use Your Information', content: 'We use the collected information to: improve the user experience on our site, respond to your inquiries, send communications if you have given us your consent, and analyze site usage to improve our content.' },
      { id: 'cookies', title: '3. Cookies and Tracking Technologies', content: 'We use first-party and third-party cookies to personalize your experience and display relevant advertising. You can configure your browser to reject cookies, although some site features may not work correctly.' },
      { id: 'advertising', title: '4. Third-Party Advertising', content: 'This site may display third-party ads such as Google AdSense. These providers may use cookies to show relevant ads based on your visits to this and other websites. You can opt out of personalized advertising in Google ad preferences.' },
      { id: 'rights', title: '5. Your Rights', content: 'You have the right to access, rectify, and delete your personal data. You may also object to the processing of your data for marketing purposes. To exercise these rights, contact us through our contact page.' },
      { id: 'changes', title: '6. Changes to This Policy', content: 'We reserve the right to update this policy at any time. We will notify you of significant changes by posting the new version on this page with the update date.' },
    ],
  },
  fr: {
    pageTitle: 'Politique de Confidentialité',
    intro: 'Votre vie privée est importante pour nous. Cette politique explique comment nous collectons, utilisons et protégeons vos informations personnelles lorsque vous visitez notre site web.',
    sections: [
      { id: 'collecte', title: '1. Informations que Nous Collectons', content: "Nous pouvons collecter des informations personnelles telles que votre nom et votre adresse e-mail lorsque vous nous contactez, ainsi que des données techniques telles que l'adresse IP, le type de navigateur et les pages visitées via des cookies et des technologies de suivi." },
      { id: 'utilisation', title: '2. Comment Nous Utilisons vos Informations', content: "Nous utilisons les informations collectées pour : améliorer l'expérience utilisateur sur notre site, répondre à vos demandes, envoyer des communications si vous nous avez donné votre consentement, et analyser l'utilisation du site pour améliorer notre contenu." },
      { id: 'cookies', title: '3. Cookies et Technologies de Suivi', content: 'Nous utilisons des cookies propriétaires et tiers pour personnaliser votre expérience et afficher de la publicité pertinente. Vous pouvez configurer votre navigateur pour refuser les cookies, bien que certaines fonctionnalités du site puissent ne pas fonctionner correctement.' },
      { id: 'publicite', title: '4. Publicité de Tiers', content: "Ce site peut afficher des publicités de tiers tels que Google AdSense. Ces fournisseurs peuvent utiliser des cookies pour afficher des publicités pertinentes en fonction de vos visites sur ce site et d'autres sites web. Vous pouvez désactiver la publicité personnalisée dans les préférences de publicité de Google." },
      { id: 'droits', title: '5. Vos Droits', content: 'Vous avez le droit d\'accéder, de rectifier et de supprimer vos données personnelles. Vous pouvez également vous opposer au traitement de vos données à des fins marketing. Pour exercer ces droits, contactez-nous via notre page de contact.' },
      { id: 'modifications', title: '6. Modifications de Cette Politique', content: 'Nous nous réservons le droit de mettre à jour cette politique à tout moment. Nous vous informerons des modifications importantes en publiant la nouvelle version sur cette page avec la date de mise à jour.' },
    ],
  },
};

export default function PrivacidadPage() {
  const { lang } = useLang();
  const p = privacyContent[lang] ?? privacyContent.es;

  return (
    <main className="min-h-screen py-10 px-4" style={{ backgroundColor: brandColors.bgGray }}>
      <div className="max-w-3xl mx-auto bg-white rounded-xl" style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
        <div className="border-b border-gray-200 px-8 py-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">{p.pageTitle}</h1>
        </div>
        <div className="px-8 py-8 text-sm text-gray-700">
          <p className="mb-8 text-gray-500">{p.intro}</p>
          <div className="space-y-6">
            {p.sections.map((s) => (
              <section key={s.id}>
                <h2 className="text-lg font-bold text-gray-800 mb-2">{s.title}</h2>
                <p className="text-gray-600 leading-relaxed">{s.content}</p>
              </section>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}