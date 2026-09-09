# Post-mortem - Inscriptions refusées pendant 4 h 10

> **Exemple.** Cet incident n'est pas le vôtre : il sert de modèle de format et
> de niveau. Le vôtre porte sur la restauration que vous venez de mener.

**Date de l'incident** : 14 mars 2026
**Rédigé par** : équipe Atelier · **le** 14 mars 2026
**Statut** : résolu

## Résumé

Le 14 mars entre 08h20 et 12h30, l'API d'inscriptions a refusé **toutes** les
inscriptions aux ateliers avec une erreur « atelier complet », y compris sur
des ateliers vides. **87 inscriptions perdues** (estimation à partir des logs
d'accès), **4 h 10 d'indisponibilité fonctionnelle**. Aucune donnée existante
n'a été altérée.

## Chronologie

| Heure | Événement |
| --- | --- |
| 07h55 | Mise en production d'un correctif sur le calcul des places restantes. |
| 08h20 | **Début réel de l'incident.** Premier refus injustifié dans les logs. |
| 09h40 | Un bénévole signale par mail « ça ne marche pas ». Le mail n'est pas lu. |
| 11h05 | **Détection.** Un adhérent appelle l'association au téléphone. |
| 11h20 | Reproduction confirmée sur un atelier vide. |
| 11h55 | Cause identifiée : les inscriptions annulées sont comptées comme actives. |
| 12h25 | Retour à la version précédente. |
| 12h30 | **Rétablissement.** Inscriptions à nouveau possibles. |
| 14h00 | Correctif refait, avec un test, et remis en production. |

**Détection : 2 h 45 après le début.** C'est le chiffre le plus inquiétant du
tableau, davantage que la durée totale.

## Cause racine

Le correctif comptait les inscriptions d'un atelier sans exclure celles dont
le champ `cancelled` vaut vrai. Sur les ateliers rouverts après désistement,
le compte dépassait la capacité, et l'API refusait tout le monde.

Mais ça, c'est le **symptôme**. En continuant à demander pourquoi :

- Pourquoi le bug est-il passé ? Aucun test ne couvrait le cas « inscription
  annulée ».
- Pourquoi n'y avait-il pas de test ? Rien n'oblige à en écrire un avant une
  mise en production.
- Pourquoi l'incident a-t-il duré 2 h 45 avant d'être vu ? Aucune surveillance
  ne regarde le taux de refus ; on dépend d'un humain qui appelle.

**Cause racine** : on peut mettre en production une modification du calcul
métier sans test, et rien ne surveille le résultat après coup. Le bug n'est
que la première occasion venue.

## Ce qui a marché

- Les logs applicatifs contenaient tout ce qu'il fallait : l'incident a été
  reproduit en 15 minutes une fois qu'on l'a cherché.
- Le retour à la version précédente a pris 5 minutes et n'a rien cassé.
- Aucune donnée n'a été perdue ni corrompue : l'API refusait, elle n'écrivait
  pas de travers.

## Ce qui a manqué

- Une alerte sur le taux de refus. Elle aurait déclenché à 08h25 au lieu de
  11h05.
- Un canal de signalement que quelqu'un lit vraiment : le mail de 09h40 aurait
  fait gagner 1 h 25.
- Un test sur le cas « atelier avec des inscriptions annulées ».

## Actions correctives

| # | Action | Responsable | Échéance |
| --- | --- | --- | --- |
| 1 | Un test automatisé sur le décompte des places qui couvre les inscriptions annulées, et qui bloque la mise en production s'il échoue | Équipe technique | 21 mars |
| 2 | Une alerte quand le taux de refus dépasse 20 % sur 15 minutes, envoyée sur le canal d'astreinte | Équipe technique | 28 mars |
| 3 | Les signalements des bénévoles arrivent sur le canal d'astreinte, plus dans une boîte mail personnelle | Bureau | 21 mars |

**Laquelle aurait suffi à elle seule ?** La n° 1 : le test aurait bloqué la
mise en production, l'incident n'aurait pas eu lieu. Les n° 2 et 3 ne
l'empêchent pas, elles réduisent les 2 h 45 de détection - ce qui compte pour
le prochain incident, qui aura une autre cause.

## Sans blâme

Ce document ne nomme personne, volontairement. La personne qui a écrit le
correctif a suivi la procédure existante : il n'y en avait aucune qui exigeait
un test. Le défaut est là, pas chez elle.
