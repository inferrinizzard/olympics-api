DROP TABLE IF EXISTS sports_events CASCADE;

CREATE TABLE IF NOT EXISTS sports_events (
    id              SERIAL PRIMARY KEY,
    game            VARCHAR(30) NOT NULL,
    sport           VARCHAR(3) NOT NULL,
    event           TEXT NOT NULL,
    gold            VARCHAR(3)[],
    silver          VARCHAR(3)[],
    bronze          VARCHAR(3)[],

    -- CONSTRAINT fk_sports_events_sport
    --     FOREIGN KEY(sport)
    --     REFERENCES sports_detail(sport),
    CONSTRAINT fk_sports_events_game
        FOREIGN KEY(game)
        REFERENCES games_detail(game)
);

COMMENT ON TABLE sports_events IS 'Main Sports table, holds all sports details';
COMMENT ON COLUMN sports_events.game IS 'Games Key';
COMMENT ON COLUMN sports_events.sport IS 'IOC Sport Code';
COMMENT ON COLUMN sports_events.event IS 'Sport event';
COMMENT ON COLUMN sports_events.gold IS 'Gold medal winner countries, nullable';
COMMENT ON COLUMN sports_events.silver IS 'Silver medal winner countries, nullable';
COMMENT ON COLUMN sports_events.bronze IS 'Bronze medal winner countries, nullable';

