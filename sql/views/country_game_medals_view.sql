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
        FROM test_sports_events
    ) unnested
    GROUP BY
        game,
        GROUPING SETS( (gold), (silver), (bronze) )
) counted
WHERE country IS NOT NULL
GROUP BY game, country
;
