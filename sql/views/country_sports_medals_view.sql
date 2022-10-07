CREATE MATERIALIZED VIEW IF NOT EXISTS country_sports_medals AS
SELECT
    COALESCE(gold_count.sport, silver_count.sport, bronze_count.sport) AS sport,
    COALESCE(gold_count.country, silver_count.country, bronze_count.country) AS country,
    COALESCE(gold, 0) AS gold,
    COALESCE(silver, 0) AS silver,
    COALESCE(bronze, 0) AS bronze
FROM (
    SELECT
        sport,
        country,
        COUNT(country) AS gold
    FROM sports_events
        CROSS JOIN UNNEST(gold) AS country
    GROUP BY sport, country
    ) gold_count
FULL JOIN (
    SELECT
        sport,
        country,
        COUNT(country) AS silver
    FROM sports_events
        CROSS JOIN UNNEST(silver) AS country
    GROUP BY sport, country
    ) silver_count
ON gold_count.country = silver_count.country AND gold_count.sport = silver_count.sport
FULL JOIN (
    SELECT
        sport,
        country,
        COUNT(country) AS bronze
    FROM sports_events
        CROSS JOIN UNNEST(bronze) AS country
    GROUP BY sport, country
    ) bronze_count
ON gold_count.country = bronze_count.country AND gold_count.sport = bronze_count.sport
;

-- SELECT
--     sport,
--     country,
--     MAX(CASE WHEN gold IS NOT NULL THEN medals END) AS gold,
--     MAX(CASE WHEN silver IS NOT NULL THEN medals END) AS silver,
--     MAX(CASE WHEN bronze IS NOT NULL THEN medals END) AS bronze
-- FROM (
--     SELECT
--         sport,
--         COALESCE(gold, silver, bronze) AS country,
--         gold,
--         silver,
--         bronze,
--         COUNT(*) AS medals
--     FROM (
--         SELECT
--             sport,
--             UNNEST(gold) AS gold,
--             UNNEST(silver) AS silver,
--             UNNEST(bronze) AS bronze
--         FROM sports_events
--     ) unnested
--     GROUP BY
--         sport,
--         GROUPING SETS( (gold), (silver), (bronze) )
-- ) counted
-- WHERE country IS NOT NULL
-- GROUP BY sport, country
-- ;

-- COMMENT ON TABLE country_sports_medals IS 'View with number of medals per sport for each country';
-- COMMENT ON COLUMN country_sports_medals.country IS 'Country Code';
-- COMMENT ON COLUMN country_sports_medals.sport IS 'Games Key';
-- COMMENT ON COLUMN country_sports_medals.gold IS 'Number of gold medals';
-- COMMENT ON COLUMN country_sports_medals.silver IS 'Number of silver medals';
-- COMMENT ON COLUMN country_sports_medals.bronze IS 'Number of bronze medals';
