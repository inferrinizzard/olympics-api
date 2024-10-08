CREATE TABLE IF NOT EXISTS sports_events (
    id              SERIAL PRIMARY KEY,
    games           VARCHAR(50) NOT NULL,
    sport           VARCHAR(5) NOT NULL,
    event           TEXT NOT NULL,
    gold            VARCHAR(3)[],
    silver          VARCHAR(3)[],
    bronze          VARCHAR(3)[],

    CONSTRAINT fk_sports_events_games
        FOREIGN KEY(games)
        REFERENCES games_detail(code),
    CONSTRAINT fk_sports_events_sport
        FOREIGN KEY(sport)
        REFERENCES sports_detail(code)
);

COMMENT ON TABLE sports_events IS 'Main Sports table, holds all sports details';
COMMENT ON COLUMN sports_events.games IS 'Games Key';
COMMENT ON COLUMN sports_events.sport IS 'IOC Sport Code';
COMMENT ON COLUMN sports_events.event IS 'Sport event';
COMMENT ON COLUMN sports_events.gold IS 'Gold medal winner countries';
COMMENT ON COLUMN sports_events.silver IS 'Silver medal winner countries';
COMMENT ON COLUMN sports_events.bronze IS 'Bronze medal winner countries';

