import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { contact } from '@/lib/contact';
import { receiptName } from '@/lib/quote';
import { readReceipt } from '@/lib/quote-server';

export const instant = false;

export const metadata = { title: 'Votre demande | Cleanic’All', robots: { index: false, follow: false } };

export default async function Thanks() {
  await connection();
  const receipt = readReceipt((await cookies()).get(receiptName)?.value);
  if (!receipt) redirect('/#devis');

  return <main className="quote-result" data-quote-status={receipt}>
    <h1>{receipt === 'test' ? 'Demande de test validée.' : 'Merci pour votre demande.'}</h1>
    <p>{receipt === 'test' ? 'Le formulaire a validé votre demande de test. Aucun e-mail n’a été envoyé.' : 'Votre demande a bien été transmise. Cleanic’All pourra vous recontacter avec les coordonnées indiquées.'}</p>
    <div className="quote-result-actions">
      <Link className="action-primary action-quote" href="/">Retour à l’accueil</Link>
      <a className="action-secondary" href={contact.whatsapp}>Ouvrir WhatsApp</a>
    </div>
  </main>;
}
