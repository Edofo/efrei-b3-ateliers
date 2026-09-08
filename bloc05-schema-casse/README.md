# 🗂️ Bloc 5 - Le schéma cassé

**Objectif** : C10 - modélisation, intégrité.
**Format** : équipe · 30 points.

## La situation

L'association « Les Copeaux » a migré son tableur vers PostgreSQL. La migration
« fonctionne » : rien ne plante jamais.

```bash
docker compose up -d

docker compose exec -T db psql -U club -d club < db/02-donnees-pourries.sql
```

> Pas besoin d'installer `psql` sur votre machine : le client est déjà dans le
> conteneur. Si vous l'avez en local, `psql postgres://club:club@localhost:5435/club -f <fichier>`
> marche aussi.

Le script d'import passe **sans la moindre erreur**. Regardez maintenant ce
qu'il y a dans la base :

```bash
docker compose exec db psql -U club -d club
```

```sql
SELECT * FROM members;
SELECT * FROM membership_fees;
```

## Votre mission - 40 minutes

Blindez le schéma jusqu'à ce que le script d'import **échoue proprement sur
chaque ligne aberrante**, et seulement sur celles-là.

Vous travaillez dans `db/03-votre-schema.sql` : il contient le schéma nu, à
durcir colonne par colonne. Le schéma nu est recréé à chaque démarrage du
conteneur, donc **votre fichier commence par quatre `DROP TABLE IF EXISTS`** :
ne les enlevez pas, ils permettent de rejouer le fichier autant de fois que
vous voulez. Votre boucle de travail :

```bash
docker compose exec -T db psql -U club -d club < db/03-votre-schema.sql      # votre schéma
docker compose exec -T db psql -U club -d club < db/02-donnees-pourries.sql  # doit crier
```

Le fichier de données contient 30 lignes, annotées : **20 sont pourries, 10
sont légitimes**. À la fin, le script doit produire exactement 20 erreurs, et
les 10 lignes saines doivent être en base. Pas besoin de `docker compose
down -v` entre deux essais.

## Les 6 catégories d'anomalie à bloquer

| # | Catégorie | 5 points |
| --- | --- | --- |
| 1 | Identifiants dupliqués ou non numériques | ☐ |
| 2 | Emails invalides, dupliqués ou absents | ☐ |
| 3 | Dates impossibles ou en texte libre | ☐ |
| 4 | Montants négatifs, nuls ou non numériques | ☐ |
| 5 | Références vers des lignes inexistantes | ☐ |
| 6 | Valeurs booléennes en texte libre | ☐ |

## Barème

30 points, 5 par catégorie bloquée. Chaque contrainte doit pouvoir être
**justifiée à l'oral** : « celle-ci bloque quelle donnée pourrie, exactement ? »

## Attention

Une contrainte trop stricte qui rejette une ligne **valide** coûte 3 points.
Le but n'est pas de tout interdire : c'est de dire précisément ce qui est vrai
dans ce métier.
