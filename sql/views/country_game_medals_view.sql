CREATE MATERIALIZED VIEW IF NOT EXISTS country_game_medals AS
SELECT
    COALESCE(gold_count.game, silver_count.game, bronze_count.game) AS game,
    COALESCE(gold_count.country, silver_count.country, bronze_count.country) AS country,
    COALESCE(gold, 0) AS gold,
    COALESCE(silver, 0) AS silver,
    COALESCE(bronze, 0) AS bronze
FROM (
    SELECT
        game,
        country,
        COUNT(country) AS gold
    FROM sports_events
        CROSS JOIN UNNEST(gold) AS country
    GROUP BY game, country
    ) gold_count
FULL JOIN (
    SELECT
        game,
        country,
        COUNT(country) AS silver
    FROM sports_events
        CROSS JOIN UNNEST(silver) AS country
    GROUP BY game, country
    ) silver_count
ON gold_count.country = silver_count.country AND gold_count.game = silver_count.game
FULL JOIN (
    SELECT
        game,
        country,
        COUNT(country) AS bronze
    FROM sports_events
        CROSS JOIN UNNEST(bronze) AS country
    GROUP BY game, country
    ) bronze_count
ON gold_count.country = bronze_count.country AND gold_count.game = bronze_count.game
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
