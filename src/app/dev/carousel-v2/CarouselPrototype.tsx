'use client';

import Image from 'next/image';
import { useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { galleryMedia } from '@/lib/services';
import './prototype.css';

const curves = {
  'Décélération': 'cubic-bezier(.22, 1, .36, 1)',
  'Équilibrée': 'cubic-bezier(.65, 0, .35, 1)',
  'Linéaire': 'linear',
};

const last = galleryMedia.length - 1;
const clamp = (position: number) => Math.max(0, Math.min(last, position));

export function CarouselPrototype() {
  const [active, setActive] = useState(0);
  const [dragPosition, setDragPosition] = useState<number | null>(null);
  const [scale, setScale] = useState(.72);
  const [duration, setDuration] = useState(640);
  const [easing, setEasing] = useState<keyof typeof curves>('Décélération');
  const [distance, setDistance] = useState(84);
  const [inactive, setInactive] = useState('lower');
  const drag = useRef<{ id: number; x: number; step: number; position: number } | null>(null);
  const stage = useRef<HTMLDivElement>(null);
  const position = dragPosition ?? active;

  function move(index: number) {
    setActive(clamp(index));
    setDragPosition(null);
  }

  function start(event: PointerEvent<HTMLDivElement>) {
    if (!event.isPrimary || event.button !== 0 || drag.current) return;
    const first = stage.current?.querySelector('[data-card]');
    if (!first || !stage.current) return;

    // Repartir de la translation affichée permet de reprendre une transition en cours.
    const translate = getComputedStyle(first).translate;
    const step = stage.current.clientWidth * distance / 100;
    const current = translate === 'none' ? active : clamp(-parseFloat(translate) / step);
    drag.current = { id: event.pointerId, x: event.clientX, step, position: current };
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragPosition(current);
  }

  function update(event: PointerEvent<HTMLDivElement>) {
    const gesture = drag.current;
    if (gesture?.id !== event.pointerId) return;
    setDragPosition(clamp(gesture.position + (gesture.x - event.clientX) / gesture.step));
  }

  function finish(event: PointerEvent<HTMLDivElement>) {
    const gesture = drag.current;
    if (gesture?.id !== event.pointerId) return;
    drag.current = null;
    const delta = (gesture.x - event.clientX) / gesture.step;
    const end = event.type === 'pointerup' ? gesture.position + delta : gesture.position;
    const target = event.type === 'pointerup' && Math.abs(delta) > .15
      ? delta > 0 ? Math.ceil(end) : Math.floor(end)
      : Math.round(end);
    move(target);
  }

  return <section className="carousel-v2-shell" aria-labelledby="carousel-v2-title">
    <header className="carousel-v2-header">
      <h1 id="carousel-v2-title">Chaque détail fait la différence.</h1>
      <p>Visuels de démonstration. Photos du client à venir.</p>
    </header>
    <div className="carousel-v2-controls">
      <p id="carousel-v2-help">Faites glisser les images ou utilisez les flèches.</p>
      <div role="group" aria-label="Commandes de la galerie">
        <button type="button" aria-label="Visuel précédent" aria-controls="carousel-v2-stage" disabled={active === 0} onClick={() => move(active - 1)}>←</button>
        <button type="button" aria-label="Visuel suivant" aria-controls="carousel-v2-stage" disabled={active === last} onClick={() => move(active + 1)}>→</button>
      </div>
    </div>
    <div ref={stage} id="carousel-v2-stage" className="carousel-v2-stage" role="region" aria-label="Visuels de la galerie" aria-describedby="carousel-v2-help" tabIndex={0}
      data-dragging={dragPosition !== null ? '' : undefined}
      style={{ '--duration': `${duration}ms`, '--curve': curves[easing] } as CSSProperties}
      onPointerDown={start} onPointerMove={update} onPointerUp={finish} onPointerCancel={finish} onLostPointerCapture={finish}
      onKeyDown={event => {
        const index = { ArrowLeft: active - 1, ArrowRight: active + 1, Home: 0, End: last }[event.key];
        if (index === undefined) return;
        event.preventDefault();
        move(index);
      }}>
      {galleryMedia.map((media, index) => {
        const offset = index - position;
        const retreat = Math.min(1, Math.abs(offset));
        return <figure key={media.id} className="carousel-v2-card" data-card aria-hidden={index !== active}
          style={{
            '--x': `${offset * distance}cqw`,
            '--size': 1 - retreat * (1 - scale),
            '--drop': `${retreat * (inactive === 'lower' ? 6 : 0)}cqw`,
            '--dim': inactive === 'dim' ? 1 - retreat * .38 : 1,
            '--caption-x': `${Math.sign(offset) * retreat * 26}px`,
            '--caption-opacity': 1 - retreat * .66,
          } as CSSProperties}>
          <div className="carousel-v2-frame">
            <Image src={media.image} alt="" fill sizes="(max-width: 700px) 85vw, 76vw" draggable={false} />
            <span>{media.note}</span>
          </div>
          <figcaption>
            <h2>{media.title}</h2>
            <p>{media.detail}</p>
          </figcaption>
        </figure>;
      })}
    </div>
    <p className="sr-only" aria-live="polite">{active + 1} sur {galleryMedia.length} · {galleryMedia[active].title}</p>
    <details className="carousel-v2-settings">
      <summary>Réglages du prototype</summary>
      <label>Échelle inactive <output>{Math.round(scale * 100)} %</output><input type="range" min=".5" max=".9" step=".01" value={scale} onChange={event => setScale(+event.target.value)} /></label>
      <label>Durée <output>{duration} ms</output><input type="range" min="250" max="1100" step="10" value={duration} onChange={event => setDuration(+event.target.value)} /></label>
      <label>Courbe <select value={easing} onChange={event => setEasing(event.target.value as keyof typeof curves)}>{Object.keys(curves).map(curve => <option key={curve}>{curve}</option>)}</select></label>
      <label>Distance <output>{distance} %</output><input type="range" min="80" max="100" value={distance} onChange={event => setDistance(+event.target.value)} /></label>
      <label>Carte inactive <select value={inactive} onChange={event => setInactive(event.target.value)}><option value="lower">Décalée vers le bas</option><option value="dim">Atténuée</option><option value="flat">Alignée</option></select></label>
    </details>
  </section>;
}
