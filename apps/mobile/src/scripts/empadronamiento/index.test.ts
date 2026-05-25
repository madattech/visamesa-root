import {
  empadronamientoPiiConfig,
  buildEmpadronamientoInjectionRules,
  buildEmpadronamientoScriptMap,
  type EmpadronamientoAutomationProfile,
} from './index';
import {EMPADRONAMIENTO_HOME_URL} from './initia';
import {EMPADRONAMIENTO_SEARCH_RESULT_URL} from './OSC-select';
import {EMPADRONAMIENTO_TRAMIT_URL} from './start-tramit';

const EMPADRONAMIENTO_CITA_PREFIX = `${EMPADRONAMIENTO_HOME_URL}/cita`;

describe('empadronamiento script map', () => {
  const profile: EmpadronamientoAutomationProfile = {
    personalInfo: {
      ...empadronamientoPiiConfig.personalInfo,
      identifier: 'X9999999Z',
      name: 'Test User',
      email: 'test.user@example.com',
    },
    motive: 'Test empadronamiento appointment.',
  };

  it('builds a url to script map for the expected webview steps', () => {
    const scriptMap = buildEmpadronamientoScriptMap(profile);

    expect(Object.keys(scriptMap)).toEqual(
      expect.arrayContaining([
        EMPADRONAMIENTO_HOME_URL,
        EMPADRONAMIENTO_SEARCH_RESULT_URL,
        EMPADRONAMIENTO_TRAMIT_URL,
        `${EMPADRONAMIENTO_CITA_PREFIX}/tema`,
        `${EMPADRONAMIENTO_CITA_PREFIX}/personal-info`,
        `${EMPADRONAMIENTO_CITA_PREFIX}/motive`,
        `${EMPADRONAMIENTO_CITA_PREFIX}/select-oficina`,
        `${EMPADRONAMIENTO_CITA_PREFIX}/select-date`,
        `${EMPADRONAMIENTO_CITA_PREFIX}/select-time`,
        `${EMPADRONAMIENTO_CITA_PREFIX}/solicit`,
        `${EMPADRONAMIENTO_CITA_PREFIX}/submit-final`,
      ]),
    );

    expect(scriptMap[EMPADRONAMIENTO_HOME_URL]).toContain('idCategory=21');
    expect(scriptMap[EMPADRONAMIENTO_SEARCH_RESULT_URL]).toContain(
      "Cita amb les Oficines d'Atenció Ciutadana",
    );
    expect(scriptMap[EMPADRONAMIENTO_TRAMIT_URL]).toContain('Inicia el tràmit');
    expect(scriptMap[`${EMPADRONAMIENTO_CITA_PREFIX}/personal-info`]).toContain(
      'X9999999Z',
    );
    expect(scriptMap[`${EMPADRONAMIENTO_CITA_PREFIX}/personal-info`]).toContain(
      'Test User',
    );
    expect(scriptMap[`${EMPADRONAMIENTO_CITA_PREFIX}/personal-info`]).toContain(
      'test.user@example.com',
    );
    expect(scriptMap[`${EMPADRONAMIENTO_CITA_PREFIX}/motive`]).toContain(
      'Test empadronamiento appointment.',
    );
    expect(scriptMap[`${EMPADRONAMIENTO_CITA_PREFIX}/select-oficina`]).toContain(
      '#OAC-DR',
    );
    expect(scriptMap[`${EMPADRONAMIENTO_CITA_PREFIX}/select-date`]).toContain(
      'pickFirstAvailableDate',
    );
    expect(scriptMap[`${EMPADRONAMIENTO_CITA_PREFIX}/select-time`]).toContain(
      "pickFirstTimeAfter('10:00')",
    );
    expect(scriptMap[`${EMPADRONAMIENTO_CITA_PREFIX}/solicit`]).toContain(
      '#solicitud',
    );
  });

  it('exports a default pii config for manual runs', () => {
    expect(empadronamientoPiiConfig).toMatchObject({
      personalInfo: {
        identifierType: 'PASSAPORT',
        identifier: 'A12345678',
        name: 'John',
        surname: 'Doe',
        secondSurname: 'Smith',
        email: 'john.doe@example.com',
        phone: '600123456',
      },
      motive: 'Booking appointment to request empadronamiento.',
    });
  });

  it('converts entries into injection rules with exact and prefix matches', () => {
    const rules = buildEmpadronamientoInjectionRules(profile);

    expect(rules).toHaveLength(11);
    expect(rules).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'empadronamiento-home',
          match: {type: 'exact', value: EMPADRONAMIENTO_HOME_URL},
        }),
        expect.objectContaining({
          id: 'empadronamiento-search-result',
          match: {
            type: 'prefix',
            value: `${EMPADRONAMIENTO_HOME_URL}/search-result`,
          },
          ready: {selector: 'p', timeoutMs: 10000},
        }),
        expect.objectContaining({
          id: 'empadronamiento-start-tramit',
          match: {
            type: 'prefix',
            value: `${EMPADRONAMIENTO_HOME_URL}/tramit/20230001668`,
          },
          ready: {
            selector: 'button[type="button"][rel="nofollow"]',
            timeoutMs: 10000,
          },
        }),
        expect.objectContaining({
          id: 'empadronamiento-personal-info',
          match: {
            type: 'prefix',
            value: `${EMPADRONAMIENTO_CITA_PREFIX}/personal-info`,
          },
          ready: {selector: 'input[formcontrolname="identifier"]'},
        }),
        expect.objectContaining({
          id: 'empadronamiento-motive',
          match: {type: 'prefix', value: `${EMPADRONAMIENTO_CITA_PREFIX}/motive`},
          ready: {selector: 'textarea#motivo[name="motivo"]'},
        }),
        expect.objectContaining({
          id: 'empadronamiento-select-oficina',
          match: {
            type: 'prefix',
            value: `${EMPADRONAMIENTO_CITA_PREFIX}/select-oficina`,
          },
          ready: {selector: '#OAC-DR'},
        }),
        expect.objectContaining({
          id: 'empadronamiento-select-date',
          match: {
            type: 'prefix',
            value: `${EMPADRONAMIENTO_CITA_PREFIX}/select-date`,
          },
          ready: {selector: 'mat-calendar td[role="button"][aria-label]'},
        }),
        expect.objectContaining({
          id: 'empadronamiento-select-time',
          match: {
            type: 'prefix',
            value: `${EMPADRONAMIENTO_CITA_PREFIX}/select-time`,
          },
          ready: {selector: 'input[type="radio"][name="hora"][aria-label]'},
        }),
        expect.objectContaining({
          id: 'empadronamiento-solicit',
          match: {type: 'prefix', value: `${EMPADRONAMIENTO_CITA_PREFIX}/solicit`},
          ready: {selector: '#solicitud'},
        }),
        expect.objectContaining({
          id: 'empadronamiento-submit-final',
          match: {
            type: 'prefix',
            value: `${EMPADRONAMIENTO_CITA_PREFIX}/submit-final`,
          },
          ready: {selector: 'button[type="submit"]'},
        }),
      ]),
    );
  });
});
