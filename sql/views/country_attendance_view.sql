CREATE MATERIALIZED VIEW IF NOT EXISTS country_attendance AS
SELECT
    country,
    ARRAY_AGG(game) AS games
FROM country_athletes
    CROSS JOIN JSON_OBJECT_KEYS(country_athletes) country
GROUP BY country;

-- COMMENT ON TABLE country_attendance IS 'Shows which games each country has attended';
-- COMMENT ON COLUMN country_attendance.country IS 'Country Code';
-- COMMENT ON COLUMN country_attendance.games IS 'List of games that country did attend';
