export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'patient' | 'doctor' | 'admin';
  abhaId?: string;
  age?: number;
  gender?: 'Male' | 'Female' | 'Other';
  bloodGroup?: string;
  city?: string;
  registeredDate: string;
  prakritiBaseline?: string;
  pastCaseCount: number;
}

export const DEMO_USERS: UserAccount[] = [
  {
    id: 'USR-PAT-001',
    name: 'Sunita Sharma',
    email: 'sunita.sharma@example.com',
    phone: '+91 98765 43210',
    role: 'patient',
    abhaId: '91-4829-1029-3841',
    age: 46,
    gender: 'Female',
    bloodGroup: 'B+',
    city: 'Jaipur, Rajasthan',
    registeredDate: '2026-02-14',
    prakritiBaseline: 'Vata-Kapha Prakriti',
    pastCaseCount: 3
  },
  {
    id: 'USR-PAT-002',
    name: 'Rajesh Verma',
    email: 'rajesh.verma@example.com',
    phone: '+91 98111 22334',
    role: 'patient',
    abhaId: '91-8842-9901-1120',
    age: 34,
    gender: 'Male',
    bloodGroup: 'O+',
    city: 'New Delhi',
    registeredDate: '2026-04-10',
    prakritiBaseline: 'Pitta-Vata Prakriti',
    pastCaseCount: 1
  },
  {
    id: 'USR-DOC-101',
    name: 'Dr. A. K. Vaidyanathan, MD (Ayur)',
    email: 'dr.vaidyanathan@ayush.gov.in',
    phone: '+91 94440 12345',
    role: 'doctor',
    abhaId: 'HPR-AYU-DEL-9982',
    city: 'All India Institute of Ayurveda (AIIA), New Delhi',
    registeredDate: '2024-01-01',
    pastCaseCount: 1420
  }
];
