import { services, type Service } from './services';

export const photoLimit = 3;
export const photoBytes = 1024 * 1024;
export const bodyBytes = photoLimit * photoBytes + 64 * 1024;
export const photoTypes = ['image/jpeg', 'image/png', 'image/webp'];
export const receiptName = 'cleanicall-quote';
export const quotePath = '#devis';

export function findService(id: string | null) {
  return services.find(service => service.id === id);
}

export function quoteFor(service: Service) {
  return `?prestation=${service.id}${quotePath}`;
}

export function photoError(file: File) {
  if (!photoTypes.includes(file.type) || !file.size) return 'Choisissez une image JPEG, PNG ou WebP.';
  if (file.size > photoBytes) return 'Chaque photo doit faire 1 Mo maximum.';
}
