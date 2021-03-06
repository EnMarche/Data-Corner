import { apiClient } from 'services/networking/client'
import qs from 'qs'
import Activist from 'domain/activist'
import { PaginatedResult } from './pagination'

export const activistAutocompleteUri = '/api/v3/adherents/autocomplete'
export const getActivists = async filter => {
  const data = await apiClient.get(`v3/adherents?${qs.stringify(filter)}`)
  const activists = data.items.map(
    a =>
      new Activist(
        a.first_name,
        a.last_name,
        a.gender,
        a.country,
        a.region_code,
        a.region,
        a.department_code,
        a.department,
        a.city_code,
        a.city,
        a.postal_code,
        a.interests,
        a.email_subscription,
        a.sms_subscription
      )
  )
  const paginatedActivists = new PaginatedResult(
    activists,
    data.metadata.total_items,
    data.metadata.items_per_page,
    data.metadata.count,
    data.metadata.current_page,
    data.metadata.last_page
  )
  return paginatedActivists
}
export const getColumns = () => apiClient.get('v3/adherents/columns')
