# 🗂️ Bloc 5 - le corrigé

Une réponse possible, publiée après l'atelier. Ce n'est **pas la** réponse :
plusieurs schémas bloquent les mêmes lignes, et certaines contraintes se
discutent (voir plus bas). Comparez le vôtre, ne le remplacez pas.

Le point de départ est resté dans le dossier parent, intact.

## L'essayer

Depuis le dossier du bloc, la base étant lancée (`docker compose up -d`) :

```bash
docker compose exec -T db psql -U club -d club < correction/03-schema-durci.sql
docker compose exec -T db psql -U club -d club < db/02-donnees-pourries.sql
```

Le second script doit produire **20 erreurs**, et laisser **10 lignes** en
base : 4 adhérents, 2 ateliers, 2 cotisations, 2 présences. Pour vérifier :

```sql
SELECT 'members' t, count(*) FROM members
UNION ALL SELECT 'workshops', count(*) FROM workshops
UNION ALL SELECT 'membership_fees', count(*) FROM membership_fees
UNION ALL SELECT 'attendances', count(*) FROM attendances;
```

Si vous en acceptez **moins**, une de vos contraintes est trop stricte et
rejette une ligne légitime. Si vous en acceptez **plus**, il vous manque une
contrainte.

## Les 23 anomalies plantées, sur 20 lignes

Une ligne peut en cumuler deux - le membre 6 a un nom vide *et* un email
invalide. Servez-vous-en pour retrouver ce que votre schéma laisse passer.

| Table | Anomalie | Catégorie |
| --- | --- | --- |
| members | identifiant `3` déjà pris | 1 |
| members | identifiant `ten` non numérique | 1 |
| members | email de Camille réutilisé par Tomás | 2 |
| members | `pas-un-email` | 2 |
| members | nom vide (`''`) | 2 |
| members | email `NULL` | 2 |
| members | date `2025-13-45` | 3 |
| members | date `March 2025` | 3 |
| workshops | tarif `-40` | 4 |
| workshops | tarif `gratuit` | 4 |
| workshops | capacité `-3` | 4 |
| workshops | `hosted_by = 99` inexistant | 5 |
| membership_fees | `member_id = 404` | 5 |
| membership_fees | `member_id = NULL` | 5 |
| membership_fees | method `bitcoin` | 6 |
| membership_fees | montant `-45` | 4 |
| membership_fees | montant `45,50` (virgule) | 4 |
| membership_fees | montant `0` | 4 |
| membership_fees | date `2025-02-30` | 3 |
| attendances | doublon du couple (1,1) | 1 |
| attendances | atelier `77` inexistant | 5 |
| attendances | adhérent `88` inexistant | 5 |
| attendances | attended `maybe` | 6 |

## Ce qui se discute

Ces quatre points n'ont pas de bonne réponse universelle. Ils dépendent du
métier, et c'est exactement ce qu'on attendait de vous en défense.

- **`price >= 0` ou `price > 0` ?** Un atelier portes ouvertes à 0 € est
  légitime. Une cotisation à 0 € ne l'est pas. Le même type, deux règles
  différentes : la contrainte vient du métier, pas de la colonne.
- **`method IN (...)` ou une table de référence ?** Le `CHECK` est plus simple,
  la table de référence est plus évolutive. Les deux se défendent.
- **L'email en `NOT NULL UNIQUE`** : et le couple qui partage une adresse ?
  C'est une vraie question métier - l'important est de se la poser avant de
  poser la contrainte.
- **`ON DELETE`** : personne n'y pense. Que devient une cotisation si on
  supprime l'adhérent ? `RESTRICT` protège la comptabilité.
