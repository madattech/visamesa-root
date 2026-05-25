import type {
  WebViewInjectionMatch,
  WebViewInjectionRule,
} from '../../webViewInjection/scriptRegistry';
import type {CitaPreviaAutomationProfile} from './config';
import {buildDetailsScript, DETAILS_URL} from './details';
import {CLAVE_SCRIPT, CLAVE_URL} from './clave';
import {INITIAL_PAGE_SCRIPT, ICP_PLUS_URL} from './initialPage';
import {buildOficinaScript, OFICINA_URL} from './oficina';
import {buildProvinciaScript, PROVINCIA_URL} from './provincia';
import {SOLICITAR_CITA_SCRIPT, SOLICITAR_CITA_URL} from './solicitarCita';

/** Direct province picker — avoids the slow/unreliable sede gateway page in WebView. */
export const CITA_PREVIA_START_URL = PROVINCIA_URL;

/** Official sede shortcut (redirects to ICP); kept for injection if the WebView lands here. */
export const CITA_PREVIA_SEDE_ENTRY_URL =
  'https://sede.administracionespublicas.gob.es/icpplus/index.html';

export {
  buildCitaPreviaAutomationProfileFromCase,
  citaPreviaPiiConfig,
  type CitaPreviaAutomationProfile,
} from './config';

export interface CitaPreviaScriptMap {
  [url: string]: string;
}

interface CitaPreviaScriptEntry {
  url: string;
  script: string;
  match?: WebViewInjectionMatch;
  ready?: WebViewInjectionRule['ready'];
}

const buildCitaPreviaScriptEntries = (
  profile: CitaPreviaAutomationProfile,
): CitaPreviaScriptEntry[] => {
  const detailsScript = buildDetailsScript({
    nie: profile.details.nie,
    Name: profile.details.Name,
    nationality: profile.details.nationality,
    documentType: profile.details.documentType,
  });

  const provinciaScript = buildProvinciaScript(profile.provinceOptionIndex);

  return [
    {
      url: ICP_PLUS_URL,
      script: INITIAL_PAGE_SCRIPT,
    },
    {
      url: CITA_PREVIA_SEDE_ENTRY_URL,
      script: provinciaScript,
      match: {
        type: 'prefix',
        value: CITA_PREVIA_SEDE_ENTRY_URL,
      },
      ready: {
        selector: 'select#form, #form, select[name="form"]',
      },
    },
    {
      url: PROVINCIA_URL,
      script: provinciaScript,
      match: {
        type: 'prefix',
        value: PROVINCIA_URL,
      },
      ready: {
        selector: 'select#form, #form, select[name="form"]',
      },
    },
    {
      url: CLAVE_URL,
      script: CLAVE_SCRIPT,
      match: {
        type: 'prefix',
        value: CLAVE_URL,
      },
      ready: {
        selector: '#btnEntrar',
      },
    },
    {
      url: DETAILS_URL,
      script: detailsScript,
      match: {
        type: 'prefix',
        value: DETAILS_URL,
      },
      ready: {
        selector: '#txtIdCitado',
      },
    },
    {
      url: OFICINA_URL,
      script: buildOficinaScript(profile.tramitesOptionIndex),
      ready: {
        selector: '#tramiteGrupo\\[0\\]',
      },
    },
    {
      url: SOLICITAR_CITA_URL,
      script: SOLICITAR_CITA_SCRIPT,
      match: {
        type: 'prefix',
        value: SOLICITAR_CITA_URL,
      },
      ready: {
        selector: '#btnEnviar',
      },
    },
  ];
};

export const buildCitaPreviaScriptMap = (
  profile: CitaPreviaAutomationProfile,
): CitaPreviaScriptMap => {
  return buildCitaPreviaScriptEntries(profile).reduce<CitaPreviaScriptMap>(
    (scriptMap, entry) => {
      scriptMap[entry.url] = entry.script;
      return scriptMap;
    },
    {},
  );
};

export const buildCitaPreviaInjectionRules = (
  profile: CitaPreviaAutomationProfile,
): WebViewInjectionRule[] =>
  buildCitaPreviaScriptEntries(profile).map(entry => ({
    id: `cita-previa-${entry.url}`,
    match:
      entry.match ?? {
        type: 'exact',
        value: entry.url,
      },
    script: entry.script,
    ready: entry.ready,
  }));
