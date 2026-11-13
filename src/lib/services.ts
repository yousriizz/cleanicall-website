/** Contenus du brief itération 2 : offre et tarifs à confirmer avant publication. */
export const services = [
  { id: 'canapes', title: 'Nettoyage de canapés', description: 'Assises, dossiers et accoudoirs en tissu.', price: 'Dès 60\u00a0€', image: '/images/sofa-demo.webp', mediaNote: 'Image de démonstration générée', message: 'un nettoyage de canapé' },
  { id: 'matelas', title: 'Nettoyage de matelas', description: 'Pour les matelas simples et doubles.', price: 'Dès 50\u00a0€', image: '/images/placeholders/matelas.svg', mediaNote: 'Illustration provisoire · photo à venir', message: 'un nettoyage de matelas' },
  { id: 'tapis', title: 'Nettoyage de tapis', description: 'Tapis de petite et grande taille.', price: 'Dès 70\u00a0€', image: '/images/placeholders/tapis.svg', mediaNote: 'Illustration provisoire · photo à venir', message: 'un nettoyage de tapis' },
  { id: 'moquettes', title: 'Nettoyage de moquettes', description: 'Revêtements textiles au sol.', price: 'Tarif à confirmer', image: '/images/placeholders/moquettes.svg', mediaNote: 'Illustration provisoire · photo à venir', message: 'un nettoyage de moquette' },
  { id: 'terrasses', title: 'Nettoyage de terrasses', description: 'Surfaces extérieures.', price: 'Tarif à confirmer', image: '/images/placeholders/terrasses.svg', mediaNote: 'Illustration provisoire · photo à venir', message: 'un nettoyage de terrasse' },
  { id: 'chantier', title: 'Nettoyage de fin de chantier', description: 'Remise en état après travaux.', price: 'Sur devis', image: '/images/placeholders/chantier.svg', mediaNote: 'Illustration provisoire · photo à venir', message: 'un nettoyage de fin de chantier' },
] as const;

export type Service = (typeof services)[number];

export const galleryMedia = [
  { id: 'salon', title: 'Nettoyage de canapés', detail: 'Canapé et tissu d’ameublement.', image: '/images/sofa-demo.webp', note: 'Image de démonstration générée' },
  { id: 'fibres', title: 'Le soin des textiles', detail: 'Détail du nettoyage d’un tissu.', image: '/images/hero-demo.webp', note: 'Image de démonstration générée' },
  { id: 'tapis', title: 'Nettoyage de tapis', detail: 'Exemple de cadrage.', image: '/images/placeholders/tapis.svg', note: 'Illustration provisoire · photo à venir' },
] as const;
