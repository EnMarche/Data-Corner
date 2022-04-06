import { saveAs } from 'file-saver'
import { format } from 'date-fns'

import { apiClient } from 'services/networking/client'
import {
  DTDGlobalKPI,
  DTDGlobalKPICampaigns,
  DTDGlobalKPISurveys,
  DTDGlobalKPIDoors,
  DTDCampaignItem,
  DTDCampaignItemScore,
  DTDCampaignDetail,
  DTDCampaignDetailKPI,
  DTDCampaignDetailKPIRemaining,
  DTDCampaignDetailKPISurveys,
  DTDCampaignDetailKPIDoors,
  DTDCampaignDetailKPIContacts,
  DTDCampaignDetailQuestioner,
  DTDCampaignDetailHistory,
  DTDCampaignDetailHistoryAddress,
  DTDCampaignDetailHistoryQuestioner,
  DTDCampaignDetailSurveysReply,
  DTDCampaignDetailSurveysReplyAnswer,
} from 'domain/DTD'
import { newPaginatedResult } from 'api/pagination'

export const getDTDGlobalKPIQuery = async () => {
  const data = await apiClient.get('api/v3/pap_campaigns/kpi')
  const campaigns = new DTDGlobalKPICampaigns(data.nb_campaigns, data.nb_ongoing_campaigns)
  const surveys = new DTDGlobalKPISurveys(data.nb_surveys, data.nb_surveys_last_30d)
  const doors = new DTDGlobalKPIDoors(data.nb_visited_doors, data.nb_visited_doors_last_30d)
  return new DTDGlobalKPI(campaigns, surveys, doors)
}

export const getDTDCampaignsQuery = async ({ pageParam: page = 1 }) => {
  const query = `?order[created_at]=desc&page=${page}&page_size=20`
  const data = await apiClient.get(`api/v3/pap_campaigns${query}`)

  const campaigns = data.items.map(c => {
    const score = new DTDCampaignItemScore(
      c.nb_surveys,
      c.goal,
      c.nb_visited_doors,
      c.nb_addresses,
      c.nb_voters,
      c.nb_vote_places,
      c.nb_collected_contacts
    )
    return new DTDCampaignItem(c.uuid, c.creator, new Date(c.begin_at), new Date(c.finish_at), c.title, score)
  })

  return newPaginatedResult(campaigns, data.metadata)
}

export const getDTDCampaignDetailQuery = async campaignId => {
  const data = await apiClient.get(`api/v3/pap_campaigns/${campaignId}`)
  const remaining = new DTDCampaignDetailKPIRemaining(new Date(data.begin_at), new Date(data.finish_at))
  const surveys = new DTDCampaignDetailKPISurveys(data.nb_surveys)
  const doors = new DTDCampaignDetailKPIDoors(data.nb_visited_doors, data.nb_open_doors)
  const contacts = new DTDCampaignDetailKPIContacts(data.nb_collected_contacts, data.nb_to_join)
  const KPI = new DTDCampaignDetailKPI(remaining, surveys, doors, contacts)
  return new DTDCampaignDetail(data.uuid, data.title, data.goal, KPI)
}

export const getDTDCampaignQuestioners = async ({ campaignId, pageParam: page = 1 }) => {
  const data = await apiClient.get(
    `api/v3/pap_campaigns/${campaignId}/questioners?order[created_at]=desc&page=${page}&page_size=20`
  )
  const questioners = data.items.map(
    c => new DTDCampaignDetailQuestioner(c.first_name, c.last_name, Number(c.nb_surveys))
  )

  return newPaginatedResult(questioners, data.metadata)
}

export const getDTDCampaignDetailHistory = async ({ campaignId, pageParam: page = 1 }) => {
  const data = await apiClient.get(
    `api/v3/pap_campaign_histories?campaign.uuid=${campaignId}&order[created_at]=desc&page=${page}&page_size=20`
  )

  const history = data.items.map(h => {
    const address = h.building
      ? new DTDCampaignDetailHistoryAddress(
          h.building.address.number ?? '',
          h.building.address.address,
          h.building.address.postal_codes[0],
          h.building.address.city_name,
          h.building_block,
          String(h.floor),
          h.door
        )
      : null
    const questioner = h.questioner
      ? new DTDCampaignDetailHistoryQuestioner(
          h.questioner.first_name,
          h.questioner.last_name,
          h.questioner.gender,
          h.questioner.age
        )
      : null
    return new DTDCampaignDetailHistory(h.uuid, h.status, address, questioner, new Date(h.created_at), h.duration)
  })

  return newPaginatedResult(history, data.metadata)
}

export const getDTDCampaignSurveysReplies = async ({ campaignId, pageSize, pageNumber }) => {
  const data = await apiClient.get(
    `api/v3/pap_campaigns/${campaignId}/replies?page=${pageNumber + 1}&page_size=${pageSize}`
  )
  return {
    totalCount: data.metadata.total_items,
    replies: data.items.map(sr => {
      const questioner = sr.pap_campaign_history.questioner
        ? new DTDCampaignDetailHistoryQuestioner(
            sr.pap_campaign_history.questioner.first_name,
            sr.pap_campaign_history.questioner.last_name,
            sr.pap_campaign_history.questioner.gender,
            sr.pap_campaign_history.questioner.age
          )
        : null
      return new DTDCampaignDetailSurveysReply(
        sr.answers.map(a => new DTDCampaignDetailSurveysReplyAnswer(a.type, a.answer, a.question)),
        questioner,
        sr.pap_campaign_history.duration,
        new Date(sr.pap_campaign_history.created_at)
      )
    }),
  }
}

export const getPhoningCampaignSurveysRepliesExport = async campaignId => {
  const data = await apiClient.get(`api/v3/pap_campaigns/${campaignId}/replies.xls`)
  saveAs(new Blob([data]), `Questionnaires PAP - ${format(new Date(), 'dd.MM.yyyy')}.xls`)
}
