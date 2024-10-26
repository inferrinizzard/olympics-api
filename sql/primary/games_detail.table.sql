CREATE TABLE IF NOT EXISTS games_detail (
    code            VARCHAR(50) PRIMARY KEY,
    year            INT NOT NULL,
    host            VARCHAR(50) NOT NULL,
    season          VARCHAR(6) NOT NULL,
    edition         VARCHAR(20) NOT NULL,
    motto           TEXT,
    num_athletes    INT,
    start_date      TEXT,
    end_date        TEXT,
    page_name       TEXT NOT NULL
);

COMMENT ON TABLE games_detail IS 'Main Games table, holds all games details';
COMMENT ON COLUMN games_detail.code IS 'Games Key';
COMMENT ON COLUMN games_detail.year IS 'Year of Game';
COMMENT ON COLUMN games_detail.host IS 'Game Host Cities';
COMMENT ON COLUMN games_detail.season IS 'Season of games (summer|winter)';
COMMENT ON COLUMN games_detail.motto IS 'Game Motto';
COMMENT ON COLUMN games_detail.edition IS 'Type of games (olympics|youth|paralympics)';
COMMENT ON COLUMN games_detail.num_athletes IS 'Total number of athletes';
COMMENT ON COLUMN games_detail.start_date IS 'Game start date';
COMMENT ON COLUMN games_detail.end_date IS 'Game end date';
COMMENT ON COLUMN games_detail.page_name IS 'Wikipedia page name';
