import type {
  WebViewInjectionMatch,
  WebViewInjectionRule,
} from '../../webViewInjection/scriptRegistry';
import {
  click,
  clickByText,
  composeWebViewScript,
  delay,
  selectByText,
  selectByValue,
  setField,
  step,
  submit,
} from '../webviewAutomation';
import {
  empadronamientoDemoProfile,
  type EmpadronamientoAutomationProfile,
} from './config';

export {
  empadronamientoDemoProfile,
  type EmpadronamientoAutomationProfile,
  type EmpadronamientoPersonalInfo,
} from './config';

export const EMPADRONAMIENTO_HOME_URL =
  'https://seuelectronica.ajuntament.barcelona.cat/oficinavirtual/ca';
export const EMPADRONAMIENTO_SEARCH_RESULT_URL = `${EMPADRONAMIENTO_HOME_URL}/search-result?idCategory=21`;
export const EMPADRONAMIENTO_TRAMIT_URL = `${EMPADRONAMIENTO_HOME_URL}/tramit/20230001668`;
export const EMPADRONAMIENTO_HOST =
  'seuelectronica.ajuntament.barcelona.cat';

const CATEGORY_SELECTOR =
  'a[href*="/oficinavirtual/ca/search-result"][href*="idCategory=21"]';
const OAC_APPOINTMENT_TEXT = "Cita amb les Oficines d'Atenció Ciutadana";
const START_TRAMIT_BUTTON_SELECTOR = 'button[type="button"][rel="nofollow"]';
const START_TRAMIT_BUTTON_TEXT = 'Inicia el tràmit';

export type EmpadronamientoStepId =
  | 'open-category'
  | 'select-oac-appointment'
  | 'start-tramit'
  | 'select-tema'
  | 'select-solicitud'
  | 'fill-motive'
  | 'fill-personal-info'
  | 'select-office'
  | 'select-date'
  | 'select-time'
  | 'submit-final'
  | 'orchestrator';

export interface EmpadronamientoScriptEntry {
  id: EmpadronamientoStepId;
  script: string;
  url?: string;
  match?: WebViewInjectionMatch;
  ready?: WebViewInjectionRule['ready'];
}

export type EmpadronamientoScriptMap = Record<EmpadronamientoStepId, string>;

export const buildOpenCategoryScript = () =>
  composeWebViewScript([click(CATEGORY_SELECTOR)]);

export const buildSelectOacAppointmentScript = () =>
  composeWebViewScript([clickByText('p', OAC_APPOINTMENT_TEXT)]);

export const buildStartTramitScript = () =>
  composeWebViewScript([
    clickByText(START_TRAMIT_BUTTON_SELECTOR, START_TRAMIT_BUTTON_TEXT),
  ]);

export const buildSelectTemaScript = (
  profile: EmpadronamientoAutomationProfile,
) =>
  composeWebViewScript(
    [
      selectByText('select[aria-label="tema"][name="tematicas"]', profile.temaText),
      delay(4000),
      selectByValue('select[name="subtematicas"]', profile.subTemaValue),
      delay(3000),
      submit(),
      delay(3000),
      click('[aria-modal="true"] p[tabindex="0"]'),
    ],
    {async: true},
  );

export const buildSelectSolicitudScript = () =>
  composeWebViewScript([click('#solicitud'), submit()]);

export const buildMotiveScript = (profile: EmpadronamientoAutomationProfile) =>
  composeWebViewScript([
    setField('textarea#motivo[name="motivo"][aria-label="motivo"]', profile.motive),
    submit(),
  ]);

export const buildPersonalInfoScript = (
  profile: EmpadronamientoAutomationProfile,
) => {
  const {personalInfo} = profile;

  return composeWebViewScript([
    selectByValue(
      'select[formcontrolname="identifierType"]',
      personalInfo.identifierType,
    ),
    setField('input[formcontrolname="identifier"]', personalInfo.identifier),
    setField('input[formcontrolname="name"]', personalInfo.name),
    setField('input[formcontrolname="surname"]', personalInfo.surname),
    personalInfo.secondSurname
      ? setField(
          'input[formcontrolname="secondSurname"]',
          personalInfo.secondSurname,
        )
      : null,
    setField('input[formcontrolname="email"]', personalInfo.email),
    setField('input[formcontrolname="phone"]', personalInfo.phone),
    submit(),
  ]);
};

export const buildSelectOfficeScript = (
  profile: EmpadronamientoAutomationProfile,
) => composeWebViewScript([click(`#${profile.officeId}`), submit()]);

export const buildSelectDateScript = () =>
  composeWebViewScript([
    step(`
      if (automation.pickFirstAvailableDate()) {
        automation.submit();
      }
    `),
  ]);

export const buildSelectTimeScript = (
  profile: EmpadronamientoAutomationProfile,
) =>
  composeWebViewScript([
    step(`
      if (automation.pickFirstTimeAfter(${JSON.stringify(profile.minTime)})) {
        automation.submit();
      }
    `),
  ]);

export const buildSubmitFinalScript = () => composeWebViewScript([submit()]);

