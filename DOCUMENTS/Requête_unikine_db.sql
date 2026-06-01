CREATE TABLE sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code_session VARCHAR(100),
    departement VARCHAR(100),
    annee VARCHAR(20),
    date_creation DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE etudiants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT,
    matricule VARCHAR(50),
    nom VARCHAR(150),
    code_secret VARCHAR(10),
    data_json LONGTEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES sessions(id)
);

CREATE TABLE configurations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    universite VARCHAR(100),
    faculte VARCHAR(100),
    departement VARCHAR(100),
    type_grille VARCHAR(50),
    configuration_json LONGTEXT
);