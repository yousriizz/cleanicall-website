# Cleanic’All — corrections de l’itération 1

Cette passe corrige les huit points demandés après l’audit du 10 novembre 2026. Elle conserve le périmètre Header, Hero et Transformation. Aucun déploiement, commit, push ou ajout de dépendance npm.

## Corrections

1. **Dialogues aux breakpoints.** Les fenêtres utilisent maintenant un portail React directement dans `document.body`. Elles ne dépendent plus des conteneurs de navigation masqués par CSS. La fenêtre reste ouverte, visible et modale pendant un redimensionnement. À sa fermeture, le focus revient au déclencheur s’il est encore affiché, sinon au bouton de devis du header. Les gestionnaires de fermeture du menu ignorent les interactions d’un dialogue ouvert.
2. **Contrastes.** Desktop et tablette : le voile fixe utilise une teinte `#303030` à 84 % d’opacité jusqu’à 37 % de la largeur, puis s’efface. Il reste indépendant du curseur et garantit un fond sombre dans la zone de texte. Mobile : le texte est placé au-dessus de l’image sur un fond uni `#303030`, en blanc. Les labels Avant/Après gardent leur propre fond sombre.
3. **Alignement vertical.** La marge du conteneur racine est devenue `0 auto`. La page ne se centre plus verticalement dans le `body` flex.
4. **Netteté des images.** Le comparateur mobile utilise un cadre de ratio 1,5 et un cadrage à droite, supprimant une grande partie du mur vide. `sizes` tient compte de la largeur réelle du panorama peint par `cover` : 200vw mobile et 120vw tablette. Aucune nouvelle image synthétique ni retouche du fichier source.
5. **Typographie.** Manrope variable locale via `next/font/local`, fichier WOFF2 latin de 24 Ko, licence SIL OFL conservée. Corps 400, navigation et CTA 600, titres 700. Aucun appel à Google depuis le navigateur et aucune récupération de police pendant le build. Les lettres arrondies se rapprochent de la maquette, sans prétendre reproduire sa police inconnue à l’identique.
6. **Rythme vertical.** Header desktop de 64 px, espacement du Hero recalibré, titres ajustés. À largeur de 1240 px, le haut du comparateur est à environ 582 px, contre environ 599 px avant correction et 582 px sur la référence.
7. **Commande intégrée.** Le bandeau gris et son curseur secondaire ont été supprimés. Un seul `input[type=range]` natif, visuellement transparent mais présent dans l’ordre de tabulation et l’arbre d’accessibilité, pilote le séparateur. Les Pointer Events sur l’image assurent clic, souris et tactile. Le focus clavier dessine un contour visible sur le cadre et la poignée. Les flèches et les touches Home/End restent natives. Le contrôle est décrit pour les lecteurs d’écran et une consigne visible accompagne l’image.
8. **Textes secondaires mobile.** Réassurances et mentions en 12 px ; identification du visuel en 11 px. Le sous-titre reste à 16 px. Le mode mouvement réduit est conservé.

L’état Avant de démonstration utilise désormais une légère correction de luminosité (0,96) et de saturation (0,9), afin de conserver une lumière plus comparable entre les états. Les salissures restent des simulations CSS explicitement identifiées.

## Fichiers de cette passe

- `src/components/ui/PreviewAction.tsx` : portail, cycle de vie natif et restitution du focus.
- `src/components/layout/Header.tsx` : gestion des interactions avec les dialogues portalisés.
- `src/components/home/BeforeAfter.tsx` : commande intégrée, Pointer Events, structure mobile et résolution responsive.
- `src/app/globals.css` : contrastes, responsive, rythme, focus et typographie.
- `src/app/layout.tsx` : chargement de la police locale.
- `src/app/fonts/Manrope-latin-variable.woff2` et `OFL-Manrope.txt` : police et licence.
- Ce document : décisions et recette.

Les autres sections, coordonnées, textes commerciaux, médias sources et métadonnées SEO restent ceux de l’itération précédente.

