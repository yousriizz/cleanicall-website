# Cahier des charges — Cleanic'All

Statut : proposition de cadrage à valider avant développement. Ce document définit la V1 et les pistes V2 ; il ne vaut pas validation des informations commerciales.

## 1. Présentation et objectif

Refondre cleanicall.com pour proposer un site vitrine premium, clair, rapide et accessible. Le site doit présenter l'activité, aider les visiteurs à identifier la prestation adaptée et faciliter une demande de devis depuis un mobile ou un ordinateur.

Objectifs : renforcer la crédibilité avec des informations vérifiées, améliorer la visibilité locale et transmettre des demandes exploitables à l'entreprise. Aucun objectif chiffré de conversion n'est fixé à ce stade.

### Informations à confirmer avant publication

Le site actuel est une source à vérifier, pas une référence commerciale automatiquement fiable.

| Information | Validation attendue |
| --- | --- |
| Prestations et publics réellement servis | Liste approuvée par Cleanic'All, avec inclusions et exclusions |
| Tarifs, TVA, suppléments, minimum de facturation et conditions du devis | Confirmation écrite ; ne publier aucun montant ni mention « gratuit » sans validation |
| Zones desservies | Communes, départements, limites et frais éventuels confirmés ; l'Île-de-France est la cible, pas une couverture garantie |
| Garanties, assurances, certifications et labels | Justificatifs et formulation approuvée ; aucune promesse implicite |
| Disponibilités, horaires et délais de réponse ou d'intervention | Engagements réellement tenables, validés par l'entreprise |
| Identité légale, adresse, téléphone et adresse de réception des demandes | Coordonnées et informations légales vérifiées |
| Photos, réalisations et témoignages | Authenticité, droits d'utilisation et autorisations vérifiés |

Une information non confirmée reste absente des pages publiques. Ne jamais inventer d'avis, de réalisations ou de certifications.

## 2. Public cible

- **Particuliers en Île-de-France** : comprendre l'offre, vérifier l'éligibilité de leur localisation et demander un devis facilement.
- **Professionnels en Île-de-France** : décrire leurs locaux et besoins ponctuels ou récurrents, puis être recontactés.

Les prestations et modalités propres à chaque public restent à confirmer. Les parcours doivent fonctionner sans connaissance technique ni création de compte.

## 3. Arborescence proposée

| URL | Contenu et rôle |
| --- | --- |
| `/` | Accueil : proposition de valeur vérifiée, prestations, zone confirmée et accès au devis |
| `/prestations` | Présentation des prestations validées et de leurs limites |
| `/a-propos` | Présentation factuelle de Cleanic'All et de sa démarche |
| `/zones-intervention` | Zones effectivement desservies et modalités éventuelles |
| `/devis` | Formulaire de demande de devis |
| `/contact` | Coordonnées, horaires confirmés et lien vers le devis |
| `/mentions-legales` | Informations légales validées avant publication |
| `/confidentialite` | Traitement des données du formulaire et services tiers utilisés |

Prévoir une page 404 utile. Des pages par prestation pourront être ajoutées si un contenu distinct et vérifié le justifie. Ne pas générer de pages par commune avec du contenu dupliqué pour le seul référencement.

## 4. Fonctionnalités prioritaires de la V1

1. Navigation commune avec en-tête, menu mobile, pied de page et accès au devis.
2. Pages éditoriales présentant uniquement les contenus approuvés.
3. Coordonnées utilisables : liens de téléphone et de courriel si validés.
4. Formulaire de devis fonctionnel, avec validation serveur, protection anti-spam et retour explicite.
5. Socle SEO : métadonnées, indexation maîtrisée, sitemap et informations locales cohérentes.
6. Pages légales, confidentialité et gestion des erreurs.

Hors V1 : paiement, réservation avec disponibilité garantie, espace client, comptes utilisateurs et administration sur mesure. Aucun traceur non essentiel n'est prévu par défaut.

## 5. Contraintes techniques

