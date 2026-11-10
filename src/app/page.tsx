import { Hero } from "@/components/home/Hero";
import { Header } from "@/components/layout/Header";
import { Transformation } from "@/components/home/Transformation";

export default function Home() {
  return (
    <div className="cleanicall">
      <a href="#contenu" className="skip-link">Aller au contenu</a>
      <Header />
      <main id="contenu" tabIndex={-1}><Hero /><Transformation /></main>
    </div>
  );
}
