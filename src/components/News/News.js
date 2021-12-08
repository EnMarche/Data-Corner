import { useState, useCallback } from 'react'
import { Container, Grid, Button as MuiButton } from '@mui/material'
import { styled } from '@mui/system'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { getNewsQuery, updateNewsStatusQuery } from 'api/news'
import { useErrorHandler } from 'components/shared/error/hooks'
import PageTitle from 'ui/PageTitle'
import Header from './Card/Header'
import NewsDomain from 'domain/news'
import CreateEditModal from './CreateEditModal'
import ReadModal from './ReadModal'
import AddIcon from '@mui/icons-material/Add'
import UICard, { Title } from 'ui/Card'
import Actions from './Card/Actions'

const Button = styled(MuiButton)(
  ({ theme }) => `
  color: ${theme.palette.orange500};
  background: ${theme.palette.newsBackground};
  border-radius: 8.35px;
`
)

const News = () => {
  const [viewingNews, setViewingNews] = useState(null)
  const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false)
  const [isReadModalOpen, setIsReadModalOpen] = useState(false)
  const queryClient = useQueryClient()
  const { handleError } = useErrorHandler()

  const { data: news = [], refetch } = useQuery('news', () => getNewsQuery(), { onError: handleError })
  const { mutate: updateNewsStatus } = useMutation(updateNewsStatusQuery, {
    onSuccess: () => {
      refetch()
    },
    onError: handleError,
  })

  const handleNewsCreate = () => {
    setViewingNews(NewsDomain.NULL)
    setIsCreateEditModalOpen(true)
  }

  const handleView = id => () => {
    setViewingNews(news.find(n => n.id === id) || NewsDomain.NULL)
    setIsReadModalOpen(true)
  }

  const handleEdit = id => () => {
    setViewingNews(news.find(n => n.id === id) || NewsDomain.NULL)
    setIsCreateEditModalOpen(true)
  }

  const handleClose = () => {
    setIsCreateEditModalOpen(false)
    setIsReadModalOpen(false)
  }

  const mergeToggledNews = useCallback(
    (id, toggledNews) => prevNews =>
      prevNews
        .filter(n => n.id !== id)
        .concat(toggledNews)
        .sort((a, b) => +b.createdAt - +a.createdAt),
    []
  )

  const toggleNewsStatus = useCallback(
    id => {
      const currentNews = news.find(n => n.id === id)
      const toggledNews = currentNews.toggleStatus()
      // TODO: replace this trick by using a loader inside NewsStatus
      queryClient.setQueryData('news', mergeToggledNews(id, toggledNews))
      updateNewsStatus(toggledNews)
    },
    [news, mergeToggledNews, updateNewsStatus, queryClient]
  )

  const messages = {
    title: 'Actualités',
    create: 'Nouvelle Actualité',
  }

  return (
    <Container maxWidth="lg" sx={{ mb: 2 }}>
      <Grid container justifyContent="space-between">
        <Grid item>
          <PageTitle title={messages.title} />
        </Grid>
        <Grid item>
          <Button onClick={handleNewsCreate}>
            <AddIcon sx={{ mr: 1 }} />
            {messages.create}
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        {news.map(n => (
          <Grid item key={n.id} xs={12} sm={6} md={3} lg={3} xl={3}>
            <UICard
              headerTitle={<Header {...n} />}
              headerSubtitle={<Title subject={n.title} author={`Par ${n.creator}`} />}
              actions={
                <Actions toggleStatus={() => toggleNewsStatus(n.id)} onView={handleView(n.id)} status={n.status} />
              }
            />
          </Grid>
        ))}
      </Grid>
      <CreateEditModal
        open={isCreateEditModalOpen}
        news={viewingNews}
        onCloseResolve={handleClose}
        onSubmitResolve={refetch}
      />
      <ReadModal
        open={isReadModalOpen}
        news={viewingNews}
        handleEdit={handleEdit(viewingNews?.id)}
        onCloseResolve={handleClose}
      />
    </Container>
  )
}

export default News
