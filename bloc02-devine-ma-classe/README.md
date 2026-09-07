# 🎯 Bloc 2 - Devine ma classe

**Objectif** : C8 - encapsulation, contrat d'interface.
**Format** : équipe coupée en deux binômes · 30 points (moyenne des deux binômes).

## Règle du jeu

1. Votre équipe se coupe en **deux binômes**. Chaque binôme reçoit **un domaine
   métier** différent : fiche papier, ou la page `/classes.html` du site, qui
   affiche votre fiche avec le lien de votre équipe.
2. **20 minutes, binômes séparés, hors de portée de voix** : chacun produit
   *uniquement* un **diagramme de classes** et les **signatures publiques** de
   son domaine. Aucun corps de méthode, aucune implémentation.
3. L'animateur fait passer les diagrammes : le binôme ① reçoit celui du ②, et
   inversement. Personne ne commente sa copie en la remettant.
4. **25 minutes** : chaque binôme implémente le diagramme **reçu**, sans poser
   la moindre question à ses auteurs, même s'ils sont dans votre équipe.
5. Debrief à la table, puis collectif : les auteurs disent ce qui a été mal
   compris.

## Ce que vous rendez à l'étape 2

Un fichier `interface.md` ou une photo du tableau, contenant :

- les classes et leurs relations,
- pour chaque classe : ses attributs et la **signature** de ses méthodes
  publiques (nom, paramètres typés, type de retour),
- les invariants que vous jugez importants (une phrase chacun).

## Barème

| Critère | Points |
| --- | --- |
| Implémentation fidèle au diagramme reçu | 15 |
| Clarté du diagramme produit (jugée sur la fidélité de ce qu'en a fait l'autre binôme) | 15 |
| Défense orale | 0 à 20 |

Chaque binôme est noté séparément ; le score de l'équipe est la moyenne des
deux. Saboter son propre binôme ne rapporte donc rien.

## La règle qui fait mal

Vous n'avez **pas le droit de parler** au binôme dont vous implémentez le
diagramme, et il est dans votre équipe. Si une signature est ambiguë, vous
devez trancher seuls - et c'est exactement ce que coûte une interface mal
nommée dans la vraie vie. Un regard par-dessus l'épaule, un « c'est pas ce que
tu voulais dire ? » : rappel à l'ordre la première fois, −5 la seconde.
