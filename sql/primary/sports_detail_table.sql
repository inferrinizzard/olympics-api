CREATE TABLE IF NOT EXISTS sports_detail (
    sport       VARCHAR(3) PRIMARY KEY,
    name        VARCHAR(20) NOT NULL,
    icon        VARCHAR(20) NOT NULL
);

COMMENT ON TABLE sports_detail IS 'Main Sports table, holds all sports details';
COMMENT ON COLUMN sports_detail.sport IS 'IOC Sport Code';
COMMENT ON COLUMN sports_detail.name IS 'Sport Name';
COMMENT ON COLUMN sports_detail.icon IS 'Sport Icon URL';