- Utiliser Next.js avec l'App Router existant, TypeScript strict et Tailwind CSS.
- Respecter `src/app`, les configurations et les conventions du dépôt ; créer des composants simples et réutilisables au besoin.
- Privilégier le rendu serveur et limiter les composants client aux interactions nécessaires.
- Ne pas ajouter de dépendance sans besoin explicite et justification.
- Garder les secrets côté serveur, hors Git et hors variables publiques ; ne pas journaliser les données des demandes.
- Suivre le développement sur GitHub avec des changements limités, des commits conventionnels et des revues par pull request.
- Préparer un futur pipeline GitHub Actions : lint, TypeScript, tests pertinents et build. Tout déploiement en production exige un accord explicite ; aucun déploiement direct.
- Choisir avant l'implémentation du formulaire le service de réception, l'hébergement et un stockage adapté à la limitation des requêtes. Aucun fournisseur n'est imposé ici.

## 6. Exigences transversales

### Responsive et cohérence visuelle

Approche mobile-first, avec une hiérarchie claire, des espacements et couleurs cohérents. Vérifier les pages à 320, 375, 768, 1024 et 1440 pixels de largeur, sans débordement horizontal. Les menus, boutons et formulaires doivent rester utilisables au tactile et au clavier, ainsi qu'avec un zoom à 200 %.

### Performance

Optimiser les images et les polices, réserver l'espace des médias pour éviter les décalages et différer les ressources non critiques. Éviter les scripts tiers sans utilité démontrée.

Objectifs de recette proposés : score Lighthouse Performance mobile ≥ 90 sur les pages principales dans un environnement de production représentatif, avec protocole et conditions consignés. Cibles en usage réel : LCP ≤ 2,5 s, INP ≤ 200 ms et CLS ≤ 0,1 au 75e percentile lorsque suffisamment de données seront disponibles. Ces cibles sont des objectifs, pas des résultats acquis ; Lighthouse seul ne valide pas l'INP réel.

### SEO local

Définir la langue française, un titre et une description propres à chaque page, une URL canonique cohérente et une structure de titres logique. Produire un sitemap et des règles robots adaptés ; empêcher l'indexation des environnements de prévisualisation. Préparer une correspondance des anciennes URL vers les nouvelles pour les redirections nécessaires lors de la refonte.

Utiliser seulement des coordonnées, zones et données structurées vérifiées. Ne pas inventer de note, de prix ni de disponibilité. Aucune garantie de position dans les moteurs de recherche.

### Accessibilité

Viser les critères WCAG 2.2 niveau AA applicables : HTML sémantique, repères de page, lien d'évitement, navigation clavier sans piège, focus visible, contrastes suffisants, textes alternatifs pertinents et respect de la réduction des animations. Les champs ont des libellés explicites ; les erreurs et confirmations doivent être perceptibles par les technologies d'assistance.

Combiner contrôles automatisés et vérifications manuelles au clavier et avec un lecteur d'écran. Un score automatisé ne constitue pas une preuve de conformité complète.

## 7. Formulaire de devis

### Champs proposés

Les obligations ci-dessous constituent une proposition à valider avec Cleanic'All. Limiter la collecte à ce qui est nécessaire au traitement de la demande.

| Champ | Obligatoire | Règles proposées |
| --- | --- | --- |
| Profil | Oui | Particulier ou professionnel |
| Nom du contact | Oui | 1 à 100 caractères après suppression des espaces de bord ; accepter accents et noms composés |
| Entreprise | Non | 150 caractères maximum ; affiché pour les professionnels |
| Courriel | Oui | Format valide, 254 caractères maximum |
| Téléphone | Non | 30 caractères maximum ; accepter les formats français et internationaux, sans imposer uniquement dix chiffres |
| Code postal et commune d'intervention | Oui | Code postal français de cinq chiffres ; commune de 100 caractères maximum ; ne pas déduire la couverture de la seule saisie |
| Prestation | Oui | Choix dans la liste validée, avec « Autre / à préciser » |
| Description du besoin | Oui | 10 à 3 000 caractères ; inviter à préciser les locaux et la fréquence sans données sensibles |
| Période souhaitée | Non | Texte de 150 caractères maximum ; aucune réservation ni disponibilité garantie |

Pas de pièce jointe ni d'adresse postale complète en V1. Afficher près du bouton une information sur le traitement des données et un lien vers la confidentialité. Le destinataire, la durée de conservation, la base légale et les modalités d'exercice des droits doivent être validés avant ouverture du formulaire. Aucun consentement marketing ni inscription automatique.

### Validation et transmission

