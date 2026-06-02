/* STRUCTURE HTML PROFESSIONNELLE */
function generateCouponHTML(session, studentData) {

return `
<html>
<head>
<style>

body {
    font-family: Arial, sans-serif;
    font-size: 12px;
}

.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.logo {
    width: 70px;
}

.header-center {
    text-align: center;
    flex: 1;
}

.title {
    text-align: center;
    font-weight: bold;
    margin-top: 10px;
    margin-bottom: 10px;
}

.student-info {
    margin-bottom: 10px;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 10px;
}

th, td {
    border: 1px solid black;
    padding: 4px;
    text-align: center;
}

th {
    background-color: #e6e6e6;
}

.section-title {
    background-color: #2f4f6f;
    color: white;
    padding: 5px;
    text-align: center;
    font-weight: bold;
}

.total-row {
    background-color: #f2c57c;
    font-weight: bold;
}

.annuel {
    background-color: #f4d7a1;
}

.signature {
    margin-top: 30px;
    display: flex;
    justify-content: space-between;
}

.student-page {
    page-break-after: always;
}

</style>
</head>

<body>

<div class="student-page">

    <!-- HEADER -->
    <div class="header">
        <img src="logo.png" class="logo" />

        <div class="header-center">
            <strong>REPUBLIQUE DEMOCRATIQUE DU CONGO</strong><br>
            <strong>${session.universite}</strong><br>
            <span>${session.faculte}</span><br>
            <span>Département ${session.departement}</span><br>
            <span>Année académique ${session.annee}</span>
        </div>
    </div>

    <div class="title">
        RELEVÉ DE NOTES N° 1
    </div>

    <!-- IDENTIFICATION -->
    <div class="student-info">
        <strong>NOM ET POSTNOM :</strong> ${studentData.nom}
    </div>

    <!-- SEMESTRE 1 -->
    <div class="section-title">SEMESTRE 1</div>
    ${generateSemestreTable(studentData.semestre1)}

    <!-- SEMESTRE 2 -->
    <div class="section-title">SEMESTRE 2</div>
    ${generateSemestreTable(studentData.semestre2)}

    <!-- ANNUEL -->
    <div class="section-title">TOTAL ANNUEL</div>
    ${generateAnnuelTable(studentData.annuel)}

    <!-- SIGNATURE -->
    <div class="signature">
        <div>
            Président du Jury<br><br>
            ${session.jury_president}
        </div>

        <div>
            Secrétaire du Jury<br><br>
            ${session.jury_secretaire}
        </div>
    </div>

</div>

</body>
</html>
`;
}




/* TABLE SEMESTRE DYNAMIQUE */
function generateSemestreTable(semestre) {

let rows = `
<table>
<tr>
    <th>Code UE</th>
    <th>Intitulé</th>
    <th>Cat</th>
    <th>CC</th>
    <th>Crédit</th>
    <th>Cotes P</th>
</tr>
`;

semestre.ues.forEach(ue => {

    // ✅ Ligne UE principale
    rows += `
    <tr>
        <td><strong>${ue.code}</strong></td>
        <td style="text-align:left"><strong>${ue.intitule}</strong></td>
        <td>${ue.categorie}</td>
        <td>${ue.cc}</td>
        <td>${ue.credit}</td>
        <td>${ue.cotePonderee}</td>
    </tr>
    `;

    // ✅ Lignes EC
    ue.ecs.forEach(ec => {

        rows += `
        <tr>
            <td></td>
            <td style="text-align:left; padding-left:20px;">
                - ${ec.intitule}
            </td>
            <td></td>
            <td>${ec.note ?? ''}</td>
            <td>${ec.credit ?? ''}</td>
            <td></td>
        </tr>
        `;
    });

});

rows += `
<tr class="total-row">
    <td colspan="4">TOTAL</td>
    <td>${semestre.creditsCapitalises}</td>
    <td>${semestre.totalCredits}</td>
</tr>

<tr>
    <td colspan="6">Moyenne Catégorie A : ${semestre.moyenneCategorieA}</td>
</tr>

<tr>
    <td colspan="6">Moyenne du Semestre : ${semestre.moyenneSemestre}</td>
</tr>

<tr>
    <td colspan="6">Décision : ${semestre.decision}</td>
</tr>
`;

rows += `</table>`;

return rows;
}




/* TABLE ANNUELLE */
function generateAnnuelTable(annuel) {

return `
<table class="annuel">
<tr><td>Total Annuel</td><td>${annuel.totalAnnuel}</td></tr>
<tr><td>Moyenne Catégorie A</td><td>${annuel.moyCategorieA}</td></tr>
<tr><td>Moyenne Annuelle</td><td>${annuel.moyAnnuel}</td></tr>
<tr><td>Pourcentage</td><td>${annuel.pourcentage}</td></tr>
<tr><td>Crédits Validés</td><td>${annuel.credits}</td></tr>
<tr><td>Mention</td><td>${annuel.mention}</td></tr>
<tr><td>Décision Finale</td><td><strong>${annuel.decision}</strong></td></tr>
</table>
`;
}


/* EXPORT */
module.exports = generateCouponHTML;
