import {loadProcessOverview} from './loadProcessOverview';
import type {ProcessOverviewContent, ProcessOverviewTranslateFn} from './types';

export function buildProcessOverview(
  translate: ProcessOverviewTranslateFn,
): ProcessOverviewContent {
  return loadProcessOverview({
    screenTitle: translate('screenTitle'),
    intro: translate('intro'),
    tabHint: translate('tabHint'),
    badges: translate('badges', {returnObjects: true}),
    phases: translate('phases', {returnObjects: true}),
  });
}
