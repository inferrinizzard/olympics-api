CREATE MATERIALIZED VIEW IF NOT EXISTS country_medal_totals AS
SELECT
    country,
    season,
    MAX(CASE WHEN gold IS NOT NULL THEN medals END) AS gold,
    MAX(CASE WHEN silver IS NOT NULL THEN medals END) AS silver,
    MAX(CASE WHEN bronze IS NOT NULL THEN medals END) AS bronze
FROM (
    SELECT
        season,
        COALESCE(gold, silver, bronze) AS country,
        gold,
        silver,
        bronze,
        COUNT(*) AS medals
    FROM (
        SELECT
            games_detail.season AS season,
            UNNEST(gold) AS gold,
            UNNEST(silver) AS silver,
            UNNEST(bronze) AS bronze
        FROM sports_events
        JOIN games_detail
            ON sports_events.game = games_detail.game
    ) unnested
    GROUP BY
        season,
        GROUPING SETS( (gold), (silver), (bronze) )
) counted
WHERE country IS NOT NULL
GROUP BY country, season
;

COMMENT ON TABLE country_medal_totals IS 'View with the number of medals per country and season';
COMMENT ON COLUMN country_medal_totals.country IS 'Country Code';
COMMENT ON COLUMN country_medal_totals.season IS 'Type of games (summer|winter)';
COMMENT ON COLUMN country_medal_totals.gold IS 'Number of gold medals';
COMMENT ON COLUMN country_medal_totals.silver IS 'Number of silver medals';
COMMENT ON COLUMN country_medal_totals.bronze IS 'Number of bronze medals';
