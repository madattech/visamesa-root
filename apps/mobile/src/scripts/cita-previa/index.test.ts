import {
  citaPreviaPiiConfig,
  buildCitaPreviaInjectionRules,
  buildCitaPreviaScriptMap,
  type CitaPreviaAutomationProfile,
} from './index';

describe('cita previa script map', () => {
  const profile: CitaPreviaAutomationProfile = {
    details: {
      ...citaPreviaPiiConfig.details,
      nie: 'Y1234567X',
      Name: 'Test User',
    },
    provinceOptionIndex: 5,
    tramitesOptionIndex: 3,
  };

  it('builds a url to script map for the expected webview steps', () => {
    const scriptMap = buildCitaPreviaScriptMap(profile);

    expect(Object.keys(scriptMap)).toEqual(
      expect.arrayContaining([
        'https://sede.administracionespublicas.gob.es/pagina/index/directorio/icpplus',
        'https://sede.administracionespublicas.gob.es/icpplus/index.html',
        'https://icp.administracionelectronica.gob.es/icpplus/index.html',
        'https://icp.administracionelectronica.gob.es/icpplustieb/acInfo',
        'https://icp.administracionelectronica.gob.es/icpplustieb/acEntrada',
        'https://icp.administracionelectronica.gob.es/icpplustieb/citar?p=8&locale=es',
        'https://icp.administracionelectronica.gob.es/icpplustieb/acValidarEntrada',
      ]),
    );

    expect(
      scriptMap['https://icp.administracionelectronica.gob.es/icpplus/index.html'],
    ).toContain('optionIndex: 5');
    expect(
      scriptMap['https://icp.administracionelectronica.gob.es/icpplus/index.html'],
    ).toContain('options?.[5]');
    expect(
      scriptMap['https://icp.administracionelectronica.gob.es/icpplustieb/citar?p=8&locale=es'],
    ).toContain('options?.[3]');
    expect(
      scriptMap['https://icp.administracionelectronica.gob.es/icpplustieb/citar?p=8&locale=es'],
    ).toContain('#tramiteGrupo\\\\[0\\\\]');
    expect(
      scriptMap['https://icp.administracionelectronica.gob.es/icpplustieb/acEntrada'],
    ).toContain('Y1234567X');
    expect(
      scriptMap['https://icp.administracionelectronica.gob.es/icpplustieb/acEntrada'],
    ).toContain('Test User');
    expect(
      scriptMap['https://icp.administracionelectronica.gob.es/icpplustieb/acEntrada'],
    ).toContain('88');
  });

  it('exports a default pii config for manual runs', () => {
    expect(citaPreviaPiiConfig).toMatchObject({
      details: {
        nie: 'Y6950398L',
        Name: 'Girish Sardar',
        nationality: 88,
        documentType: 'nie',
      },
      provinceOptionIndex: 9,
      tramitesOptionIndex: 17,
    });
  });

  it('converts the map into exact-match injection rules', () => {
    const rules = buildCitaPreviaInjectionRules(profile);

    expect(rules).toHaveLength(7);
    expect(rules).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          match: {
            type: 'exact',
            value: 'https://sede.administracionespublicas.gob.es/pagina/index/directorio/icpplus',
          },
        }),
        expect.objectContaining({
          match: {
            type: 'prefix',
            value: 'https://sede.administracionespublicas.gob.es/icpplus/index.html',
          },
          ready: {selector: 'select#form, #form, select[name="form"]'},
        }),
        expect.objectContaining({
          match: {
            type: 'prefix',
            value: 'https://icp.administracionelectronica.gob.es/icpplus/index.html',
          },
          ready: {selector: 'select#form, #form, select[name="form"]'},
        }),
        expect.objectContaining({
          match: {
            type: 'prefix',
            value: 'https://icp.administracionelectronica.gob.es/icpplustieb/acInfo',
          },
          ready: {selector: '#btnEntrar'},
        }),
        expect.objectContaining({
          match: {
            type: 'prefix',
            value: 'https://icp.administracionelectronica.gob.es/icpplustieb/acEntrada',
          },
          ready: {selector: '#txtIdCitado'},
        }),
        expect.objectContaining({
          match: {
            type: 'exact',
            value: 'https://icp.administracionelectronica.gob.es/icpplustieb/citar?p=8&locale=es',
          },
          ready: {selector: '#tramiteGrupo\\[0\\]'},
        }),
        expect.objectContaining({
          match: {
            type: 'prefix',
            value: 'https://icp.administracionelectronica.gob.es/icpplustieb/acValidarEntrada',
          },
          ready: {selector: '#btnEnviar'},
        }),
      ]),
    );
  });
});
