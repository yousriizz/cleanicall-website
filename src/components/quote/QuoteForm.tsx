'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from 'react';
import { contact, serviceQuoteUrl } from '@/lib/contact';
import { findService, photoError, photoLimit, photoTypes } from '@/lib/quote';
import { services } from '@/lib/services';

type Photo = { file: File; url: string };
type Errors = Record<string, string>;
const inputs = [
  { name: 'nom', label: 'Nom', autoComplete: 'name', type: 'text', maxLength: 100, required: true },
  { name: 'telephone', label: 'Téléphone', autoComplete: 'tel', type: 'tel', maxLength: 30, required: true },
  { name: 'ville', label: 'Ville ou code postal', autoComplete: 'address-level2', type: 'text', maxLength: 100, required: true },
  { name: 'email', label: 'E-mail', autoComplete: 'email', type: 'email', maxLength: 254, required: false },
] as const;

function subscribe(callback: () => void) {
  window.addEventListener('popstate', callback);
  return () => window.removeEventListener('popstate', callback);
}

export function QuoteForm({ mode }: { mode: string | undefined }) {
  const router = useRouter();
  const preset = useSyncExternalStore(subscribe, () => new URLSearchParams(location.search).get('prestation'), () => null);
  const [selection, setSelection] = useState<string>();
  const service = findService(selection ?? preset);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [photoMessage, setPhotoMessage] = useState('');
  const photoUrls = useRef(new Set<string>());
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState('');
  const [pending, setPending] = useState(false);
  const sending = useRef(false);
  const submission = useRef<{ id: string; version: number } | null>(null);
  const version = useRef(0);
  const errorRef = useRef<HTMLParagraphElement>(null);
  const picker = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const urls = photoUrls.current;
    return () => urls.forEach(url => URL.revokeObjectURL(url));
  }, []);
  useEffect(() => {
    if (message) errorRef.current?.focus();
  }, [message]);

  function addPhotos(files: FileList | null) {
    const next = [...photos];
    const issues = new Set<string>();
    for (const file of Array.from(files ?? [])) {
      const issue = photoError(file);
      if (issue) { issues.add(issue); continue; }
      if (next.length >= photoLimit) { issues.add(`Ajoutez jusqu’à ${photoLimit} photos.`); break; }
      const url = URL.createObjectURL(file);
      photoUrls.current.add(url);
      next.push({ file, url });
    }
    setPhotos(next);
    setPhotoMessage([...issues].join(' '));
    setErrors(previous => ({ ...previous, photos: '' }));
    version.current++;
  }

  function removePhoto(photo: Photo) {
    URL.revokeObjectURL(photo.url);
    photoUrls.current.delete(photo.url);
    setPhotos(photos.filter(item => item !== photo));
    setPhotoMessage('');
    picker.current?.focus();
    version.current++;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;
    const data = new FormData(event.currentTarget);
    for (const photo of photos) data.append('photos', photo.file);
    if (submission.current?.version !== version.current) {
      submission.current = { id: crypto.randomUUID(), version: version.current };
    }
    data.set('submission', submission.current.id);
    sending.current = true;
    setPending(true);
    setMessage('');
    setErrors({});
    try {
      const response = await fetch('/api/devis', { method: 'POST', body: data, signal: AbortSignal.timeout(25000) });
      const result = await response.json();
      if (response.ok && result.redirect === '/merci') {
        router.push('/merci');
        return;
      }
      setErrors(result.fields ?? {});
      setMessage(result.message ?? 'L’envoi n’a pas pu être confirmé. Réessayez ou utilisez WhatsApp.');
    } catch {
      setMessage('L’envoi n’a pas pu être confirmé. Réessayez ou utilisez WhatsApp.');
    }
    sending.current = false;
    setPending(false);
  }

  function fieldError(name: string) {
    return errors[name] ? <span id={`erreur-${name}`} className="quote-error">{errors[name]}</span> : null;
  }

  function fieldState(name: string) {
    return { 'aria-invalid': Boolean(errors[name]), 'aria-describedby': errors[name] ? `erreur-${name}` : undefined };
  }

  return <form className="quote-form" onSubmit={submit} aria-labelledby="quote-form-title" aria-busy={pending}
    onChange={() => { version.current++; }} action="/api/devis" method="post" encType="multipart/form-data">
    <h3 id="quote-form-title">Votre demande de devis</h3>
    <p className="quote-muted">Les champs suivis d’un astérisque sont obligatoires.</p>
    {mode === 'test' && <p className="quote-test">Mode test local. Utilisez des données fictives. Aucun e-mail ne sera envoyé.</p>}
    {mode !== 'test' && mode !== 'resend' && <p className="quote-muted">Le formulaire n’est pas encore ouvert. Vous pouvez demander votre devis sur WhatsApp.</p>}
    {message && <p className="quote-error quote-summary" ref={errorRef} tabIndex={-1}>{message}</p>}
    <fieldset disabled={pending} className="quote-fields">
      <fieldset className="quote-services" aria-describedby={errors.prestation ? 'erreur-prestation' : undefined}>
        <legend>Prestation souhaitée *</legend>
        <div className="quote-options">
          {services.map(item => <label key={item.id} className="quote-option">
            <input className="sr-only" type="radio" name="prestation" value={item.id} required checked={service?.id === item.id}
              onChange={() => setSelection(item.id)} {...fieldState('prestation')} />
            <span><Image src={item.image} alt="" width={160} height={88} sizes="160px" /><span>{item.title.replace(/^Nettoyage (?:de |d’)?/, '')}</span></span>
          </label>)}
        </div>
        {fieldError('prestation')}
      </fieldset>
      <div className="quote-grid">
        {inputs.map(input => <label className="quote-field" key={input.name}>
          <span>{input.label}{input.required ? ' *' : ''}</span>
          <input name={input.name} type={input.type} autoComplete={input.autoComplete} required={input.required}
            maxLength={input.maxLength} minLength={input.required ? 2 : undefined} {...fieldState(input.name)} />
          {fieldError(input.name)}
        </label>)}
      </div>
      <label className="quote-field">Description du besoin
        <textarea name="description" rows={3} maxLength={3000} {...fieldState('description')} />
        {fieldError('description')}
      </label>
      <label className="quote-field">Disponibilités
        <input name="disponibilites" maxLength={150} {...fieldState('disponibilites')} />
        {fieldError('disponibilites')}
      </label>
      <div className="quote-photos">
        <label htmlFor="quote-photos">Photos de la surface</label>
        <p id="quote-photo-help" className="quote-muted">Jusqu’à 3 photos JPEG, PNG ou WebP, 1 Mo chacune. Évitez les visages et documents personnels.</p>
        <input ref={picker} id="quote-photos" type="file" accept={photoTypes.join(',')} multiple aria-describedby="quote-photo-help"
          onChange={event => { addPhotos(event.target.files); event.target.value = ''; }} />
        <p className="quote-error" aria-live="polite">{photoMessage}</p>
        {fieldError('photos')}
        {photos.length > 0 && <ul className="quote-previews">
          {photos.map(photo => <li key={photo.url}>
            <Image src={photo.url} alt="" width={68} height={54} unoptimized />
            <span>{photo.file.name}</span>
            <button type="button" onClick={() => removePhoto(photo)} aria-label={`Supprimer ${photo.file.name}`}>×</button>
          </li>)}
        </ul>}
      </div>
      <div hidden><label>Site web<input name="site" tabIndex={-1} autoComplete="off" /></label></div>
      <p className="quote-muted">Cleanic’All utilise ces informations pour traiter votre demande et vous recontacter. Consultez la <Link href="/confidentialite" target="_blank">notice de confidentialité provisoire <span className="sr-only">(nouvel onglet)</span></Link>.</p>
      <label className="quote-consent"><input type="checkbox" name="information" required {...fieldState('information')} /> <span>J’ai lu l’information sur le traitement de mes données. *</span></label>
      {fieldError('information')}
      <button className="action-primary action-quote" type="submit" disabled={mode !== 'test' && mode !== 'resend'}>{pending ? 'Envoi en cours…' : 'Envoyer ma demande'}</button>
    </fieldset>
    <p className="sr-only" role="status">{pending ? 'Envoi de votre demande en cours.' : ''}</p>
    <a className="quote-alternative" href={service ? serviceQuoteUrl(service.message) : contact.whatsapp}>Continuer sur WhatsApp</a>
  </form>;
}
