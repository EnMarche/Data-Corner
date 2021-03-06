import PropTypes from 'prop-types'

export class DTDCampaignDetailKPIRemaining {
  constructor(startDate, endDate) {
    this.startDate = startDate
    this.endDate = endDate
  }
  static propTypes = {
    startDate: PropTypes.object.isRequired,
    endDate: PropTypes.object.isRequired,
  }
}

export class DTDCampaignDetailKPISurveys {
  constructor(count) {
    this.count = count
  }
  static propTypes = {
    count: PropTypes.number.isRequired,
  }
}

export class DTDCampaignDetailKPIDoors {
  constructor(knockedCount, openCount) {
    this.knockedCount = knockedCount
    this.openCount = openCount
  }
  static propTypes = {
    knockedCount: PropTypes.number.isRequired,
    openCount: PropTypes.number.isRequired,
  }
}

export class DTDCampaignDetailKPIContacts {
  constructor(collectedCount, toJoinCount) {
    this.collectedCount = collectedCount
    this.toJoinCount = toJoinCount
  }
  static propTypes = {
    collectedCount: PropTypes.number.isRequired,
    toJoinCount: PropTypes.number.isRequired,
  }
}
export class DTDCampaignDetailKPIAddresses {
  constructor(todoAddresses, ongoingAddresses, completedAddresses) {
    this.todoAddresses = todoAddresses
    this.ongoingAddresses = ongoingAddresses
    this.completedAddresses = completedAddresses
  }

  static propTypes = {
    todoAddresses: PropTypes.number.isRequired,
    ongoingAddresses: PropTypes.number.isRequired,
    completedAddresses: PropTypes.number.isRequired,
  }
}

export class DTDCampaignDetailKPI {
  constructor(remaining, surveys, doors, contacts, addresses) {
    this.remaining = remaining
    this.surveys = surveys
    this.doors = doors
    this.contacts = contacts
    this.addresses = addresses
  }
  static propTypes = {
    remaining: PropTypes.shape(DTDCampaignDetailKPIRemaining.propTypes),
    surveys: PropTypes.shape(DTDCampaignDetailKPISurveys.propTypes),
    doors: PropTypes.shape(DTDCampaignDetailKPIDoors.propTypes),
    contacts: PropTypes.shape(DTDCampaignDetailKPIContacts.propTypes),
    addresses: PropTypes.shape(DTDCampaignDetailKPIAddresses.propTypes),
  }
}
