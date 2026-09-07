# 🍝 Bloc 4 - Désspaghettification

**Objectif** : C8 - MVC, séparation des responsabilités.
**Format** : équipe · 30 points.

## La situation (à lire à voix haute)

> L'atelier gère ses inscriptions avec une petite API. Elle marche. Tout est
> dans un seul fichier, `app/server.ts` : le SQL, les règles métier, le
> formatage des dates. Le prochain qui doit ajouter une règle ne sait pas où
> l'écrire, et le premier qui change de base de données casse tout.
>
> **Partie A, 15 minutes, sans ordinateur** : vous triez 40 responsabilités
> dans cinq couches. **Partie B, 35 minutes** : vous redécoupez l'API en
> couches, sans changer son comportement.

## Partie A - 15 minutes, sans ordinateur

Votre équipe reçoit **40 cartes**. Chacune porte une responsabilité du code.
Triez-les en cinq tas :

```
CONTROLLER   ·   SERVICE   ·   REPOSITORY   ·   MODEL   ·   VIEW
```

Vous devez placer **toutes** les cartes. Pour celles qui vous font hésiter,
posez-les au milieu et **argumentez** : ce sont celles-là qui nous intéressent.

## Partie B - 35 minutes

`app/server.ts` est une petite API de gestion d'inscriptions à des ateliers.
Tout est dans le contrôleur : accès base, règles métier, formatage d'affichage.

Prérequis sur le poste : Node 26 (`nvm use` lit le `.nvmrc`), pnpm, Docker.

```bash
docker compose up -d     # PostgreSQL sur le port 5434, jeu de données inclus
pnpm install
node app/server.ts       # http://localhost:4000
curl localhost:4000/workshops
```

Découpez-la en couches. À l'arrivée, on doit pouvoir répondre à ces questions :

- Où se trouve la règle « on ne peut pas s'inscrire deux fois » ?
- Où se trouve le SQL ?
- Où se trouve la mise en forme de la date affichée ?
- Si on remplace PostgreSQL par un fichier JSON, quels fichiers changent ?

`pnpm typecheck` vérifie les types de ce que vous produisez : le comportement
de l'API, lui, doit rester identique (mêmes routes, mêmes réponses).

## Barème

| Critère | Points |
| --- | --- |
| Tri des cartes argumenté | 10 |
| Découpage effectif en couches | 10 |
| Aucune règle métier restée dans le contrôleur | 10 |
| Défense orale | 0 à 20 |

## Le piège à éviter

Le **Service fourre-tout** : une classe `WorkshopService` de 300 lignes qui fait
tout, et qui est juste le nouveau nom du spaghetti. Si votre service parle SQL
ou formate des dates, ce n'est pas un service.
