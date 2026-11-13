import Image from 'next/image';
import { services, type Service } from '@/lib/services';
import { serviceQuoteUrl } from '@/lib/contact';

function ServiceCard({ service }: { service: Service }) {
  // Le canapé panoramique est peint en cover dans un cadre haut ; réserver une source assez nette.
  const sizes = service.id === 'canapes'
    ? '(max-width: 700px) 750px, (max-width: 1100px) 1300px, 1800px'
    : '(max-width: 700px) 90vw, (max-width: 1100px) 50vw, 40vw';
  return <article className={`service-card service-${service.id}`} aria-labelledby={`service-${service.id}`}>
    <div className="service-image media-reveal">
      <Image src={service.image} alt="" fill sizes={sizes} loading="lazy" />
      <span className="media-note">{service.mediaNote}</span>
    </div>
    <div className="service-copy">
      <h3 id={`service-${service.id}`}>{service.title}</h3>
      <p>{service.description}</p>
      <div className="service-action">
        <p className="service-price">{service.price}<span>Tarif provisoire</span></p>
        <a className="action-secondary action-quote service-quote" href={serviceQuoteUrl(service.message)} aria-label={`Demander un devis — ${service.title} sur WhatsApp`} aria-describedby="services-note">Demander un devis</a>
      </div>
    </div>
  </article>;
}

export function PremiumServices() {
  return <section id="prestations" className="premium-services" aria-labelledby="services-title">
    <div className="section-heading">
      <h2 id="services-title">Des solutions sur mesure<br />pour votre intérieur.</h2>
      <p>Du canapé aux espaces extérieurs, un soin adapté à chaque surface.</p>
      <p id="services-note" className="content-disclaimer">Offre et tarifs provisoires, à confirmer par Cleanic’All. Les demandes de devis s’ouvrent sur WhatsApp.</p>
    </div>
    <div className="services-grid">{services.map((service) => <ServiceCard key={service.id} service={service} />)}</div>
  </section>;
}
