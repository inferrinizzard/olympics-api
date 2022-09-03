DROP TABLE IF EXISTS country_athletes CASCADE;

CREATE TABLE IF NOT EXISTS country_athletes (
    id               SERIAL PRIMARY KEY,
    game             VARCHAR(30) NOT NULL,
    country_athletes JSON NOT NULL,

    CONSTRAINT fk_country_athletes_game
        FOREIGN KEY(game)
        REFERENCES games_detail(game)
);

COMMENT ON TABLE country_athletes IS 'Table containing the number of athletes per country and game';
COMMENT ON COLUMN country_athletes.id IS 'Unique identifier for the row';
COMMENT ON COLUMN country_athletes.game IS 'Games Key';
COMMENT ON COLUMN country_athletes.country_athletes IS 'Number of athletes per country';
