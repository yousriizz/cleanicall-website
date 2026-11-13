# Recette navigateur — itération 2

`iteration-v2.pw` est un script Playwright CLI : il reçoit la page de la session et retourne les contrôles détaillés avec `passed` et `failed`. Ce n’est pas une suite `@playwright/test` et aucune dépendance n’est ajoutée à l’application.

Prérequis : Node/npm, Playwright CLI et Chromium disponibles. Démarrer un build local de production sur `http://127.0.0.1:3000` :

```sh
npm run build
npm run start -- --hostname 127.0.0.1
```

Dans un autre terminal, depuis la racine du dépôt :

```sh
mkdir -p output/playwright/iteration-v2
npx --package @playwright/cli playwright-cli -s=cleanicall-v2 open http://127.0.0.1:3000
npx --package @playwright/cli playwright-cli -s=cleanicall-v2 run-code --filename=tests/browser/iteration-v2.pw
npx --package @playwright/cli playwright-cli -s=cleanicall-v2 close
```

Le résultat attendu est `passed: 109, failed: 0`. Inspecter aussi toute section `Error` du CLI : le seul code de sortie du wrapper n’atteste pas la réussite des assertions.

Couverture : trois formats (1440, 768, 390), flèches de la galerie, limites et clavier, gestes tactiles Chromium émulés, mentions provisoires, chargement différé, mouvement réduit, six destinations WhatsApp et activation clavier, absence de débordement, erreurs console et ressources HTTP. Les navigations WhatsApp sont interceptées ; aucun message n’est envoyé.

Les captures et sorties de recette sont placées dans `output/playwright/iteration-v2/`, ignoré par Git. Les captures de sections masquent le Header fixe et le lien d’évitement uniquement dans l’outil de capture ; la capture pleine page conserve le Header. Les médias lazy sont chargés par défilement avant capture.

Les anciennes suites CLI de l’itération 1 restent disponibles localement dans `output/playwright/pr-v1/`. Elles ont été rejouées pour cette livraison avec une adaptation de l’attente des images : les nouveaux médias hors écran ne doivent pas être attendus avant défilement.
