# Cleanic'All — consignes de développement

Refonte de cleanicall.com avec Next.js, TypeScript et Tailwind CSS : site vitrine premium, responsive, rapide et optimisé pour le SEO local. Suivi sur GitHub ; futur pipeline CI/CD avec GitHub Actions.

## Principes

- Conserver TypeScript en mode strict ; éviter `any` et typer les données aux frontières de l'application.
- Privilégier des composants React simples, accessibles et réutilisables ; respecter la structure existante.
- Utiliser Tailwind CSS, un design cohérent et une approche mobile-first.
- Respecter l'accessibilité : HTML sémantique, navigation au clavier, focus visible, contrastes et libellés explicites.
- Optimiser le SEO local et les performances : métadonnées pertinentes, contenu local vérifié, images adaptées et JavaScript limité au nécessaire.
- Ne jamais exposer de secrets ni d'informations clients dans le code, les journaux ou les commits.
- Ne jamais inventer d'avis, de réalisations, de certifications ni d'autres faits concernant Cleanic'All ; demander les informations manquantes.
- Ne jamais déployer directement en production ; toute mise en production exige l'accord explicite de l'utilisateur.
- Éviter les dépendances inutiles ; privilégier les outils déjà présents.
- Expliquer en français les choix techniques importants et la raison des modifications avant de les effectuer.

## Pour chaque tâche

1. Inspecter les fichiers concernés et les consignes applicables.
2. Limiter les modifications au besoin demandé, sans modifier les autres fonctionnalités.
3. Exécuter les vérifications disponibles et pertinentes : `npm run lint`, `npx --no-install tsc --noEmit`, tests existants et `npm run build`. Pour une modification documentaire seule, vérifier le diff ; expliquer toute vérification non exécutée.
4. Résumer les fichiers modifiés, les résultats des vérifications et la manière de tester les changements ; signaler les limites restantes.
5. Proposer un message de commit conventionnel (`feat:`, `fix:`, `docs:`, etc.).

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
