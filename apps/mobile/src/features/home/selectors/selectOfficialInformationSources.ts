import {tieStepsDetail} from '@/features/home/data/stepsData';
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

  for (const step of tieStepsDetail) {
    for (const link of step.officialLinks) {
      addLink(link);
    }

    for (const requirement of step.requirements) {
      addLink(requirement.link);
    }
  }

  return links;
}
