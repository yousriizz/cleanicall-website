import { PreviewAction } from '@/components/ui/PreviewAction';
import { Icon } from '@/components/ui/Icon';
import { contact } from '@/lib/contact';
import { HeroMedia } from './HeroMedia';
export function Hero() {
  return <section aria-labelledby="hero-title" className="hero">
    <HeroMedia src="/images/hero-demo.webp" alt="Visuel de démonstration : une buse d’injection-extraction nettoie le tissu clair d’un canapé." />
    <div className="hero-content">
      <h1 id="hero-title"><span>Vos textiles</span><span>comme <span className="title-muted">neufs.</span></span></h1>
      <p className="hero-description">Nettoyage professionnel de canapés, matelas, tapis et fin de chantier, directement chez vous en Île-de-France.</p>
      <div className="hero-actions">
        <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer" className="action-primary"><Icon name="whatsapp" />Devis sur WhatsApp<span className="sr-only"> (nouvel onglet)</span></a>
        <PreviewAction destination="devis" className="action-secondary action-quote">Demander un devis</PreviewAction>
      </div>
      <ul className="hero-reassurance">
        <li><Icon name="bolt" /><p><strong>À domicile</strong><span>en Île-de-France</span></p></li>
        <li><Icon name="leaf" /><p><strong>Produits adaptés</strong><span>à chaque textile</span></p></li>
        <li><Icon name="shield" /><p><strong>Nettoyage</strong><span>en profondeur</span></p></li>
      </ul>
    </div>
    <p className="hero-demo-note">Visuel de démonstration</p>
    <a href="#transformation" className="discover">Découvrir<Icon name="chevron" /></a>
  </section>;
}
