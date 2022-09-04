CREATE MATERIALIZED VIEW country_medal_totals AS
SELECT
    country,
    MAX(CASE WHEN gold IS NOT NULL THEN medals END) AS gold,
    MAX(CASE WHEN silver IS NOT NULL THEN medals END) AS silver,
    MAX(CASE WHEN bronze IS NOT NULL THEN medals END) AS bronze
FROM (
    SELECT
        COALESCE(gold, silver, bronze) AS country,
        gold,
        silver,
        bronze,
        COUNT(*) AS medals
    FROM (
        SELECT
            UNNEST(gold) AS gold,
            UNNEST(silver) AS silver,
            UNNEST(bronze) AS bronze
        FROM sports_events
    ) unnested
    GROUP BY
        GROUPING SETS( (gold), (silver), (bronze) )
) counted
WHERE country IS NOT NULL
GROUP BY country
;
