export type OfficialLink = {
  label: string
  url: string
}

export type Requirement = {
  label: string
  description?: string
  link?: OfficialLink
}

export type EstimatedTimeItem = {
  label: string
  value: string
}

export type EstimatedTime = EstimatedTimeItem[]

export type CommonQuestion = {
  question: string
  answer: string
}

export type TieStepDetail = {
  id: number
  title: string
  slug: string
  short: string
  description: string
  estimatedTime: EstimatedTime
  officialLinks: OfficialLink[]
  whyItExists: string
  commonQuestions: CommonQuestion[]
  requirements: Requirement[]
}
