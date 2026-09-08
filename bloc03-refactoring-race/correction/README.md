# ⚡ Bloc 3 - le corrigé

Une réponse possible au refactoring, publiée après l'atelier. Ce n'est **pas
la** réponse : toute version qui garde les 12 tests verts et supprime la
duplication vaut la même chose. Compare, ne recopie pas.

Le point de départ est resté dans le dossier parent, intact.

```bash
nvm use && pnpm install
pnpm test        # 12 vert - le fichier de tests n'a pas été modifié
```

## Ce qui a changé

`src/billing.ts` faisait 206 lignes. Il en fait 69, et le reste est parti dans
des fichiers qui portent chacun une responsabilité :

| Fichier | Rôle |
| --- | --- |
| `src/computePrice.ts` | le calcul du tarif, écrit **une seule fois** pour la facture et le devis |
| `src/constants/vehicules.ts` | les tarifs par véhicule, remplaçant la cascade de `if/else` |
| `src/constants/holidays.ts` | les jours fériés |
| `src/types/` | `Rental`, `Invoice`, `Quote` |

## Le point qui se discute

`Rental["type"]` est passé de `string` à une union des véhicules connus. C'est
plus sûr - le compilateur refuse désormais un `"scooter"` - mais le test
`rejects an unknown vehicle type` a justement besoin d'écrire ce `"scooter"`
pour vérifier qu'il est rejeté à l'exécution. Résultat : `pnpm test` est vert,
`pnpm typecheck` sort une erreur sur cette ligne.

Les deux positions se défendent, et c'est exactement le genre d'arbitrage qu'on
attend de vous en défense orale.
