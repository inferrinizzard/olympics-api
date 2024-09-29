CREATE TABLE IF NOT EXISTS games_records {
    id          SERIAL PRIMARY KEY,
    games       VARCHAR(50) NOT NULL,
    country     VARCHAR(3) NOT NULL,
    sport       VARCHAR(5) NOT NULL,
    gold        INT NOT NULL,
    silver      INT NOT NULL,
    bronze      INT NOT NULL,
    men         INT NOT NULL,
    women       INT NOT NULL,

    CONSTRAINT fk_games_records_games
        FOREIGN KEY(games)
        REFERENCES games_detail(code),
    CONSTRAINT fk_games_records_country
        FOREIGN KEY(country)
        REFERENCES country_detail(code),
    CONSTRAINT fk_games_records_sport
        FOREIGN KEY(sport)
        REFERENCES sports_detail(code)
}

COMMENT ON TABLE games_records IS 'Table containing number of medals and athletes per country per games';
COMMENT ON COLUMN games_records.id IS 'Incremental ID';
COMMENT ON COLUMN games_records.games IS 'Games code from games_detail, year+host+edition';
COMMENT ON COLUMN games_records.country IS 'Country code from country_detail, NOC/NPC';
COMMENT ON COLUMN games_records.sport IS 'Sports code from sports_detail, IOC/IPC';
COMMENT ON COLUMN games_records.gold IS 'Number of gold medals';
COMMENT ON COLUMN games_records.silver IS 'Number of silver medals';
COMMENT ON COLUMN games_records.bronze IS 'Number of bronze medals';
COMMENT ON COLUMN games_records.men IS 'Number of male athletes';
COMMENT ON COLUMN games_records.women IS 'Number of female athletes';
