#!/usr/bin/env bash
# Votre chronomètre. Rejoue ma-solution/mon-index.sql, chronomètre
# reference/requete-lente.sql (l'« avant ») et ma-solution/ma-requete.sql (la
# vôtre), compare les deux empreintes et écrit les deux plans d'exécution dans
# ma-solution/. À relancer autant de fois que vous voulez.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")"

BEFORE=reference/requete-lente.sql
AFTER=ma-solution/ma-requete.sql
INDEXES=ma-solution/mon-index.sql
EXPECTED="85db24eb3a239c5dfb195fa6f2d94e3f"
# En TCP et pas par le socket : pendant l'initialisation du conteneur, l'image
# lance un serveur temporaire qui n'ecoute que sur le socket, puis le redemarre.
PSQL=(docker compose exec -T -e PGPASSWORD=golf db psql -h 127.0.0.1 -U golf -d golf -X -q -v ON_ERROR_STOP=1)
RED=$'\033[31m'; GREEN=$'\033[32m'; BOLD=$'\033[1m'; OFF=$'\033[0m'

# Le corps d'un fichier SQL : sans commentaires, sur une ligne, sans le ; final.
body() {
  sed -e 's/--.*$//' "$1" | tr '\n' ' ' | sed -e 's/[[:space:]]*;[[:space:]]*$//'
}

# md5 du résultat complet, trié : une virgule qui bouge et tout change.
fingerprint() {
  "${PSQL[@]}" -tA <<SQL
WITH result AS ($(body "$1"))
SELECT md5(string_agg(
         name || '|' || area || '|' || reading_count || '|' ||
         average || '|' || minimum || '|' || maximum,
         E'\n' ORDER BY name))
  FROM result;
SQL
}

# Écrit le plan d'exécution complet dans $2, affiche la durée en ms.
explain() {
  printf 'EXPLAIN (ANALYZE, BUFFERS) %s;\n' "$(body "$1")" | "${PSQL[@]}" -tA > "$2"
  sed -nE 's/^Execution Time: ([0-9.]+) ms/\1/p' "$2"
}

WANTED=$(sed -nE 's/.*generate_series\(1, *([0-9]+)\).*/\1/p' db/01-generation.sql | head -1)
ROWS=$("${PSQL[@]}" -tA -c "SELECT count(*) FROM readings" 2>/dev/null || echo 0)
if [ "$ROWS" != "$WANTED" ]; then
  echo "${RED}readings contient $ROWS lignes au lieu de $WANTED : la base n'est pas lancee ou la generation n'est pas finie. Patientez, puis relancez.${OFF}"
  exit 1
fi

"${PSQL[@]}" < "$INDEXES"
T_BEFORE=$(explain "$BEFORE" ma-solution/explain-avant.txt)
T_AFTER=$(explain "$AFTER" ma-solution/explain-apres.txt)
F_BEFORE=$(fingerprint "$BEFORE")
F_AFTER=$(fingerprint "$AFTER")

echo
printf '   requete-lente.sql : %9.3f ms   empreinte %s\n' "$T_BEFORE" "$F_BEFORE"
printf '   ma-requete.sql    : %9.3f ms   empreinte %s\n' "$T_AFTER" "$F_AFTER"
echo
if [ "$F_AFTER" != "$EXPECTED" ]; then
  echo "${RED}   Empreinte differente - le resultat de ma-requete.sql n'est plus le meme.${OFF}"
  echo "${RED}   Rapide ou pas, c'est 0 point tant que ca ne revient pas a $EXPECTED.${OFF}"
  exit 2
fi
echo "${GREEN}   Empreinte identique - le resultat n'a pas bouge.${OFF}"
GAIN=$(awk -v a="$T_BEFORE" -v b="$T_AFTER" 'BEGIN { if (b > 0) printf "%.1f", a / b; else print "?" }')
echo "   Gain : ${BOLD}${GAIN}x${OFF}"
echo
echo "   Plans ecrits dans ma-solution/explain-avant.txt et ma-solution/explain-apres.txt."
