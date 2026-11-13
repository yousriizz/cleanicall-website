# Itération 2 — galerie immersive et prestations

Date : 10 novembre 2026. Branche : `feature/immersive-services-v2`.
Base vérifiée : `main`, commit `253f8bd` (PR #6 fusionnée), identique à la référence distante au début de la tâche. Aucun commit, push, merge ni déploiement pendant cette itération.

## Réalisation

Deux sections ajoutées immédiatement après le comparateur :

- **Galerie** : trois grands visuels, défilement horizontal natif, tactile et trackpad, flèches précédent/suivant, limites désactivées, région focalisable et commandes clavier gauche/droite/Début/Fin. Aucun autoplay, aucun scroll-jacking. Le titre et le sous-titre suivent le brief.
- **Prestations** : six offres. Le canapé occupe une grande surface sur desktop, accompagné des blocs matelas et tapis, puis des trois prestations restantes. Sur tablette, le canapé prend toute la largeur ; sur mobile, les prestations se succèdent en colonne.
- **CTA** : six liens WhatsApp réutilisent le destinataire existant et préremplissent un message spécifique à la prestation. Aucune création de formulaire, aucun envoi réel dans les tests.
- **Identité** : Manrope, blanc, noir, gris de section et bleu `#315FAE` conservés. Pas de dépendance ajoutée. Header, Hero, comparateur et dialogues de l’itération 1 inchangés ; leurs parcours de navigation existants sont conservés.

## Architecture et médias

`ImmersiveGallery` et `PremiumServices` sont des composants serveur. `GalleryRail` est la seule nouvelle frontière client : elle reçoit les figures serveur par `children`, gère les commandes et suit les limites de défilement. Un ResizeObserver recalcule ces limites lors des changements de largeur.

Les données éditoriales sont centralisées dans `src/lib/services.ts` pour faciliter un futur remplacement par un CMS. `serviceQuoteUrl` construit les destinations à partir du contact existant.

Les médias passent par `next/image`, sont chargés en lazy et disposent d’un espace réservé. La résolution demandée tient compte du panorama recadré en cover pour le canapé. Les illustrations SVG locales, légères et sans contenu tiers, sont des emplacements provisoires.

La révélation utilise uniquement transform/opacity avec une timeline CSS de scroll, et une progression de l’opacité de 0,96 à 1 : le contenu reste visible sans JS et sans support des timelines. Le mode mouvement réduit supprime les animations et les transitions et rend les commandes de défilement instantanées. Les focus restent visibles en bleu.

## Contenus à confirmer

Aucune photographie authentifiée de réalisation n’a été ajoutée. La galerie réutilise deux images de démonstration générées déjà présentes, ainsi qu’un emplacement illustré. Les six prestations présentent également une mention explicite sur chaque média : démonstration générée ou illustration provisoire.

Les montants du brief sont affichés avec une mention **Tarif provisoire** pour chaque prestation et une note de section : canapé dès 60 €, matelas dès 50 €, tapis dès 70 €, moquette et terrasse à confirmer, chantier sur devis. L’offre, les montants et les photographies restent à valider avant publication. Le `noindex` existant est conservé.

## Fichiers

Créés :

- `src/components/home/ImmersiveGallery.tsx`
- `src/components/home/PremiumServices.tsx` (inclut le composant serveur ServiceCard)
- `src/components/ui/GalleryRail.tsx`
- `src/lib/services.ts`
- `public/images/placeholders/{matelas,tapis,moquettes,terrasses,chantier}.svg`
- `tests/browser/iteration-v2.pw`
- `tests/browser/README.md`
- `docs/iteration-v2.md`

Modifiés : `src/app/page.tsx`, `src/app/globals.css`, `src/lib/contact.ts`.

## Tests réels

- `npm run lint` : réussi.
- `npx --no-install tsc --noEmit` : réussi.
- `npm run build` : réussi, page statique générée avec Turbopack.
- `git diff --check` : réussi.
- Régression Playwright Chromium : **160/160** contrôles réussis (37 généraux, 25 régressions, 26 comparateur, 42 marque, 30 CTA/clavier).
- Nouvelles sections : **109/109** contrôles réussis aux trois formats, incluant les six CTA réellement activés au clavier et les navigations interceptées, les flèches, leurs limites, les gestes tactiles émulés, les médias différés et mentions provisoires.
- Contrôles complémentaires : **17/17** réussis, incluant axe, contrastes, activation des flèches par Entrée/Espace, largeurs 320/375/1024 sans débordement et présence des contenus/CTA serveur avec JS désactivé.
- Total : **286 contrôles réussis, aucun échec final**.
- Les trois redimensionnements des dialogues 390 → 1440, 1024 → 1366 et 1440 → 390 restent fonctionnels.
- Axe : zéro violation détectée à 1440, 768 et 390 px. Seul `color-contrast` reste incomplet pour les contenus sur image. Les textes des nouvelles sections sont sur des surfaces unies ; contraste minimal calculé sur les couleurs CSS et le fond effectif : **4,66:1**. Cela ne constitue pas une certification WCAG complète.
- Suite des nouvelles sections : aucune erreur ni aucun avertissement console, aucune réponse HTTP ≥ 400.

Incidents résolus pendant la recette : le premier build échouait sur l’ouverture d’un port local par Turbopack dans le sandbox ; la relance autorisée et la mise de côté du cache défaillant ont permis le build normal, sans modification de configuration. Six assertions initiales sur les limites de la galerie s’exécutaient avant le rendu React des boutons ; elles attendent maintenant leur état observable. Un contrôle axe incomplet sur le nom du groupe de commandes a conduit à ajouter `role="group"`, puis à rejouer la suite et axe avec succès.

Les scripts historiques restent des outils locaux ignorés. Leur attente des images a été adaptée pour charger les nouveaux médias lazy par défilement avant capture. La nouvelle suite de 109 contrôles et son mode d’emploi sont inclus dans `tests/browser/` ; aucun pipeline CI ni nouvelle dépendance de test n’est ajouté.

## Vérification visuelle et captures

Les rendus ont été inspectés à 1440, 768 et 390 px : hiérarchie Manrope, grands visuels, marges cohérentes avec le Hero, surfaces blanches/gris clair et accents bleus. Le cadrage du détail textile et la résolution du canapé ont été ajustés après la première revue. Les captures de sections masquent seulement le Header sticky et le lien d’évitement dans l’outil de capture, pour éviter leurs superpositions ; la capture pleine page conserve le Header.

Dossier local ignoré : `output/playwright/iteration-v2/`.

- Pages complètes : `1440.png`, `768.png`, `390.png`.
- Galerie : `gallery-1440.png`, `gallery-768.png`, `gallery-390.png`.
- Prestations : `services-1440.png`, `services-768.png`, `services-390.png`.
- Sorties détaillées : `qa-output.txt`, `regressions-output.txt`, `control-output.txt`, `brand-output.txt`, `cta-keyboard-output.txt`, `new-sections-output.txt`, `accessibility-v2-output.txt`.

## Limites et suite

Les vrais médias et tarifs confirmés restent nécessaires pour finaliser l’aspect photographique et les informations commerciales. Le menu Prestations conserve l’aperçu de l’itération 1 ; la nouvelle section est accessible par défilement et directement via `/#prestations`, sans modifier le Header validé. Les sections suivantes ne sont pas commencées.

Pas de test sur appareil physique, Safari/Firefox/Edge, lecteur d’écran ni de mesure Lighthouse dans cette passe. Le tactile est émulé dans Chromium. Aucun score de performance réel ni conformité complète n’est revendiqué.

Message de commit proposé, non exécuté : `feat(home): add immersive gallery and premium services`.
