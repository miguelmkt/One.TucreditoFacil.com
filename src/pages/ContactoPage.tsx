import { useState } from 'react';
import { siteConfig, brandColors } from '../config/siteConfig';
import { useLang } from '../i18n/LangContext';

interface ContactContent {
  pageTitle: string; subtitle: string; infoTitle: string;
  email: string; hours: string; hoursVal: string; avgReply: string; avgReplyVal: string;
  faqTitle: string; faqItems: string[];
  formTitle: string; successTitle: string; successSub: string;
  nameLabel: string; namePlaceholder: string;
  emailLabel: string; emailPlaceholder: string;
  subjectLabel: string; subjectPlaceholder: string;
  messageLabel: string; messagePlaceholder: string;
  submitBtn: string;
}

const contactContent: Record<string, ContactContent> = {
  es: {
    pageTitle: 'Contacto', subtitle: '¿Tienes dudas, sugerencias o quieres colaborar con nosotros? Escríbenos y te responderemos en menos de 48 horas.',
    infoTitle: 'Información de Contacto', email: 'Correo:', hours: 'Horario de atención:', hoursVal: 'Lunes a viernes, 9:00 – 18:00', avgReply: 'Respuesta promedio:', avgReplyVal: 'menos de 48 horas hábiles',
    faqTitle: 'Temas Frecuentes', faqItems: ['Consultas sobre artículos publicados', 'Propuestas de colaboración o patrocinio', 'Correcciones o actualizaciones de contenido', 'Solicitudes de prensa y medios'],
    formTitle: 'Envíanos un Mensaje', successTitle: '¡Mensaje enviado!', successSub: 'Te responderemos pronto.',
    nameLabel: 'Nombre', namePlaceholder: 'Tu nombre', emailLabel: 'Correo electrónico', emailPlaceholder: 'tu@correo.com',
    subjectLabel: 'Asunto', subjectPlaceholder: '¿En qué podemos ayudarte?', messageLabel: 'Mensaje', messagePlaceholder: 'Escribe tu mensaje aquí...', submitBtn: 'Enviar mensaje',
  },
  pt: {
    pageTitle: 'Contato', subtitle: 'Tem dúvidas, sugestões ou quer colaborar conosco? Escreva-nos e responderemos em menos de 48 horas.',
    infoTitle: 'Informações de Contato', email: 'E-mail:', hours: 'Horário de atendimento:', hoursVal: 'Segunda a sexta, 9:00 – 18:00', avgReply: 'Tempo médio de resposta:', avgReplyVal: 'menos de 48 horas úteis',
    faqTitle: 'Assuntos Frequentes', faqItems: ['Consultas sobre artigos publicados', 'Propostas de colaboração ou patrocínio', 'Correções ou atualizações de conteúdo', 'Solicitações de imprensa e mídia'],
    formTitle: 'Envie uma Mensagem', successTitle: 'Mensagem enviada!', successSub: 'Responderemos em breve.',
    nameLabel: 'Nome', namePlaceholder: 'Seu nome', emailLabel: 'E-mail', emailPlaceholder: 'voce@email.com',
    subjectLabel: 'Assunto', subjectPlaceholder: 'Como podemos ajudá-lo?', messageLabel: 'Mensagem', messagePlaceholder: 'Escreva sua mensagem aqui...', submitBtn: 'Enviar mensagem',
  },
  en: {
    pageTitle: 'Contact', subtitle: 'Have questions, suggestions or want to collaborate with us? Write to us and we will reply within 48 hours.',
    infoTitle: 'Contact Information', email: 'Email:', hours: 'Business hours:', hoursVal: 'Monday to Friday, 9:00 AM – 6:00 PM', avgReply: 'Average reply time:', avgReplyVal: 'less than 48 business hours',
    faqTitle: 'Frequent Topics', faqItems: ['Questions about published articles', 'Collaboration or sponsorship proposals', 'Content corrections or updates', 'Press and media requests'],
    formTitle: 'Send Us a Message', successTitle: 'Message sent!', successSub: "We'll get back to you soon.",
    nameLabel: 'Name', namePlaceholder: 'Your name', emailLabel: 'Email', emailPlaceholder: 'you@email.com',
    subjectLabel: 'Subject', subjectPlaceholder: 'How can we help you?', messageLabel: 'Message', messagePlaceholder: 'Write your message here...', submitBtn: 'Send message',
  },
  fr: {
    pageTitle: 'Contact', subtitle: 'Vous avez des questions, des suggestions ou souhaitez collaborer avec nous ? Écrivez-nous et nous vous répondrons dans les 48 heures.',
    infoTitle: 'Informations de Contact', email: 'E-mail :', hours: 'Heures de bureau :', hoursVal: 'Lundi au vendredi, 9h00 – 18h00', avgReply: 'Délai de réponse moyen :', avgReplyVal: 'moins de 48 heures ouvrables',
    faqTitle: 'Sujets Fréquents', faqItems: ['Questions sur les articles publiés', 'Propositions de collaboration ou de parrainage', 'Corrections ou mises à jour de contenu', 'Demandes de presse et médias'],
    formTitle: 'Envoyez-nous un Message', successTitle: 'Message envoyé !', successSub: 'Nous vous répondrons bientôt.',
    nameLabel: 'Nom', namePlaceholder: 'Votre nom', emailLabel: 'E-mail', emailPlaceholder: 'vous@email.com',
    subjectLabel: 'Sujet', subjectPlaceholder: 'Comment pouvons-nous vous aider ?', messageLabel: 'Message', messagePlaceholder: 'Écrivez votre message ici...', submitBtn: 'Envoyer le message',
  },
};

export default function ContactoPage() {
  const [enviado, setEnviado] = useState(false);
  const { lang } = useLang();
  const c = contactContent[lang] ?? contactContent.es;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEnviado(true);
  }

  return (
    <main className="min-h-screen py-10 px-4" style={{ backgroundColor: brandColors.bgGray }}>
      <div className="max-w-3xl mx-auto bg-white rounded-xl" style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
        <div className="border-b border-gray-200 px-8 py-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">{c.pageTitle}</h1>
        </div>
        <div className="px-8 py-8 text-sm text-gray-700">
          <p className="mb-8 text-gray-500">{c.subtitle}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mb-10">
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4">{c.infoTitle}</h2>
              <ul className="space-y-3 text-gray-700 text-sm">
                <li><span className="font-semibold">{c.email}</span> <span>{siteConfig.contactEmail}</span></li>
                <li><span className="font-semibold">{c.hours}</span> {c.hoursVal}</li>
                <li><span className="font-semibold">{c.avgReply}</span> {c.avgReplyVal}</li>
              </ul>
              <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">{c.faqTitle}</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm">
                {c.faqItems.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4">{c.formTitle}</h2>
              {enviado ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <p className="text-green-700 font-semibold text-lg">{c.successTitle}</p>
                  <p className="text-green-600 text-sm mt-1">{c.successSub}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{c.nameLabel}</label>
                    <input type="text" required placeholder={c.namePlaceholder} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{c.emailLabel}</label>
                    <input type="email" required placeholder={c.emailPlaceholder} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{c.subjectLabel}</label>
                    <input type="text" required placeholder={c.subjectPlaceholder} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{c.messageLabel}</label>
                    <textarea required rows={4} placeholder={c.messagePlaceholder} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none" />
                  </div>
                  <button type="submit" className="w-full text-white font-semibold py-2.5 rounded-lg text-sm transition-opacity hover:opacity-90" style={{ backgroundColor: brandColors.secondary }}>
                    {c.submitBtn}
                  </button>
                </form>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}