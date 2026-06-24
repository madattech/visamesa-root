import { lightColors } from './colors.js'
import { radii } from './radii.js'
import { spacing } from './spacing.js'
import { sizes } from './sizes.js'

function toKebabCase(value: string) {
  return value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

function colorVariables(prefix: string, colors: Record<string, string>) {
  return Object.entries(colors)
    .map(([key, value]) => `--${prefix}-color-${toKebabCase(key)}: ${value};`)
    .join('\n  ')
}

function spacingVariables() {
  return Object.entries(spacing)
    .map(([key, value]) => `--space-${key}: ${value}px;`)
    .join('\n  ')
}

function radiusVariables() {
  return Object.entries(radii)
    .map(([key, value]) => `--radius-${key}: ${value}px;`)
    .join('\n  ')
}

export function createThemeCssVariables() {
  return `:root {
  ${colorVariables('vm', lightColors)}
  ${spacingVariables()}
  ${radiusVariables()}
  --content-max-width: ${sizes.marketingMaxWidth}px;
  --vm-size-touch-target-min: ${sizes.touchTargetMin}px;
  --font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
}`
}
