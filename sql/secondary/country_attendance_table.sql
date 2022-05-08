CREATE TABLE IF NOT EXISTS country_attendance (
    id              SERIAL PRIMARY KEY,
    country         VARCHAR(3) NOT NULL,
    game            VARCHAR(20) NOT NULL,
    num_athletes    INT NOT NULL DEFAULT 0,
    gold            INT NOT NULL DEFAULT 0,
    silver          INT NOT NULL DEFAULT 0,
    bronze          INT NOT NULL DEFAULT 0,

    CONSTRAINT fk_country_attendance_country
        FOREIGN KEY(country)
        REFERENCES country_detail(country),
    CONSTRAINT fk_country_attendance_game
        FOREIGN KEY(game)
        REFERENCES games_detail(game)
);

COMMENT ON TABLE country_attendance IS 'Table containing the number of athletes per country and game';
COMMENT ON COLUMN country_attendance.id IS 'Unique identifier for the row';
COMMENT ON COLUMN country_attendance.country IS 'Country Code';
COMMENT ON COLUMN country_attendance.game IS 'Games Key';
COMMENT ON COLUMN country_attendance.num_athletes IS 'Number of athletes';
