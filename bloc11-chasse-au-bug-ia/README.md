# workshop-rentals-api

API de gestion des locations de matériel de l'atelier : catalogue, ouverture
d'une location, retour et facturation.

> Ce service a été mis au propre avec l'aide d'une IA puis relu par l'équipe.
> Architecture en couches, types stricts, lint et tests en place.

## Pile technique

- **Node 26**, **TypeScript** strict, **Express 5**
- **PostgreSQL 16** (via Docker Compose)
- **Vitest** pour les tests, **ESLint** + **Prettier** pour le style
- **pnpm 10+** comme gestionnaire de paquets (`pnpm-workspace.yaml` autorise le script d'installation d'esbuild, exigé par pnpm 11)

## Démarrage

```bash
cp .env.example .env
make install        # pnpm install
make up             # PostgreSQL + schéma + jeu de données
make dev            # API sur http://localhost:3000
```

`make help` liste toutes les cibles disponibles.

## Vérifier que tout va bien

```bash
make check          # types + lint + tests
```

## Endpoints

| Méthode | Route                   | Rôle                                          |
| ------- | ----------------------- | --------------------------------------------- |
| GET     | `/health`               | Sonde de vie                                   |
| GET     | `/items/available`      | Matériels disponibles à la location            |
| GET     | `/rentals`              | Locations, avec leur matériel et leur client   |
| POST    | `/rentals`              | Ouvre une location                             |
| POST    | `/rentals/:id/return`   | Solde une location et encaisse le paiement     |

### Exemples

```bash
curl http://localhost:3000/items/available

curl -X POST http://localhost:3000/rentals \
  -H "content-type: application/json" \
  -d '{"renterId":1,"itemId":1,"startDate":"2026-09-20","expectedReturnDate":"2026-09-23","discountPercent":10}'

curl -X POST http://localhost:3000/rentals/1/return \
  -H "content-type: application/json" \
  -d '{"returnedAt":"2026-09-14"}'
```

## Règles de facturation

- Tarif journalier propre à chaque matériel.
- Toute journée entamée est due, avec un minimum d'une journée.
- La remise commerciale s'applique sur le total, avant arrondi au centime.
- Le métier est parisien : la base et l'API tournent en `Europe/Paris`.

## Organisation du code

```
src/
  app.ts                    application Express
  server.ts                 point d'entrée
  config/db.ts              pool PostgreSQL
  routes/                   déclaration des routes
  controllers/              traduction HTTP <-> métier
  services/                 règles de gestion (dont pricing.ts)
  repositories/             accès aux données
  schemas/                  validation des entrées
  middlewares/              gestion centralisée des erreurs
  utils/                    erreurs HTTP, dates
db/
  schema.sql                schéma de la base
  seed.sql                  jeu de données de démonstration
tests/                      tests unitaires
```
