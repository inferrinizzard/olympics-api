CREATE MATERIALIZED VIEW country_attendance AS
SELECT
    country,
    ARRAY_AGG(game) AS games
FROM country_athletes
    CROSS JOIN JSON_OBJECT_KEYS(country_athletes) country
GROUP BY country;
