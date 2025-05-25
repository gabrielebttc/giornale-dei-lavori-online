-- Creazione della tabella user_type
CREATE TABLE user_type (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Creazione della tabella users con link ai profili social
CREATE TABLE "users" (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15)
);

-- Creazione della tabella user_user_type
CREATE TABLE users_user_type (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    user_type_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES "users" (id) ON DELETE CASCADE,
    FOREIGN KEY (user_type_id) REFERENCES user_type (id) ON DELETE CASCADE
);

-- Creazione della tabella building_sites
CREATE TABLE building_sites (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    notes TEXT,
    city VARCHAR(100),
    address VARCHAR(255),
    latitude DECIMAL(9, 6),
    longitude DECIMAL(9, 6)
);

-- Creazione della tabella daily_notes
CREATE TABLE daily_notes (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    building_site_id INT NOT NULL,
    notes TEXT,
    other_notes TEXT,
    FOREIGN KEY (building_site_id) REFERENCES building_sites (id) ON DELETE CASCADE
);

CREATE TABLE users_bulding_sites (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    city_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES "users" (id) ON DELETE CASCADE,
    FOREIGN KEY (city_id) REFERENCES cities (id) ON DELETE CASCADE
); -- da sistemare site_id

-- Nuove tabelle

-- Tabella companies
CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    notes TEXT
);

-- Tabella users_companies
CREATE TABLE users_companies (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    company_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES "users" (id) ON DELETE CASCADE,
    FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE
);

-- Tabella daily_presences
CREATE TABLE daily_presences (
    id SERIAL PRIMARY KEY,
    building_site_id INT NOT NULL,
    user_id INT NOT NULL,
    date DATE NOT NULL,
    is_present VARCHAR(20) NOT NULL CHECK (is_present IN ('present', 'absent', 'not_required')),
    notes TEXT,
    FOREIGN KEY (building_site_id) REFERENCES building_sites (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES "users" (id) ON DELETE CASCADE
);

-- Tabella teams
CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Tabella users_teams
CREATE TABLE users_teams (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    team_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES "users" (id) ON DELETE CASCADE,
    FOREIGN KEY (team_id) REFERENCES teams (id) ON DELETE CASCADE
);

-- Inserimento dei valori nella tabella user_type
INSERT INTO user_type (name) VALUES
('admin'),
('muratore');