export function getStepShortLabel(title: string): string {
  return title.split(' ')[0] ?? title;
}
