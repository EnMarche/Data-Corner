import { Group, GroupMember } from 'domain/group'
import { apiClient } from 'services/networking/client'
import { newPaginatedResult } from 'api/pagination'
import { Zone } from 'domain/zone'

export const getUserZones = async (q = '') => {
  const data = await apiClient.get(`/api/v3/zone/autocomplete?q=${q}`)
  return data.map(z => new Zone(z.uuid, z.name, z.code))
}

const formatGroupMembers = (members = []) =>
  members.map(
    ({
      adherent_uuid: id,
      first_name: firstname,
      last_name: lastname,
      registered_at: registeredAt,
      postal_code: postalCode,
    }) => new GroupMember(id, firstname, lastname, registeredAt, postalCode)
  )

const formatGroup = (group = {}) => {
  const members = new Array(group.members_count).fill(GroupMember.NULL)
  return new Group(group.uuid, group.name, group.creator, members, null, null)
}

export const getGroupsQuery = async ({ pageParam: page = 1 }) => {
  const data = await apiClient.get(`api/v3/teams?order[created_at]=desc&page=${page}&page_size=20`)
  const groups = data.items.map(formatGroup)
  return newPaginatedResult(groups, data.metadata)
}

export const getGroupQuery = async groupId => {
  const group = await apiClient.get(`api/v3/teams/${groupId}`)
  const groupMembers = formatGroupMembers(group.members)
  if (group.visibility === 'national') return new Group(group.uuid, group.name, group.creator, groupMembers, true, null)
  return new Group(
    group.uuid,
    group.name,
    group.creator,
    groupMembers,
    false,
    new Zone(group.zone.uuid, group.zone.code, group.zone.name)
  )
}

export const createGroupQuery = group =>
  apiClient.post('api/v3/teams', {
    name: group.name,
    zone: group.zone?.id,
  })
export const updateGroupQuery = group =>
  apiClient.put(`api/v3/teams/${group.id}`, {
    name: group.name,
    zone: group.zone?.id,
  })

export const addGroupMemberQuery = ({ groupId, memberId }) =>
  apiClient.put(`api/v3/teams/${groupId}/add-members`, [{ adherent_uuid: memberId }])

export const deleteGroupMemberQuery = ({ groupId, memberId }) =>
  apiClient.delete(`api/v3/teams/${groupId}/members/${memberId}`)
