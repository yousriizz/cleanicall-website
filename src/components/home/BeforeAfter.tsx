'use client';

import Image from 'next/image';
import { useId, useRef, useState, type CSSProperties, type PointerEvent } from 'react';

type BeforeAfterProps = { before: string; after: string; demonstration?: boolean };
// Sur mobile, cover peint un panorama d’environ deux fois la largeur de l’écran.
const imageSizes = '(max-width: 700px) 200vw, (max-width: 960px) 120vw, 95vw';

export function BeforeAfter({ before, after, demonstration = false }: BeforeAfterProps) {
  const [position, setPosition] = useState(62);
  const range = useRef<HTMLInputElement>(null);
  const labelId = useId();
  const hintId = useId();

  function move(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    setPosition(Math.min(100, Math.max(0, Math.round((event.clientX - rect.left) / rect.width * 100))));
  }

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0 || !event.isPrimary) return;
    event.preventDefault();
    range.current?.focus({ preventScroll: true });
    event.currentTarget.setPointerCapture(event.pointerId);
    move(event);
  }

  function continueDrag(event: PointerEvent<HTMLDivElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) move(event);
  }

  function endDrag(event: PointerEvent<HTMLDivElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  return (
    <figure className="comparison-figure">
      <div className="comparison" style={{ '--position': `${position}%` } as CSSProperties}>
        <div className="transformation-copy">
          <p className="eyebrow">La transformation</p>
          <h2 id="transformation-title">Un résultat<br />qui se voit.</h2>
          <p>Avant / après : la preuve<br />d’un nettoyage en profondeur.</p>
        </div>
        <div className="comparison-images" onPointerDown={startDrag} onPointerMove={continueDrag} onPointerUp={endDrag} onPointerCancel={endDrag}>
          <Image src={after} alt={demonstration ? 'Canapé clair dans un salon, image de démonstration générée.' : 'Canapé après nettoyage.'} fill sizes={imageSizes} loading="eager" />
          <div className={`comparison-before${demonstration ? ' is-simulated' : ''}`}>
            <Image src={before} alt="" fill sizes={imageSizes} loading="eager" />
            {demonstration ? <div className="demo-stains" /> : null}
          </div>
          <div className="comparison-divider" aria-hidden="true"><span>‹ ›</span></div>
          <div className="comparison-labels" aria-hidden="true"><span>Avant</span><span>Après</span></div>
          <label id={labelId} htmlFor={`${labelId}-range`} className="sr-only">Comparer avant et après</label>
          <input
            ref={range}
            id={`${labelId}-range`}
            className="comparison-range"
            type="range"
            min="0"
            max="100"
            step="1"
            value={position}
            aria-labelledby={labelId}
            aria-describedby={hintId}
            aria-valuetext={`${position} % avant, ${100 - position} % après`}
            onChange={(event) => setPosition(Number(event.target.value))}
          />
        </div>
      </div>
      <figcaption id={hintId} className="comparison-help">Glissez pour comparer<span className="sr-only">, ou utilisez les flèches du clavier.</span></figcaption>
    </figure>
  );
}
