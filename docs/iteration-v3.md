# Itération 3 — Avis, parcours, zone d’intervention et professionnels

Branche de travail : `feature/trust-experience-v3`. Les modifications du carrousel présentes dans l’index au démarrage sont distinctes de cette itération. Les quatre sections suivent les prestations dans l’accueil. Le menu et les sections antérieures conservent leur comportement.

## Données et médias

- [Site Cleanic’All](https://cleanicall.com/#avis) : source des deux liens vers la fiche et le formulaire d’avis Google. La fiche n’a pas pu être consultée directement pour confirmer la note, le nombre ou les témoignages. La section affiche donc son état provisoire. `getVerifiedGoogleReviews()` fournit le contrat côté serveur pour un futur fournisseur avec note, nombre, horodatage et témoignages vérifiés.
- [Contours administratifs Etalab](https://www.data.gouv.fr/datasets/contours-administratifs) : millésime 2026, fichier `departements-1000m.geojson`, huit départements extraits puis convertis en chemins SVG. Projection locale à 48,8° N et précision d’un dixième d’unité dans le viewBox. La carte couvre les départements demandés et les radios servent d’alternative textuelle native. Le cahier du dépôt demande de faire confirmer les communes : le CTA ouvre WhatsApp avec le département sélectionné.
- La machine est une illustration générée, identifiée comme provisoire dans la légende, stockée en WebP (81 Kio) et servie avec `next/image`.
- Le bloc professionnel présente les publics demandés et préremplit un message sur le canal WhatsApp existant.

## Choix de mouvement

[CSS Scroll-driven Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations/Timelines) pilote la transformation du visuel et la mise en avant du texte via des timelines de vue. Chaque étape traverse le même cycle de montée, lecture et retrait. Le cadre reste fixe avec `position: sticky`. L’image zoom et se déplace progressivement dans le cadre. Les animations suivent la position de scroll dans les deux sens et n’ajoutent ni écouteur JavaScript de défilement ni décalage de mise en page.

[Motion](https://motion.dev/docs/react-use-scroll) et [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) permettent aussi de lier un mouvement à la progression. La composition demandée tient en deux timelines natives et un sticky CSS, donc les deux bibliothèques ajouteraient une dépendance sans besoin concret. Sous 900 px, en viewport bas, en mouvement réduit ou en l’absence de support des timelines, l’image et les étapes se lisent en colonne. Seule la carte a besoin d’une frontière client dans les nouvelles sections.

## Fichiers

- `src/app/page.tsx` : ajout des sections à l’accueil.
- `src/components/home/trust/TrustSections.tsx`, `InterventionMap.tsx`, `trust.css` : contenu, interactions cartographiques et styles.
- `src/lib/google-reviews.ts`, `src/lib/ile-de-france.ts` : contrat des avis, liens Google et géométrie locale.
- `public/images/extractor-demo.webp` : illustration provisoire.
- `tests/browser/iteration-v3.pw` : tests ciblés et enregistrement.
- `tests/browser/iteration-v2.pw` : vérification de l’ordre relatif des anciennes sections sur la page étendue.

## Recette locale

ESLint, TypeScript et build Next.js réussis. Chromium à 1440, 768, 390 et 320 px : 53 vérifications ciblées réussies. Le cadre reste à 94 px du haut aux trois points desktop échantillonnés. Le retour au même point restitue le même zoom et les mêmes opacités. Les tests couvrent aussi la sélection SVG par clic et par toucher émulé, les radios au clavier, les liens contextualisés et le mouvement réduit.

Axe n’a signalé aucune violation sur les quatre nouvelles sections en mode statique à 1440, 768 et 390 px. La validation sur navigateur et appareil physiques, au lecteur d’écran et avec Lighthouse n’a pas été effectuée.

Captures et vidéo dans `output/playwright/iteration-v3/` (ignoré par Git). Pour rejouer les tests, démarrer le build local avec `npm run start -- --hostname 127.0.0.1 --port 3023`, ouvrir la page avec Playwright CLI puis exécuter `run-code --filename=tests/browser/iteration-v3.pw`. Créer le dossier de sortie au préalable. La capture vidéo nécessite l’encodeur Playwright.

Commit proposé : `feat(home): add trust sections and scroll storytelling`.
