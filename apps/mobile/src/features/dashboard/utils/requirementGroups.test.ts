import { groupRequirementsByLocation } from '@/features/dashboard/utils/requirementGroups'
import type { RequirementLocation } from '@visamesa/content/tieSteps/detail'

describe('groupRequirementsByLocation', () => {
  it('lists in-app items without a group header', () => {
    const requirements = [
      { key: 'a', label: 'A', type: 'self_declared' as const, location: 'in_app' as RequirementLocation},
      { key: 'b', label: 'B', type: 'self_declared' as const, location: 'in_person' as RequirementLocation},
    ]

    const groups = groupRequirementsByLocation(requirements)

    expect(groups).toHaveLength(2)
    expect(groups[0]?.location).toBeUndefined()
    expect(groups[1]?.location).toBe('in_person')
  })
})
