# Cleanic’All — première itération

Périmètre : Header, Hero, Transformation. Aucun formulaire complet, CMS, service détaillé ou déploiement. Les modifications locales déjà présentes ont été reprises. Aucun commit, push ou merge.

## Références et arbitrages

La mission limite cette session à trois éléments. La section Services visible dans la maquette n’est donc pas développée. Le cahier des charges du 8 novembre 2026 fournit les coordonnées, la zone d’intervention et les informations fonctionnelles.

Conflits signalés pendant le développement :

- Le PDF demande un hero vidéo sombre avec comparateur intégré ; la maquette validée montre un hero clair et un comparateur séparé. La composition de la maquette est suivie.
- Le PDF suggère des titres de 44–56 px desktop et 30–34 px mobile ; les proportions de la maquette appellent des titres plus grands. Cette itération suit la maquette.
- Le PDF évoque WordPress ou équivalent ; la mission confirme Next.js. Le choix du CMS reste pour une autre étape.
- Le logo HD et sa couleur officielle n’ont pas été fournis. Le mot-symbole typographique et les boutons noirs suivent la maquette ; ne pas considérer le vert du focus comme une couleur de marque validée.

## Direction visuelle

Blanc `#ffffff`, texte `#111111`, boutons `#0b0b0b`, texte secondaire `#707074`, mot « neufs. » `#89898c`, surface de commande `#f6f6f7`. Une seule famille sans-serif locale (Arial/Helvetica), poids 400 et 700, sans téléchargement de police. Le logo typographique, le titre sur deux lignes et les marges suivent la référence. Le grand visuel de nettoyage est le point d’attention ; les autres éléments restent sobres.

La maquette ne fournit pas la police ni les photographies séparées. Le rendu reprend sa composition, mais ne peut pas être annoncé comme identique au pixel. Un contrôle natif supplémentaire sous l’image rend le comparateur explicite et facilement utilisable au clavier.

## Architecture

- `src/app/page.tsx` assemble les trois blocs, avec un lien d’évitement.
- `src/components/layout/Header.tsx` : navigation sticky, menu mobile avec état local, fermeture par Échap, clic extérieur et sélection d’une ancre. Le menu fermé est `inert`.
- `src/components/home/Hero.tsx` : Server Component pour le contenu statique.
- `src/components/home/HeroMedia.tsx` : point de remplacement du poster par une vidéo officielle. Quand cette vidéo arrivera, prévoir une image de repli, aucune lecture en mode mouvement réduit, et un contrôle de pause si elle boucle.
- `src/components/home/Transformation.tsx` : composition et avertissement de démonstration.
- `src/components/home/BeforeAfter.tsx` : état isolé du curseur, Pointer Events pour souris et tactile, capture du pointeur, contrôle natif `range` pour le clavier. Le pourcentage modifie un `clip-path`, jamais la largeur des images. Les deux plans gardent exactement le même cadrage.
- `src/components/ui/PreviewAction.tsx` : fenêtres natives `dialog`, avec focus modal et restitution à la fermeture. Les destinations non développées proposent un aperçu court et un contact réel plutôt qu’un lien inexistant.
- `src/components/ui/Icon.tsx` : SVG locaux, décoratifs et masqués aux lecteurs d’écran.
- `src/lib/contact.ts` : coordonnées officielles centralisées et message WhatsApp encodé intégralement.
- `src/app/globals.css` : tokens Tailwind, styles de composition, responsive, animations CSS et mode réduit.
- `src/app/layout.tsx` : langue française, titre et description. Le `noindex` de la prévisualisation est conservé tant que le contenu reste provisoire.
- `.gitignore` : captures et fichiers temporaires Playwright exclus du suivi Git et du scan de contenu Tailwind.

Aucune dépendance ajoutée. Les composants interactifs sont les seules frontières client. Aucun abonnement au scroll en JavaScript : la révélation de Transformation utilise `animation-timeline: view()` si le navigateur la prend en charge ; sinon le contenu reste visible. Toutes les animations sont désactivées avec `prefers-reduced-motion`.

## Médias provisoires

Images créées avec l’outil intégré `imagegen`, puis redimensionnées et compressées avec Sharp en WebP :