- Valider côté navigateur pour guider la saisie et systématiquement côté serveur pour la sécurité : types, choix autorisés, longueurs et taille totale de la requête.
- Refuser une soumission invalide même si les contrôles du navigateur sont contournés. Traiter les valeurs comme du texte ; ne jamais les injecter comme HTML ni comme en-têtes de courriel non contrôlés.
- Associer chaque erreur au champ concerné, conserver la saisie après échec et placer le focus de manière utile.
- Désactiver l'envoi pendant le traitement et éviter les transmissions en double.
- Afficher une confirmation uniquement après acceptation par le service de réception ; ne pas prétendre que le courriel a été lu ou livré. En cas d'échec, permettre une nouvelle tentative et proposer un contact validé.

### Protections anti-spam

- Ajouter un champ piège inaccessible au parcours clavier et aux lecteurs d'écran.
- Limiter les requêtes côté serveur, avec un état partagé adapté à l'hébergement ; seuil initial à définir et à tester avant ouverture.
- Vérifier l'origine des requêtes attendues et plafonner la taille des données ; ne pas considérer ces contrôles comme suffisants isolément.
- Prévoir un délai minimal de soumission comme signal complémentaire, sans bloquer à lui seul les utilisateurs rapides ou les outils d'assistance.
- Ajouter un challenge seulement en cas de besoin démontré, après évaluation de son accessibilité et de ses implications pour les données personnelles.
- Garder les clés du service côté serveur et minimiser les données techniques conservées pour l'anti-spam.

## 8. Critères de validation

| Fonctionnalité | Critères de recette |
| --- | --- |
| Navigation | Tous les liens internes aboutissent ; menu utilisable au tactile et au clavier ; fermeture et focus cohérents ; accès au contenu principal par lien d'évitement |
| Accueil | Activité compréhensible, contenu approuvé et accès visible au devis ; aucune affirmation commerciale non confirmée |
| Prestations et présentation | Prestations, limites et présentation validées ; aucune preuve commerciale inventée ; contenu lisible sur mobile |
| Zones d'intervention | Seules les zones confirmées apparaissent ; les limites et frais éventuels sont explicités s'ils sont validés |
| Contact | Liens téléphone et courriel corrects ; coordonnées et horaires approuvés ; accès au devis fonctionnel |
| Formulaire valide | Une demande de test arrive au destinataire de test prévu ; confirmation accessible après acceptation ; absence de double envoi lors d'un double clic |
| Formulaire invalide | Champs manquants, courriel invalide et valeurs trop longues refusés côté serveur ; erreurs compréhensibles et saisie conservée |
| Anti-spam et incidents | Champ piège et limite de requêtes testés ; dépassement refusé proprement ; panne du service simulée avec message utile et possibilité de réessayer |
| Confidentialité et sécurité | Aucun secret dans le dépôt ou le navigateur ; pas de données de formulaire dans les journaux ; information sur les traitements et destinataires validée |
| Pages légales | Informations approuvées et liens accessibles depuis le pied de page |
| Page 404 | URL inconnue renvoyant un statut 404, avec accès à l'accueil ou au contact |
| Responsive et accessibilité | Largeurs et zoom prévus vérifiés ; parcours complet au clavier et formulaire au lecteur d'écran ; aucune anomalie bloquante connue |
| SEO | Métadonnées distinctes, langue et canonical corrects ; sitemap limité aux pages publiques ; prévisualisation non indexable ; anciennes URL et redirections vérifiées |
| Performance | Mesures consignées sur accueil, prestations et devis ; cibles de laboratoire évaluées ; images et décalages de mise en page contrôlés |
| Qualité technique | Lint, vérification TypeScript, tests pertinents et build réussis ; résultats et éventuelles limites documentés dans la pull request |

La recette utilise des données fictives explicites et un destinataire de test, sans envoi à des clients. Une validation de la V1 ne déclenche aucun déploiement automatique en production.

## 9. Pistes pour une V2

- Pages détaillées par prestation et contenus locaux utiles, basés sur des informations confirmées.
- Témoignages et réalisations authentiques avec autorisations vérifiées.
- FAQ issue des questions réelles reçues.
- Gestion éditoriale par CMS si la fréquence des mises à jour le justifie.
- Mesure des conversions avec un dispositif respectueux des données personnelles, à cadrer avant ajout.
- Connexion à un outil de suivi des demandes si le volume le nécessite.
- Pièces jointes, réservation ou espace client uniquement après validation du besoin, des coûts, de la sécurité et des modalités de traitement des données.

Ces pistes ne sont pas des engagements : leur priorité sera décidée après retour d'expérience sur la V1.
