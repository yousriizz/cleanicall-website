import Image from 'next/image';
import { GalleryRail } from '@/components/ui/GalleryRail';
import { galleryMedia } from '@/lib/services';

export function ImmersiveGallery() {
  return <section id="galerie" className="immersive-gallery" aria-labelledby="gallery-title">
    <div className="section-heading">
      <h2 id="gallery-title">Chaque détail<br />fait la différence.</h2>
      <p>Canapés, textiles et tapis, vus de près.</p>
      <p className="content-disclaimer">Visuels de démonstration. Photos du client à venir.</p>
    </div>
    <GalleryRail>
      {galleryMedia.map((media) => <figure key={media.id} className={`gallery-slide gallery-slide-${media.id}`}>
        <div className="gallery-image media-reveal">
          {/* Le panorama canapé est plus large que son cadre : sizes couvre aussi le recadrage. */}
          <Image src={media.image} alt="" fill sizes={media.id === 'salon' ? '(max-width: 700px) 280vw, (max-width: 1440px) 127vw, 1820px' : '(max-width: 700px) 130vw, (max-width: 1440px) 110vw, 1500px'} loading="lazy" />
          <span className="media-note">{media.note}</span>
        </div>
        <figcaption><h3>{media.title}</h3><p>{media.detail}</p></figcaption>
      </figure>)}
    </GalleryRail>
  </section>;
}
