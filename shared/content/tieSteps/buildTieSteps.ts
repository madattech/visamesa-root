import { tieStepManifest } from './manifest'
import {
  TIE_STEP_ORDER,
  type Requirement,
  type TieStepDetail,
  type TieStepSlug,
  type TieStepTranslation,
} from './types'

export type TieStepsTranslateFn = (
  key: string,
  options?: { returnObjects?: boolean },
) => string | unknown

function buildRequirements(
  slug: TieStepSlug,
  translation: TieStepTranslation,
  slugToId: Record<TieStepSlug, number>,
): Requirement[] {
  const manifest = tieStepManifest[slug]

  return manifest.requirements.map((entry) => {
    const copy = translation.requirements[entry.key]

    if (!copy) {
      throw new Error(`Missing requirement translation: tieSteps:steps.${slug}.requirements.${entry.key}`)
    }

    const requirement: Requirement = {
      key: entry.key,
      label: copy.label,
      description: copy.description,
      type: entry.type,
      automationId: entry.automationId,
      formId: entry.formId,
    }

    if (entry.link) {
      requirement.link = {
        label: copy.link?.label ?? copy.label,
        url: entry.link.url,
      }
    }

    if (entry.referencesStepSlug) {
      requirement.referencesStepId = slugToId[entry.referencesStepSlug]
    }

    return requirement
  })
}

export function buildTieSteps(t: TieStepsTranslateFn): TieStepDetail[] {
  const slugToId = Object.fromEntries(
    TIE_STEP_ORDER.map((slug) => [slug, tieStepManifest[slug].id]),
  ) as Record<TieStepSlug, number>

  return TIE_STEP_ORDER.map((slug) => {
    const manifest = tieStepManifest[slug]
    const translation = t(`tieSteps:steps.${slug}`, { returnObjects: true }) as TieStepTranslation

    if (!translation || typeof translation !== 'object') {
      throw new Error(`Missing step translation: tieSteps:steps.${slug}`)
    }

    return {
      id: manifest.id,
      slug,
      title: translation.title,
      short: translation.short,
      description: translation.description,
      whyItExists: translation.whyItExists,
      completionPrompt: translation.completionPrompt,
      cta: translation.cta,
      estimatedTime: translation.estimatedTime,
      officialLinks: manifest.officialLinkUrls.map((url, index) => ({
        url,
        label: translation.officialLinks[index]?.label ?? url,
      })),
      commonQuestions: translation.commonQuestions,
      requirements: buildRequirements(slug, translation, slugToId),
    }
  })
}
