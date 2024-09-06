CREATE TABLE IF NOT EXISTS country_detail (
    code        VARCHAR(3) PRIMARY KEY,
    name        TEXT NOT NULL,
    page_name   TEXT NOT NULL,
    status      VARCHAR(10) NOT NULL
);

COMMENT ON TABLE country_detail IS 'Main Country table, holds all country details';
COMMENT ON COLUMN country_detail.code IS 'Country Code';
COMMENT ON COLUMN country_detail.name IS 'Country Name';
COMMENT ON COLUMN country_detail.page_name IS 'Country Wikipedia page name';
COMMENT ON COLUMN country_detail.status IS 'If code is active, special, or historic';
