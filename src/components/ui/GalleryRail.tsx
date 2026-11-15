'use client';

import { useCallback, useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';

import { galleryMotionLayers, galleryMotionProfiles } from './gallery-motion';

/** Les figures restent rendues sur le serveur ; seul le défilement est interactif. */
export function GalleryRail({ children, preview = false }: { children: ReactNode; preview?: boolean }) {
  const rail = useRef<HTMLDivElement>(null);
  const id = useId();
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const positions = useRef<number[]>([]);
  const animation = useRef<{ frame: number; destination: number } | null>(null);
  const active = useRef(-1);
  const [profileName, setProfileName] = useState<keyof typeof galleryMotionProfiles>('studio');
  const profile = galleryMotionProfiles[preview ? profileName : 'signature'];
  const reducedMotion = useRef(false);
  const mobile = useRef(false);

  const updatePosition = useCallback(() => {
    const element = rail.current;
    const stops = positions.current;
    if (!element || !stops.length) return;

    const left = element.scrollLeft;
    const nearest = animation.current?.destination ?? stops.reduce((index, stop, candidate) =>
      Math.abs(stop - left) < Math.abs(stops[index] - left) ? candidate : index, 0);
    if (active.current !== nearest) {
      element.children[active.current]?.removeAttribute('data-active');
      element.children[nearest]?.setAttribute('data-active', '');
      active.current = nearest;
    }
    if (!reducedMotion.current) {
      const travel = mobile.current ? profile.mobileTravel : profile.desktopTravel;
      const nominalInterval = stops[1] - stops[0] || 1;

      for (const [index, stop] of stops.entries()) {
        const slide = element.children[index];
        if (!(slide instanceof HTMLElement)) continue;
        const neighbor = stops[index + (left > stop ? 1 : -1)];
        const interval = Math.abs(neighbor - stop) || nominalInterval;
        const distance = Math.max(-1, Math.min(1, (stop - left) / interval));
        const progress = Math.abs(distance);
        const retreat = progress * progress * (3 - 2 * progress);
        slide.style.setProperty('--gallery-frame-scale', String(1 - retreat * profile.frameInset));
        slide.style.setProperty('--gallery-image-x', `${-distance * travel}px`);
        slide.style.setProperty('--gallery-image-scale', String(1 + galleryMotionLayers.restingImageZoom + progress * galleryMotionLayers.imageScale));
        slide.style.setProperty('--gallery-image-opacity', String(1 - retreat * galleryMotionLayers.imageFade));
        slide.style.setProperty('--gallery-caption-y', `${retreat * profile.captionTravel}px`);
        slide.style.setProperty('--gallery-caption-opacity', String(1 - retreat * galleryMotionLayers.captionFade));
      }
    }
    setAtStart(left <= 2);
    setAtEnd(left >= stops[stops.length - 1] - 2);
  }, [profile]);

  const stopAnimation = useCallback(() => {
    if (!animation.current) return;
    cancelAnimationFrame(animation.current.frame);
    animation.current = null;
    rail.current?.removeAttribute('data-scrolling');
    updatePosition();
  }, [updatePosition]);

  useEffect(() => {
    const element = rail.current;
    if (!element) return;

    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotion.current = preference.matches;

    function measure() {
      if (!element) return;
      stopAnimation();
      mobile.current = window.matchMedia('(max-width: 700px)').matches;
      const slides = Array.from(element.children) as HTMLElement[];
      const origin = slides[0]?.offsetLeft ?? 0;
      const end = element.scrollWidth - element.clientWidth;
      positions.current = slides.map(slide => Math.min(end, slide.offsetLeft - origin));
      element.setAttribute('data-ready', '');
      updatePosition();
    }

    const observer = new ResizeObserver(measure);
    observer.observe(element);
    measure();

    function updateMotionPreference() {
      reducedMotion.current = preference.matches;
      const destination = animation.current?.destination;
      if (destination !== undefined && preference.matches) {
        stopAnimation();
        element?.scrollTo({ left: positions.current[destination], behavior: 'instant' });
      }
      updatePosition();
    }
    preference.addEventListener('change', updateMotionPreference);
    return () => {
      observer.disconnect();
      preference.removeEventListener('change', updateMotionPreference);
      stopAnimation();
    };
  }, [stopAnimation, updatePosition]);

  function goTo(index: number) {
    const element = rail.current;
    const target = positions.current[index];
    if (!element || target === undefined) return;

    const start = element.scrollLeft;
    stopAnimation();
    if (Math.abs(target - start) < 1 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      element.scrollTo({ left: target, behavior: 'instant' });
      return;
    }

    element.setAttribute('data-scrolling', '');
    const began = performance.now();
    const job = { frame: 0, destination: index };
    animation.current = job;
    updatePosition();

    function step(now: number) {
      if (!element) return;
      const progress = Math.min(1, (now - began) / profile.duration);
      const eased = progress < .5
        ? 4 * progress ** 3
        : 1 - (-2 * progress + 2) ** 3 / 2;
      element.scrollLeft = start + (target - start) * eased;
      if (progress < 1) {
        job.frame = requestAnimationFrame(step);
      } else {
        stopAnimation();
      }
    }
    job.frame = requestAnimationFrame(step);
  }

  function move(direction: -1 | 1) {
    const current = animation.current?.destination ?? active.current;
    goTo(Math.min(positions.current.length - 1, Math.max(0, current + direction)));
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      move(event.key === 'ArrowRight' ? 1 : -1);
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      goTo(event.key === 'Home' ? 0 : positions.current.length - 1);
    }
  }

  return <div className="gallery-shell">
    {preview && <div className="gallery-controls">
      <label>Profil de mouvement{' '}
        <select value={profileName} onChange={event => setProfileName(event.target.value === 'studio' ? 'studio' : 'signature')}>
          <option value="studio">Studio · 600 ms</option>
          <option value="signature">Signature · 550 ms</option>
        </select>
      </label>
    </div>}
    <div className="gallery-controls">
      <p id={`${id}-hint`}>Faites défiler pour explorer<span className="sr-only">. Au clavier : flèches gauche et droite, Début et Fin.</span></p>
      <div className="gallery-arrows" role="group" aria-label="Commandes de la galerie">
        <button type="button" aria-label="Visuel précédent" aria-controls={id} disabled={atStart} onClick={() => move(-1)}><span aria-hidden="true">←</span></button>
        <button type="button" aria-label="Visuel suivant" aria-controls={id} disabled={atEnd} onClick={() => move(1)}><span aria-hidden="true">→</span></button>
      </div>
    </div>
    <div ref={rail} id={id} style={{
      '--gallery-hover-x': `${galleryMotionLayers.hoverTitleTravel}px`,
      '--gallery-hover-duration': `${galleryMotionLayers.hoverDuration}ms`,
    } as CSSProperties} className="gallery-rail" data-signature="" role="region" aria-label="Visuels de la galerie" aria-describedby={`${id}-hint`} tabIndex={0} onKeyDown={onKeyDown} onScroll={updatePosition} onPointerDown={stopAnimation} onWheel={stopAnimation}>
      {children}
    </div>
  </div>;
}
