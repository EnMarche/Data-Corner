import PropTypes from 'prop-types'

export class PhoningCampaign {
  constructor(id, title, startDate, endDate, calls, surveys, averageTime, goal, brief, team, survey, filters) {
    this.id = id
    this.title = title
    this.startDate = startDate
    this.endDate = endDate
    this.calls = calls
    this.surveys = surveys
    this.averageTime = averageTime
    this.goal = goal
    this.brief = brief
    this.team = team
    this.survey = survey
    this.filters = filters
  }
}
export class PhoningCampaignFilters {
  constructor(
    firstName,
    lastName,
    gender,
    adherentFromDate,
    adherentToDate,
    ageMin,
    ageMax,
    certified,
    committeeMember,
    emailSubscribed,
    SMSSubscribed,
    zones
  ) {
    this.firstName = firstName
    this.lastName = lastName
    this.gender = gender
    this.adherentFromDate = adherentFromDate
    this.adherentToDate = adherentToDate
    this.ageMin = ageMin
    this.ageMax = ageMax
    this.certified = certified
    this.committeeMember = committeeMember
    this.emailSubscribed = emailSubscribed
    this.SMSSubscribed = SMSSubscribed
    this.zones = zones
  }
}
export class PhoningCampaignZone {
  constructor(id, name, code) {
    this.id = id
    this.name = name
    this.code = code
  }
}
export class PhoningCampaignTeam {
  constructor(id, name) {
    this.id = id
    this.name = name
  }
}
export class PhoningCampaignSurvey {
  constructor(id, name) {
    this.id = id
    this.name = name
  }
}
export class PhoningCampaignCalls {
  constructor(count, toRemind) {
    this.count = count
    this.toRemind = toRemind
  }
}

export class PhoningCampaignSurveys {
  constructor(count, goal) {
    this.count = count
    this.goal = goal
  }
}

PhoningCampaign.propTypes = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  calls: PhoningCampaignCalls.propTypes,
  surveys: PhoningCampaignSurveys.propTypes,
  averageTime: PropTypes.number.isRequired,
  goal: PropTypes.number.isRequired,
  brief: PropTypes.string.isRequired,
  team: PhoningCampaignTeam.propTypes,
  survey: PhoningCampaignSurvey.propTypes,
  filters: PhoningCampaignFilters.propTypes,
})

PhoningCampaignFilters.propTypes = PropTypes.shape({
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  gender: PropTypes.string.isRequired,
  adherentFromDate: PropTypes.string.isRequired,
  adherentToDate: PropTypes.string.isRequired,
  ageMin: PropTypes.number.isRequired,
  ageMax: PropTypes.number.isRequired,
  certified: PropTypes.bool.isRequired,
  committeeMember: PropTypes.bool.isRequired,
  emailSubscribed: PropTypes.bool.isRequired,
  SMSSubscribed: PropTypes.bool.isRequired,
  zones: PropTypes.arrayOf(PhoningCampaignZone.propTypes).isRequired,
})

PhoningCampaignZone.propTypes = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
})

PhoningCampaignTeam.propTypes = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  creator: PropTypes.string.isRequired,
})

PhoningCampaignSurvey.propTypes = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
})

PhoningCampaignCalls.propTypes = PropTypes.shape({
  count: PropTypes.number.isRequired,
  toRemind: PropTypes.number.isRequired,
})

PhoningCampaignSurveys.propTypes = PropTypes.shape({
  count: PropTypes.number.isRequired,
  goal: PropTypes.number.isRequired,
})
