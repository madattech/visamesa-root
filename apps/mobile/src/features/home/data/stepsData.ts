import { TieStepDetail } from '../types/TieStepDetail'

export const tieStepsDetail: TieStepDetail[] = [
  {
    id: 1,
    title: 'Register Your Address',
    slug: 'empadronamiento',
    short: 'Register your address at the local Ayuntamiento (empadronamiento).',
    description:
      'Empadronamiento is the official registration of your residence address in Barcelona’s municipal register. It proves that you live in a specific neighbourhood and is required for many formalities — including your TIE appointment.',
    estimatedTime: [
      {
        label: 'Typical',
        value: '1-3 hours at the Ayuntamiento + waiting time for appointment',
      },
      {
        label: 'Appointment Wait',
        value: 'Varies by town hall (often 1–2 weeks)*',
      },
      {
        label: 'Document Validity',
        value: 'Certificate is usually valid for 90 days',
      },
    ],
    officialLinks: [
      {
        label: 'Ajuntament de Barcelona – Empadronamiento',
        url: 'https://seuelectronica.ajuntament.barcelona.cat/oficinavirtual/es',
      },
      {
        label: 'Barcelona Citizen Services Info',
        url: 'https://www.barcelona.cat/internationalwelcome/en',
      },
    ],
    whyItExists:
      'The Spanish system uses empadronamiento to prove residence for administrative procedures like healthcare, school, and immigration formalities.',
    commonQuestions: [
      {
        question: 'Do I need an appointment?',
        answer: 'Often yes — check your local Ayuntamiento',
      },
      {
        question: 'Can I use a rental contract alone?',
        answer: 'No — you need the official empadronamiento certificate',
      },
      {
        question: 'How recent must the certificate be?',
        answer: 'Usually within 90 days',
      },
    ],
    requirements: [
      { label: 'Valid passport and NIE' },
      {
        label: 'A rental contract or proof of residence',
        description:
          'Rental contract, property deed, or landlord authorization (depending on your housing situation).',
      },
      {
        label: 'Appointment confirmation',
        description:
          'Some Ayuntamientos require booking an appointment before visiting.',
      },
    ],
  },
  {
    id: 2,
    title: 'Book Your Fingerprint Appointment',
    slug: 'toma-de-huellas',
    short:
      'Reserve an online appointment to submit your TIE application and have fingerprints taken.',
    description:
      'Before you apply for your TIE, you must book a "cita previa" on the official Spanish government site. This appointment is when you’ll submit your documents and have your fingerprints captured. Demand is high in Barcelona so appointments often get fully booked quickly, especially in peak months (like September).',
    estimatedTime: [
      { label: 'Search Time', value: '1–10 days of checking for slots' },
      {
        label: 'Typical Schedule Range',
        value: '1–3 weeks until actual appointment date',
      },
      {
        label: 'Tips',
        value: 'Refresh often, new slots may open at unpredictable times',
      },
    ],
    officialLinks: [
      {
        label: 'Cita Previa – Official Appointment Booking (Policía)',
        url: 'https://sede.administracionespublicas.gob.es/icpplus/index.html',
      },
    ],
    whyItExists:
      'The Spanish police require in-person verification and fingerprints for identity cards. Appointments ensure orderly processing and verification.',
    commonQuestions: [
      {
        question: 'Can someone book on my behalf?',
        answer: 'Yes, but you must attend in person',
      },
      {
        question: 'Do I need an NIE to book?',
        answer: 'Most systems ask for NIE/passport info to reserve a slot',
      },
      {
        question: 'What if no appointments are available?',
        answer: 'Keep checking regularly; they open at random times',
      },
    ],
    requirements: [
      {
        label: 'Personal identification details',
        description:
          'Passport number, nationality, and basic personal information are required to book.',
      },
      {
        label: 'Access to the official Cita Previa website',
        link: {
          label: 'Book fingerprint appointment',
          url: 'https://sede.administracionespublicas.gob.es/icpplus/index.html',
        },
      },
      {
        label: 'Appointment confirmation',
        description:
          'Print or save the confirmation to bring to the police station.',
      },
    ],
  },
  {
    id: 3,
    title: 'Prepare the Required Documents',
    slug: 'required-documents',
    short:
      'Gather and organise all the paperwork you need before your appointment.',
    description:
      'Bring all required documents printed and organised. This prevents rejections at your appointment — missing even one piece often means you have to reschedule and wait longer.',
    estimatedTime: [
      { label: 'Prep Time', value: '1–3 days to collect and make copies' },
      { label: 'Empadronamiento Validity', value: 'less than 3 months old' },
      { label: 'Photos', value: 'recent, correct passport style' },
    ],
    officialLinks: [
      {
        label: 'Barcelona TIE Info – National Police',
        url: 'https://www.barcelona.cat/internationalwelcome/en/identity-card-foreign-nationals-tie',
      },
      {
        label: 'TIE Requirements & Documents (Indicative)',
        url: 'https://immigrationlawyerbarcelona.es/apply-for-tie-spain-online/',
      },
    ],
    whyItExists:
      'Spanish bureaucracy is strict about completeness and accuracy — official forms, passport copies, fee payments, and certificates must be exact.',
    commonQuestions: [
      {
        question: 'Do photos need specific specs?',
        answer: 'Yes — passport format with white background',
      },
      {
        question: 'Can I pay the fee later?',
        answer:
          'No — you must pay the 790-012 fee and bring proof of payment at appointment',
      },
      {
        question: 'Can documents be in English?',
        answer:
          'Most have to be translated if not in Spanish — check country of origin rules',
      },
    ],
    requirements: [
      { label: 'Completed EX-17 application form' },
      {
        label: 'Valid passport',
        description:
          'Original plus photocopies of main page and visa/entry stamp.',
      },
      {
        label: 'Student visa or residence authorisation',
        description: 'Proof of permission to stay longer than 6 months.',
      },
      {
        label: 'Empadronamiento certificate',
        description: 'Proof of local address registration.',
      },
      {
        label: 'Passport-style photographs',
        description: 'Recent color photos with white background.',
      },
      {
        label: 'Appointment confirmation',
        description: 'Printed confirmation from the Cita Previa website.',
      },
    ],
  },
  {
    id: 4,
    title: 'Pay the TIE Issuance Fee',
    slug: 'pay-fee',
    short:
      'Complete and pay the official Modelo 790 code 012 fee before your appointment.',
    description:
      'You must fill in the official Modelo 790 fee form (code 012) and pay it at a Spanish bank before your TIE appointment. You’ll need to bring proof of payment with you — without it they can reject the application on the spot.',
    estimatedTime: [
      { label: 'Bank Visit', value: '30 minutes to 1 hour at a bank branch' },
      { label: 'Processing', value: 'Immediate issue of a payment receipt' },
      {
        label: 'Fee Range',
        value: 'Approx. €16–€22 depending on permit type',
      },
    ],
    officialLinks: [
      {
        label: 'Download Modelo 790 (Government)',
        url: 'https://sede.policia.gob.es',
      },
      {
        label: 'Fee Information – Immigration Portal',
        url: 'https://sede.policia.gob.es',
      },
    ],
    whyItExists:
      'The fee is a legal requirement for processing and manufacturing your TIE card. Paying before the appointment confirms your commitment and covers administrative costs.',
    commonQuestions: [
      {
        question: 'Can I pay online?',
        answer:
          'Usually at a bank for code 012 — check if online bank allows this',
      },
      {
        question: 'Do I need the exact code?',
        answer: 'Yes — use code 012 specifically for TIE issuance',
      },
    ],
    requirements: [
      { label: 'Modelo 790 Code 012 form (completed)' },
      {
        label: 'Fee payment receipt',
        description:
          'Receipt provided by the bank after payment — must be brought to appointment.',
      },
      {
        label: 'Official fee form source',
        link: {
          label: 'Modelo 790 Code 012',
          url: 'https://sede.policia.gob.es',
        },
      },
    ],
  },
  {
    id: 5,
    title: 'Attend Your Fingerprint Appointment',
    slug: 'fingerprint-appointment',
    short:
      'Go to your scheduled appointment with all documents — fingerprints are taken and application is submitted.',
    description:
      'At the police station on your appointment day you will submit all documents, have your fingerprints and photo taken, and receive a appointment receipt (resguardo). This confirms your application and tells you when and where to pick up your TIE.',
    estimatedTime: [
      { label: 'Appointment Length', value: '30–60 minutes' },
      { label: 'Admin Wait', value: 'Resguardo given immediately' },
    ],
    officialLinks: [
      {
        label: 'Official TIE Info (Barcelona International Welcome)',
        url: 'https://www.barcelona.cat/internationalwelcome/en/identity-card-foreign-nationals-tie',
      },
    ],
    whyItExists:
      'This in-person step verifies your identity (biometrics) and ensures all information on your card is accurate and linked to your fingerprints.',
    commonQuestions: [
      {
        question: 'What if I forget a document?',
        answer: 'They may cancel your appointment — you’ll have to rebook',
      },
      {
        question: 'Do they issue the TIE on the spot?',
        answer: 'No — you collect it later',
      },
    ],
    requirements: [
      { label: 'All required documents prepared in Step 3' },
      { label: 'Proof of fee payment (Modelo 790 receipt)' },
      {
        label: 'Original passport',
        description: 'Required for identity verification.',
      },
    ],
  },
  {
    id: 6,
    title: 'Pick Up Your TIE',
    slug: 'collect-tie',
    short:
      'Return to the police station after processing to collect your physical TIE card.',
    description:
      'Once your TIE is ready (often ~30–45 days after your appointment), you return with your receipt to collect your physical card. In some cases you may need to schedule an appointment for pickup.',
    estimatedTime: [
      { label: 'Processing', value: 'Approx. 30–45 days after appointment' },
      { label: 'Pickup Visit', value: '30 minutes to 1 hour' },
    ],
    officialLinks: [
      {
        label: 'TIE Collection Info (Police)',
        url: 'https://sede.policia.gob.es',
      },
    ],
    whyItExists:
      'The TIE card is produced centrally and not printed on site. The wait time is part of the card manufacturing and delivery process.',
    commonQuestions: [
      {
        question: 'Can someone else pick it up?',
        answer: 'Usually you must be present',
      },
      {
        question: 'What if I don’t pick it up?',
        answer: 'Cards may be destroyed after a period — check local rules',
      },
    ],
    requirements: [
      {
        label: 'Resguardo (receipt) from fingerprint appointment',
        description: 'Issued when you submitted your application.',
      },
      {
        label: 'Passport',
        description: 'Required to verify your identity at collection.',
      },
    ],
  },
]
