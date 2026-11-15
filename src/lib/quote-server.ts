import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

const localSecret = randomBytes(32).toString('hex');
export const receiptSeconds = 300;

function signature(value: string) {
  return createHmac('sha256', process.env.QUOTE_SECRET || localSecret).update(value).digest('hex');
}

export function makeReceipt(mode: 'test' | 'sent') {
  const value = `${mode}.${Date.now() + receiptSeconds * 1000}.${randomBytes(12).toString('hex')}`;
  return `${value}.${signature(value)}`;
}

export function readReceipt(receipt = '') {
  const [mode, expires, nonce, hash] = receipt.split('.');
  if ((mode !== 'test' && mode !== 'sent') || !/^\d{13}$/.test(expires ?? '') ||
      Number(expires) <= Date.now() || !/^[a-f0-9]{24}$/.test(nonce ?? '') ||
      !/^[a-f0-9]{64}$/.test(hash ?? '') || receipt.split('.').length !== 4) return;
  if (timingSafeEqual(Buffer.from(hash), Buffer.from(signature(`${mode}.${expires}.${nonce}`)))) return mode;
}

export function privateKey(ip: string) {
  return signature(ip);
}
