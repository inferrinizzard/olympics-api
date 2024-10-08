CREATE TABLE IF NOT EXISTS participation_records {
    id          SERIAL PRIMARY KEY,
    games       VARCHAR(50) NOT NULL,
    country     VARCHAR(3) NOT NULL,
    sport       VARCHAR(5) NOT NULL,
    gold        INT NOT NULL,
    silver      INT NOT NULL,
    bronze      INT NOT NULL,
    men         INT NOT NULL,
    women       INT NOT NULL,

    CONSTRAINT fk_participation_records_games
        FOREIGN KEY(games)
        REFERENCES participation_detail(code),
    CONSTRAINT fk_participation_records_country
        FOREIGN KEY(country)
        REFERENCES country_detail(code),
    CONSTRAINT fk_participation_records_sport
        FOREIGN KEY(sport)
        REFERENCES sports_detail(code)
}

COMMENT ON TABLE participation_records IS 'Table containing number of medals and athletes per country per games';
COMMENT ON COLUMN participation_records.id IS 'Incremental ID';
COMMENT ON COLUMN participation_records.games IS 'Games code from games_detail, year+host+edition';
COMMENT ON COLUMN participation_records.country IS 'Country code from country_detail, NOC/NPC';
COMMENT ON COLUMN participation_records.sport IS 'Sports code from sports_detail, IOC/IPC';
COMMENT ON COLUMN participation_records.gold IS 'Number of gold medals';
COMMENT ON COLUMN participation_records.silver IS 'Number of silver medals';
COMMENT ON COLUMN participation_records.bronze IS 'Number of bronze medals';
COMMENT ON COLUMN participation_records.men IS 'Number of male athletes';
COMMENT ON COLUMN participation_records.women IS 'Number of female athletes';
