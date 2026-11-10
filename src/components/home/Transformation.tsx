import { BeforeAfter } from './BeforeAfter';
export function Transformation() {
  return <section id="transformation" className="transformation" aria-labelledby="transformation-title">
    <BeforeAfter before="/images/sofa-demo.webp" after="/images/sofa-demo.webp" demonstration />
    <p className="transformation-note">Démonstration interactive : image générée et salissures simulées. Ce visuel ne présente pas une réalisation Cleanic’All.</p>
  </section>;
}