export const buildEmpadronamientoOrchestratorScript = (
  profile: EmpadronamientoAutomationProfile,
) => {
  const personalInfoScript = buildPersonalInfoScript(profile);
  const selectTemaScript = buildSelectTemaScript(profile);

  return composeWebViewScript(
    [
      step(`
        if (automation.has(${JSON.stringify(CATEGORY_SELECTOR)})) {
          automation.click(${JSON.stringify(CATEGORY_SELECTOR)});
          return;
        }

        if (automation.findByText('p', ${JSON.stringify(OAC_APPOINTMENT_TEXT)})) {
          automation.clickByText('p', ${JSON.stringify(OAC_APPOINTMENT_TEXT)});
          return;
        }

        if (automation.findByText(${JSON.stringify(
          START_TRAMIT_BUTTON_SELECTOR,
        )}, ${JSON.stringify(START_TRAMIT_BUTTON_TEXT)})) {
          automation.clickByText(${JSON.stringify(
            START_TRAMIT_BUTTON_SELECTOR,
          )}, ${JSON.stringify(START_TRAMIT_BUTTON_TEXT)});
          return;
        }

        if (automation.has('select[aria-label="tema"][name="tematicas"]')) {
          ${selectTemaScript}
          return;
        }

        if (automation.has('#solicitud')) {
          automation.click('#solicitud');
          automation.submit();
          return;
        }

        if (automation.has('textarea#motivo[name="motivo"][aria-label="motivo"]')) {
          automation.setField(
            'textarea#motivo[name="motivo"][aria-label="motivo"]',
            ${JSON.stringify(profile.motive)}
          );
          automation.submit();
          return;
        }

        if (automation.has('select[formcontrolname="identifierType"]')) {
          ${personalInfoScript}
          return;
        }

        if (automation.has(${JSON.stringify(`#${profile.officeId}`)})) {
          automation.click(${JSON.stringify(`#${profile.officeId}`)});
          automation.submit();
          return;
        }

        if (automation.has('mat-calendar td[role="button"][aria-label]')) {
          if (automation.pickFirstAvailableDate()) {
            automation.submit();
          }
          return;
        }

        if (automation.has('input[type="radio"][name="hora"][aria-label]')) {
          if (automation.pickFirstTimeAfter(${JSON.stringify(profile.minTime)})) {
            automation.submit();
          }
          return;
        }

        if (automation.has('button[type="submit"]')) {
          automation.submit();
        }
      `),
    ],
    {async: true},
  );
};

export const buildEmpadronamientoScriptEntries = (
  profile: EmpadronamientoAutomationProfile = empadronamientoDemoProfile,
): EmpadronamientoScriptEntry[] => [
  {
    id: 'open-category',
    url: EMPADRONAMIENTO_HOME_URL,
    match: {
      type: 'exact',
      value: EMPADRONAMIENTO_HOME_URL,
    },
    ready: {
      selector: CATEGORY_SELECTOR,
    },
    script: buildOpenCategoryScript(),
  },
  {
    id: 'select-oac-appointment',
    url: EMPADRONAMIENTO_SEARCH_RESULT_URL,
    match: {
      type: 'prefix',
      value: EMPADRONAMIENTO_SEARCH_RESULT_URL,
    },
    ready: {
      selector: 'p',
    },
    script: buildSelectOacAppointmentScript(),
  },
  {
    id: 'start-tramit',
    url: EMPADRONAMIENTO_TRAMIT_URL,
    match: {
      type: 'prefix',
      value: EMPADRONAMIENTO_TRAMIT_URL,
    },
    ready: {
      selector: START_TRAMIT_BUTTON_SELECTOR,
    },
    script: buildStartTramitScript(),
  },
  {
    id: 'orchestrator',
    match: {
      type: 'host',
      value: EMPADRONAMIENTO_HOST,
    },
    script: buildEmpadronamientoOrchestratorScript(profile),
  },
];

export const buildEmpadronamientoScriptMap = (
  profile: EmpadronamientoAutomationProfile = empadronamientoDemoProfile,
): EmpadronamientoScriptMap => ({
  'open-category': buildOpenCategoryScript(),
  'select-oac-appointment': buildSelectOacAppointmentScript(),
  'start-tramit': buildStartTramitScript(),
  'select-tema': buildSelectTemaScript(profile),
  'select-solicitud': buildSelectSolicitudScript(),
  'fill-motive': buildMotiveScript(profile),
  'fill-personal-info': buildPersonalInfoScript(profile),
  'select-office': buildSelectOfficeScript(profile),
  'select-date': buildSelectDateScript(),
  'select-time': buildSelectTimeScript(profile),
  'submit-final': buildSubmitFinalScript(),
  orchestrator: buildEmpadronamientoOrchestratorScript(profile),
});

export const buildEmpadronamientoInjectionRules = (
  profile: EmpadronamientoAutomationProfile = empadronamientoDemoProfile,
): WebViewInjectionRule[] =>
  buildEmpadronamientoScriptEntries(profile).map(entry => ({
    id: `empadronamiento-${entry.id}`,
    match:
      entry.match ??
      ({
        type: 'exact',
        value: entry.url,
      } as WebViewInjectionMatch),
    script: entry.script,
    ready: entry.ready,
  }));
