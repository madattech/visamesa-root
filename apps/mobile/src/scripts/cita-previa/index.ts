import type {
  WebViewInjectionMatch,
  WebViewInjectionRule,
} from '../../webViewInjection/scriptRegistry';
import type {CitaPreviaDetails} from '../../types';
import {buildDetailsScript, DETAILS_URL} from './details';
import {CLAVE_SCRIPT, CLAVE_URL} from './clave';
import {INITIAL_PAGE_SCRIPT, ICP_PLUS_URL} from './initialPage';
import {buildOficinaScript, OFICINA_URL} from './oficina';
import {PROVINCIA_SCRIPT, PROVINCIA_URL} from './provincia';
import {SOLICITAR_CITA_SCRIPT, SOLICITAR_CITA_URL} from './solicitarCita';

export interface CitaPreviaAutomationProfile {
  details: CitaPreviaDetails;
  tramitesOptionIndex?: number;
}

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
    nationality: profile.details.nationality ?? 88,
    documentType: profile.details.documentType ?? 'nie',
  });

  return [
    {
      url: ICP_PLUS_URL,
      script: INITIAL_PAGE_SCRIPT,
      ready: {
        selector: '#submit',
      },
    },
    {
      url: PROVINCIA_URL,
      script: PROVINCIA_SCRIPT,
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
      script: buildOficinaScript(profile.tramitesOptionIndex ?? 17),
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
