CREATE TABLE IF NOT EXISTS sports_detail (
    code        VARCHAR(5) PRIMARY KEY,
    name        VARCHAR(30) NOT NULL,
    category    VARCHAR(15) NOT NULL,
    parent      VARCHAR(5),
    status      VARCHAR(15),
    season      VARCHAR(6),
    page_name   TEXT
);

COMMENT ON TABLE sports_detail IS 'Main Sports table, holds all sports details';
COMMENT ON COLUMN sports_detail.code IS 'IOC/IPC Sport Code';
COMMENT ON COLUMN sports_detail.name IS 'Sport Name';
COMMENT ON COLUMN sports_detail.category IS 'Sport or Discipline';
COMMENT ON COLUMN sports_detail.parent IS 'Parent sport, if is Discipline';
COMMENT ON COLUMN sports_detail.status IS 'If sport is active, other, unrecognised, NULL';
COMMENT ON COLUMN sports_detail.season IS 'Sport season, if active';
COMMENT ON COLUMN sports_detail.page_name IS 'Wikipedia page name';
