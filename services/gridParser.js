// ✅ Fonction pour convertir lettre colonne → index
function colToIndex(column) {

    let index = 0;

    for (let i = 0; i < column.length; i++) {
        index = index * 26 + (column.charCodeAt(i) - 64);
    }

    return index - 1;
}

/**
 * Parser les étudiants
 */
function parseStudents(rows, config) {

    const students = [];

    const nomIndex = colToIndex(config.columns.nom);
    const matriculeIndex = colToIndex(config.columns.matricule);
    const mentionIndex = colToIndex(config.columns.mention);
    const decisionIndex = colToIndex(config.columns.decision_annuelle);
    const moyenneIndex = colToIndex(config.columns.moyenne_annuelle);

    for (let i = config.startRow - 1; i < rows.length; i++) {

        const row = rows[i];
       

        if (!row || !row[matriculeIndex]) continue;

        const student = {
            nom: row[nomIndex],
            matricule: row[matriculeIndex],
            semestres: [],
            annuel: {
                moyenne: row[moyenneIndex],
                mention: row[mentionIndex],
                decision: row[decisionIndex]
            }
        };

        students.push(student);
    }

    return students;
}

// ✅ TRÈS IMPORTANT : export correct
module.exports = parseStudents;