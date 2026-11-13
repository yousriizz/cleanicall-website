'use client';

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';

/** Les figures restent rendues sur le serveur ; seul le défilement est interactif. */
export function GalleryRail({ children }: { children: ReactNode }) {
  const rail = useRef<HTMLDivElement>(null);
  const id = useId();
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  function updateEdges() {
    const element = rail.current;
    if (!element) return;
    setAtStart(element.scrollLeft <= 2);
    setAtEnd(element.scrollLeft + element.clientWidth >= element.scrollWidth - 2);
  }

  useEffect(() => {
    const element = rail.current;
    if (!element) return;
    const observer = new ResizeObserver(updateEdges);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  function move(direction: number) {
    const element = rail.current;
    const first = element?.firstElementChild;
    if (!element || !(first instanceof HTMLElement)) return;
    const gap = Number.parseFloat(getComputedStyle(element).columnGap) || 0;
    element.scrollBy({
      left: direction * (first.offsetWidth + gap),
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    });
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      move(event.key === 'ArrowRight' ? 1 : -1);
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      rail.current?.scrollTo({ left: event.key === 'Home' ? 0 : rail.current.scrollWidth, behavior: 'instant' });
    }
  }

  return <div className="gallery-shell">
    <div className="gallery-controls">
      <p id={`${id}-hint`}>Faites défiler pour explorer<span className="sr-only">. Au clavier : flèches gauche et droite, Début et Fin.</span></p>
      <div className="gallery-arrows" role="group" aria-label="Commandes de la galerie">
        <button type="button" aria-label="Visuel précédent" aria-controls={id} disabled={atStart} onClick={() => move(-1)}><span aria-hidden="true">←</span></button>
        <button type="button" aria-label="Visuel suivant" aria-controls={id} disabled={atEnd} onClick={() => move(1)}><span aria-hidden="true">→</span></button>
      </div>
    </div>
    <div ref={rail} id={id} className="gallery-rail" role="region" aria-label="Visuels de la galerie" aria-describedby={`${id}-hint`} tabIndex={0} onKeyDown={onKeyDown} onScroll={updateEdges}>
      {children}
    </div>
  </div>;
}
