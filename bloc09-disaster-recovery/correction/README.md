# 🚨 Bloc 9 - le corrigé

Le meilleur résultat possible, publié après l'atelier, avec la procédure qui y
mène. Votre kit de crise est resté intact dans le dossier parent : vous pouvez
tout rejouer.

```bash
docker compose down -v && docker compose up -d    # base vide
./correction/restaurer.sh
```

Le script fait, dans l'ordre, ce qu'on aurait fait en vrai — et il commente
chaque étape.

## 1. L'inventaire, avant de restaurer quoi que ce soit

C'est là que se joue la moitié du bloc. Trois commandes suffisent à voir venir
le problème sans avoir rien cassé :

```bash
ls -l kit/                                        # le fichier du 12 est plus court
file kit/*                                        # incr-2026-03-12.sql : « data », pas du texte
tail -c 200 kit/incr-2026-03-12.sql | cat -v      # coupé net, puis des ^@^@
grep -E 'ERROR|WARN|FATAL' kit/application.log    # tout est annoncé, le 12 mars à 2 h
```

Le journal applicatif dit ce qui s'est passé **avant** la panne : le disque
était plein **la veille**, avec un `WARN` que personne n'a lu.

## 2. Restaurer dans une transaction

```bash
docker compose exec -T db psql -U prod -d prod -v ON_ERROR_STOP=1 --single-transaction < kit/<fichier>.sql
```

`--single-transaction` n'est pas un détail de confort. Sans lui, `psql`
exécute **instruction par instruction** : quand le fichier du 12 casse en
plein milieu, le client 7 et son `setval` sont déjà en base. La base est à
moitié restaurée, et rien ne le signale. Pire, la reprise échouera ensuite sur
un `duplicate key value violates unique constraint "customers_pkey"`, sans
qu'on comprenne pourquoi.

Avec la transaction : `ERROR`, puis `ROLLBACK`. La base est exactement comme
avant, et on peut réfléchir.

## 3. Un fichier corrompu n'est pas un fichier vide

Le fichier du 12 est tronqué **au milieu de la commande 11**. La commande 10,
elle, est intacte quelques lignes plus haut. On garde le fichier jusque-là et
on referme l'instruction :

```bash
sed -n '1,/CMD-2026-0010/p' kit/incr-2026-03-12.sql | sed -e '$ s/),$/);/' > incr-12-repare.sql
```

Lire avant de jeter : cette seule ligne fait la différence entre 11 et 12
commandes récupérées.

## 4. Ce qu'on annonce

| | |
| --- | --- |
| **Récupéré** | commandes 1 à 10, 12 et 13 — soit **12 commandes**, 8 clients, 11 lignes de commande |
| **Dernière donnée** | commande 13, `2026-03-12 19:15:00` |
| **Fenêtre de perte** | de 19h15 le 12 mars à 03h12 le 13 : **environ 8 heures** |
| **Cohérence** | `orders_id_seq` est à 13 : la prochaine commande prendra le 14, pas de collision |

**Perdu, et pourquoi** — nommer chaque perte fait partie du travail :

- **commande 11** : tronquée dans le fichier corrompu. Le journal dit qu'elle
  est de Sofia, le 11 mars vers 13 h ; le montant, lui, est illisible.
- **commandes 14 et 15** : enregistrées après la dernière sauvegarde. Seules
  leurs références et leurs heures survivent, dans le journal applicatif.
- **les lignes de la commande 10** : elles se trouvaient après la troncature.

Une équipe qui annonce « rien perdu » n'a pas lu le journal. Il ne rend pas les
données, mais il dit **exactement** ce qui manque : c'est une sauvegarde de
dernier recours.

## Les quatre choses à retenir

1. **Un backup non testé n'est pas un backup.** Le 12 mars, le job a écrit
   « completed » sur un fichier mort. Personne n'a relu le code de sortie,
   personne n'a jamais restauré pour voir.
2. **Une restauration se rejoue dans une transaction**, sinon un fichier cassé
   laisse une base à moitié restaurée sans le dire.
3. **Un fichier corrompu n'est pas un fichier vide.** Lire avant de jeter.
4. **Le journal applicatif est la dernière ligne de défense** : il ne rend pas
   les données, il dit ce qui manque.

## Ce que vous devez savoir défendre

- Qu'est-ce que le fichier du 12 mars a **quand même écrit** dans votre base
  avant d'échouer ?
- Comment savez-vous que les commandes 14 et 15 ont existé, et pourquoi ne
  pouvez-vous pas les recréer ?
- Quelle est votre fenêtre de perte, en heures ? À partir de quel horodatage
  n'avez-vous plus confiance dans vos données ?
- Si le fichier du 13 avait été corrompu **aussi**, que feriez-vous
  différemment demain matin ?
