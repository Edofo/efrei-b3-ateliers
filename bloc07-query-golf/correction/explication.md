# Ce qui a changé

`Seq Scan on readings` → `Index Only Scan using idx_readings_quality_time`,
avec `Heap Fetches: 0`.

C'est possible maintenant parce que le filtre ne passe plus par une fonction.
Avant, `date_trunc('day', recorded_at)` obligeait PostgreSQL à calculer la
valeur sur **chacune des 4 millions de lignes** pour savoir si elle entrait
dans le trimestre : aucun index sur `recorded_at` ne pouvait l'aider. En
comparant directement la colonne à une borne, le prédicat redevient
*sargable*, l'index devient utilisable, et le `INCLUDE` lui permet même de
répondre seul, sans lire la table.
