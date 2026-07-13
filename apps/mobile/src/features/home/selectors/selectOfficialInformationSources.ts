import {TIE_STEP_ORDER, tieStepManifest} from '@visamesa/content/tieSteps/detail';

import type {OfficialLink} from '@/features/home/types/TieStepDetail';

const EXCLUDED_HOSTS = ['immigrationlawyerbarcelona.es'];

function isOfficialSource(url: string): boolean {
  try {
    const host = new URL(url).hostname;
    return !EXCLUDED_HOSTS.some(excluded => host.includes(excluded));
  } catch {
    return false;
  }
}

export function selectOfficialInformationSources(): OfficialLink[] {
  const seen = new Set<string>();
  const links: OfficialLink[] = [];

  const addLink = (link: OfficialLink | undefined) => {
    if (!link || !isOfficialSource(link.url) || seen.has(link.url)) {
      return;
    }

    seen.add(link.url);
    links.push(link);
  };

  for (const slug of TIE_STEP_ORDER) {
    const step = tieStepManifest[slug];

    for (const url of step.officialLinkUrls) {
      addLink({label: url, url});
    }

    for (const requirement of step.requirements) {
      if (requirement.link) {
        addLink({label: requirement.link.url, url: requirement.link.url});
      }
    }
  }

  return links;
}
