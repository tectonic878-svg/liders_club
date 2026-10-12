import JSZip from 'jszip';
import { StudentApplication } from '../types';

/**
 * Generates an official Microsoft Word (.doc) document
 * with HTML formatting compatible with MS Word, LibreOffice, and Google Docs.
 */
export function generateWordDocumentBlob(app: StudentApplication): Blob {
  const essayContent =
    app.leadershipAnswers.essay ||
    app.leadershipAnswers.motivation ||
    'Yozma javob kiritilmagan';

  const booksHtml =
    app.recentBooks.length > 0
      ? app.recentBooks
          .map(
            (b, i) => `
          <tr style="background-color: ${i % 2 === 0 ? '#ffffff' : '#f8fafc'};">
            <td style="padding: 8px; border: 1px solid #cbd5e1; font-weight: bold;">#${i + 1} ${escapeXml(b.title)}</td>
            <td style="padding: 8px; border: 1px solid #cbd5e1;">${escapeXml(b.author)}</td>
            <td style="padding: 8px; border: 1px solid #cbd5e1; font-style: italic;">"${escapeXml(b.keyTakeaway)}"</td>
          </tr>`
          )
          .join('')
      : '<tr><td colspan="3" style="padding: 8px; border: 1px solid #cbd5e1;">Kitoblar kiritilmagan</td></tr>';

  const achievementsHtml =
    app.achievements.length > 0
      ? app.achievements
          .map(
            (ach, i) => `
          <div style="margin-bottom: 12px; padding: 10px; background-color: #f8fafc; border-left: 4px solid #d97706; border-radius: 4px;">
            <p style="margin: 0 0 4px 0; font-size: 13pt; font-weight: bold; color: #0f172a;">${i + 1}. ${escapeXml(ach.title)} (${escapeXml(ach.year)})</p>
            <p style="margin: 0 0 4px 0; font-size: 10pt; color: #475569;">Tashkilot: ${escapeXml(ach.organization)} | Toifa: ${escapeXml(ach.category)}</p>
            <p style="margin: 0; font-size: 10.5pt; color: #1e293b;">${escapeXml(ach.description)}</p>
            ${ach.certificateFileName ? `<p style="margin: 4px 0 0 0; font-size: 9.5pt; color: #0369a1; font-weight: bold;">Ilova fayl: ${escapeXml(ach.certificateFileName)}</p>` : ''}
          </div>`
          )
          .join('')
      : '<p style="color: #64748b; font-style: italic;">Yutuqlar kiritilmagan</p>';

  const docHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${escapeXml(app.fullName)} - UBS Leaders Club Arizasi</title>
      <style>
        body {
          font-family: 'Calibri', 'Arial', sans-serif;
          font-size: 11pt;
          line-height: 1.5;
          color: #0f172a;
          margin: 30px;
        }
        h1 {
          font-size: 18pt;
          color: #1e3a8a;
          margin-bottom: 4px;
          border-bottom: 2px solid #d97706;
          padding-bottom: 6px;
        }
        h2 {
          font-size: 13pt;
          color: #b45309;
          margin-top: 18px;
          margin-bottom: 8px;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 4px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 8px;
          margin-bottom: 14px;
        }
        th {
          background-color: #f1f5f9;
          color: #1e293b;
          text-align: left;
          padding: 8px;
          border: 1px solid #cbd5e1;
          font-size: 10pt;
        }
        .essay-box {
          background-color: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          padding: 14px;
          margin-top: 6px;
          line-height: 1.6;
          font-size: 11pt;
          white-space: pre-wrap;
        }
        .meta-table td {
          padding: 6px 8px;
          border: 1px solid #e2e8f0;
          font-size: 10.5pt;
        }
        .meta-label {
          font-weight: bold;
          background-color: #f8fafc;
          width: 25%;
        }
      </style>
    </head>
    <body>
      <h1>UBS LEADERS CLUB · NOMZOD HUJJATI VA YOZMA JAVOBLARI</h1>
      <p style="font-size: 10pt; color: #64748b; margin-top: 0;">
        Ariza ID: <strong>${escapeXml(app.id)}</strong> | Topshirilgan sana: ${app.submittedAt ? new Date(app.submittedAt).toLocaleDateString('uz-UZ') : 'Qoralama'}
      </p>

      <h2>1. NOMZOD HAQIDA UMUMIY MA'LUMOTLAR</h2>
      <table class="meta-table">
        <tr>
          <td class="meta-label">F.I.SH:</td>
          <td><strong>${escapeXml(app.fullName)}</strong></td>
          <td class="meta-label">Telefon:</td>
          <td><strong>${escapeXml(app.phoneNumber)}</strong></td>
        </tr>
        <tr>
          <td class="meta-label">Ta'lim yo'nalishi:</td>
          <td>${escapeXml(app.direction || app.faculty || 'Ko\'rsatilmagan')}</td>
          <td class="meta-label">Kursi:</td>
          <td>${escapeXml(app.course)}</td>
        </tr>
        <tr>
          <td class="meta-label">Ta'lim shakli:</td>
          <td>Kunduzgi</td>
          <td class="meta-label">Guruh / GPA:</td>
          <td>${escapeXml(app.groupNumber || '-')} / ${escapeXml(app.gpa || '-')}</td>
        </tr>
        <tr>
          <td class="meta-label">Jami o'qilgan kitoblar:</td>
          <td><strong>${app.totalBooksRead || 0} ta</strong></td>
          <td class="meta-label">Ariza holati:</td>
          <td><strong>${escapeXml(app.status)}</strong></td>
        </tr>
      </table>

      <h2>2. YOZMA JAVOB: LIDERLIK VA MOTIVATSIYA BAYONI (INSHO)</h2>
      <p style="font-size: 10pt; color: #475569; font-style: italic; margin-bottom: 6px;">
        Savol: O'zingiz, liderlik qarashlaringiz va UBS Leaders Club'ga a'zo bo'lish maqsadingiz haqida yozma bayon:
      </p>
      <div class="essay-box">
${escapeXml(essayContent)}
      </div>

      <h2>3. MUTOLAA TAHLILI (SO'NGGI O'QILGAN KITOB XULOSALARI)</h2>
      <p style="font-size: 10pt; color: #475569; margin-bottom: 6px;">
        Nomzod tomonidan kiritilgan kitoblar va olingan asosiy xulosalar:
      </p>
      <table>
        <thead>
          <tr>
            <th style="width: 30%;">Kitob Nomi</th>
            <th style="width: 25%;">Muallifi</th>
            <th style="width: 45%;">Asosiy Saboq / Xulosa</th>
          </tr>
        </thead>
        <tbody>
          ${booksHtml}
        </tbody>
      </table>

      <h2>4. ERISHILGAN YUTUQLAR VA SERTIFIKATLAR</h2>
      ${achievementsHtml}

      <div style="margin-top: 30px; border-top: 1px solid #cbd5e1; padding-top: 8px; font-size: 9pt; color: #64748b; text-align: center;">
        Ushbu hujjat UBS Leaders Club 2026-yilgi saralov tizimidan avtomatik shakllantirildi.
      </div>
    </body>
    </html>
  `;

  return new Blob(['\ufeff', docHtml], {
    type: 'application/msword;charset=utf-8;',
  });
}

function escapeXml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Downloads a Blob directly to the client browser
 */
export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Generates a ZIP archive containing:
 * 1. Word document (.doc) with all responses and applicant data
 * 2. Uploaded certificate files in a Sertifikatlar/ folder
 * 3. Text summary file
 */
export async function generateApplicantZip(app: StudentApplication): Promise<Blob> {
  const zip = new JSZip();

  // 1. Add Word document
  const wordBlob = generateWordDocumentBlob(app);
  const wordBuffer = await wordBlob.arrayBuffer();
  const safeName = app.fullName.replace(/[^a-zA-Z0-9_\u0400-\u04FF]/g, '_');
  zip.file(`${safeName}_Yozma_Javoblar.doc`, wordBuffer);

  // 2. Add text summary
  const summaryText = `UBS LEADERS CLUB - NOMZOD HUJJATI
========================================
F.I.SH: ${app.fullName}
Telefon: ${app.phoneNumber}
ID: ${app.id}
Yo'nalish: ${app.direction || app.faculty}
Kurs: ${app.course}
Ta'lim shakli: Kunduzgi
GPA: ${app.gpa || '-'}
Guruh: ${app.groupNumber || '-'}
Jami o'qilgan kitoblar soni: ${app.totalBooksRead || 0}
Status: ${app.status}
Topshirilgan vaqt: ${app.submittedAt || 'Qoralama'}

YOZMA INSHO VA LIDERLIK BAYONI:
----------------------------------------
${app.leadershipAnswers.essay || app.leadershipAnswers.motivation || 'Kiritilmagan'}

KITOB TAQRIZLARI (${app.recentBooks.length} ta):
----------------------------------------
${app.recentBooks
  .map(
    (b, i) =>
      `${i + 1}. "${b.title}" - ${b.author}\n   Xulosa: ${b.keyTakeaway}`
  )
  .join('\n\n')}

YUTUQLAR VA SERTIFIKATLAR (${app.achievements.length} ta):
----------------------------------------
${app.achievements
  .map(
    (a, i) =>
      `${i + 1}. ${a.title} (${a.year})\n   Tashkilot: ${a.organization}\n   Toifa: ${a.category}\n   Tavsif: ${a.description}${a.certificateFileName ? `\n   Fayl: ${a.certificateFileName}` : ''}`
  )
  .join('\n\n')}
`;
  zip.file(`${safeName}_Malumotlar.txt`, summaryText);

  // 3. Add certificate files if available
  const certsFolder = zip.folder('Sertifikatlar');
  if (certsFolder) {
    app.achievements.forEach((ach, index) => {
      if (ach.certificateFileData) {
        try {
          const match = ach.certificateFileData.match(/^data:(.*?);base64,(.*)$/);
          if (match && match[2]) {
            const base64Data = match[2];
            const originalFileName =
              ach.certificateFileName ||
              `sertifikat_${index + 1}.${ach.certificateFileType?.includes('pdf') ? 'pdf' : 'png'}`;
            certsFolder.file(originalFileName, base64Data, { base64: true });
          }
        } catch (err) {
          console.error('Error adding certificate to zip:', err);
        }
      }
    });
  }

  return await zip.generateAsync({ type: 'blob' });
}

/**
 * Generates a master ZIP containing all applicants' dossiers
 */
export async function generateAllApplicantsMasterZip(apps: StudentApplication[]): Promise<Blob> {
  const masterZip = new JSZip();

  for (const app of apps) {
    const safeName = `${app.id}_${app.fullName.replace(/[^a-zA-Z0-9_\u0400-\u04FF]/g, '_')}`;
    const applicantFolder = masterZip.folder(safeName);

    if (applicantFolder) {
      // Add Word Doc
      const wordBlob = generateWordDocumentBlob(app);
      const wordBuffer = await wordBlob.arrayBuffer();
      applicantFolder.file(`${safeName}_Yozma_Javoblar.doc`, wordBuffer);

      // Add certificates
      const certsFolder = applicantFolder.folder('Sertifikatlar');
      if (certsFolder) {
        app.achievements.forEach((ach, index) => {
          if (ach.certificateFileData) {
            try {
              const match = ach.certificateFileData.match(/^data:(.*?);base64,(.*)$/);
              if (match && match[2]) {
                const base64Data = match[2];
                const originalFileName =
                  ach.certificateFileName ||
                  `sertifikat_${index + 1}.${ach.certificateFileType?.includes('pdf') ? 'pdf' : 'png'}`;
                certsFolder.file(originalFileName, base64Data, { base64: true });
              }
            } catch (err) {
              console.error('Error adding certificate to zip:', err);
            }
          }
        });
      }
    }
  }

  return await masterZip.generateAsync({ type: 'blob' });
}
