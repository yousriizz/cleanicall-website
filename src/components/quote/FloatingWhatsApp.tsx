'use client';

import { useEffect, useState } from 'react';
import { contact } from '@/lib/contact';
import { Icon } from '@/components/ui/Icon';

export function FloatingWhatsApp() {
  const [nearForm, setNearForm] = useState(false);
  useEffect(() => {
    const section = document.getElementById('devis');
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => setNearForm(entry.isIntersecting), { rootMargin: '64px' });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);
  return <a className="floating-whatsapp" href={contact.whatsapp} hidden={nearForm}
    aria-label="Contacter Cleanic’All sur WhatsApp pour un devis"><Icon name="whatsapp" /></a>;
}
