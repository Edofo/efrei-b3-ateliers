# 🍝 Bloc 4 - le corrigé

Une réponse possible au découpage en couches, publiée après l'atelier. Ce n'est
**pas la** réponse : plusieurs découpages se défendent, et les vôtres seront
différents. Comparez, ne recopiez pas.

Le point de départ est resté dans le dossier parent, intact.

Le comportement de l'API est **identique** au monolithe : mêmes routes, mêmes
codes HTTP, mêmes corps de réponse, mêmes messages d'erreur. C'est la seule
contrainte non négociable du refactoring.

## Lancer

La base est celle du kit - un seul `docker compose` pour les deux versions.

```bash
cd .. && docker compose up -d        # PostgreSQL sur 5434, la base du kit
cd correction
nvm use                              # Node 26
pnpm install
pnpm typecheck                                          # vert
node app/server.ts                                      # http://localhost:4000
```

```bash
curl localhost:4000/workshops
curl -X POST localhost:4000/registrations \
  -H 'content-type: application/json' -d '{"workshopId":1,"participantId":3}'
```

## L'arborescence

```
app/
├── server.ts                            composition root : câblage + serveur HTTP
├── routes/
│   ├── router.ts                        (méthode, chemin) → contrôleur, sinon 404
│   ├── workshops.routes.ts              GET  /workshops
│   └── registrations.routes.ts          POST /registrations
├── controllers/
│   ├── http.ts                          lecture du corps, écriture de la réponse
│   ├── workshops.controller.ts
│   └── registrations.controller.ts      erreur métier → statut HTTP + message
├── services/
│   ├── registrations.service.ts         les 3 règles + l'ordre des appels
│   └── workshops.service.ts
├── repositories/
│   ├── pool.ts                          le pool, et sa fermeture
│   ├── workshop.repository.ts           tout le SQL « ateliers » + row → objet
│   └── registration.repository.ts       tout le SQL « inscriptions »
├── models/
│   ├── workshop.ts                      Workshop, seatsLeft, hoursUntilStart
│   ├── registration.ts                  Registration
│   └── errors.ts                        DomainError + les 4 codes métier
└── views/
    ├── date.view.ts                     « September 14, 2026 », « 18:30 »
    ├── workshop.view.ts                 « Full », « 1 seat left »
    └── registration.view.ts
```

## Les quatre questions de l'énoncé, répondues sur ce code

| Question | Réponse |
| --- | --- |
| Où est « on ne s'inscrit pas deux fois » ? | `services/registrations.service.ts`, une ligne |
| Où est le SQL ? | `repositories/`, nulle part ailleurs |
| Où est la mise en forme de la date ? | `views/date.view.ts` |
| PostgreSQL → fichier JSON, quels fichiers changent ? | `repositories/` uniquement - le service dépend des **interfaces** `WorkshopRepository` et `RegistrationRepository`, pas de `pg` |

La dernière question est le vrai test : comptez les fichiers à toucher pour
remplacer PostgreSQL. Si la réponse dépasse `repositories/`, le découpage n'est
pas fini - et ça vaut aussi pour le vôtre.

## Les trois décisions qui se discutent

**1. L'erreur métier ne connaît pas HTTP.** `DomainError` porte un code
(`WORKSHOP_FULL`), pas un `409` ni une phrase. Le contrôleur possède la table
de traduction (cartes 16 et 9). C'est ce qui rend le service appelable depuis
un script, une file de messages ou un test.

**2. `seatsLeft` est dans le modèle, la décision est dans le service.** C'est
le débat de la carte 5, tranché ici dans les deux sens : l'arithmétique
`capacity - registered` appartient à `Workshop`, la règle « donc on refuse »
appartient au service. Les deux réponses des étudiants se défendent tant que
les deux choses ne sont pas dans le même fichier.

**3. `workshops.service.ts` ne fait que déléguer.** Un service qui ne porte
aucune règle est un vrai sujet : on peut aussi laisser le contrôleur appeler le
repository. Le prix à payer, c'est un contrôleur qui sait qu'un repository
existe - et le jour où une règle arrive (« ne pas lister les ateliers annulés »),
elle n'a pas d'endroit où se poser. Le commentaire est dans le fichier.

## Ce que ce corrigé ne contient pas

Les cartes 3 (email valide), 14 (email de confirmation), 18 (arrondi), 19
(masquer un email), 29 (jeton d'authentification), 31 (pagination) et 38
(remboursement) n'ont **aucune route** dans cette API. Elles servaient au tri de
la partie A : les implémenter dans la partie B, c'était du hors-sujet.

L'injection de `now` dans `createRegistrationsService` est là pour montrer que
la règle des 24 h devient testable sans attendre : il n'y a pas de tests dans
le kit distribué, c'est volontaire (le bloc 3 s'occupe des tests).
