import Link from 'next/link';
import { contact } from '@/lib/contact';

export const metadata = { title: 'Confidentialité | Cleanic’All', robots: { index: false, follow: false } };

export default function Privacy() {
  return <main className="quote-result">
    <h1>Confidentialité</h1>
    <p>Notice provisoire. Les modalités définitives seront validées avant l’ouverture publique du formulaire.</p>
    <p>Les coordonnées, les renseignements sur la prestation et les photos facultatives servent à préparer votre devis et à vous recontacter. Vous pouvez écrire à <a href={`mailto:${contact.email}`}>{contact.email}</a> pour toute question sur vos données.</p>
    <Link className="action-primary action-quote" href="/#devis">Retour au devis</Link>
  </main>;
}
