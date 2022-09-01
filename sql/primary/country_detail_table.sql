DROP TABLE IF EXISTS country_detail CASCADE;

CREATE TABLE IF NOT EXISTS country_detail (
    country     VARCHAR(3) PRIMARY KEY,
    name        VARCHAR(50) NOT NULL,
    icon        TEXT NOT NULL,
    flag        TEXT NOT NULL,
    status      VARCHAR(10) NOT NULL
);

COMMENT ON TABLE country_detail IS 'Main Country table, holds all country details';
COMMENT ON COLUMN country_detail.country IS 'Country Code';
COMMENT ON COLUMN country_detail.name IS 'Country Name';
COMMENT ON COLUMN country_detail.icon IS 'Country Icon URL';
COMMENT ON COLUMN country_detail.flag IS 'Country Flag URL';
COMMENT ON COLUMN country_detail.status IS 'If code is active, special, or historic';
