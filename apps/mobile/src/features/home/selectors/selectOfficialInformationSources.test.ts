import {selectOfficialInformationSources} from './selectOfficialInformationSources';

describe('selectOfficialInformationSources', () => {
  it('returns unique official links from step data', () => {
    const sources = selectOfficialInformationSources();

    expect(sources.length).toBeGreaterThan(0);
    expect(new Set(sources.map(source => source.url)).size).toBe(sources.length);
  });

  it('excludes non-official third-party links', () => {
    const sources = selectOfficialInformationSources();

    expect(
      sources.some(source =>
        source.url.includes('immigrationlawyerbarcelona.es'),
      ),
    ).toBe(false);
  });

  it('includes key government appointment and police sources', () => {
    const urls = selectOfficialInformationSources().map(source => source.url);

    expect(urls).toContain(
      'https://sede.administracionespublicas.gob.es/icpplus/index.html',
    );
    expect(urls).toContain('https://sede.policia.gob.es');
  });
});
