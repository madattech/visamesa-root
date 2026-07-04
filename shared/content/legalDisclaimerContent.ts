export const SERVICE_DISCLAIMER_SHORT =
  'VisaMesa is not a law firm, gestoría, or government body, and gives guidance only — not legal advice. We just make the process clearer.';

export const STORE_LISTING_DISCLAIMER =
  'VisaMesa is an independent guidance service and is not affiliated with, endorsed by, or representing any government entity. Official information comes from Spanish public administration sources. VisaMesa does not provide legal advice.';

export const SERVICE_DISCLAIMER_MASTER_PARAGRAPHS = [
  'VisaMesa is not a law firm, a gestoría, or a government agency, and we are not affiliated with or endorsed by any government entity. We do not provide legal advice, legal representation, or any service reserved for licensed lawyers (abogados) or registered administrative agents (gestores administrativos).',
  'VisaMesa is an independent facilitation and guidance tool. We help you understand and organize a public administrative process that you are fully entitled to complete yourself, free of charge, directly with the Spanish authorities — or with the help of a licensed abogado or gestor administrativo of your choosing.',
  'The official government procedures (such as empadronamiento, cita previa, and TIE/Tarjeta de Identidad de Extranjero applications) are provided by the relevant Spanish public bodies. Information in VisaMesa is drawn from publicly available official sources. We do not charge you for the government procedures themselves; our fee is solely for the guidance, organization, and optional automation we provide.',
  'Nothing in this app or on this website constitutes legal advice or creates a lawyer–client relationship. You are responsible for reviewing all information and documents for accuracy before submitting them to any authority. We do not guarantee any specific outcome, approval, or appointment availability. For advice on your legal rights or a complex case, please consult a licensed abogado.',
] as const;

export const SERVICE_DISCLAIMER_LIMITATIONS = [
  {
    title: 'No guarantee of approval',
    body: 'While we help you navigate the application process, we cannot guarantee that your TIE application will be approved by Spanish authorities. Approval depends on factors outside our control.',
  },
  {
    title: 'Appointment availability',
    body: 'Government appointment availability is beyond our control. We will make best efforts to book appointments, but cannot guarantee availability.',
  },
] as const;

export const SERVICE_DISCLAIMER_SECTION_TITLE = 'Service disclaimer';

export const OFFICIAL_SOURCES_SECTION_TITLE = 'Official information sources';

export const OFFICIAL_SOURCES_INTRO =
  'Government procedure information in VisaMesa is based on the same official sources linked in each step of the TIE process.';

/** Official sources linked in the mobile app TIE steps (tieStepsDetail.officialLinks). */
export const OFFICIAL_INFORMATION_SOURCES = [
  {
    label: 'Ajuntament de Barcelona – Empadronamiento',
    url: 'https://seuelectronica.ajuntament.barcelona.cat/oficinavirtual/es',
  },
  {
    label: 'Barcelona Citizen Services Info',
    url: 'https://www.barcelona.cat/internationalwelcome/en',
  },
  {
    label: 'Cita Previa – Official Appointment Booking (Policía)',
    url: 'https://sede.administracionespublicas.gob.es/icpplus/index.html',
  },
  {
    label: 'Barcelona TIE Info – National Police',
    url: 'https://www.barcelona.cat/internationalwelcome/en/identity-card-foreign-nationals-tie',
  },
  {
    label: 'Download Modelo 790 (Government)',
    url: 'https://sede.policia.gob.es',
  },
] as const;
