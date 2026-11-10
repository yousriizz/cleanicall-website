'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { contact } from '@/lib/contact';
import { Icon } from './Icon';

const destinations = {
  devis: { title: 'Parlons de votre nettoyage.', description: 'Envoyez-nous 2 ou 3 photos sur WhatsApp pour demander votre devis, ou contactez-nous par téléphone ou par e-mail.' },
  prestations: { title: 'Un soin adapté à vos textiles.', description: 'Canapés, matelas, tapis, moquettes et terrasses en Île-de-France. Nettoyage de fin de chantier sur devis. Les fiches détaillées seront ajoutées lors d’une prochaine étape.' },
  professionnels: { title: 'Vous êtes professionnel ?', description: 'Conciergeries, hôtels, gestionnaires de biens, bureaux et entreprises du BTP : contactez Cleanic’All pour discuter de vos besoins.' },
  presentation: { title: 'Le soin de vos espaces.', description: 'Cleanic’All est une entreprise de nettoyage à domicile en Île-de-France. Notre technique : l’injection-extraction, avec du matériel professionnel et des produits adaptés.' },
};

type PreviewActionProps = {
  children: React.ReactNode;
  destination: keyof typeof destinations;
  className?: string;
};

export function PreviewAction({ children, destination, className }: PreviewActionProps) {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const content = destinations[destination];

  useEffect(() => {
    if (open) dialog.current?.showModal();
  }, [open]);

  function close() {
    setOpen(false);
    // Le déclencheur peut être masqué après un changement de breakpoint.
    const target = trigger.current?.checkVisibility()
      ? trigger.current
      : document.querySelector<HTMLButtonElement>('.header-quote');
    target?.focus({ preventScroll: true });
  }

  return (
    <>
      <button ref={trigger} type="button" className={className} aria-haspopup="dialog" onClick={() => setOpen(true)}>
        {children}
      </button>
      {open ? createPortal(
        <dialog ref={dialog} aria-labelledby={titleId} aria-describedby={descriptionId} className="preview-dialog" onClose={close}>
          <form method="dialog"><button className="dialog-close" aria-label="Fermer la fenêtre" autoFocus>×</button></form>
          <h2 id={titleId}>{content.title}</h2>
          <p id={descriptionId}>{content.description}</p>
          <a className="action-primary" href={contact.whatsapp} target="_blank" rel="noopener noreferrer">
            <Icon name="whatsapp" />{destination === 'devis' ? 'Devis sur WhatsApp' : 'Contacter Cleanic’All'}
            <span className="sr-only"> (nouvel onglet)</span>
          </a>
          <div className="contact-links">
            <a href={contact.telephone}>{contact.phone}</a>
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </div>
          {destination === 'devis' ? <p className="dialog-note">Le formulaire en ligne sera ajouté lors d’une prochaine étape.</p> : null}
        </dialog>,
        document.body,
      ) : null}
    </>
  );
}
