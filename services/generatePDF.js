let puppeteer;

async function loadPuppeteer() {
    if (!puppeteer) {
        puppeteer = await import('puppeteer');
    }
}
const db = require('../db');
const fs = require('fs');
const path = require('path');
const generateCouponHTML = require('../templates/couponTemplate');

async function generatePDF(session_id) {

    await loadPuppeteer();

    // ✅ 1. Lire session
    const [sessionRows] = await db.promise().query(
        "SELECT * FROM sessions WHERE id = ?",
        [session_id]
    );

    if (!sessionRows.length) {
        throw new Error("Session introuvable");
    }

    const session = sessionRows[0];

    // ✅ 2. Lire étudiants
    const [students] = await db.promise().query(
        "SELECT * FROM etudiants WHERE session_id = ?",
        [session_id]
    );

    if (!students.length) {
        throw new Error("Aucun étudiant trouvé pour cette session");
    }

    // ✅ 3. Construire HTML global
    let fullHTML = `
    <html>
    <head>
        <meta charset="UTF-8">
    </head>
    <body>
    `;

    for (let s of students) {

        const studentData = JSON.parse(s.data_json);

        // ✅ Générer page étudiant
        const studentHTML = generateCouponHTML(session, studentData);

        fullHTML += studentHTML;
    }

    fullHTML += `
    </body>
    </html>
    `;

    // ✅ 4. Lancer Puppeteer
    const browser = await puppeteer.default.launch({
    headless: true,
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
});

    const page = await browser.newPage();

    await page.setContent(fullHTML, {
        waitUntil: 'networkidle0'
    });

    // ✅ 5. Chemin PDF
    const fileName = `${session.code_session}.pdf`;
    const filePath = path.join(__dirname, '../archives', fileName);

    // ✅ 6. Générer PDF
    await page.pdf({
        path: filePath,
        format: 'A4',
        printBackground: true
    });

    await browser.close();

    return {
        message: "PDF généré avec succès ✅",
        file: fileName
    };
}

module.exports = generatePDF;