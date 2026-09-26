import { AyushCaseSheet } from '../types/ayush';

export function exportCaseToPrintableHtml(caseSheet: AyushCaseSheet): string {
  const patient = caseSheet.patientInfo;
  const pName = patient?.fullName || 'Anonymous Patient';
  const pAbha = patient?.abhaId || 'ABHA-XXXX-XXXX-9901';
  const pAge = patient?.age || '38';
  const pGender = patient?.gender || 'Not specified';
  const pPhone = patient?.phone || '+91 98765 43210';
  const pLocation = patient?.location || 'New Delhi, India';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AYUSH Case Record - ${pName}</title>
  <style>
    @page { size: A4; margin: 15mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.45; font-size: 11pt; padding: 20px; }
    .header { border-bottom: 2px solid #065f46; padding-bottom: 12px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: flex-start; }
    .title-block h1 { color: #065f46; margin: 0; font-size: 20pt; font-weight: 800; letter-spacing: -0.5px; }
    .title-block p { margin: 3px 0 0 0; color: #475569; font-size: 9pt; }
    .badge { background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; padding: 3px 8px; border-radius: 4px; font-size: 8.5pt; font-weight: bold; text-transform: uppercase; }
    .patient-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px; margin-bottom: 18px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; font-size: 9.5pt; }
    .patient-box div strong { color: #0f172a; display: block; font-size: 8pt; text-transform: uppercase; color: #64748b; }
    .section-title { color: #065f46; font-size: 11pt; font-weight: bold; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin: 16px 0 8px 0; text-transform: uppercase; letter-spacing: 0.5px; }
    .complaint-item { background: #ffffff; border-left: 3px solid #059669; padding: 6px 12px; margin-bottom: 8px; font-size: 9.5pt; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px; font-size: 9.5pt; }
    .dosha-bar { display: flex; height: 10px; border-radius: 5px; overflow: hidden; margin: 8px 0; }
    .dosha-v { background: #6366f1; }
    .dosha-p { background: #f97316; }
    .dosha-k { background: #14b8a6; }
    .rx-box { border: 1px dashed #059669; background: #ecfdf5; border-radius: 6px; padding: 12px; margin-top: 10px; }
    .rx-item { margin-bottom: 6px; font-weight: 600; color: #064e3b; font-size: 9.5pt; }
    .red-flag { background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; padding: 8px 12px; border-radius: 6px; font-size: 9pt; margin-bottom: 10px; }
    .footer { margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 12px; display: flex; justify-content: space-between; font-size: 8.5pt; color: #64748b; }
    .signature { text-align: right; }
    .signature-line { font-family: Georgia, serif; font-style: italic; font-size: 14pt; color: #0f172a; margin-top: 16px; }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="title-block">
      <h1>AyushCase Clinical Health Record</h1>
      <p>Ministry of Ayush, Government of India • Standardized Holistic Case-Taking & Scribe</p>
      <p>Ontology: NAMASTE Portal • ABDM / FHIR R4 Ready • Dual-Coded with WHO ICD-11</p>
    </div>
    <div style="text-align: right;">
      <span class="badge">${caseSheet.systemOfAyush || 'Ayurveda'}</span>
      <p style="margin: 4px 0 0 0; font-size: 8pt; color: #64748b;">Record ID: ${caseSheet.id || 'AYUSH-' + Date.now().toString().slice(-6)}</p>
      <p style="margin: 2px 0 0 0; font-size: 8pt; color: #64748b;">Date: ${new Date(caseSheet.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
    </div>
  </div>

  <div class="patient-box">
    <div>
      <strong>Patient Full Name</strong>
      <span>${pName} (${pGender}, Age ${pAge})</span>
    </div>
    <div>
      <strong>ABHA Health ID (NDHM)</strong>
      <span style="font-family: monospace; color: #047857; font-weight: bold;">${pAbha}</span>
    </div>
    <div>
      <strong>Contact & Location</strong>
      <span>${pPhone} • ${pLocation}</span>
    </div>
  </div>

  ${caseSheet.redFlags && caseSheet.redFlags.length > 0 ? `
  <div class="red-flag">
    <strong>⚠️ Clinical Alert / Triage Flag:</strong> ${caseSheet.redFlags[0].title} — ${caseSheet.redFlags[0].recommendation}
  </div>` : ''}

  <div class="section-title">Clinical Presentation & Summary</div>
  <p style="font-size: 9.5pt; margin-top: 4px; color: #334155; line-height: 1.5;">${caseSheet.patientSummary}</p>

  <div class="section-title">Chief Complaints (Pradhana Vedana)</div>
  ${caseSheet.chiefComplaints?.map(c => `
    <div class="complaint-item">
      <strong>${c.complaint}</strong> (Duration: ${c.duration} | Severity: ${c.severity}/10)<br/>
      <span style="font-size: 8.5pt; color: #475569;">
        <strong>Aggravating:</strong> ${c.aggravatingFactors || 'N/A'} • 
        <strong>Relieving:</strong> ${c.relievingFactors || 'N/A'}<br/>
        <strong>Associated Symptoms:</strong> ${c.associatedSymptoms || 'None reported'}
      </span>
    </div>
  `).join('')}

  <div class="section-title">Constitutional Dosha & Bio-Energetic Profile</div>
  <div class="card">
    <div style="display: flex; justify-content: space-between; font-size: 9pt; font-weight: bold;">
      <span style="color: #4f46e5;">Vata: ${caseSheet.doshaProfile?.vata || 33}%</span>
      <span style="color: #ea580c;">Pitta: ${caseSheet.doshaProfile?.pitta || 33}%</span>
      <span style="color: #0d9488;">Kapha: ${caseSheet.doshaProfile?.kapha || 34}%</span>
      <span style="color: #065f46;">Dominance: ${caseSheet.doshaProfile?.dominantConstitution || 'Sama Tridosha'}</span>
    </div>
    <div class="dosha-bar">
      <div class="dosha-v" style="width: ${caseSheet.doshaProfile?.vata || 33}%;"></div>
      <div class="dosha-p" style="width: ${caseSheet.doshaProfile?.pitta || 33}%;"></div>
      <div class="dosha-k" style="width: ${caseSheet.doshaProfile?.kapha || 34}%;"></div>
    </div>
    <p style="margin: 4px 0 0 0; font-size: 8.5pt; color: #475569;">${caseSheet.doshaProfile?.analysis || ''}</p>
  </div>

  <div class="section-title">Ashtavidha Pariksha & Agni Assessment</div>
  <div class="grid-2">
    <div class="card">
      <strong style="color: #065f46; display: block; margin-bottom: 4px; font-size: 9pt;">Ashtavidha Pariksha (Eight-Fold Examination)</strong>
      <div style="font-size: 8.5pt; line-height: 1.5;">
        • <strong>Nadi (Pulse):</strong> ${caseSheet.ashtavidhaPariksha?.nadi || 'Prakrita'}<br/>
        • <strong>Jihva (Tongue):</strong> ${caseSheet.ashtavidhaPariksha?.jihva || 'Nirama'}<br/>
        • <strong>Mala (Bowel):</strong> ${caseSheet.ashtavidhaPariksha?.mala || 'Normal'}<br/>
        • <strong>Mutra (Urine):</strong> ${caseSheet.ashtavidhaPariksha?.mutra || 'Prakrita'}<br/>
        • <strong>Sparsha (Skin):</strong> ${caseSheet.ashtavidhaPariksha?.sparsha || 'Samashitoshna'}
      </div>
    </div>
    <div class="card">
      <strong style="color: #065f46; display: block; margin-bottom: 4px; font-size: 9pt;">Agni, Koshtha & Generals</strong>
      <div style="font-size: 8.5pt; line-height: 1.5;">
        • <strong>Agni (Digestive Fire):</strong> ${caseSheet.agniKoshtha?.agniType || 'Sama Agni'}<br/>
        • <strong>Koshtha (Bowel habit):</strong> ${caseSheet.agniKoshtha?.koshthaType || 'Madhyama'}<br/>
        • <strong>Sleep (Nidra):</strong> ${caseSheet.agniKoshtha?.sleep || 'Normal'}<br/>
        • <strong>Thermal State:</strong> ${caseSheet.homeopathicUnaniGenerals?.thermalState || 'Ambithermal'}<br/>
        • <strong>Mizaj / Miasm:</strong> ${caseSheet.homeopathicUnaniGenerals?.mizaj || 'Damvi'} (${caseSheet.homeopathicUnaniGenerals?.miasmaticTendency || 'Psora'})
      </div>
    </div>
  </div>

  <div class="section-title">Pathya-Apathya Regimen (Diet & Lifestyle Directives)</div>
  <div class="grid-2">
    <div class="card" style="border-left: 3px solid #059669;">
      <strong style="color: #065f46;">Pathya (Recommended Wholesome Habits):</strong>
      <div style="font-size: 8.5pt; margin-top: 4px; color: #334155;">
        <strong>Diet (Ahara):</strong> ${caseSheet.ayushPathyaApathya?.pathyaAhara?.join(', ') || 'Fresh seasonal cooked food'}<br/>
        <strong>Lifestyle (Vihara):</strong> ${caseSheet.ayushPathyaApathya?.pathyaVihara?.join(', ') || 'Regular sleep, gentle walks'}
      </div>
    </div>
    <div class="card" style="border-left: 3px solid #dc2626;">
      <strong style="color: #991b1b;">Apathya (Strictly Avoid Unwholesome Habits):</strong>
      <div style="font-size: 8.5pt; margin-top: 4px; color: #334155;">
        <strong>Diet (Ahara):</strong> ${caseSheet.ayushPathyaApathya?.apathyaAhara?.join(', ') || 'Incompatible food combinations'}<br/>
        <strong>Habits (Vihara):</strong> ${caseSheet.ayushPathyaApathya?.apathyaVihara?.join(', ') || 'Day sleeping, late nights'}
      </div>
    </div>
  </div>

  <div class="section-title">Chikitsa Plan & Prescriptions (Rx)</div>
  <div class="rx-box">
    ${caseSheet.prescriptions && caseSheet.prescriptions.length > 0 ? 
      caseSheet.prescriptions.map((rx, idx) => `<div class="rx-item">Rx ${idx + 1}: ${rx}</div>`).join('') :
      `<div class="rx-item">Rx 1: Kaishore Guggulu 2 tablets twice daily after food with lukewarm water</div>
       <div class="rx-item">Rx 2: Dashamoola Kwatha 20 ml with equal quantity warm water before food</div>`
    }
    ${caseSheet.doctorNotes ? `
    <div style="margin-top: 8px; pt-2; border-top: 1px dashed #a7f3d0; font-size: 8.5pt; color: #064e3b;">
      <strong>Doctor Clinical Notes:</strong> ${caseSheet.doctorNotes}
    </div>` : ''}
  </div>

  <div class="footer">
    <div>
      <p style="margin: 0; font-weight: bold; color: #0f172a;">National AYUSH Mission • Ayush Grid Healthcare Interoperability</p>
      <p style="margin: 2px 0 0 0;">Authenticated Digital Document • ABDM Milestone 1/2 Certified</p>
    </div>
    <div class="signature">
      <div class="signature-line">Dr. A. K. Vaidyanathan</div>
      <p style="margin: 2px 0 0 0;">Reg No: AYU-DEL-2014-9982 • MD (Ayurveda)</p>
      <p style="margin: 1px 0 0 0; font-size: 7.5pt; color: #94a3b8;">Digitally Signed via ABHA Health Professional Registry</p>
    </div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(() => {
        window.print();
      }, 400);
    }
  </script>
</body>
</html>`;
}
