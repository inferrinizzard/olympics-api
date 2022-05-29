DROP TABLE IF EXISTS games_detail CASCADE;

CREATE TABLE IF NOT EXISTS games_detail (
    game            VARCHAR(30) PRIMARY KEY,
    year            INT NOT NULL,
    season          VARCHAR(6) NOT NULL,
    title           VARCHAR(30) NOT NULL,
    emblem          TEXT NOT NULL,
    host            VARCHAR(100) NOT NULL,
    num_athletes    INT NOT NULL,
    start_date      VARCHAR(20) NOT NULL,
    end_date        VARCHAR(20) NOT NULL
);

COMMENT ON TABLE games_detail IS 'Main Games table, holds all games details';
COMMENT ON COLUMN games_detail.game IS 'Games Key';
COMMENT ON COLUMN games_detail.year IS 'Year of Game';
COMMENT ON COLUMN games_detail.season IS 'Type of games (summer|winter)';
COMMENT ON COLUMN games_detail.title IS 'Game Title';
COMMENT ON COLUMN games_detail.emblem IS 'Game Emblem URL';
COMMENT ON COLUMN games_detail.host IS 'Game Host Cities';
COMMENT ON COLUMN games_detail.num_athletes IS 'Total number of athletes';
COMMENT ON COLUMN games_detail.start_date IS 'Game Start Date';
COMMENT ON COLUMN games_detail.end_date IS 'Game End Date';
