import { useCallback, useState } from 'react'
import { useMutation } from 'react-query'
import { Container, Grid, Typography } from '@mui/material'
import { styled } from '@mui/system'

import { useQueryWithScope } from 'api/useQueryWithScope'
import { getMyTeamQuery, removeTeamMemberQuery } from 'api/my-team'
import { roles } from './shared/constants'
import { useCustomSnackbar } from 'components/shared/notification/hooks'
import { useErrorHandler } from 'components/shared/error/hooks'
import { notifyVariants } from 'components/shared/notification/constants'
import PageHeader from 'ui/PageHeader'
import { PageHeaderButton } from 'ui/PageHeader/PageHeader'
import EditIcon from 'ui/icons/EditIcon'
import MyTeamMember from './MyTeamMember'
import CreateEdit from './CreateEdit/CreateEdit'

const PageTitle = styled(Typography)`
  font-size: 24px;
  font-weight: 400;
  line-height: 36px;
`

const messages = {
  pageTitle: 'Mon équipe',
  create: 'Ajouter un membre',
  noResult: "Il n'y a aucun membre dans votre équipe",
  deleteSuccess: 'Membre retiré avec succès',
}

const MyTeam = () => {
  const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false)
  const [teamMemberToUpdate, setTeamMemberToUpdate] = useState({})
  const { enqueueSnackbar } = useCustomSnackbar()
  const { handleError } = useErrorHandler()

  const { data: myTeam = {}, refetch: refetchMyTeam } = useQueryWithScope(
    ['my-team', { feature: 'MyTeam', view: 'MyTeam' }],
    () => getMyTeamQuery(),
    {
      onError: handleError,
    }
  )

  const { mutate: removeTeamMember } = useMutation(removeTeamMemberQuery, {
    onSuccess: () => {
      enqueueSnackbar(messages.deleteSuccess, notifyVariants.success)
      refetchMyTeam()
    },
    onError: handleError,
  })

  const handleUpdate = useCallback(
    memberId => () => {
      const teamMember = myTeam.members.find(({ id }) => id === memberId)
      if (!teamMember) return
      setTeamMemberToUpdate(teamMember)
      setIsCreateEditModalOpen(true)
    },
    [myTeam.members]
  )

  const handleDelete = useCallback(
    memberId => () => {
      removeTeamMember(memberId)
    },
    [removeTeamMember]
  )

  const handleClose = () => {
    setTeamMemberToUpdate({})
    setIsCreateEditModalOpen(false)
  }

  return (
    <Container maxWidth="lg" sx={{ mb: 3 }}>
      <Grid container justifyContent="space-between">
        <PageHeader
          title={<PageTitle sx={{ color: 'campaigncolor' }}>{messages.pageTitle}</PageTitle>}
          button={
            <PageHeaderButton
              label={messages.create}
              icon={<EditIcon sx={{ color: 'campaign.color', fontSize: '20px' }} />}
              onClick={() => setIsCreateEditModalOpen(true)}
            />
          }
        />
      </Grid>

      <Grid container justifyContent="space-between" data-cy="my-team-container" sx={{ pt: 1 }}>
        {myTeam.members?.length === 0 && (
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
            data-cy="my-team-not-initialized"
            sx={{ minHeight: '50vh' }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: '400' }}>
              {messages.noResult}
            </Typography>
          </Grid>
        )}
        {myTeam.members?.length > 0 && (
          <Grid container spacing={2} data-cy="my-team-list">
            {myTeam.members.map(member => (
              <MyTeamMember
                key={member.id}
                role={roles[member.role]}
                activist={member.activist}
                accessCount={member.features.length}
                handleUpdate={handleUpdate(member.id)}
                handleDelete={handleDelete(member.id)}
              />
            ))}
          </Grid>
        )}
      </Grid>

      {isCreateEditModalOpen && (
        <CreateEdit
          teamId={myTeam.id}
          teamMember={Object.keys(teamMemberToUpdate).length > 0 ? teamMemberToUpdate : null}
          onCreateResolve={refetchMyTeam}
          handleClose={handleClose}
        />
      )}
    </Container>
  )
}

export default MyTeam