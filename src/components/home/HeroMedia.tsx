import Image from 'next/image';
/** Point de remplacement du poster par une future vidéo officielle, sans changer le Hero. */
export function HeroMedia({ src, alt }: { src: string; alt: string }) {
  return <div className="hero-media"><Image src={src} alt={alt} fill sizes="100vw" fetchPriority="high" loading="eager" /></div>;
}
