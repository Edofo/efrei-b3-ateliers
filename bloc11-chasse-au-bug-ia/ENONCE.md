# 🐛 Bloc 11 - La chasse au bug IA

**Objectif** : la synthèse de la formation.
**Format** : équipe · **BOSS** · 60 points + 20 de défense · 2 h 15.

## La situation

> Ce service de location de matériel a été écrit avec l'aide d'une IA, puis
> relu par l'équipe. Architecture en couches, types stricts, noms clairs,
> commentaires utiles. `make check` est vert : types, lint, tests, tout passe.
>
> **Il contient 4 bugs.** Ils sont réalistes, du genre qu'une IA produit
> vraiment : rien qui plante, rien que le compilateur puisse voir. Le service
> répond correctement dans le cas nominal.
>
> À vous de les trouver.

C'est tout l'intérêt du bloc : ce code **a l'air parfait**. C'est exactement
comme ça qu'il arrive dans vos futures pull requests.

## Démarrage

```bash
cp .env.example .env
make install
make up             # PostgreSQL, schéma et jeu de données
make dev            # API sur http://localhost:3000
make check          # types + lint + tests : vert, et ça ne prouve rien
```

`make help` liste toutes les cibles. Le [README](README.md) documente les
endpoints avec des exemples `curl`.

## Le déroulé - 2 h 15

### 1. Trouver les bugs · 45 min

**+15 points par bug réel. −5 par faux signalement.**

Le malus n'est pas là pour vous punir : il est là pour vous empêcher de
mitrailler. Signaler dix suspicions pour être sûr d'avoir les quatre vous
coûtera plus cher que d'en trouver trois et de vous arrêter là.

Un bug signalé, c'est : **le fichier, la ligne, ce qui se passe réellement, et
dans quel cas**. « Le calcul de prix a l'air bizarre » n'est pas un
signalement.

### 2. Corriger, et écrire le test qui l'aurait attrapé · 45 min

Pour **chaque** bug trouvé : le correctif, **et** le test qui échoue avant le
correctif et passe après. C'est le test qui compte le plus — c'est lui qui
prouve que vous avez compris le bug, et pas seulement fait disparaître le
symptôme.

Un correctif sans test ne vaut que la moitié des points.

### 3. Préparer la soutenance · 45 min

Une autre équipe présentera votre travail. Rendez-le lisible.

## L'IA est autorisée

Et c'est même recommandé : servez-vous-en pour chercher.

Vous allez découvrir deux choses. Elle en **rate** — les bugs les plus subtils
lui échappent, parce qu'ils ressemblent à du code correct. Et elle en
**invente** — elle vous signalera des problèmes qui n'en sont pas, avec le même
aplomb. Chaque faux signalement qu'elle vous fait avaler vous coûte 5 points.

C'est la leçon de la journée, et elle ne se transmet pas en cours : votre
valeur, ce n'est pas de produire du code, c'est de savoir lequel refuser.

## Le rendu

- La liste des bugs : fichier, ligne, ce qui se passe, dans quel cas.
- Un correctif par bug.
- Un test par bug, qui échoue sans le correctif.
- `make check` toujours vert à l'arrivée.

## Barème

| Critère | Points |
| --- | --- |
| Bugs réels trouvés | +15 chacun |
| Faux signalements | −5 chacun |
| Correctif sans test qui l'attrape | la moitié des points du bug |
| Défense orale | 0 à 20 |

## La question de défense

> **« Qu'est-ce que l'IA a proposé que vous avez REFUSÉ ? »**

Préparez cette réponse. C'est celle qui départage les équipes, et c'est aussi
celle qu'on vous posera en entretien d'embauche.
