# Mouvement signature de la galerie

## Référence et limites de l’observation

Source : https://rhombusstudio.fr/, section « From the blog ». Dans Chromium à 1 280 px, les titres se trouvaient aux abscisses 40, 450 et 860 px. Un aller-retour vertical de 380 px a déplacé la section de y = 207 à −173 puis à 207 px. Les trois abscisses et l’opacité calculée des titres (1) étaient identiques aux points mesurés. Aucun bouton de carrousel n’a été trouvé dans la section. Lors du précédent essai à 390 px, un déplacement horizontal à la molette n’avait pas déplacé le premier titre.

Ces observations décrivent des états mesurés. Elles ne permettent pas d’identifier un déclencheur, de mesurer une animation transitoire, ni de déduire une courbe ou un comportement lors d’une inversion. L’enregistrement annoncé n’était pas joint au texte accessible au début du travail. Les valeurs ci-dessous sont des propositions Cleanic’All.

## États et interactions

| État | Cadre, image et légende |
| --- | --- |
| Au repos | Le cadre actif occupe toute sa surface. Les visuels voisins sont légèrement en retrait et restent visibles. |
| Entrée | Lorsque le rail avance, le cadre entrant grandit graduellement. Le recadrage interne se recentre pendant que la légende remonte et retrouve son opacité. |
| Milieu | Les deux cadres partagent la mise en avant. Les images se déplacent dans leur masque en sens opposés. |
| Fin | Le nouveau visuel retrouve son cadrage stable. Le rail revient à son ancrage natif et la flèche de fin se désactive à la limite. |
| Inversion | Les valeurs suivent la position réelle du rail. Un geste inverse retrace les mêmes états dans l’ordre inverse. Une commande inverse repart de la position atteinte. |

Le scroll vertical continue de déplacer la page. Le défilement horizontal, le pavé tactile et le balayage utilisent le rail natif. Les flèches, les touches directionnelles et Début/Fin animent ce même rail. Une entrée tactile ou à la molette interrompt une commande en cours. Aucune lecture automatique.

## Paramètres

Les réglages sont centralisés dans le module de mouvement et essayables sur la route de développement. La distance signée vaut 0 au point d’ancrage et atteint ±1 à un intervalle de carte. Les effets saturent au-delà. La proximité suit une courbe smoothstep pour adoucir son départ et son arrivée, indépendamment de la vitesse du geste.

Le profil initial utilise 600 ms, 2,8 % de réduction du cadre, 24 px de déplacement interne sur desktop (12 px sur mobile), un zoom interne de 4 % à 8 %, une opacité d’image de 0,9 à 1, et une translation de légende de 6 px avec une opacité minimale de 0,95. Le déplacement commandé utilise une courbe cubique ease-in-out pour décélérer à l’approche de l’ancrage. La tablette utilise les réglages desktop et conserve sa largeur de cadre responsive.

Le prototype permet de réduire l’amplitude et la durée pour comparer la lisibilité des légendes et le recadrage des images. Les masques conservent leurs dimensions et les médias existants. Aucun effet 3D. Le bleu demeure réservé aux interactions.

## Accessibilité et coût

Le focus et les libellés existants sont conservés. Les images et légendes restent dans le document. En mouvement réduit, les commandes sont immédiates et les couches reprennent leur état statique. Aucune interception du scroll vertical. Mesure des ancrages au redimensionnement, écriture des transformations et opacités à partir de la position du rail, images chargées comme dans la galerie existante. Le mouvement est réalisable avec les API natives.

## Comparaison avec l’enregistrement fourni

L’enregistrement a été retrouvé sur le Bureau après le premier prototype. Les images horodatées montrent une grille de trois cartes. Vers 0–2 s puis 12–16 s, cadres, images et légendes défilent verticalement ensemble ; les colonnes restent fixes en x. Le retour du scroll restaure la composition. Vers 3 s et 11,25 s, le titre de la première carte apparaît décalé d’environ 9 à 10 px vers la droite dans les images réduites à 720 px. Le cadre de l’image reste en place. Le curseur se trouve au niveau de la carte, et le décalage disparaît quand il s’éloigne. Cela indique une réponse au survol ; la métrique CSS d’origine, sa durée et sa courbe ne sont pas établies. Aucun changement horizontal de carte, fondu de passage ou geste tactile n’est visible dans cet enregistrement.

Le mouvement Cleanic’All transpose cette séparation entre image et texte. Sur desktop, le titre de la légende se déplace de 8 px au survol, en 240 ms avec une décélération. Le mobile conserve le balayage et le mouvement lié à la position horizontale. La galerie Cleanic’All garde un grand cadre actif et un aperçu du suivant, là où Rhombus montre trois cartes côte à côte. Le rythme du passage horizontal est un choix propre au projet.

## Deux passes du prototype

Les deux profils ont été contrôlés à 1 440, 768 et 390 px aux ancrages 0 et 1 et à mi-distance. En revenant au milieu depuis la seconde carte, les valeurs calculées étaient identiques à celles mesurées à l’aller.

| Profil | Durée commandée | Cadre à mi-distance | Décalage interne à mi-distance desktop / mobile |
| --- | --- | --- | --- |
| Studio | 600 ms | 98,6 % | ±12 px / ±6 px |
| Signature | 550 ms | 99,1 % | ±8 px / ±4 px |

Au milieu, les deux profils donnent environ 95 % d’opacité à l’image et 97,5 % à la légende. La seconde passe a réduit l’amplitude pour conserver davantage du cadrage des photos. Signature est intégré à l’accueil. Le prototype conserve les deux options sur `/dev/gallery-motion` avec `npm run dev`. La route renvoie HTTP 404 en production.
