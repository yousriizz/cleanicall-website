import { Hero } from "@/components/home/Hero";
import { Header } from "@/components/layout/Header";
import { Transformation } from "@/components/home/Transformation";
import { ImmersiveGallery } from "@/components/home/ImmersiveGallery";
import { PremiumServices } from "@/components/home/PremiumServices";

export default function Home() {
  return (
    <div className="cleanicall">
      <a href="#contenu" className="skip-link">Aller au contenu</a>
      <Header />
      <main id="contenu" tabIndex={-1}><Hero /><Transformation /><ImmersiveGallery /><PremiumServices /></main>
    </div>
  );
}
