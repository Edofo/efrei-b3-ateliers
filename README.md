# Ateliers - EFREI B3, renforcement technique

Un dossier par bloc, l'énoncé dans son `README.md`. Les blocs apparaissent ici
au fur et à mesure de la progression : si le dossier du jour n'est pas encore
là, fais un `git pull`.

| Bloc | Atelier | Dossier |
| --- | --- | --- |
| 1 | 🔧 Le repo saboté | dépôt séparé : <https://github.com/Edofo/efrei-b3-bloc01> |
| 2 | 🎯 Devine ma classe | `bloc02-devine-ma-classe/` |
| 3 | ⚡ Refactoring Race | `bloc03-refactoring-race/` · corrigé dans `correction/` |
| 4 | 🍝 Désspaghettification | `bloc04-desspaghettification/` |
| 5 | 🗂️ Le schéma cassé | `bloc05-schema-casse/` |
| 6 | 🔍 Enquête SQL | `bloc06-enquete-sql/` |

Le bloc 1 a son propre dépôt parce que son historique Git **fait partie de
l'exercice** : il se clone à part.

Les corrigés arrivent **après** l'atelier concerné, dans un sous-dossier
`correction/`. Le point de départ, lui, reste intact à côté : tu peux refaire
l'exercice depuis zéro à tout moment.

## Prérequis sur ton poste

- **Node 26** : `nvm install 26`, puis `nvm use` dans chaque dossier (un
  `.nvmrc` est fourni). Node 26 exécute le TypeScript directement, il n'y a
  aucune étape de compilation.
- **pnpm 10 ou plus** : `npm install -g pnpm` (Node 26 n'embarque plus Corepack).
- **Docker** (à partir du bloc 4) et **git**.
- Sous Windows : travaille dans **WSL**. Les ateliers utilisent des scripts
  bash et des permissions de fichiers, PowerShell ne suffit pas.

Vérifie ta version avant de commencer :

```bash
node --version   # doit afficher v26.x
pnpm --version   # doit afficher 10.x ou 11.x
```

## Convention de code

Tout le **code** est en **TypeScript** et en **anglais** : identifiants,
colonnes SQL, commentaires, messages. Seuls les **énoncés** sont en français.
C'est volontaire : on ne peut pas exiger du clean code en donnant des tables
nommées en français. Ce qu'on te demande d'écrire suit la même règle.
