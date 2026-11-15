# Itération 4 · Demande de devis

## Parcours

Les CTA généralistes du Header et du Hero pointent vers `/#devis`. Chaque carte transmet son identifiant de prestation pour présélectionner une des six vignettes. Le lien WhatsApp de secours tient compte de cette sélection. Le bloc WhatsApp affiche le numéro officiel et un QR statique vers une conversation avec ce numéro. Le bouton flottant s’efface à proximité du formulaire et dispose d’un décalage réglable par `--cookie-banner-height`.

Le formulaire est la seule interface de saisie. Les photos facultatives sont prévisualisées dans le navigateur par URL objet, révoquée à la suppression ou au démontage. Les erreurs d’envoi gardent les champs et photos en mémoire tant que l’utilisateur reste sur la page. Le consentement demandé dans le PDF est présenté comme une attestation de lecture. La base légale, le texte de la case et la notice sont à valider avant de recueillir des données réelles.

## Traitement serveur

Le formulaire envoie un multipart à `POST /api/devis` sur le même site. La route Node vérifie l’origine, la configuration, la fréquence, le format du corps, le champ piège, la prestation, la case et les limites des champs. Trois photos maximum, JPEG, PNG ou WebP, 1 Mio par fichier et 3 Mio + 64 Kio pour la requête. Sharp vérifie le format et décode les images, limite la résolution à 25 mégapixels et refuse les images animées. Les photos sont réencodées en WebP sans métadonnées ni noms originaux et réduites dans un cadre de 1 600 px.

En mode réel, la requête est transmise à Resend par son API HTTPS. L’identifiant de soumission est réutilisé si la saisie n’a pas changé, afin d’éviter les doubles envois lors d’un nouvel essai. L’application n’écrit ni les données du formulaire ni les photos sur disque, dans GitHub ou dans ses logs. Le courriel et ses pièces jointes relèvent des politiques de rétention du fournisseur et de la boîte destinataire. Redis ne reçoit qu’une clé dérivée de l’adresse IP avec un HMAC, assortie d’une expiration. La limite est de huit tentatives sur dix minutes. Une panne du limiteur ferme le parcours e-mail.

La page `/merci` exige un reçu signé et temporaire dans un cookie HttpOnly de cinq minutes, limité à cette route. Le reçu ne contient aucune donnée de contact. En mode réel, il n’est créé qu’après acceptation par l’API d’e-mail. Un attribut `data-quote-status` distingue le test d’un envoi accepté pour une intégration publicitaire future. Un futur événement de conversion devra filtrer sur `sent` et gérer la déduplication. Aucun traceur n’est installé.

## Configuration

Copier les noms de variables depuis `.env.example`. Conserver `QUOTE_MODE=disabled` tant que la configuration et la confidentialité n’ont pas été validées.

| Variable | Usage |
| --- | --- |
| `QUOTE_MODE` | `disabled` par défaut, `test` en local, `resend` après validation. Définir la même valeur au build et à l’exécution. |
| `QUOTE_ORIGIN` | Origine HTTPS exacte du site en mode réel, sans chemin ni barre finale. |
| `QUOTE_SECRET` | Secret aléatoire d’au moins 32 caractères, partagé entre les instances. |
| `QUOTE_CLIENT_IP_HEADER` | En-tête IP unique, écrasé par le proxy de confiance. Le serveur d’origine doit rester inaccessible hors de ce proxy. |
| `QUOTE_REDIS_URL`, `QUOTE_REDIS_TOKEN` | Service Redis REST HTTPS compatible avec les commandes JSON Upstash et le script Lua atomique. |
| `QUOTE_FROM`, `RESEND_API_KEY` | Expéditeur autorisé sur le domaine vérifié et clé d’envoi serveur. |

Resend transmet le message transactionnel à l’adresse officielle `contact@cleanicall.com`. Aucun compte, DNS ou secret fournisseur n’a été configuré. Avant activation, vérifier le domaine d’envoi et les enregistrements DNS indiqués par la console, provisionner Redis, valider les sous-traitants, la rétention et les conditions de transfert, et effectuer une recette avec une boîte de test. L’offre gratuite Resend est limitée à 100 e-mails par jour. Les offres payantes et Redis peuvent entraîner des frais. L’accusé de réception par e-mail au client, mentionné dans le PDF, reste à valider. La confirmation Web est réalisée. [API Resend](https://resend.com/docs/api-reference/emails/send-email) · [Domaines Resend](https://resend.com/docs/dashboard/domains/introduction) · [Tarifs Resend](https://resend.com/pricing)

## Recette locale

```sh
QUOTE_MODE=test npm run build
QUOTE_MODE=test QUOTE_SECRET="$(openssl rand -hex 32)" npm run start -- --hostname 127.0.0.1 --port 3040
```

Ouvrir le serveur dans Playwright CLI, puis exécuter `tests/browser/iteration-v4.pw` avec `run-code --filename=tests/browser/iteration-v4.pw`. Le script utilise l’origine de la page ouverte. Employer un processus de test neuf pour remettre le compteur à zéro. Utiliser exclusivement des données fictives. Le mode test est limité aux hôtes locaux et ne contacte aucun fournisseur. La page de confirmation indique explicitement qu’aucun e-mail n’a été envoyé.

ESLint, TypeScript et build Next.js réussis. Chromium a validé 35 contrôles du devis et 213 contrôles de régression. Axe n’a signalé aucune violation sur le formulaire aux trois largeurs. Le QR a été décodé avec ZXing et correspond au numéro officiel. La chaîne Resend et Redis n’a pas été exercée avec des comptes réels.
