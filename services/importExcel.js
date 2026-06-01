const db = require('../db');
const readExcel = require('./excelReader');
const parseStudents = require('./gridParser');
const crypto = require('crypto');

function generateCode() {
    return crypto.randomBytes(2).toString('hex').toUpperCase();
}

async function importExcel(filePath) {

    // ✅ 1. Lire Excel
    const rows = readExcel(filePath);

    // ✅ 2. Parser étudiants
    const students = parseStudents(rows);

    // ✅ 3. Infos session
    const departement = "DIPA";
    const annee = "2025-2026";
    const code_session = `${departement}_${annee}`;
    const universite = "UNIVERSITE DE KINSHASA";
    const faculte_filiere = "FILIERE DES SCIENCES JURIDIQUES";
    const niveau = "MASTER 1";
    const bureau_jury = "Bureau du jury de M1 Droit International Public Africain";
    const jury_president = "Pr. Barthélémy OMEONGA TONGOMO";
    const jury_secretaire = "Pr. Nadine MUNDALA WALO";
    const lieu = "Kinshasa";

    // ✅ 4. Vérifier si session existe
    let [sessionRows] = await db.promise().query(
        "SELECT * FROM sessions WHERE code_session = ?",
        [code_session]
    );

    let session_id;

    if (!sessionRows.length) {

        const [insert] = await db.promise().query(
            "INSERT INTO sessions (code_session, departement, annee, universite, faculte, jury_president, jury_secretaire, lieu) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [code_session, departement, annee, universite, faculte, jury_president, jury_secretaire, lieu]
        );

        session_id = insert.insertId;

    } else {
        session_id = sessionRows[0].id;
    }

    // ✅ 5. INSERT ou UPDATE étudiants

    for (let student of students) {

        const matricule = student.matricule || student.nom;
        const nom = student.nom;
        const data_json = JSON.stringify(student);

        const [existing] = await db.promise().query(
            "SELECT * FROM etudiants WHERE matricule = ? AND session_id = ?",
            [matricule, session_id]
        );

        if (!existing.length) {

            const code_secret = generateCode();

            await db.promise().query(
                "INSERT INTO etudiants (session_id, matricule, nom, code_secret, data_json) VALUES (?, ?, ?, ?, ?)",
                [session_id, matricule, nom, code_secret, data_json]
            );

        } else {

            await db.promise().query(
                "UPDATE etudiants SET data_json = ?, updated_at = NOW() WHERE id = ?",
                [data_json, existing[0].id]
            );
        }
    }

    return {
        message: "Importation terminée ✅",
        total: students.length
    };
}

module.exports = importExcel;