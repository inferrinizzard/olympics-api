CREATE TABLE IF NOT EXISTS events_results (
    id              SERIAL PRIMARY KEY,
    games           VARCHAR(50) NOT NULL,
    sport           VARCHAR(5) NOT NULL,
    event           TEXT NOT NULL,
    gold            VARCHAR(3)[],
    silver          VARCHAR(3)[],
    bronze          VARCHAR(3)[],

    CONSTRAINT fk_events_results_games
        FOREIGN KEY(games)
        REFERENCES games_detail(code),
    CONSTRAINT fk_events_results_sport
        FOREIGN KEY(sport)
        REFERENCES sports_detail(code)
);

COMMENT ON TABLE events_results IS 'Main Sports table, holds all sports details';
COMMENT ON COLUMN events_results.games IS 'Games code from games_detail, year+host+edition';
COMMENT ON COLUMN events_results.sport IS 'Sports code from sports_detail, IOC/IPC';
COMMENT ON COLUMN events_results.event IS 'Name of event';
COMMENT ON COLUMN events_results.gold IS 'Gold medal winner countries';
COMMENT ON COLUMN events_results.silver IS 'Silver medal winner countries';
COMMENT ON COLUMN events_results.bronze IS 'Bronze medal winner countries';

