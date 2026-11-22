CREATE TABLE new_sports_events (
    id              SERIAL PRIMARY KEY,
    game            VARCHAR(30) NOT NULL,
    sport           VARCHAR(3) NOT NULL,
    event           TEXT NOT NULL,
    gold            VARCHAR(3)[] NOT NULL,
    silver          VARCHAR(3)[] NOT NULL,
    bronze          VARCHAR(3)[] NOT NULL,

    -- CONSTRAINT fk_sports_events_sport
    --     FOREIGN KEY(sport)
    --     REFERENCES sports_detail(sport),
    CONSTRAINT fk_sports_events_game
        FOREIGN KEY(game)
        REFERENCES games_detail(game)
);

\set content `cat json/sportsEvents.json`
CREATE TEMP TABLE json_t ( j json );
INSERT INTO json_t VALUES (:'content');

CREATE OR REPLACE FUNCTION json_array_to_text_array(_js JSON)
    RETURNS VARCHAR[]
    LANGUAGE sql IMMUTABLE PARALLEL SAFE STRICT AS
'SELECT ARRAY(SELECT json_array_elements_text(_js))';

INSERT INTO new_sports_events
SELECT
    ROW_NUMBER() OVER () AS id,
    j->>'game' AS game,
    j->>'sport' AS sport,
    j->>'event' AS event,
    json_array_to_text_array(CAST(j->>'gold' AS JSON)) AS gold,
    json_array_to_text_array(CAST(j->>'silver' AS JSON)) AS silver,
    json_array_to_text_array(CAST(j->>'bronze' AS JSON)) AS bronze
FROM (SELECT JSON_ARRAY_ELEMENTS(j) AS j FROM json_t) subj;