Source de la police : https://github.com/google/fonts/tree/main/ofl/manrope ; version WOFF2 distribuée par Google Fonts. La conversion locale envisagée n’était pas disponible (fontTools absent) ; le WOFF2 officiel a été téléchargé directement, sans installation d’outil.

## Validation

- `npm run lint` : réussi.
- `npx tsc --noEmit` : réussi.
- `npm run build` : réussi avec Turbopack ; page statique générée.
- `git diff --check` : réussi.
- Playwright Chromium, build local de production : 37 contrôles des parcours courants réussis, puis 25 contrôles de régression réussis.
- Les trois scénarios 390 → 1440, 1024 → 1366 et 1440 → 390 vérifient la visibilité de la modale, le maintien du focus à l’intérieur, le retour du focus vers une cible visible et la possibilité de rouvrir le devis après fermeture.
- Les premiers contrôles de retour du focus ont produit trois échecs : ils s’exécutaient après le clic de fermeture mais avant l’événement natif `close`. L’observation du cycle de vie a confirmé le retour du focus après cet événement. Les tests attendent maintenant le retrait du dialogue avant l’assertion ; les trois scénarios passent. Aucun échec final dans ces suites.
- Écrans hauts 768×1366 et 1440×1440 : header à y=0. Largeurs 320, 360, 390, 768, 1240 et 1440 px contrôlées sans débordement horizontal.
- Axe-core 4.10.3 aux trois formats : aucune violation automatiquement détectée. Le contraste sur image demeure un résultat incomplet du moteur ; il est donc vérifié séparément sur des captures dont les textes sont temporairement masqués, en utilisant la couleur CSS du texte et les pixels du fond.
- Contrastes mesurés sur l’ensemble des boîtes des trois textes du comparateur, aux positions 0, 50 et 100 %. Résultats détaillés : `output/playwright/corrections/contrast-results.json`.
- Mobile DPR 2 : ressource demandée de 1920 px pour une largeur peinte nécessaire de 1432 px ; résolution suffisante pour ce cadrage.
- Console et ressources HTTP des sessions propres desktop, tablette et mobile : aucune erreur ni avertissement.
- Préférence de mouvement réduit, révélation au scroll, souris, tactile Chromium émulé, clavier et alignement des images vérifiés.

Captures de contrôle : `output/playwright/corrections/1440.png`, `768.png`, `390.png` et `1240.png`. Elles sont prises en mouvement réduit pour rendre tout le contenu visible sur une capture pleine hauteur. Les artefacts de recette sont ignorés par Git.

## Limites restantes

Les images générées et le mot-symbole typographique restent provisoires. Le nouvel agencement mobile du comparateur est volontaire pour garantir lisibilité et netteté ; seule une maquette desktop était fournie. Pas de validation sur appareils physiques, Safari/Firefox/Edge, lecteur d’écran, ni de mesure Lighthouse dans cette passe. Le `noindex` de la prévisualisation est conservé.

### Mesures finales de contraste

| Largeur | Curseur 0 % | Curseur 50 % | Curseur 100 % |
| --- | ---: | ---: | ---: |
| 1440 px | 8,33:1 | 8,46:1 | 8,46:1 |
| 768 px | 8,30:1 | 8,56:1 | 8,56:1 |
| 390 px | 13,20:1 | 13,20:1 | 13,20:1 |

Ces minima sont calculés sur les fonds des boîtes de l’eyebrow, du titre et du paragraphe, avec le texte masqué uniquement dans le navigateur de test. Ils dépassent le seuil de 4,5:1 du texte courant. Le fond mobile est constant ; le voile desktop/tablette reste fixe lorsque le curseur se déplace.

Les scripts CLI utilisés et leurs résultats JSON sont conservés dans `output/playwright/corrections/` pour inspection locale. Les 37 contrôles courants, les captures et les contrastes ont été rejoués après le dernier ajustement de résolution tablette ; les 25 régressions de comportement sont également réussies.
