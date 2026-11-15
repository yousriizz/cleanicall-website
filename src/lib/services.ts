/** Contenus du brief itération 2 : offre et tarifs à confirmer avant publication. */
export const services = [
  { id: 'canapes', title: 'Nettoyage de canapés', description: 'Assises, dossiers et accoudoirs en tissu.', price: 'Dès 60\u00a0€', image: '/images/appartement/selection-canape.webp', mediaNote: 'Image de démonstration générée', message: 'un nettoyage de canapé' },
  { id: 'matelas', title: 'Nettoyage de matelas', description: 'Pour les matelas simples et doubles.', price: 'Dès 50\u00a0€', image: '/images/appartement/matelas-sans-personnes.webp', mediaNote: 'Image de démonstration générée', message: 'un nettoyage de matelas' },
  { id: 'tapis', title: 'Nettoyage de tapis', description: 'Tapis de petite et grande taille.', price: 'Dès 70\u00a0€', image: '/images/appartement/selection-tapis.webp', mediaNote: 'Image de démonstration générée', message: 'un nettoyage de tapis' },
  { id: 'moquettes', title: 'Nettoyage de moquettes', description: 'Revêtements textiles au sol.', price: 'Tarif à confirmer', image: '/images/appartement/moquette-sans-personnes.webp', mediaNote: 'Image de démonstration générée', message: 'un nettoyage de moquette' },
  { id: 'terrasses', title: 'Nettoyage de terrasses', description: 'Surfaces extérieures.', price: 'Tarif à confirmer', image: '/images/appartement/terrasse.webp', mediaNote: 'Image de démonstration générée', message: 'un nettoyage de terrasse' },
  { id: 'chantier', title: 'Nettoyage de fin de chantier', description: 'Remise en état après travaux.', price: 'Sur devis', image: '/images/appartement/chantier.webp', mediaNote: 'Image de démonstration générée', message: 'un nettoyage de fin de chantier' },
] as const;

export type Service = (typeof services)[number];

export const galleryMedia = [
  { id: 'salon', title: 'Le soin des assises', detail: 'Un fauteuil en lin et son matériel d’extraction.', image: '/images/appartement/selection-fauteuil.webp', note: 'Image de démonstration générée' },
  { id: 'fibres', title: 'Le soin des textiles', detail: 'Le grain du bouclé bleu en lumière naturelle.', image: '/images/appartement/galerie-boucle.webp', note: 'Image de démonstration générée' },
  { id: 'geste', title: 'Le geste de nettoyage', detail: 'Une microfibre posée sur l’accoudoir en bouclé.', image: '/images/appartement/galerie-geste-sans-personnes.webp', note: 'Image de démonstration générée' },
  { id: 'tapis', title: 'Le salon après le soin', detail: 'Des fauteuils en laine olive, dans un salon lumineux.', image: '/images/appartement/selection-salon.webp', note: 'Image de démonstration générée' },
] as const;
