import Image from 'next/image';
import { contact } from '@/lib/contact';
import { Icon } from '@/components/ui/Icon';
import { QuoteForm } from './QuoteForm';

export function QuoteSection() {
  return <section id="devis" className="quote-section" aria-labelledby="quote-title" tabIndex={-1}>
    <h2 id="quote-title">Tout commence ici.</h2>
    <p className="quote-intro">Un intérieur transformé, à quelques clics.</p>
    <div className="quote-layout">
      <div className="quote-whatsapp">
        <h3>Votre devis sur WhatsApp</h3>
        <p>Envoyez-nous deux ou trois photos de la surface à nettoyer et indiquez votre commune.</p>
        <div className="quote-whatsapp-actions">
          <a className="action-primary" href={contact.whatsapp}><Icon name="whatsapp" />Ouvrir WhatsApp</a>
          <a className="quote-phone" href={contact.telephone}>{contact.phone}</a>
        </div>
        <figure className="quote-qr">
          <Image src="/images/whatsapp-qr.png" alt="" width={104} height={104} unoptimized />
          <figcaption>Scannez le code avec votre téléphone pour ouvrir WhatsApp.</figcaption>
        </figure>
        <a className="quote-form-jump" href="#quote-form-title">Utiliser le formulaire</a>
      </div>
      <QuoteForm mode={process.env.QUOTE_MODE} />
    </div>
  </section>;
}
