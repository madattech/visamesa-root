import {
  buildCitaPreviaInjectionRules,
  buildCitaPreviaScriptMap,
  type CitaPreviaAutomationProfile,
} from './index';

describe('cita previa script map', () => {
  const profile: CitaPreviaAutomationProfile = {
    details: {
      nie: 'Y1234567X',
      Name: 'Test User',
      nationality: 88,
      documentType: 'nie',
    },
    tramitesOptionIndex: 17,
  };

  it('builds a url to script map for the expected webview steps', () => {
    const scriptMap = buildCitaPreviaScriptMap(profile);

    expect(Object.keys(scriptMap)).toEqual(
      expect.arrayContaining([
        'https://sede.administracionespublicas.gob.es/pagina/index/directorio/icpplus',
        'https://icp.administracionelectronica.gob.es/icpplus/index.html',
        'https://icp.administracionelectronica.gob.es/icpplustieb/acInfo',
        'https://icp.administracionelectronica.gob.es/icpplustieb/acEntrada',
        'https://icp.administracionelectronica.gob.es/icpplustieb/citar?p=8&locale=es',
        'https://icp.administracionelectronica.gob.es/icpplustieb/acValidarEntrada',
      ]),
    );

    expect(scriptMap['https://icp.administracionelectronica.gob.es/icpplustieb/citar?p=8&locale=es']).toContain(
      '#tramiteGrupo\\\\[0\\\\]',
    );
    expect(
      scriptMap['https://icp.administracionelectronica.gob.es/icpplustieb/acEntrada'],
    ).toContain('Y1234567X');
    expect(
      scriptMap['https://icp.administracionelectronica.gob.es/icpplustieb/acEntrada'],
    ).toContain('Test User');
  });

  it('converts the map into exact-match injection rules', () => {
    const rules = buildCitaPreviaInjectionRules(profile);

    expect(rules).toHaveLength(6);
    expect(rules[0]).toMatchObject({
      match: {
        type: 'exact',
        value: 'https://sede.administracionespublicas.gob.es/pagina/index/directorio/icpplus',
      },
    });
    expect(rules[1]).toMatchObject({
      match: {
        type: 'prefix',
        value: 'https://icp.administracionelectronica.gob.es/icpplus/index.html',
      },
    });
    expect(rules[2]).toMatchObject({
      match: {
        type: 'prefix',
        value: 'https://icp.administracionelectronica.gob.es/icpplustieb/acInfo',
      },
    });
    expect(rules[3]).toMatchObject({
      match: {
        type: 'prefix',
        value: 'https://icp.administracionelectronica.gob.es/icpplustieb/acEntrada',
      },
    });
    expect(rules[5]).toMatchObject({
      match: {
        type: 'prefix',
        value: 'https://icp.administracionelectronica.gob.es/icpplustieb/acValidarEntrada',
      },
    });
    expect(rules).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          match: {
            type: 'exact',
            value: 'https://sede.administracionespublicas.gob.es/pagina/index/directorio/icpplus',
          },
          ready: {selector: '#submit'},
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
