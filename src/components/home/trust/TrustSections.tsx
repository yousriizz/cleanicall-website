import Image from 'next/image';
import { contact, serviceQuoteUrl } from '@/lib/contact';
import { getVerifiedGoogleReviews, googleReviewsLinks } from '@/lib/google-reviews';
import { InterventionMap } from './InterventionMap';
import './trust.css';

const steps = [
  { title: 'Envoyez-nous vos photos.', description: 'Quelques photos de la surface à nettoyer et votre commune nous aident à préparer votre devis.' },
  { title: 'Choisissez votre date.', description: 'Une fois le devis validé, convenons ensemble d’un créneau qui vous convient.' },
  { title: 'Profitez du résultat.', description: 'Nous intervenons sur place, avec le matériel adapté à la prestation convenue.' },
];

const audiences = ['Hôtels', 'Conciergeries Airbnb', 'Bureaux', 'Syndics et gestionnaires de biens', 'Entreprises du BTP'];

function GoogleReviews() {
  const snapshot = getVerifiedGoogleReviews();

  return (
    <section id="avis" className="trust-section trust-reviews" aria-labelledby="reviews-title">
      <div>
        <p className="trust-label">Avis Google</p>
        <h2 id="reviews-title">L’expérience de nos clients.</h2>
      </div>
      <div className="trust-review-copy">
        {snapshot ? (
          <>
            <p className="trust-review-rating"><strong>{new Intl.NumberFormat('fr-FR').format(snapshot.rating)} / 5</strong> · {snapshot.count} avis</p>
            <p>Vérifié le <time dateTime={snapshot.fetchedAt}>{new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeZone: 'Europe/Paris' }).format(new Date(snapshot.fetchedAt))}</time>.</p>
            {snapshot.testimonials.map(review => (
              <figure key={review.id}>
                <blockquote>{review.text}</blockquote>
                <figcaption>{review.author}</figcaption>
              </figure>
            ))}
          </>
        ) : (
          <>
            <p className="trust-review-status">Données Google en attente de vérification</p>
            <p>Retrouvez les avis directement sur la fiche Google de Cleanic’All. La note et le nombre d’avis seront affichés ici après vérification.</p>
          </>
        )}
        <div className="trust-actions">
          <a className="action-primary action-quote" href={googleReviewsLinks.listing}>Voir tous les avis</a>
          <a className="action-secondary" href={googleReviewsLinks.write}>Laisser un avis</a>
        </div>
      </div>
    </section>
  );
}

const storyImages = [
  '/images/appartement/envoyer-photo-sans-personnes.webp',
  '/images/appartement/rendez-vous-sans-personnes.webp',
  '/images/appartement/resultat.webp',
] as const;
const machineSizes = '(min-width: 1280px) 700px, (min-width: 900px) 58vw, 92vw';

function CleaningStory() {
  return (
    <section id="comment-ca-marche" className="trust-story" aria-labelledby="story-title">
      <div className="trust-section">
        <p className="trust-label">Comment ça marche</p>
        <h2 id="story-title">Trois étapes.<br />Un intérieur transformé.</h2>
        <div className="trust-story-track">
          <div className="trust-story-scene">
            <figure className="trust-machine">
              <div className="trust-machine-frame">
                <Image className="trust-shot trust-shot-wide" src={storyImages[0]} alt="" fill sizes={machineSizes} />
                <Image className="trust-shot trust-shot-calendar" src={storyImages[1]} alt="" fill sizes={machineSizes} />
                <Image className="trust-shot trust-shot-result" src={storyImages[2]} alt="" fill sizes={machineSizes} />
              </div>
              <figcaption>Illustrations générées à titre provisoire</figcaption>
            </figure>
            <div className="trust-story-narrative">
              <div className="trust-story-progress" aria-hidden="true">
                <span>01</span><span>02</span><span>03</span>
              </div>
              <ol className="trust-story-steps" role="list">
                {steps.map((step, index) => (
                  <li className="trust-story-step" key={step.title}>
                    <div className="trust-story-copy">
                      <span className="trust-step-number" aria-hidden="true">0{index + 1}</span>
                      <h3>{step.title}</h3>
                      <p>{step.description}</p>
                      {index > 0 && (
                        <figure className="trust-static-shot">
                          <Image src={storyImages[index]} alt="" fill sizes="(max-width: 900px) 92vw, 700px" />
                          <figcaption>Illustration générée</figcaption>
                        </figure>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
        <a className="action-primary action-quote trust-story-action" href={contact.whatsapp}>Envoyer mes photos sur WhatsApp</a>
      </div>
    </section>
  );
}

function ProfessionalPartnership() {
  return (
    <section id="partenariats" className="trust-section" aria-labelledby="partnership-title">
      <div className="trust-partnership">
        <div>
          <p className="trust-label">Professionnels</p>
          <h2 id="partnership-title">Le soin de vos espaces, au rythme de votre activité.</h2>
          <p>Pour un besoin ponctuel ou récurrent, parlons de vos locaux, des surfaces à nettoyer et de vos contraintes d’accès.</p>
          <a className="action-secondary" href={serviceQuoteUrl('un partenariat professionnel en nettoyage')}>Discuter d’un partenariat</a>
        </div>
        <ul aria-label="Professionnels concernés">
          {audiences.map(audience => <li key={audience}>{audience}</li>)}
        </ul>
      </div>
    </section>
  );
}

export function TrustSections() {
  return (
    <>
      <GoogleReviews />
      <CleaningStory />
      <InterventionMap />
      <ProfessionalPartnership />
    </>
  );
}
