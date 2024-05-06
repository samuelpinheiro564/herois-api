CREATE TABLE heros (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    power_values INTEGER NOT NULL,
    power_type VARCHAR(255) NOT NULL,
    hp INTEGER NOT NULL,
    attack INTEGER NOT NULL
);
INSERT INTO heros (name, power_values, power_type, hp, attack) VALUES ('Superman', 100, 'fortão', 000001, 100);
INSERT INTO heros (name, power_values, power_type, hp, attack) VALUES ('Batman', 50, 'intelligence', 500, 50);
INSERT INTO heros (name, power_values, power_type, hp, attack) VALUES ('Mulher Maravilha', 80, 'Amazona', 800, 80);  
INSERT INTO heros (name, power_values, power_type, hp, attack) VALUES ('Flash', 70, 'Velocidade', 700, 70);
INSERT INTO heros (name, power_values, power_type, hp, attack) VALUES ('Aquaman', 60, 'Atlantida', 600, 60);
INSERT INTO heros (name, power_values, power_type, hp, attack) VALUES ('Lanterna Verde', 90, 'Anel', 900, 90);
INSERT INTO heros (name, power_values, power_type, hp, attack) VALUES ('Ciborgue', 40, 'Tecnologia', 800, 40);
INSERT INTO heros (name, power_values, power_type, hp, attack) VALUES ('Shazam', 85, 'Magia', 8500, 85);
INSERT INTO heros (name, power_values, power_type, hp, attack) VALUES ('Arqueiro Verde', 55, 'Arqueiro', 550, 55);

CREATE TABLE batalhas (
    id INTEGER PRIMARY KEY,
    heros_p INTEGER NOT NULL,
   heros_s INTEGER NOT NULL,
    FOREIGN KEY (heros_p) REFERENCES heros(id),
    FOREIGN KEY (heros_s) REFERENCES heros(id)
);

INSERT INTO batalhas (id,heros_p, heros_s) VALUES (1,1, 2);

CREATE OR REPLACE FUNCTION obter_vencedor_batalha(batalha_id INTEGER)
RETURNS VARCHAR(255) AS
$$
DECLARE
    winner_name VARCHAR(255);
BEGIN
    
    SELECT CASE
               WHEN (h1.attack + h1.power_values) > (h2.attack + h2.power_values) THEN h1.name
               WHEN (h1.attack + h1.power_values) < (h2.attack + h2.power_values) THEN h2.name
               ELSE 'Empate'
           END INTO winner_name
    FROM batalhas AS b
    INNER JOIN heros AS h1 ON b.heros_p = h1.id
    INNER JOIN heros AS h2 ON b.heros_s = h2.id
    WHERE b.id = batalha_id;

    RETURN winner_name;
END;
$$
LANGUAGE plpgsql;

SELECT FROM obter_vencedor_batalha(1);