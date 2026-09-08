# 🔍 Bloc 6 - Enquête SQL

**Objectif** : C10 - requêtes, jointures, agrégats.
**Format** : solo · paliers 🥉 10 / 🥈 15 / 🥇 20 points.

## L'affaire

> Dans la nuit du **12 au 13 mars 2026**, la **scie plongeante Festool**
> (720 €) a disparu de l'association « Les Copeaux ».
>
> Le bureau a extrait pour vous les données du système de badges, le registre
> des emprunts, les témoignages recueillis et le registre des casiers.
>
> **Trouvez qui l'a prise.** Uniquement avec des requêtes SQL.

```bash
docker compose up -d
docker compose exec db psql -U investigation -d investigation
```

> Pas besoin d'installer `psql` sur votre machine : le client est déjà dans le
> conteneur. Si vous l'avez en local,
> `psql postgres://investigation:investigation@localhost:5436/investigation` marche aussi.

## Les données à votre disposition

| Table | Contenu |
| --- | --- |
| `members` | nom, email, numéro de badge |
| `tools` | nom, valeur, zone de rangement (`storage_area`) |
| `badge_events` | chaque passage de badge : porte, horodatage, `in` ou `out` |
| `tool_loans` | emprunts déclarés : outil, membre, `borrowed_at`, `returned_at` |
| `statements` | déclarations recueillies après la disparition |
| `lockers` | contenu déclaré des casiers personnels |

```sql
\dt              -- lister les tables
\d badge_events   -- décrire une table
```

## Les paliers

| Palier | Attendu |
| --- | --- |
| 🥉 **Bronze** (10 pts) | Vous désignez le coupable, même en enchaînant dix requêtes séparées et en lisant les résultats à l'œil. |
| 🥈 **Argent** (15 pts) | Une seule requête par étape du raisonnement, avec de vraies jointures - pas de recopie manuelle d'identifiants d'une requête à l'autre. |
| 🥇 **Or** (20 pts) | **Une requête unique** de bout en bout qui renvoie le nom du coupable, en utilisant des CTE (`WITH`).

## Le rendu

Un fichier `enquete.sql` contenant vos requêtes **dans l'ordre**, avec un
commentaire par étape expliquant ce que vous cherchez.

## La défense

> « Explique ta jointure ligne par ligne. »

⚠️ **Le palier Or ne rapporte rien sans la défense.** Une requête copiée d'une
IA et non comprise vaut zéro point. C'est la parade anti copier-coller.

## Un conseil

Ne commencez pas par le coupable. Commencez par la question : *où était rangée
la scie, et qui pouvait physiquement y accéder cette nuit-là ?*
