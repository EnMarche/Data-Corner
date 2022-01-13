import { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Container, Grid } from '@mui/material'
import GroupModal from './GroupModal'
import { getGroupsQuery } from 'api/groups'
import { getNextPageParam, refetchUpdatedPage, usePaginatedData } from 'api/pagination'
import { useInfiniteQueryWithScope } from 'api/useQueryWithScope'
import { Group } from 'domain/group'
import { useErrorHandler } from 'components/shared/error/hooks'
import Header from './Card/Header'
import UICard, { Title } from 'ui/Card'
import Loader from 'ui/Loader'
import PageHeader from 'ui/PageHeader'
import { PageHeaderButton } from 'ui/PageHeader/PageHeader'
import Actions from './Card/Actions'

const messages = {
  title: 'Groupes',
  create: 'Créer un groupe',
}

const Groups = () => {
  const [currentGroup, setCurrentGroup] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { handleError, errorMessages, resetErrorMessages } = useErrorHandler()
  const {
    data: paginatedGroups = null,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQueryWithScope('groups', getGroupsQuery, {
    getNextPageParam,
    onError: handleError,
  })

  const groups = usePaginatedData(paginatedGroups)

  const handleNewGroup = () => {
    setCurrentGroup(Group.NULL)
    setIsModalOpen(true)
  }

  const handleEditGroup = id => {
    setCurrentGroup(groups.find(group => group.id === id))
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    resetErrorMessages()
  }

  return (
    <Container maxWidth="lg" sx={{ mb: 3 }}>
      <Grid container justifyContent="space-between">
        <PageHeader
          title={messages.title}
          button={<PageHeaderButton onClick={handleNewGroup} label={messages.create} />}
        />
      </Grid>
      {paginatedGroups && (
        <InfiniteScroll
          dataLength={groups.length}
          next={() => fetchNextPage()}
          hasMore={hasNextPage}
          loader={<Loader />}
        >
          <Grid container spacing={2}>
            {groups.map(group => (
              <Grid item key={group.id} xs={12} sm={6} md={3}>
                <UICard
                  rootProps={{ sx: { height: '168px' } }}
                  headerProps={{ sx: { pt: '21px' } }}
                  header={
                    <>
                      <Header groupCount={group.members.length} />
                      <Title subject={group.name} author={group.creator} sx={{ pt: 1 }} />
                    </>
                  }
                  actionsProps={{ sx: { pt: 3 } }}
                  actions={<Actions groupId={group.id} onEdit={() => handleEditGroup(group.id)} />}
                />
              </Grid>
            ))}
          </Grid>
        </InfiniteScroll>
      )}
      {currentGroup && (
        <GroupModal
          open={isModalOpen}
          group={currentGroup}
          onCloseResolve={handleCloseModal}
          errors={errorMessages}
          onCreateEditResolve={updatedGroup => {
            !currentGroup?.id ? refetch() : refetchUpdatedPage(paginatedGroups, refetch, updatedGroup.id)
          }}
        />
      )}
    </Container>
  )
}

export default Groups