- `public/images/hero-demo.webp` : environ 110 Ko. Image de nettoyage de démonstration.
- `public/images/sofa-demo.webp` : environ 139 Ko. Même image de canapé pour les deux états ; assombrissement et salissures CSS explicitement simulés.

Les deux visuels sont identifiés dans l’interface. Aucun témoignage ni réalisation réelle n’est inventé. Le SVG préexistant `nettoyage-placeholder.svg` est conservé mais n’est plus utilisé.

Prompts utilisés avec `imagegen` :

**Hero**

> Create a photorealistic provisional website hero photograph, landscape 1536x1024. Close-up of professional upholstery injection extraction cleaning: transparent triangular extractor nozzle with tiny water droplets on an ivory textured fabric sofa cushion, stainless steel wand diagonally entering from upper right, black gloved hand visible at far upper right. Nozzle centered at 73% horizontal and 62% vertical. Pale bright airy living room background, white negative space across entire LEFT HALF for black heading overlaid later in code. Very refined neutral white/gray light, premium product photography, tactile fabric, shallow depth of field. No text, no logos, no UI, no watermark. This is an illustrative demonstration asset, not documentary proof of a real client job.

**Canapé**

> Generate a photorealistic provisional website image of a pristine ivory boucle three seat sofa in a refined minimal gray living room, soft daylight from upper right, full sofa seen straight on and positioned across RIGHT TWO THIRDS of the wide landscape composition. Left third is empty charcoal gray wall, reserved for white text added later. Wide banner composition about 3:1, sofa bottom slightly cropped, pillows at right. Architectural editorial photography, same clean neutral aesthetic as a luxury interior brand. Entire sofa CLEAN, NO before-after divider, NO dirt, NO labels, NO text, NO UI. We will simulate a before state with an explicitly labeled CSS demonstration overlay using this same exact image to guarantee pixel alignment. This is a demonstration, not a real customer result.

Pour passer aux images officielles : remplacer les sources dans Hero et Transformation, fournir une paire de mêmes dimensions et cadrage, puis retirer `demonstration` et son avertissement seulement après vérification de la provenance.

## Vérifications

Les résultats finaux et captures sont consignés après la recette locale. Les tests tactiles Chromium sont une émulation, pas une validation sur un appareil physique. Aucun score Lighthouse ni test Safari/Firefox/Edge n’est revendiqué.

Référence de revue ergonomique : https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md

## Commit proposé

`feat(home): implement premium header hero and before-after comparison`

### Résultats du 10 novembre 2026

- `npm run lint` : réussi.
- `npx tsc --noEmit` : réussi, mode strict conservé.
- `npm run build` : réussi avec Turbopack, page statique générée. Les premières tentatives ont rencontré une restriction système de création de processus/port ; un build Webpack puis les builds Turbopack suivants ont réussi.
- `git diff --check` : réussi.
- Recette Playwright CLI sur le build local de production : 38 assertions réussies. Largeurs 320, 360, 390, 768, 1024, 1240, 1440 et 1920 px, devis visible, absence de débordement, liens officiels, fermeture/restitution du focus, menu mobile, navigation par ancre, sticky, bornes et flèches clavier, glissement souris, glissement tactile Chromium émulé, alignement des images, mode réduit et révélation au scroll.
- Une première recette avait échoué sur la restitution du focus dans le menu mobile. Corrigée en laissant le dialogue gérer Échap avant le menu, puis recette complète réussie.
- Captures desktop 1240 px et mobile 390 px, prises en mode mouvement réduit pour afficher toute la page dans une capture pleine hauteur : `output/playwright/desktop.png` et `output/playwright/mobile.png` (artefacts locaux ignorés par Git).
- Comparaison visuelle : composition conservée, suppression du débordement du comparateur, correction de la graisse du titre Transformation. Médias et police restent provisoires.
- La revue de code selon les Web Interface Guidelines a couvert les libellés, le HTML sémantique, les focus, les cibles tactiles, les images dimensionnées et les animations réduites. Ce contrôle ne constitue pas un audit WCAG complet.
- Vérification finale dans deux contextes Chromium propres, sans changement de viewport après chargement : zéro erreur et zéro avertissement console, desktop et mobile. Les changements rapides de viewport pendant la recette générale ont provoqué deux avertissements de preload devenus inutiles, absents dans ces sessions propres.
