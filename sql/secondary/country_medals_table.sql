CREATE TABLE IF NOT EXISTS country_medals (
    id          SERIAL PRIMARY KEY,
    country     VARCHAR(3) NOT NULL,
    game        VARCHAR(30) NOT NULL,
    gold        INT NOT NULL DEFAULT 0,
    silver      INT NOT NULL DEFAULT 0,
    bronze      INT NOT NULL DEFAULT 0,
    total       INT NOT NULL DEFAULT 0,

    CONSTRAINT fk_country_medals_country
        FOREIGN KEY(country)
        REFERENCES country_detail(country),
    CONSTRAINT fk_country_medals_game
        FOREIGN KEY(game)
        REFERENCES games_detail(game)
);

COMMENT ON TABLE country_medals IS 'Table containing the number of medals per country and season';
COMMENT ON COLUMN country_medals.country IS 'Country Code';
COMMENT ON COLUMN country_medals.game IS 'Games Key';
COMMENT ON COLUMN country_medals.gold IS 'Number of gold medals';
COMMENT ON COLUMN country_medals.silver IS 'Number of silver medals';
COMMENT ON COLUMN country_medals.bronze IS 'Number of bronze medals';
COMMENT ON COLUMN country_medals.total IS 'Total number of medals';
