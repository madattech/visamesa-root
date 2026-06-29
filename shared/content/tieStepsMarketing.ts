export const HOW_TO_NAME = 'Student TIE process in Barcelona'

export const HOW_TO_DESCRIPTION =
  'Six guided steps to complete your student TIE residency card process in Barcelona.'

export const tieSteps = [
  {
    id: 1,
    title: 'Register your address',
    description: 'Get empadronamiento at your local Ayuntamiento in Barcelona.',
  },
  {
    id: 2,
    title: 'Book fingerprint appointment',
    description: 'Secure a cita previa slot on the official police website.',
  },
  {
    id: 3,
    title: 'Prepare documents',
    description: 'Gather EX-17, passport copies, photos, and confirmations.',
  },
  {
    id: 4,
    title: 'Pay the TIE fee',
    description: 'Complete Modelo 790 code 012 and pay at a Spanish bank.',
  },
  {
    id: 5,
    title: 'Attend appointment',
    description: 'Submit paperwork, provide biometrics, and receive resguardo.',
  },
  {
    id: 6,
    title: 'Collect your TIE',
    description: 'Return to pick up your physical card when ready.',
  },
] as const;

/** FAQ content mirrored from the mobile app step data for SEO / JSON-LD. */
export const tieStepFaqs = [
  {
    question: 'Do I need an appointment for empadronamiento?',
    answer: 'Often yes — check your local Ayuntamiento.',
  },
  {
    question: 'Can I use a rental contract alone for empadronamiento?',
    answer: 'No — you need the official empadronamiento certificate.',
  },
  {
    question: 'Can someone book my cita previa on my behalf?',
    answer: 'Yes, but you must attend in person.',
  },
  {
    question: 'Do I need an NIE to book a cita previa?',
    answer: 'Most systems ask for NIE/passport info to reserve a slot.',
  },
  {
    question: 'What if no cita previa appointments are available?',
    answer: 'Keep checking regularly; they open at random times.',
  },
  {
    question: 'Do TIE photos need specific specs?',
    answer: 'Yes — passport format with white background.',
  },
  {
    question: 'Can I pay the Modelo 790 fee later?',
    answer:
      'No — you must pay the 790-012 fee and bring proof of payment at appointment.',
  },
  {
    question: 'Do they issue the TIE on the spot at the appointment?',
    answer: 'No — you collect it later.',
  },
  {
    question: 'Can someone else pick up my TIE?',
    answer: 'Usually you must be present.',
  },
] as const;
