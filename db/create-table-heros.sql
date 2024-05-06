CREATE TABLE heros (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    power_values INTEGER NOT NULL,
    power_type VARCHAR(255) NOT NULL,
    hp INTEGER NOT NULL,
    attack INTEGER NOT NULL,
);
INSERT INTO heros (name, power_values, power_type, hp, attack) VALUES ('Superman', 100, 'Kriptonitaniano', 000001, 100);
INSERT INTO heros (name, power_values, power_type, hp, attack) VALUES ('Batman', 50, 'intelligence', 500, 50);
INSERT INTO heros (name, power_values, power_type, hp, attack) VALUES ('Mulher Maravilha', 80, 'Amazona', 800, 80);  
INSERT INTO heros (name, power_values, power_type, hp, attack) VALUES ('Flash', 70, 'Velocidade', 700, 70);
INSERT INTO heros (name, power_values, power_type, hp, attack) VALUES ('Aquaman', 60, 'Atlantida', 600, 60);
INSERT INTO heros (name, power_values, power_type, hp, attack) VALUES ('Lanterna Verde', 90, 'Anel', 900, 90);
INSERT INTO heros (name, power_values, power_type, hp, attack) VALUES ('Ciborgue', 40, 'Tecnologia', 800, 40);
INSERT INTO heros (name, power_values, power_type, hp, attack) VALUES ('Shazam', 85, 'Magia', 8500, 85);
INSERT INTO heros (name, power_values, power_type, hp, attack) VALUES ('Arqueiro Verde', 55, 'Arqueiro', 550, 55);

CREATE TABLE batalhas (
    id SERIAL PRIMARY KEY,
    1heros_id INTEGER NOT NULL,
   2heros_id INTEGER NOT NULL,
    winner VARCHAR(150) NOT NULL,
    FOREIGN KEY (1heros_id) REFERENCES heros(id),
    FOREIGN KEY (2heros_id) REFERENCES heros(id),
);

CREATE OR REPLACE FUNCTION determinar_e_inserir_batalha(hero1_id INTEGER, hero2_id INTEGER)
RETURNS VARCHAR(255) AS
$$
DECLARE
    hero1_name VARCHAR(255);
    hero1_attack INTEGER;
    hero1_hp INTEGER;
    hero2_name VARCHAR(255);
    hero2_attack INTEGER;
    hero2_hp INTEGER;
    winner VARCHAR(255);
BEGIN
    
    SELECT name, attack, hp INTO hero1_name, hero1_attack, hero1_hp FROM heros WHERE id = hero1_id;
    SELECT name, attack, hp INTO hero2_name, hero2_attack, hero2_hp FROM heros WHERE id = hero2_id;

    
    INSERT INTO batalhas ("1heros_id", "2heros_id", winner) VALUES (hero1_id, hero2_id, NULL) RETURNING id INTO winner;

   
    LOOP
        hero2_hp := hero2_hp - hero1_attack;
        hero1_hp := hero1_hp - hero2_attack;

        IF hero2_hp <= 0 AND hero1_hp <= 0 THEN
            winner := 'Empate';
            EXIT;
        ELSIF hero2_hp <= 0 THEN
            winner := hero1_name;
            EXIT;
        ELSIF hero1_hp <= 0 THEN
            winner := hero2_name;
            EXIT;
        END IF;
    END LOOP;

    -- Atualizar o vencedor da batalha na tabela batalhas
    UPDATE batalhas SET winner = winner WHERE id = winner;

    RETURN winner;
END;
$$
LANGUAGE plpgsql;

