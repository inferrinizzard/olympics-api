CREATE MATERIALIZED VIEW country_game_medals AS
SELECT
    game,
    country,
    MAX(CASE WHEN gold IS NOT NULL THEN medals END) AS gold,
    MAX(CASE WHEN silver IS NOT NULL THEN medals END) AS silver,
    MAX(CASE WHEN bronze IS NOT NULL THEN medals END) AS bronze
FROM (
    SELECT
        game,
        COALESCE(gold, silver, bronze) AS country,
        gold,
        silver,
        bronze,
        COUNT(*) AS medals
    FROM (
        SELECT
            game,
            UNNEST(gold) AS gold,
            UNNEST(silver) AS silver,
            UNNEST(bronze) AS bronze
        FROM sports_events
    ) unnested
    GROUP BY
        game,
        GROUPING SETS( (gold), (silver), (bronze) )
) counted
WHERE country IS NOT NULL
GROUP BY game, country
;

COMMENT ON MATERIALIZED VIEW country_game_medals IS 'View with number of medals per game for each country';
COMMENT ON COLUMN country_game_medals.country IS 'Country Code';
COMMENT ON COLUMN country_game_medals.game IS 'Games Key';
COMMENT ON COLUMN country_game_medals.gold IS 'Number of gold medals';
COMMENT ON COLUMN country_game_medals.silver IS 'Number of silver medals';
COMMENT ON COLUMN country_game_medals.bronze IS 'Number of bronze medals';
