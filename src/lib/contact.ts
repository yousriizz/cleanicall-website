/** Coordonnées officielles : cahier des charges du 8 novembre 2026. */
export const contact = {
  phone: '07 49 81 60 82',
  telephone: 'tel:+33749816082',
  email: 'contact@cleanicall.com',
  whatsapp: `https://wa.me/33749816082?text=${encodeURIComponent('Bonjour Cleanic’All, je souhaite un devis pour un nettoyage en Île-de-France. Je peux vous envoyer 2 ou 3 photos.')}`,
};

/** Le même destinataire que les CTA existants, avec un besoin propre à la prestation. */
export function serviceQuoteUrl(service: string) {
  const url = new URL(contact.whatsapp);
  url.searchParams.set('text', `Bonjour Cleanic’All, je souhaite un devis pour ${service}. Je peux vous envoyer 2 ou 3 photos et préciser ma commune.`);
  return url.toString();
}
