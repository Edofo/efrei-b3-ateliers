# 🔍 Bloc 6 - le corrigé

**Le coupable : Bruno Mercier** (badge B-1004).

Une façon d'y arriver, publiée après l'atelier. Ce n'est **pas la** réponse :
d'autres chemins mènent au même nom. Comparez votre raisonnement, pas
seulement votre conclusion.

## Les deux fichiers

| Fichier | Ce que c'est |
| --- | --- |
| `enquete.sql` | le raisonnement en 5 étapes, une requête par étape - le rendu attendu aux paliers 🥉 et 🥈 |
| `requete-unique.sql` | le même raisonnement d'un seul tenant, en CTE - le palier 🥇 |

```bash
docker compose up -d
docker compose exec -T db psql -U investigation -d investigation < correction/enquete.sql
docker compose exec -T db psql -U investigation -d investigation < correction/requete-unique.sql
```

## Le raisonnement

1. **Partir du lieu, pas du suspect.** `tools.storage_area` dit où était rangée
   la scie : l'atelier bois. C'est la porte à surveiller.
2. **Qui est entré cette nuit-là ?** Quatre personnes : Léa Vasseur (22h15),
   Malik Benali (22h30), Bruno Mercier (01h12), Ana Kowalski (01h20). La
   jointure se fait sur le **badge**, pas sur l'`id` - c'est le badge qui
   apparaît dans `badge_events`.
3. **Qui n'a rien déclaré ?** Un `NOT EXISTS` sur `tool_loans` élimine ceux qui
   ont un emprunt déclaré cette nuit-là. Restent Ana et Bruno.
4. **Le témoignage tranche.** Ana décrit « quelqu'un avec un grand sac de sport
   rouge » vers 1h30 : elle témoigne, donc elle n'est pas la coupable. Le
   registre des casiers dit à qui appartient ce sac.
5. **La confirmation.** Bruno quitte l'atelier bois à 01h44 et sort par la
   **porte de service** à 01h47 - la seule utilisation de cette porte dans tout
   le jeu de données. Et le témoignage de Sofia signale qu'elle ne se verrouille
   plus.

## Les fausses pistes

Chacune apprend quelque chose sur la lecture des données.

| Piste | Pourquoi elle tombe |
| --- | --- |
| **Camille Rousseau** a emprunté la scie ce soir-là | Le registre (`returned_at`) indique un retour à 20h40, avant les faits. Lire `returned_at`, pas seulement `borrowed_at`. |
| **Hugo Pereira** a aussi emprunté la scie | Le 11 mars, pas le 12. Filtrer les dates. |
| **Ana Kowalski** est présente à 01h20 sans emprunt | Elle est le témoin, pas la coupable. Le témoignage disqualifie l'hypothèse. |
| **Malik Benali** est resté jusqu'à minuit quinze | Son emprunt est déclaré et rendu, et il part avant l'arrivée de Bruno. |

## Ce que vous devez savoir défendre

Le palier Or ne vaut rien sans la défense. Sur votre propre requête :

- Sur quoi porte la jointure `badge_events` ↔ `members`, et pourquoi pas
  sur l'`id` ?
- Pourquoi `NOT EXISTS` plutôt qu'un `LEFT JOIN … WHERE … IS NULL` ? Les deux
  marchent-ils ici ?
- Que donnerait votre requête si **deux** personnes avaient un sac rouge ?
