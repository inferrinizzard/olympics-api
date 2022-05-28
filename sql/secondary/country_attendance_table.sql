CREATE TABLE IF NOT EXISTS country_attendance (
    id               SERIAL PRIMARY KEY,
    game             VARCHAR(30) NOT NULL,
    country_athletes JSON NOT NULL,

    CONSTRAINT fk_country_attendance_game
        FOREIGN KEY(game)
        REFERENCES games_detail(game)
);

COMMENT ON TABLE country_attendance IS 'Table containing the number of athletes per country and game';
COMMENT ON COLUMN country_attendance.id IS 'Unique identifier for the row';
COMMENT ON COLUMN country_attendance.game IS 'Games Key';
COMMENT ON COLUMN country_attendance.country_athletes IS 'Number of athletes per country';
