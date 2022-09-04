CREATE MATERIALIZED VIEW country_game_medals AS
WITH unnested AS (
    SELECT
        game,
        UNNEST(gold) AS gold,
        UNNEST(silver) AS silver,
        UNNEST(bronze) AS bronze
    FROM test_sports_events
),
counted AS (
    SELECT
        game,
        gold,
        silver,
        bronze,
        COUNT(*) AS medals
    FROM unnested
    GROUP BY
        game,
        GROUPING SETS( (gold), (silver), (bronze) )
)
SELECT
    game,
    COALESCE(gold, silver, bronze) AS country,
    MAX(CASE WHEN gold IS NOT NULL THEN medals END) AS gold,
    MAX(CASE WHEN silver IS NOT NULL THEN medals END) AS silver,
    MAX(CASE WHEN bronze IS NOT NULL THEN medals END) AS bronze
FROM counted
WHERE COALESCE(gold, silver, bronze) IS NOT NULL
GROUP BY game, COALESCE(gold, silver, bronze)
;
