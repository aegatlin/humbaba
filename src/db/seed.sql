DROP TABLE IF EXISTS list;

CREATE TABLE list (
  id SERIAL,
  name VARCHAR(255)
);

INSERT INTO list (name)
VALUES ('my list');
