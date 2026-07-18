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
    title: 'Fill your EX-17 form',
    description: 'VisaMesa pre-fills your TIE application form from your profile.',
  },
  {
    id: 4,
    title: 'Pay the TIE fee',
    description: 'Complete Modelo 790 code 012, print it, and pay at a Spanish bank.',
  },
  {
    id: 5,
    title: 'Attend fingerprint appointment',
    description: 'Print your documents, go to the police station, and submit your application.',
  },
  {
    id: 6,
    title: 'Collect your TIE',
    description: 'Return with your resguardo and passport to pick up your card.',
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
    question: "What if I don't have a rental contract?",
    answer: 'Your landlord may need to come with you to the Ayuntamiento.',
  },
  {
    question: 'Can someone book my cita previa on my behalf?',
    answer: 'Yes, but you must attend in person.',
  },
  {
    question: 'What if no cita previa appointments are available?',
    answer: 'Keep checking regularly; slots open at unpredictable times.',
  },
  {
    question: 'Can I pay the Modelo 790 fee later?',
    answer: 'No — bring proof of payment to your fingerprint appointment.',
  },
  {
    question: 'Which banks accept Modelo 790 code 012?',
    answer: 'Most major Spanish banks — you do not need an account.',
  },
  {
    question: 'Do they issue the TIE on the spot?',
    answer: 'No — you collect it later with your resguardo.',
  },
  {
    question: 'Can someone else pick up my TIE?',
    answer: 'Usually you must be present.',
  },
] as const;
