DROP TABLE IF EXISTS players;

CREATE TABLE players (
    user_id SERIAL PRIMARY KEY,
    name TEXT,
    score INTEGER
);