-- Bloc 7 - l'index
--
-- INCLUDE embarque les colonnes lues mais non filtrees (sensor_id, value) :
-- l'index se suffit a lui-meme, la table n'est plus visitee du tout.
-- C'est ce qui donne Index Only Scan et Heap Fetches: 0 dans le plan.

CREATE INDEX IF NOT EXISTS idx_readings_quality_time
    ON readings (quality, recorded_at)
    INCLUDE (sensor_id, value);
