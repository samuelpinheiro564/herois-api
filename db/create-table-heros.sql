CREATE TABLE heros (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    power_values INTEGER NOT NULL,
    power_type VARCHAR(255) NOT NULL,
    hp INTEGER NOT NULL,
    attack INTEGER NOT NULL,
);