CREATE MATERIALIZED VIEW IF NOT EXISTS country_game_medals AS
WITH unnested_sports_events AS (
    SELECT
        game,
        UNNEST(gold) AS gold,
        UNNEST(silver) AS silver,
        UNNEST(bronze) AS bronze
    FROM sports_events
)
SELECT
    COALESCE(gold_t.game, silver_t.game, bronze_t.game) AS game,
    COALESCE(gold_t.country, silver_t.country, bronze_t.country) AS country,
    SUM(gold_t.total) AS gold,
    SUM(silver_t.total) AS silver,
    SUM(bronze_t.total) AS bronze
FROM (
    SELECT
        game,
        gold AS country,
        COUNT(gold) AS total
    FROM unnested_sports_events
    GROUP BY game, gold
) gold_t
FULL JOIN (
    SELECT
        game,
        silver AS country,
        COUNT(silver) AS total
    FROM unnested_sports_events
    GROUP BY game, silver
) silver_t
    ON gold_t.country = silver_t.country
FULL JOIN (
    SELECT
        game,
        bronze AS country,
        COUNT(bronze) AS total
    FROM unnested_sports_events
    GROUP BY game, bronze
) bronze_t
    ON gold_t.country = bronze_t.country
WHERE COALESCE(gold_t.country, silver_t.country, bronze_t.country) IS NOT NULL
GROUP BY
    COALESCE(gold_t.game, silver_t.game, bronze_t.game),
    COALESCE(gold_t.country, silver_t.country, bronze_t.country)
;

-- SELECT
--     game,
--     country,
--     MAX(CASE WHEN gold IS NOT NULL THEN medals END) AS gold,
--     MAX(CASE WHEN silver IS NOT NULL THEN medals END) AS silver,
--     MAX(CASE WHEN bronze IS NOT NULL THEN medals END) AS bronze
-- FROM (
--     SELECT
--         game,
--         COALESCE(gold, silver, bronze) AS country,
--         gold,
--         silver,
--         bronze,
--         COUNT(*) AS medals
--     FROM (
--         SELECT
--             game,
--             UNNEST(gold) AS gold,
--             UNNEST(silver) AS silver,
--             UNNEST(bronze) AS bronze
--         FROM sports_events
--     ) unnested
--     GROUP BY
--         game,
--         GROUPING SETS( (gold), (silver), (bronze) )
-- ) counted
-- WHERE country IS NOT NULL
-- GROUP BY game, country
-- ;

-- COMMENT ON TABLE country_game_medals IS 'View with number of medals per game for each country';
-- COMMENT ON COLUMN country_game_medals.country IS 'Country Code';
-- COMMENT ON COLUMN country_game_medals.game IS 'Games Key';
-- COMMENT ON COLUMN country_game_medals.gold IS 'Number of gold medals';
-- COMMENT ON COLUMN country_game_medals.silver IS 'Number of silver medals';
-- COMMENT ON COLUMN country_game_medals.bronze IS 'Number of bronze medals';
