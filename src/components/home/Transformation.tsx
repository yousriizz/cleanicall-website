import { BeforeAfter } from './BeforeAfter';
export function Transformation() {
  return <section id="transformation" className="transformation" aria-labelledby="transformation-title">
    <BeforeAfter before="/images/appartement/comparateur.webp" after="/images/appartement/comparateur.webp" demonstration />
    <p className="transformation-note">Démonstration interactive : image générée et salissures simulées. Ce visuel ne présente pas une réalisation Cleanic’All.</p>
  </section>;
}
