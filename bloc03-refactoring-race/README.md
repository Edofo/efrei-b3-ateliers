# ⚡ Bloc 3 - Refactoring Race

**Objectif** : C8 - héritage, polymorphisme, organisation du code.
**Format** : équipe · 30 points · **rotation du clavier toutes les 10 minutes**.

## La situation (à lire à voix haute)

> `src/billing.ts` calcule les factures et les devis d'une agence de location
> de véhicules. Il fonctionne : la suite de tests est verte. Il est aussi
> parfaitement illisible, et plus personne n'ose y toucher.
>
> **Vous avez 50 minutes pour le rendre lisible sans jamais casser les tests.**
> Le clavier change de mains toutes les 10 minutes. À la fin, une autre équipe
> lira votre code et le présentera à votre place.

## Avant de commencer

Prérequis sur le poste : Node 26 (`nvm use` lit le `.nvmrc`) et pnpm.

```bash
pnpm install
pnpm test        # doit être vert AVANT que vous touchiez à quoi que ce soit
```

## Votre mission

Rendre ce fichier lisible **sans jamais casser les tests**.

Trois chantiers vous attendent :

1. **Les `if/else` en cascade sur le type de véhicule** appellent du
   polymorphisme. Trouvez la bonne abstraction.
2. **La duplication** entre `computeInvoice` et `computeQuote`.
3. **Les variables globales** qui font que deux factures calculées à la suite
   ne donnent pas le même résultat.

## Règle d'or

> **Les tests doivent rester verts en permanence.**
> Une équipe dont les tests cassent **gèle son chrono** jusqu'à réparation.

Lancez `pnpm test:watch` dans un terminal et gardez-le sous les yeux.
`pnpm typecheck` vérifie les types : un bon garde-fou, mais le juge de paix
reste `pnpm test`.

## Barème

| Critère | Points |
| --- | --- |
| Tests verts à l'arrivée | 10 |
| Duplication éliminée | 10 |
| Lisibilité (jugée par une **autre** équipe) | 10 |
| Défense orale | 0 à 20 |

## Défense croisée

Chaque équipe présente le refactoring **d'une autre équipe**. Lire du code
étranger, ça ne se récite pas.

## Ce qui n'est pas demandé

Changer le comportement, ajouter des fonctionnalités, ou réécrire les tests.
Si vous avez besoin de modifier un test pour que ça passe, c'est que vous avez
changé le comportement : revenez en arrière.
