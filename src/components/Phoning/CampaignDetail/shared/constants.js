const sent = 'send'
const unsubscribed = 'to-unsubscribe'
const unreachable = 'to-unjoin'
const unanswered = 'not-respond'
const toRemind = 'to-remind'
const refused = 'failed'
const abandoned = 'interrupted-dont-remind'
const interrupted = 'interrupted'
const completed = 'completed'
const ongoing = 'ongoing'
const finished = 'terminated'

export const defaultChipColor = { color: 'gray700', bgcolor: 'campaign.background.chip.default' }
export const chipColorsByStatus = {
  [sent]: { color: 'lightBlue700', bgcolor: 'campaign.background.chip.sent' },
  [unsubscribed]: { color: 'yellow500', bgcolor: 'campaign.background.chip.unsubscribed' },
  [unreachable]: defaultChipColor,
  [unanswered]: defaultChipColor,
  [toRemind]: defaultChipColor,
  [refused]: defaultChipColor,
  [abandoned]: defaultChipColor,
  [interrupted]: defaultChipColor,
  [completed]: { color: 'green700', bgcolor: 'campaign.background.chip.completed' },
  [ongoing]: { color: 'green700', bgcolor: 'campaign.background.chip.ongoing' },
  [finished]: defaultChipColor,
}

export const chipLabelByStatus = {
  [sent]: 'Envoyé',
  [unsubscribed]: 'Désabonné',
  [unreachable]: 'Non joignable',
  [unanswered]: 'Sans réponse',
  [toRemind]: 'A rappeler',
  [refused]: 'Echec',
  [abandoned]: 'Abandonné',
  [interrupted]: 'Interrompu',
  [completed]: 'Complété',
}

export const translatedGender = {
  other: 'Autre',
  male: 'Homme',
  female: 'Femme',
}

export const simpleField = 'simple_field'
export const uniqueChoice = 'unique_choice'
export const multipleChoice = 'multiple_choice'
