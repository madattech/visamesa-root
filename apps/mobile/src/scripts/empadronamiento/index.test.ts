import {
  buildEmpadronamientoInjectionRules,
  buildEmpadronamientoScriptMap,
  EMPADRONAMIENTO_HOME_URL,
  EMPADRONAMIENTO_SEARCH_RESULT_URL,
  EMPADRONAMIENTO_TRAMIT_URL,
  type EmpadronamientoAutomationProfile,
} from './index';

describe('empadronamiento composable scripts', () => {
  const profile: EmpadronamientoAutomationProfile = {
    personalInfo: {
      identifierType: 'PASSAPORT',
      identifier: 'P123456',
      name: 'Test',
      surname: 'User',
      secondSurname: 'Example',
      email: 'test@example.com',
      phone: '600000000',
    },
    motive: 'Need an appointment for empadronamiento.',
    officeId: 'OAC-DR',
    temaText: "OAC: ATENCIÓ PRESENCIAL A L'OFICINA",
    subTemaValue: 'OAPAD',
    minTime: '11:00',
  };

  it('builds reusable scripts by semantic step id', () => {
    const scripts = buildEmpadronamientoScriptMap(profile);

    expect(Object.keys(scripts)).toEqual([
      'open-category',
      'select-oac-appointment',
      'start-tramit',
      'select-tema',
      'select-solicitud',
      'fill-motive',
      'fill-personal-info',
      'select-office',
      'select-date',
      'select-time',
      'submit-final',
      'orchestrator',
    ]);
    expect(scripts['fill-personal-info']).toContain('P123456');
    expect(scripts['fill-personal-info']).toContain('test@example.com');
    expect(scripts['fill-motive']).toContain(
      'Need an appointment for empadronamiento.',
    );
    expect(scripts['select-time']).toContain('11:00');
  });

  it('builds URL-driven WebView injection rules for the known Padron pages', () => {
    const rules = buildEmpadronamientoInjectionRules(profile);

    expect(rules).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'empadronamiento-open-category',
          match: {
            type: 'exact',
            value: EMPADRONAMIENTO_HOME_URL,
          },
        }),
        expect.objectContaining({
          id: 'empadronamiento-select-oac-appointment',
          match: {
            type: 'prefix',
            value: EMPADRONAMIENTO_SEARCH_RESULT_URL,
          },
        }),
        expect.objectContaining({
          id: 'empadronamiento-start-tramit',
          match: {
            type: 'prefix',
            value: EMPADRONAMIENTO_TRAMIT_URL,
          },
        }),
        expect.objectContaining({
          id: 'empadronamiento-orchestrator',
          match: {
            type: 'host',
            value: 'seuelectronica.ajuntament.barcelona.cat',
          },
        }),
      ]),
    );
  });
});
