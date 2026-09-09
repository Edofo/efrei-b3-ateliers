# 📋 Bloc 10 - Post-mortem

**Objectif** : C13 - gestion des incidents, sécurisation.
**Format** : équipe · 30 points + 20 de défense.

## La consigne

Suite directe du sinistre que vous venez de traverser. Votre équipe rédige le
post-mortem de **votre** restauration : **une page**, pas deux. Puis vous le
présentez en **5 minutes**.

Vous écrivez pour quelqu'un qui n'était pas là et qui doit comprendre ce qui
s'est passé, pourquoi, et ce qui va changer.

## La règle qui prime sur tout : sans blâme

On cherche le **défaut de procédure**, jamais le coupable. Un post-mortem qui
nomme une personne comme cause a raté son sujet : si l'organisation permet
qu'une erreur humaine détruise la production, c'est l'organisation qui a un
défaut. Écrivez « le fichier de sauvegarde n'était vérifié par personne »,
jamais « X n'avait pas vérifié ».

Ce n'est pas de la politesse, c'est de l'efficacité : dans une équipe où on
cherche des coupables, personne ne signale plus rien.

## Ce que contient votre page

| Section | Ce qu'on y attend |
| --- | --- |
| **Résumé** | 2 lignes, et l'impact **chiffré** : combien de données perdues, combien de temps d'indisponibilité |
| **Chronologie** | les heures, dans l'ordre : le début réel, la détection, le diagnostic, le rétablissement |
| **Cause racine** | pas le symptôme. Continuez à demander « pourquoi ? » jusqu'à tomber sur une procédure absente |
| **Ce qui a marché** | à garder. Un post-mortem qui n'a que du négatif est faux |
| **Ce qui a manqué** | l'outil, l'information ou la procédure dont vous auriez eu besoin |
| **3 actions correctives** | concrètes, chacune avec un responsable et une échéance |

## Le modèle

[`exemple-postmortem.md`](exemple-postmortem.md) est un post-mortem complet, au
format et à la longueur attendus. Il porte volontairement sur **un autre
incident** que le vôtre : il vous montre le niveau, il ne vous donne aucune
réponse.

## Barème

| Critère | Points |
| --- | --- |
| Chronologie précise et honnête | 10 |
| Cause racine atteinte (pas le symptôme) | 10 |
| 3 actions correctives concrètes et vérifiables | 10 |
| Défense orale | 0 à 20 |

Une action corrective du type « être plus vigilant » vaut zéro : elle n'est ni
concrète, ni vérifiable, et elle repose sur la bonne volonté des gens plutôt
que sur une procédure.

## La question de défense

> « Laquelle de vos 3 actions correctives aurait évité l'incident **à elle
> seule** ? »

Si aucune ne répond, c'est que vous n'avez pas atteint la cause racine.
