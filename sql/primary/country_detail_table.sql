CREATE TABLE IF NOT EXISTS country_detail (
    country     VARCHAR(3) PRIMARY KEY,
    name        VARCHAR(20) NOT NULL,
    flag        VARCHAR(20) NOT NULL
);

COMMENT ON TABLE country_detail IS 'Main Country table, holds all country details';
COMMENT ON COLUMN country_detail.country IS 'Country Code';
COMMENT ON COLUMN country_detail.name IS 'Country Name';
COMMENT ON COLUMN country_detail.flag IS 'Country Flag URL';
