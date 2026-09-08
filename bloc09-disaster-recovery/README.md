# 🚨 Bloc 9 - Disaster Recovery

**Objectif** : C13 - sauvegarde, restauration.
**Format** : équipe · 30 points.

## Mise en scène (à jouer, vraiment)

> **9 h 05.** L'animateur entre dans la salle.
>
> « La prod est morte cette nuit. Le serveur de l'association a rendu l'âme à
> 3 h 12. On a un kit de sauvegardes. Vous avez 40 minutes pour remonter la
> base en perdant le moins de données possible. »

## Votre kit de crise

```
kit/
  complet-2026-03-06.sql       sauvegarde complète, vieille de 7 jours
  incr-2026-03-08.sql          incrémental
  incr-2026-03-10.sql          incrémental
  incr-2026-03-12.sql          incrémental
  incr-2026-03-13.sql          incrémental
  application.log              les logs applicatifs de la période
```

Vous recevez ce dossier tel quel. La base de production, elle, est vide : c'est
à vous de la remonter.

```bash
docker compose up -d                              # une base PostgreSQL vide, port 5439
docker compose exec db psql -U prod -d prod       # pour y regarder
```

Pour rejouer un fichier du kit dans la base :

```bash
docker compose exec -T db psql -U prod -d prod -v ON_ERROR_STOP=1 < kit/complet-2026-03-06.sql
```

> Pas besoin d'installer `psql` sur votre machine : le client est déjà dans le
> conteneur. Si vous l'avez en local, `psql postgres://prod:prod@localhost:5439/prod -f <fichier>`
> marche aussi.

## Votre mission

Restaurer la base **le plus près possible de 3 h 12 le 13 mars**.

Votre score, ce sont deux chiffres que vous devez annoncer vous-mêmes :

| Indicateur | Définition | Points |
| --- | --- | --- |
| **RPO** | Quelle quantité de données avez-vous perdue ? À quel horodatage s'arrête votre base restaurée ? | 15 |
| **RTO** | Combien de temps votre restauration a-t-elle pris, de la panne au service rétabli ? | 15 |

## Ce qu'on attend à l'arrivée

1. Une base qui répond et dont vous pouvez prouver le contenu :
   ```sql
   SELECT count(*) FROM orders;
   SELECT max(placed_at) FROM orders;
   ```
2. **L'horodatage exact** de votre dernière donnée récupérée.
3. La liste de ce que vous **n'avez pas** pu récupérer, et pourquoi.

## Consigne de méthode

Avant de taper la moindre commande : **inventoriez le kit**. Un fichier de
sauvegarde qui existe n'est pas forcément un fichier de sauvegarde qui marche.

Les logs applicatifs sont là pour une raison.
