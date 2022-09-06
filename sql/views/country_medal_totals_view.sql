CREATE MATERIALIZED VIEW IF NOT EXISTS country_medal_totals AS
SELECT
    country,
    season,
    SUM(gold) AS gold,
    SUM(silver) AS silver,
    SUM(bronze) AS bronze
FROM country_game_medals
JOIN games_detail
    ON country_game_medals.game = games_detail.game
GROUP BY country, season;

COMMENT ON TABLE country_medal_totals IS 'View with the number of medals per country and season';
COMMENT ON COLUMN country_medal_totals.country IS 'Country Code';
COMMENT ON COLUMN country_medal_totals.season IS 'Type of games (summer|winter)';
COMMENT ON COLUMN country_medal_totals.gold IS 'Number of gold medals';
COMMENT ON COLUMN country_medal_totals.silver IS 'Number of silver medals';
COMMENT ON COLUMN country_medal_totals.bronze IS 'Number of bronze medals';
