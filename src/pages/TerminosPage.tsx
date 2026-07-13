import { useLang } from '../i18n/LangContext';
import { brandColors } from '../config/siteConfig';

interface TermsSection { id: string; title: string; content: string; }
interface TermsLang { pageTitle: string; intro: string; sections: TermsSection[]; }

const termsContent: Record<string, TermsLang> = {
  es: {
    pageTitle: 'Términos de Uso',
    intro: 'Bienvenido a nuestros Términos de Uso. Al acceder y utilizar este sitio web, aceptas cumplir con estos términos y condiciones.',
    sections: [
      { id: 'uso', title: '1. Uso del Sitio', content: 'Este sitio web proporciona contenidos sobre mascotas y animales de estimación únicamente con fines educativos, informativos e inspiracionales. No constituye asesoría veterinaria, médica o de crianza profesional. Para cuestiones de salud de tu mascota, consulta siempre a un veterinario cualificado.' },
      { id: 'contenido', title: '2. Propiedad del Contenido', content: 'Todo el contenido publicado en este sitio —artículos, gráficos, logos e imágenes— es propiedad de este sitio web y está protegido por las leyes de propiedad intelectual. No está permitida su reproducción sin autorización expresa por escrito.' },
      { id: 'exactitud', title: '3. Exactitud de la Información', content: 'Aunque nos esforzamos por ofrecer información precisa y actualizada, no garantizamos la exactitud, integridad o vigencia del contenido. La información puede cambiar sin previo aviso y puede no reflejar las condiciones actuales del mercado.' },
      { id: 'enlaces', title: '4. Sitios de Terceros', content: 'Este sitio puede contener enlaces a sitios web de terceros. No somos responsables del contenido, políticas de privacidad o prácticas de esos sitios. El acceso a sitios externos es bajo tu propio riesgo.' },
      { id: 'cambios', title: '5. Cambios en los Términos', content: 'Nos reservamos el derecho de modificar estos Términos de Uso en cualquier momento. Los cambios serán efectivos inmediatamente después de su publicación. El uso continuo del sitio implica aceptación de los Términos actualizados.' },
      { id: 'contacto', title: '6. Contacto', content: 'Si tienes preguntas sobre estos Términos de Uso, puedes contactarnos a través de la página de contacto. Responderemos en el menor tiempo posible.' },
    ],
  },
  pt: {
    pageTitle: 'Termos de Uso',
    intro: 'Bem-vindo aos nossos Termos de Uso. Ao acessar e utilizar este site, você concorda em cumprir estes termos e condições.',
    sections: [
      { id: 'uso', title: '1. Uso do Site', content: 'Este site fornece conteúdos sobre pets e animais de estimação apenas para fins educacionais, informativos e inspiracionais. Não constitui assessoria veterinária, médica ou de criação profissional. Para questões de saúde do seu pet, consulte sempre um veterinário qualificado.' },
      { id: 'conteudo', title: '2. Propriedade do Conteúdo', content: 'Todo o conteúdo publicado neste site — artigos, gráficos, logotipos e imagens — é propriedade deste site e está protegido pelas leis de propriedade intelectual. Não é permitida sua reprodução sem autorização expressa por escrito.' },
      { id: 'exatidao', title: '3. Exatidão das Informações', content: 'Embora nos esforcemos para oferecer informações precisas e atualizadas, não garantimos a exatidão, integridade ou vigência do conteúdo. As informações podem mudar sem aviso prévio e podem não refletir as condições atuais do mercado.' },
      { id: 'links', title: '4. Sites de Terceiros', content: 'Este site pode conter links para sites de terceiros. Não somos responsáveis pelo conteúdo, políticas de privacidade ou práticas desses sites. O acesso a sites externos é por sua conta e risco.' },
      { id: 'mudancas', title: '5. Alterações nos Termos', content: 'Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. As alterações entrarão em vigor imediatamente após sua publicação. O uso continuado do site implica aceitação dos Termos atualizados.' },
      { id: 'contato', title: '6. Contato', content: 'Se você tiver dúvidas sobre estes Termos de Uso, pode nos contatar através da página de contato. Responderemos o mais breve possível.' },
    ],
  },
  en: {
    pageTitle: 'Terms of Use',
    intro: 'Welcome to our Terms of Use. By accessing and using this website, you agree to comply with these terms and conditions.',
    sections: [
      { id: 'uso', title: '1. Use of the Site', content: 'This website provides content about pets and animals for educational, informational and inspirational purposes only. It does not constitute veterinary, medical or professional breeding advice. For your pet\'s health concerns, always consult a qualified veterinarian.' },
      { id: 'contenido', title: '2. Content Ownership', content: 'All content published on this site — articles, graphics, logos, and images — is the property of this website and is protected by intellectual property laws. Reproduction without express written authorization is not permitted.' },
      { id: 'exactitud', title: '3. Accuracy of Information', content: 'While we strive to provide accurate and up-to-date information, we do not guarantee the accuracy, completeness, or timeliness of the content. Information may change without notice and may not reflect current market conditions.' },
      { id: 'enlaces', title: '4. Third-Party Sites', content: 'This site may contain links to third-party websites. We are not responsible for the content, privacy policies, or practices of those sites. Access to external sites is at your own risk.' },
      { id: 'cambios', title: '5. Changes to Terms', content: 'We reserve the right to modify these Terms of Use at any time. Changes will be effective immediately upon publication. Continued use of the site implies acceptance of the updated Terms.' },
      { id: 'contacto', title: '6. Contact', content: 'If you have questions about these Terms of Use, you can contact us through the contact page. We will respond as soon as possible.' },
    ],
  },
  fr: {
    pageTitle: "Conditions d'Utilisation",
    intro: "Bienvenue dans nos Conditions d'Utilisation. En accédant et en utilisant ce site web, vous acceptez de respecter ces conditions.",
    sections: [
      { id: 'uso', title: '1. Utilisation du Site', content: "Ce site web fournit des contenus sur les animaux de compagnie à des fins éducatives, informatives et inspirationnelles uniquement. Il ne constitue pas un conseil vétérinaire, médical ou d'élevage professionnel. Pour toute question de santé de votre animal, consultez toujours un vétérinaire qualifié." },
      { id: 'contenido', title: '2. Propriété du Contenu', content: "Tout le contenu publié sur ce site — articles, graphiques, logos et images — est la propriété de ce site web et est protégé par les lois sur la propriété intellectuelle. La reproduction sans autorisation écrite expresse n'est pas autorisée." },
      { id: 'exactitud', title: '3. Exactitude des Informations', content: "Bien que nous nous efforcions de fournir des informations précises et actualisées, nous ne garantissons pas l'exactitude, l'exhaustivité ou l'actualité du contenu. Les informations peuvent changer sans préavis et peuvent ne pas refléter les conditions actuelles du marché." },
      { id: 'enlaces', title: '4. Sites Tiers', content: "Ce site peut contenir des liens vers des sites web tiers. Nous ne sommes pas responsables du contenu, des politiques de confidentialité ou des pratiques de ces sites. L'accès aux sites externes est à vos propres risques." },
      { id: 'cambios', title: '5. Modifications des Conditions', content: "Nous nous réservons le droit de modifier ces Conditions d'Utilisation à tout moment. Les modifications seront effectives immédiatement après leur publication. L'utilisation continue du site implique l'acceptation des Conditions mises à jour." },
      { id: 'contacto', title: '6. Contact', content: "Si vous avez des questions sur ces Conditions d'Utilisation, vous pouvez nous contacter via la page de contact. Nous répondrons dans les plus brefs délais." },
    ],
  },
};

export default function TerminosPage() {
  const { lang } = useLang();
  const t = termsContent[lang] ?? termsContent.es;

  return (
    <main className="min-h-screen py-10 px-4" style={{ backgroundColor: brandColors.bgGray }}>
      <div className="max-w-3xl mx-auto bg-white rounded-xl" style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
        <div className="border-b border-gray-200 px-8 py-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">{t.pageTitle}</h1>
        </div>
        <div className="px-8 py-8 text-sm text-gray-700">
          <p className="mb-8 text-gray-500">{t.intro}</p>
          <div className="space-y-6">
            {t.sections.map((s) => (
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