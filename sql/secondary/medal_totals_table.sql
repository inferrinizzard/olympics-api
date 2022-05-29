DROP TABLE IF EXISTS medal_totals CASCADE;

CREATE TABLE IF NOT EXISTS medal_totals (
    country     VARCHAR(3) PRIMARY KEY,
    season      VARCHAR(6) NOT NULL,
    gold        INT NOT NULL DEFAULT 0,
    silver      INT NOT NULL DEFAULT 0,
    bronze      INT NOT NULL DEFAULT 0,
    total       INT NOT NULL DEFAULT 0,

    CONSTRAINT fk_medal_totals_country
        FOREIGN KEY(country)
        REFERENCES country_detail(country)
);

COMMENT ON TABLE medal_totals IS 'Table containing the number of medals per country and season';
COMMENT ON COLUMN medal_totals.country IS 'Country Code';
COMMENT ON COLUMN medal_totals.season IS 'Type of games (summer|winter)';
COMMENT ON COLUMN medal_totals.gold IS 'Number of gold medals';
COMMENT ON COLUMN medal_totals.silver IS 'Number of silver medals';
COMMENT ON COLUMN medal_totals.bronze IS 'Number of bronze medals';
COMMENT ON COLUMN medal_totals.total IS 'Total number of medals';
