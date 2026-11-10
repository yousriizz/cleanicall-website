'use client';
import { useEffect, useRef, useState } from 'react';
import { PreviewAction } from '@/components/ui/PreviewAction';
import { Icon } from '@/components/ui/Icon';
function NavigationItems() {
  return <>
    <li><a href="#contenu" aria-current="page" className="nav-item">Accueil</a></li>
    <li><PreviewAction destination="prestations" className="nav-item">Prestations <Icon name="chevron" /></PreviewAction></li>
    <li><PreviewAction destination="professionnels" className="nav-item">Professionnels</PreviewAction></li>
    <li><a href="#transformation" className="nav-item">Nos réalisations</a></li>
    <li><PreviewAction destination="presentation" className="nav-item">À propos</PreviewAction></li>
    <li className="mobile-contact"><PreviewAction destination="devis" className="nav-item">Contact</PreviewAction></li>
  </>;
}
export function Header() {
  const [open, setOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      // Le dialogue natif gère Échap et restitue le focus avant de fermer le menu.
      if (event.key === 'Escape' && !document.querySelector('dialog[open]')) {
        setOpen(false); toggle.current?.focus();
      }
    }
    function onOutside(event: PointerEvent) {
      if (document.querySelector('dialog[open]')) return;
      if (event.target instanceof Node && !header.current?.contains(event.target)) setOpen(false);
    }
    function onResize() { if (window.innerWidth >= 1100) setOpen(false); }
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onOutside);
    window.addEventListener('resize', onResize);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onOutside); window.removeEventListener('resize', onResize); };
  }, [open]);
  return <header className="site-header" ref={header}>
    <div className="header-inner">
      <a href="#contenu" className="wordmark" aria-label="Cleanic’All — accueil">Cleanic’All</a>
      <nav aria-label="Navigation principale" className="desktop-nav"><ul><NavigationItems /></ul></nav>
      <div className="header-actions">
        <PreviewAction destination="devis" className="action-primary action-quote header-quote"><Icon name="whatsapp" /><span>Demander un devis</span></PreviewAction>
        <button ref={toggle} type="button" className="menu-toggle" aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'} onClick={() => setOpen(!open)}><span /><span /></button>
      </div>
    </div>
    <div id="mobile-navigation" className="mobile-navigation" data-open={open} inert={!open}>
      <nav aria-label="Navigation principale mobile"><ul onClick={(event) => { if ((event.target as HTMLElement).closest('a')) setOpen(false); }}><NavigationItems /></ul></nav>
    </div>
  </header>;
}
