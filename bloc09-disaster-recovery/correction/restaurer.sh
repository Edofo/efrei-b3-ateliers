#!/usr/bin/env bash
set -euo pipefail

# Bloc 9 - la restauration, du diagnostic au meilleur resultat possible.
# A lancer depuis le dossier du bloc, la base demarree (docker compose up -d) :
#
#   ./correction/restaurer.sh
#
# Chaque etape est celle qu'on aurait faite en vrai, dans l'ordre.

cd "$(dirname "$0")/.."
psql() { docker compose exec -T db psql -U prod -d prod -v ON_ERROR_STOP=1 --single-transaction "$@"; }

echo "== 1. Inventaire : on regarde AVANT de restaurer =="
ls -l kit/
file kit/*.sql | sed 's/^/  /'
echo "  -- la fin du fichier du 12 --"
tail -c 120 kit/incr-2026-03-12.sql | cat -v | sed 's/^/  /'
echo "  -- ce que dit le journal applicatif --"
grep -E 'ERROR|WARN|FATAL' kit/application.log | sed 's/^/  /'

echo
echo "== 2. Restauration dans l'ordre, chaque fichier dans une transaction =="
for f in complet-2026-03-06 incr-2026-03-08 incr-2026-03-10; do
  psql < "kit/$f.sql" > /dev/null && echo "  ✔ $f"
done

echo
echo "== 3. Le fichier du 12 est corrompu : la transaction protege la base =="
if psql < kit/incr-2026-03-12.sql > /dev/null 2>&1; then
  echo "  ✖ inattendu : il est passe"
else
  echo "  ✔ echec + ROLLBACK : la base est exactement comme avant."
  echo "    Sans --single-transaction, le client 7 serait reste en base et la"
  echo "    reprise plus bas echouerait sur un duplicate key."
fi

echo
echo "== 4. Un fichier corrompu n'est pas un fichier vide : on sauve la commande 10 =="
# On garde tout jusqu'a la ligne de la commande 10, et on referme l'instruction.
sed -n '1,/CMD-2026-0010/p' kit/incr-2026-03-12.sql | sed -e '$ s/),$/);/' > /tmp/incr-12-repare.sql
psql < /tmp/incr-12-repare.sql > /dev/null && echo "  ✔ commande 10 recuperee"

echo
echo "== 5. Le fichier du 13, sain =="
psql < kit/incr-2026-03-13.sql > /dev/null && echo "  ✔ incr-2026-03-13"

echo
echo "== 6. Ce qu'on annonce =="
docker compose exec -T db psql -U prod -d prod -c \
  "SELECT count(*) AS commandes, max(placed_at) AS derniere FROM orders;"
docker compose exec -T db psql -U prod -d prod -tAc \
  "SELECT 'commandes en base : ' || string_agg(id::text, ',' ORDER BY id) FROM orders;"
