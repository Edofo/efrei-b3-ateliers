# ⛳ Bloc 7 - le corrigé

Une réponse possible, publiée après l'atelier. Le dossier est un
`ma-solution/` complet : la requête, l'index, et l'`explication.md` sans
laquelle le rendu ne vaut rien.

Votre point de départ est resté intact dans `ma-solution/`.

## L'essayer

Copiez les deux `.sql` par-dessus les vôtres, ou pointez `verifier.sh` dessus :

```bash
cp correction/ma-requete.sql correction/mon-index.sql ma-solution/
./verifier.sh
```

Mesuré : **~825 ms → ~94 ms, gain 12×**, empreinte inchangée
(`85db24eb3a239c5dfb195fa6f2d94e3f`). Sur un portable avec Docker, comptez
plutôt 1,5 à 3 s → 150 à 300 ms : c'est le **rapport** qui compte, pas la
valeur absolue.

> Lancez `./verifier.sh` **deux fois** et gardez la seconde mesure. La
> première, cache froid, est fausse - au point de donner un « gain » inférieur
> à 1 sur deux requêtes pourtant identiques.

## Le vrai sujet : un prédicat *sargable*

Le problème n'était pas l'absence d'index. C'était :

```sql
WHERE date_trunc('day', r.recorded_at) >= DATE '2025-01-01'
  AND upper(r.quality) = 'OK'
```

Une fonction appliquée à une colonne rend le filtre **non indexable** :
PostgreSQL devrait évaluer `date_trunc` sur chacune des 4 millions de lignes
avant de pouvoir comparer. Un index sur `recorded_at` existe ? Il ne sert à
rien - le plan reste `Seq Scan`. **Essayez** : posez l'index sans réécrire la
requête, vous ne gagnerez rien.

Le plan le dit aussi autrement : `rows=100` estimé contre `rows=194116` réel.
Le planificateur n'a aucune statistique sur `date_trunc(recorded_at)` et
retombe sur une estimation par défaut - ce qui lui fait ensuite choisir un
`Nested Loop` absurde sur la jointure, 679 408 lignes écartées pour rien.

### Pourquoi la réécriture est équivalente

Tronquer à la journée ne fait que reculer un horodatage jusqu'à minuit, donc
`date_trunc('day', x) >= '2025-01-01'` ⇔ `x >= '2025-01-01'`. **La borne haute
est celle où l'on se trompe** : `date_trunc('day', x) < '2025-04-01'` ⇔
`x < '2025-04-01'` tient aussi, parce qu'un horodatage du 1er avril, même à
23h59, se tronque au 1er avril et sort dans les deux écritures.

Pour `upper(quality) = 'OK'` ⇔ `quality = 'ok'`, l'équivalence ne tient que
parce que le jeu de données ne contient que `'ok'` et `'suspect'`, en
minuscules. **Vérifiez-le, ne le supposez pas** :

```sql
SELECT DISTINCT quality FROM readings;
```

En production, c'est exactement là qu'on se plante.

## La forme de l'index ne fait presque rien

Requête réécrite dans tous les cas :

| Index | Plan obtenu | Durée |
| --- | --- | --- |
| aucun | `Seq Scan` | ~800 ms |
| `(recorded_at)` | `Index Scan` | ~78 ms |
| `(quality, recorded_at)` | `Bitmap Heap Scan` | ~83 ms |
| `(quality, recorded_at) INCLUDE (sensor_id, value)` | `Index Only Scan`, `Heap Fetches: 0` | ~76 ms |
| `(recorded_at) WHERE quality = 'ok'` (partiel) | `Index Scan` | ~75 ms |

À 5 % de sélectivité, la forme de l'index change à peine la durée. **Les 12×
viennent de la réécriture**, qui rend n'importe quel index utilisable. Le choix
de l'index, c'est du réglage fin. L'index partiel
(`(recorded_at) WHERE quality = 'ok'`) est le plus élégant : plus petit, et il
exprime la règle métier.

## Fausses bonnes idées

| Proposition | Verdict |
| --- | --- |
| Index sur `sensor_id` | Inutile : la jointure porte sur 8 lignes, PostgreSQL fait un hash. |
| `VACUUM FULL` | Aucun effet ici, la table n'a jamais été mise à jour. |
| Vue matérialisée | Valable, mais hors sujet : contourne le problème au lieu de le comprendre. Il faut alors assumer le compromis de fraîcheur. |
| Augmenter `work_mem` | Traite le symptôme. Mesuré : 820 ms → 743 ms. Soit ~10 %, contre 12×. |
| Retirer le `ORDER BY` | Change le résultat : empreinte différente, 0 point. |
| Poser l'index sans réécrire | Ne change **rien**, le plan reste `Seq Scan`. |

## Ce que vous devez savoir défendre

- Montrer la ligne du plan qui a changé, et pourquoi elle n'était pas possible
  avant.
- L'écart `rows=100` estimé contre `rows=194116` réel : d'où il vient, et ce
  qu'il a coûté au reste du plan.
- Prouver que `date_trunc('day', x) < '2025-04-01'` et `x < '2025-04-01'`
  sélectionnent exactement les mêmes lignes.
