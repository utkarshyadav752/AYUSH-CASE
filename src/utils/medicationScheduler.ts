import { AyushCaseSheet } from '../types/ayush';

export interface PrescribedMedicationAlert {
  id: string;
  medicineName: string;
  dosage: string;
  targetTime: string; // "07:30", "08:30", "13:00", "20:00", "21:30"
  formattedTime: string; // "08:30 AM"
  period: 'morning' | 'afternoon' | 'evening' | 'night';
  instructions: string;
  anupana: string;
  formType: 'pill' | 'liquid' | 'powder' | 'water';
  colorHex: string;
  urgency: 'high' | 'normal';
}

/**
 * Derives timed alerts from prescriptions listed in an AyushCaseSheet
 */
export function extractMedicationScheduleFromCaseSheet(caseSheet: AyushCaseSheet | null): PrescribedMedicationAlert[] {
  if (!caseSheet || !caseSheet.prescriptions || caseSheet.prescriptions.length === 0) {
    // Default standard clinical prescription schedule for Amavata / Ayush patient
    return [
      {
        id: 'rx-alert-1',
        medicineName: 'Dashamoola Kwatha',
        dosage: '20 ml with 40 ml lukewarm water',
        targetTime: '07:30',
        formattedTime: '07:30 AM',
        period: 'morning',
        instructions: 'Drink on empty stomach before breakfast to kindle Agni.',
        anupana: 'Lukewarm water',
        formType: 'liquid',
        colorHex: '#d97706',
        urgency: 'high'
      },
      {
        id: 'rx-alert-2',
        medicineName: 'Kaishore Guggulu (Morning Dose)',
        dosage: '2 round tablets',
        targetTime: '08:30',
        formattedTime: '08:30 AM',
        period: 'morning',
        instructions: 'Take 20 mins after breakfast with warm water. Do not skip.',
        anupana: 'Warm water',
        formType: 'pill',
        colorHex: '#059669',
        urgency: 'high'
      },
      {
        id: 'rx-alert-3',
        medicineName: 'Warm Water Hydration (Ushnodaka)',
        dosage: '1 Glass (250 ml)',
        targetTime: '11:00',
        formattedTime: '11:00 AM',
        period: 'morning',
        instructions: 'Hydrate to flush Ama endotoxins and soothe joint inflammation.',
        anupana: 'Warm water',
        formType: 'water',
        colorHex: '#0284c7',
        urgency: 'normal'
      },
      {
        id: 'rx-alert-4',
        medicineName: 'Kaishore Guggulu (Night Dose)',
        dosage: '2 round tablets',
        targetTime: '20:30',
        formattedTime: '08:30 PM',
        period: 'night',
        instructions: 'Take 20 mins after light dinner with lukewarm water.',
        anupana: 'Warm water',
        formType: 'pill',
        colorHex: '#059669',
        urgency: 'high'
      },
      {
        id: 'rx-alert-5',
        medicineName: 'Ashwagandha Churna',
        dosage: '1 teaspoon (3g - 5g)',
        targetTime: '21:30',
        formattedTime: '09:30 PM',
        period: 'night',
        instructions: 'Stir into half cup warm milk or water before sleep.',
        anupana: 'Warm milk / water',
        formType: 'powder',
        colorHex: '#7c3aed',
        urgency: 'high'
      }
    ];
  }

  // Parse dynamically from caseSheet.prescriptions
  const alerts: PrescribedMedicationAlert[] = [];
  caseSheet.prescriptions.forEach((rx, idx) => {
    const isKwatha = /kwatha|kashayam|liquid|decoction|arishta/i.test(rx);
    const isChurna = /churna|powder|bhasma/i.test(rx);
    const isGugguluOrVati = /guggulu|vati|tablet|capsule|gutika/i.test(rx);
    const isNight = /bedtime|night|dinner|sone se pehle|ratre/i.test(rx);

    const targetTime = isKwatha ? '07:30' : isNight ? '21:30' : idx % 2 === 0 ? '08:30' : '20:30';
    const formattedTime = targetTime === '07:30' ? '07:30 AM' : targetTime === '08:30' ? '08:30 AM' : targetTime === '20:30' ? '08:30 PM' : '09:30 PM';

    alerts.push({
      id: `case-rx-${idx}`,
      medicineName: rx.split(' - ')[0] || rx.split(',')[0] || rx,
      dosage: rx.includes('tablet') ? '2 Tablets' : rx.includes('ml') ? '20 ml' : '1 Teaspoon',
      targetTime,
      formattedTime,
      period: isNight ? 'night' : targetTime.startsWith('07') || targetTime.startsWith('08') ? 'morning' : 'evening',
      instructions: rx,
      anupana: rx.includes('milk') ? 'Warm Milk' : 'Lukewarm Water',
      formType: isKwatha ? 'liquid' : isChurna ? 'powder' : 'pill',
      colorHex: isKwatha ? '#d97706' : isChurna ? '#7c3aed' : '#059669',
      urgency: 'high'
    });
  });

  return alerts;
}
