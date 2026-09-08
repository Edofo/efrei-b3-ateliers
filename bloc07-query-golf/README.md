# ⛳ Bloc 7 - Query Golf

**Objectif** : C10 - administration courante, performance.
**Format** : équipe · 30 points.

## La situation

`readings` contient **4 millions de relevés** de capteurs, d'août 2021 à
aujourd'hui. Le rapport trimestriel (`requete-lente.sql`) ne concerne qu'un
trimestre - **194 000 lignes, 5 % de la table** - mais il relit les 4 millions
à chaque exécution. Environ **800 ms** sur une machine de bureau au repos, et
il tourne toutes les heures.

## Démarrage

```bash
docker compose up -d
```

> ⏳ La première fois, la génération des 4 millions de lignes prend **30 à 90
> secondes**. Le conteneur peut être annoncé « healthy » avant la fin - pas de
> panique, `./verifier.sh` vous dira d'attendre si ce n'est pas prêt.

Pour ouvrir un `psql` interactif et fouiller :

```bash
docker compose exec db psql -U golf -d golf
```

> Pas besoin d'installer `psql` sur votre machine : le client est déjà dans le
> conteneur. Si vous l'avez en local, `psql postgres://golf:golf@localhost:5437/golf`
> marche aussi.

## Comment c'est rangé

```
bloc07-query-golf/
├── verifier.sh              ← votre chronomètre. La seule commande à retenir.
├── docker-compose.yml
├── reference/               ← ON N'Y TOUCHE PAS
│   ├── requete-lente.sql        la requête d'origine : c'est l'« avant »
│   └── checksum.sql             l'empreinte, à la main (verifier.sh le fait pour vous)
├── ma-solution/             ← VOUS TRAVAILLEZ ICI, ET C'EST LE RENDU
│   ├── ma-requete.sql           votre version (copie conforme de l'originale au départ)
│   ├── mon-index.sql            vos CREATE INDEX (vide au départ)
│   ├── explain-avant.txt        ⚙️ généré par verifier.sh
│   └── explain-apres.txt        ⚙️ généré par verifier.sh
└── db/                      ← la génération des données, pour les curieux
```

Retenez une seule chose : **tout ce qui est dans `ma-solution/` est votre
rendu.** Le reste, vous le lisez.

## Votre mission - 40 minutes

Rendre ce rapport rapide, **à résultat strictement identique**.

### 1. Mesurez l'état de départ

```bash
./verifier.sh
```

Vous devez lire quelque chose comme ça - les deux requêtes sont identiques,
donc même temps, même empreinte, gain de 1× :

```
   requete-lente.sql :  838.982 ms   empreinte 85db24eb3a239c5dfb195fa6f2d94e3f
   ma-requete.sql    :  856.835 ms   empreinte 85db24eb3a239c5dfb195fa6f2d94e3f

   Empreinte identique - le resultat n'a pas bouge.
   Gain : 1.0x
```

Le script vient d'écrire les plans d'exécution complets dans
`ma-solution/explain-avant.txt` et `ma-solution/explain-apres.txt`.
**Ouvrez-les.** C'est votre matière première.

### 2. Optimisez

Modifiez `ma-solution/ma-requete.sql`, remplissez `ma-solution/mon-index.sql`,
relancez `./verifier.sh` autant de fois que vous voulez. Le script rejoue vos
index, rechronomètre tout et réécrit les deux plans à chaque passage.

⚠️ **L'empreinte doit rester `85db24eb3a239c5dfb195fa6f2d94e3f`.** C'est une
signature md5 du résultat complet. Une empreinte différente = 0 point, même si
c'est 100 fois plus rapide. Le script vous le dit en rouge.

Deux contraintes pour que l'empreinte reste calculable :
* une seule requête `SELECT` dans `ma-requete.sql` ;
* les mêmes alias de colonnes (`name`, `area`, `reading_count`, `average`,
  `minimum`, `maximum`).

### 3. Expliquez ce qui a changé dans le plan

C'est là que se gagnent les points. Pas dans le chrono.

## Le rendu

Le dossier `ma-solution/` complet :

1. `ma-requete.sql` et `mon-index.sql`
2. `explain-avant.txt` et `explain-apres.txt`
3. `explication.md` - **un paragraphe** qui nomme la ligne du plan qui a changé
   et explique pourquoi elle n'était pas possible avant.

## Barème

| Critère | Points |
| --- | --- |
| Gain de performance mesuré | 10 |
| **Lecture du plan d'exécution** (avant/après, ce qui a changé et pourquoi) | 20 |
| Défense orale | 0 à 20 |

## Contrainte anti-triche

> **Pas d'explication du plan = 0**, même si c'est 100 fois plus rapide.

Un index posé au hasard qui marche par chance ne rapporte rien. Un index posé
pour une raison expliquée rapporte tout.

## Indices

**Après 10 minutes** - comparez ces deux nombres dans `explain-avant.txt` :

```
Seq Scan on readings r  (cost=0.00..133332.90 rows=100 ...) (actual ... rows=194116 ...)
```

Le planificateur estime **100 lignes**. Il en trouve **194 116**. Pourquoi
est-il aveugle à ce point ?

**Après 20 minutes** - regardez ce que la clause `WHERE` fait subir aux
colonnes. Un index ne sert à rien si on l'empêche de servir.
