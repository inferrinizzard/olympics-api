CREATE TABLE IF NOT EXISTS sport_events (
    game            VARCHAR(30) PRIMARY KEY,
    sport           VARCHAR(3) NOT NULL,
    event           TEXT NOT NULL,
    sex             VARCHAR(5) NOT NULL,
    gold            VARCHAR(3)[],
    silver          VARCHAR(3)[],
    bronze          VARCHAR(3)[],

    CONSTRAINT fk_sport_events_game
        FOREIGN KEY(game)
        REFERENCES games_detail(game),
    CONSTRAINT fk_sport_events_sport
        FOREIGN KEY(sport)
        REFERENCES sports_detail(sport)
);

COMMENT ON TABLE sport_events IS 'Main Sports table, holds all sports details';
COMMENT ON COLUMN sport_events.game IS 'Games Key';
COMMENT ON COLUMN sport_events.sport IS 'IOC Sport Code';
COMMENT ON COLUMN sport_events.event IS 'Sport Event Name';
COMMENT ON COLUMN sport_events.sex IS 'Sex of Event (men|women|mixed)';
COMMENT ON COLUMN sport_events.gold IS 'Event Gold Winner (Country Code Array)';
COMMENT ON COLUMN sport_events.silver IS 'Event Silver Winner (Country Code Array)';
COMMENT ON COLUMN sport_events.bronze IS 'Event Bronze Winner (Country Code Array)';
