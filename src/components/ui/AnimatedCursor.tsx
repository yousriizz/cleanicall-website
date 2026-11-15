'use client';

import { useEffect, useRef } from 'react';
import './animated-cursor.css';

const cursorQuery = '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) and (forced-colors: none)';
const nativeZones = 'input, textarea, select, [contenteditable]:not([contenteditable="false"]), .comparison-images, .gallery-rail, [draggable="true"]';
const controls = 'a[href], button, summary, label, [role="button"], [role="link"], [data-department]';

export function AnimatedCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = ref.current;
    if (!cursor) return;
    const root = document.documentElement;
    const media = window.matchMedia(cursorQuery);
    const listeners = new AbortController();
    const options = { signal: listeners.signal, passive: true, capture: true };
    let frame = 0;
    let time = 0;
    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;
    let visible = false;
    let hasMouse = false;
    let dragging = false;

    function reset() {
      window.cancelAnimationFrame(frame);
      frame = 0;
      time = 0;
      visible = false;
      root.removeAttribute('data-animated-cursor');
      cursor?.removeAttribute('data-hover');
      cursor?.removeAttribute('data-pressed');
    }

    function leave() {
      hasMouse = false;
      dragging = false;
      reset();
    }

    function render(now: number) {
      const ease = time ? 1 - Math.exp(-Math.min(now - time, 48) / 34) : 1;
      time = now;
      x += (targetX - x) * ease;
      y += (targetY - y) * ease;
      const moving = Math.abs(targetX - x) + Math.abs(targetY - y) > .25;
      if (!moving) {
        x = targetX;
        y = targetY;
      }
      cursor?.style.setProperty('transform', `translate3d(${x}px, ${y}px, 0)`);
      frame = moving ? window.requestAnimationFrame(render) : 0;
      if (!moving) time = 0;
    }

    function updateTarget(target: Element | null) {
      if (!hasMouse || dragging || !media.matches || !target ||
          target === root || target.closest(nativeZones) || document.querySelector('dialog[open]')) {
        if (visible) reset();
        return;
      }
      const control = target.closest(controls);
      const linkLabel = control instanceof HTMLLabelElement && !control.control;
      const hovering = Boolean(control && !linkLabel && !control.matches(':disabled') && !control.closest('[aria-disabled="true"], [inert]') &&
        !(control instanceof HTMLLabelElement && control.control?.matches(':disabled')));
      cursor?.toggleAttribute('data-hover', hovering);
      if (!visible) {
        visible = true;
        x = targetX;
        y = targetY;
        cursor?.style.setProperty('transform', `translate3d(${x}px, ${y}px, 0)`);
        root.setAttribute('data-animated-cursor', '');
      }
      if (!frame && (x !== targetX || y !== targetY)) {
        time = performance.now();
        frame = window.requestAnimationFrame(render);
      }
    }

    function onMove(event: PointerEvent) {
      if (event.pointerType !== 'mouse' || !media.matches) {
        leave();
        return;
      }
      hasMouse = true;
      targetX = event.clientX;
      targetY = event.clientY;
      updateTarget(event.target instanceof Element ? event.target : null);
    }

    function onDown(event: PointerEvent) {
      onMove(event);
      if (visible && event.button === 0) cursor?.setAttribute('data-pressed', '');
    }

    function onUp(event: PointerEvent) {
      cursor?.removeAttribute('data-pressed');
      onMove(event);
    }

    function onOut(event: PointerEvent) {
      if (event.relatedTarget === null) leave();
    }

    function onScroll() {
      if (hasMouse) updateTarget(document.elementFromPoint(targetX, targetY));
    }

    function onDragStart() {
      dragging = true;
      reset();
    }

    window.addEventListener('pointermove', onMove, options);
    window.addEventListener('pointerdown', onDown, options);
    window.addEventListener('pointerup', onUp, options);
    window.addEventListener('pointerout', onOut, options);
    window.addEventListener('pointercancel', leave, options);
    window.addEventListener('blur', leave, options);
    window.addEventListener('scroll', onScroll, options);
    window.addEventListener('resize', onScroll, options);
    window.addEventListener('dragstart', onDragStart, options);
    window.addEventListener('dragend', leave, options);
    document.addEventListener('visibilitychange', leave, options);
    media.addEventListener('change', leave, options);

    return () => {
      listeners.abort();
      leave();
    };
  }, []);

  return <div className="animated-cursor-layer" aria-hidden="true">
    <div ref={ref} className="animated-cursor">
      <div className="animated-cursor-shape">
        <span className="animated-cursor-dot" />
        <span className="animated-cursor-ring" />
      </div>
    </div>
  </div>;
}
