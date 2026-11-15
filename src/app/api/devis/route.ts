import { isIP } from 'node:net';
import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { contact } from '@/lib/contact';
import { bodyBytes, findService, photoBytes, photoError, photoLimit, receiptName } from '@/lib/quote';
import { makeReceipt, privateKey, receiptSeconds } from '@/lib/quote-server';

const windowSeconds = 600;
const limit = 8;
const localAttempts = new Map<string, { until: number; count: number }>();

function error(message: string, status: number, fields?: Record<string, string>) {
  return NextResponse.json({ message, fields }, {
    status,
    headers: { 'Cache-Control': 'no-store', ...(status === 429 && { 'Retry-After': String(windowSeconds) }) },
  });
}

async function acceptRequest(key: string, test: boolean) {
  if (test) {
    const now = Date.now();
    for (const [id, attempt] of localAttempts) {
      if (attempt.until <= now) localAttempts.delete(id);
    }
    const attempt = localAttempts.get(key) ?? { until: now + windowSeconds * 1000, count: 0 };
    attempt.count++;
    localAttempts.set(key, attempt);
    return attempt.count <= limit;
  }

  const result = await fetch(process.env.QUOTE_REDIS_URL!, {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.QUOTE_REDIS_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(['EVAL', "local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],ARGV[1]); end; return n", 'quote:' + key, windowSeconds]),
    signal: AbortSignal.timeout(3500),
  });
  const value = (await result.json()).result;
  if (!result.ok || typeof value !== 'number') throw new Error('Rate limiter unavailable');
  return value <= limit;
}

async function readForm(request: NextRequest) {
  if (Number(request.headers.get('content-length')) > bodyBytes) return;
  const reader = request.body?.getReader();
  if (!reader) return;
  const chunks: Uint8Array<ArrayBuffer>[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > bodyBytes) {
      await reader.cancel();
      return;
    }
    chunks.push(new Uint8Array(value));
  }
  return new Response(new Blob(chunks), {
    headers: { 'Content-Type': request.headers.get('content-type') ?? '' },
  }).formData();
}

const fields = {
  nom: [2, 100], telephone: [7, 30], ville: [2, 100],
  email: [0, 254], description: [0, 3000], disponibilites: [0, 150],
} as const;

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  const host = request.headers.get('host') ?? '';
  const loopback = /^(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/.test(host);
  const mode = process.env.QUOTE_MODE;
  const test = mode === 'test' && loopback;
  const live = mode === 'resend' && process.env.QUOTE_ORIGIN?.startsWith('https://') &&
    (process.env.QUOTE_SECRET?.length ?? 0) >= 32 && process.env.QUOTE_REDIS_URL?.startsWith('https://') &&
    process.env.QUOTE_REDIS_TOKEN && process.env.QUOTE_CLIENT_IP_HEADER &&
    process.env.RESEND_API_KEY && process.env.QUOTE_FROM;
  if (!test && !live) return error('Le formulaire est indisponible. Vous pouvez utiliser WhatsApp.', 503);
  if (origin !== (test ? `http://${host}` : process.env.QUOTE_ORIGIN)) return error('Origine non autorisée.', 403);
  if (!request.headers.get('content-type')?.startsWith('multipart/form-data;')) return error('Format de demande invalide.', 415);

  const ip = test ? 'local-test' : request.headers.get(process.env.QUOTE_CLIENT_IP_HEADER!)?.trim();
  if (!ip || (!test && !isIP(ip))) return error('Le formulaire est momentanément indisponible.', 503);
  try {
    if (!await acceptRequest(privateKey(ip), test)) return error('Trop de tentatives. Réessayez dans quelques minutes ou utilisez WhatsApp.', 429);
  } catch {
    return error('Le formulaire est momentanément indisponible.', 503);
  }

  let form: FormData | undefined;
  try {
    form = await readForm(request);
  } catch {
    return error('Impossible de lire la demande.', 400);
  }
  if (!form) return error('Les pièces jointes sont trop volumineuses.', 413);
  const get = (key: string) => {
    const value = form.get(key);
    return typeof value === 'string' ? value.trim() : '';
  };
  if (form.has('site') && form.get('site') !== '') return error('La demande a été bloquée.', 400);
  const service = findService(get('prestation'));
  const issues: Record<string, string> = {};
  if (!service) issues.prestation = 'Choisissez une prestation.';
  if (get('information') !== 'on') issues.information = 'Confirmez avoir lu l’information sur les données.';
  for (const [name, [min, max]] of Object.entries(fields)) {
    const value = get(name);
    if (value.length < min || value.length > max) issues[name] = value.length < min ? 'Renseignez ce champ.' : `Utilisez ${max} caractères maximum.`;
  }
  const phone = get('telephone');
  if (!/^[+\d().\s-]+$/.test(phone) || !/^\d{7,15}$/.test(phone.replace(/\D/g, ''))) issues.telephone = 'Saisissez un numéro de téléphone valide.';
  const email = get('email');
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) issues.email = 'Saisissez une adresse e-mail valide.';
  const photos = form.getAll('photos');
  if (photos.length > photoLimit) issues.photos = `Ajoutez jusqu’à ${photoLimit} photos.`;
  if (Object.keys(issues).length) return error('Vérifiez les champs indiqués.', 422, issues);

  const attachments: { filename: string; content: string }[] = [];
  for (const photo of photos) {
    try {
      if (typeof photo === 'string' || photoError(photo)) throw new Error('Invalid photo');
      const image = sharp(Buffer.from(await photo.arrayBuffer()), { limitInputPixels: 25_000_000, failOn: 'warning' });
      const metadata = await image.metadata();
      const format = photo.type.slice('image/'.length);
      if (metadata.format !== format || (metadata.pages ?? 1) > 1) throw new Error('Invalid format');
      const bytes = await image.rotate().resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true }).webp({ quality: 78 }).toBuffer();
      if (bytes.length > photoBytes) throw new Error('Invalid size');
      attachments.push({ filename: `photo-${attachments.length + 1}.webp`, content: bytes.toString('base64') });
    } catch {
      return error('Vérifiez les photos jointes.', 422, { photos: 'Joignez des images JPEG, PNG ou WebP valides, de 1 Mo maximum chacune.' });
    }
  }

  if (!test) {
    const id = get('submission');
    if (!/^[a-f0-9-]{36}$/.test(id)) return error('Rechargez le formulaire puis réessayez.', 400);
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
          'Idempotency-Key': `cleanicall-quote/${id}`,
        },
        body: JSON.stringify({
          from: process.env.QUOTE_FROM,
          to: [contact.email],
          subject: 'Nouvelle demande de devis Cleanic’All',
          text: [
            `Prestation : ${service?.title}`, `Nom : ${get('nom')}`, `Téléphone : ${phone}`,
            `Ville ou code postal : ${get('ville')}`, `E-mail : ${email}`,
            `Description : ${get('description')}`, `Disponibilités : ${get('disponibilites')}`,
          ].join('\n'),
          attachments,
        }),
        signal: AbortSignal.timeout(8000),
      });
      if (!response.ok || typeof (await response.json()).id !== 'string') throw new Error('Provider rejected request');
    } catch {
      return error('L’envoi n’a pas pu être confirmé. Réessayez ou utilisez WhatsApp.', 502);
    }
  }

  const response = NextResponse.json({ redirect: '/merci' }, { headers: { 'Cache-Control': 'no-store' } });
  response.cookies.set(receiptName, makeReceipt(test ? 'test' : 'sent'), {
    httpOnly: true, secure: !test, sameSite: 'lax', path: '/merci', maxAge: receiptSeconds,
  });
  return response;
}
