import { useMemo } from 'react'
import PropTypes from 'prop-types'
import { Grid, Icon as MuiIcon, Typography } from '@mui/material'
import { styled } from '@mui/system'
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded'
import NotificationsOffRoundedIcon from '@mui/icons-material/NotificationsOffRounded'
import MuiCloseIcon from '@mui/icons-material/Close'
import DomainNews from 'domain/news'
import { shouldForwardProps } from 'components/shared/shouldForwardProps'
import { useCurrentDeviceType } from 'components/shared/device/hooks'
import EditIcon from '@mui/icons-material/EditRounded'
import PersonIcon from '@mui/icons-material/Person'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import { format } from 'date-fns'
import { TruncatedText } from 'components/shared/styled'
import Button from 'ui/Button'
import NewsEditor from './NewsEditor'
import Dialog from 'ui/Dialog'
import ReadCTA from './ReadCTA'
import { ctaModePublication } from './constants'

const HeaderContainer = styled(Grid)`
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const StatusIcon = styled(
  'span',
  shouldForwardProps
)(
  ({ theme, active }) => `
  font-size: 10px;
  font-weight: 500;
  line-height: 15px;
  border-radius: 19px;
  margin-right: ${theme.spacing(1)};
  padding: ${theme.spacing(0.25, 1)};
  color: ${active ? theme.palette.green700 : theme.palette.red600};
  background: ${active ? theme.palette.activeLabel : theme.palette.inactiveLabel};
`
)

const NotificationIcon = styled(MuiIcon)(
  ({ theme }) => `
  font-size: 15px;
  padding: ${theme.spacing(0.25, 1)};
  margin-right: ${theme.spacing(1)};
  border: 1px solid ${theme.palette.gray300};
  border-radius: 19px;
`
)

const DateItem = styled(Typography)(
  ({ theme }) => `
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  color: ${theme.palette.gray600};
`
)

const CloseIcon = styled(MuiCloseIcon)`
  color: ${({ theme }) => theme.palette.gray700};
  cursor: pointer;
`

const Title = styled(TruncatedText)(
  ({ theme }) =>
    `
  font-size: 24px;
  font-weight: 600;
  line-height: 30px;
  color: ${theme.palette.gray800}
  width: 400px;
`
)

const Author = styled(Typography)(
  ({ theme }) => `
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  color: ${theme.palette.gray600};
  margin-right: ${theme.spacing(1)}
`
)

const UserTimeContainer = styled(Grid)(
  () => `
  display: flex;
  align-items: center;
`
)

const messages = {
  published: 'Publiée',
  unpublished: 'Dépubliée',
  edit: 'Modifier',
}

const ReadModal = ({ open, news, handleEdit, onCloseResolve }) => {
  const Icon = news?.withNotification ? NotificationsActiveRoundedIcon : NotificationsOffRoundedIcon
  const { isMobile } = useCurrentDeviceType()
  const isPublished = useMemo(() => !!news?.status, [news])

  if (!news) return null

  const handleClose = () => {
    onCloseResolve()
  }

  const readOnlyConfiguration = {
    toolbar: null,
  }

  return (
    <Dialog open={open} handleClose={handleClose}>
      <HeaderContainer container sx={{ mt: isMobile ? 2 : 0 }}>
        <StatusIcon active={news?.status}>{news?.status ? messages.published : messages.unpublished}</StatusIcon>
        <NotificationIcon component={Icon} />
        <DateItem>{format(news?.createdAt || new Date(), 'dd/MM/yyyy')}</DateItem>
        <Button
          onClick={handleEdit}
          isMainButton
          rootProps={{
            sx: {
              margin: theme => theme.spacing('auto', 1, 'auto', 'auto'),
              padding: theme => theme.spacing(0.75, 1),
            },
          }}
        >
          <EditIcon sx={{ mr: 1 }} />
          {messages.edit}
        </Button>

        <CloseIcon onClick={handleClose} data-testid="close-icon" />
      </HeaderContainer>
      <Grid sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
        <StatusIcon active={isPublished}>{isPublished ? messages.published : messages.unpublished}</StatusIcon>
        <NotificationIcon component={Icon} />
      </Grid>
      <Title title={news?.title}>{news?.title}</Title>
      <UserTimeContainer>
        <PersonIcon sx={{ mr: 0.5, color: 'gray600', fontSize: '12px' }} />
        <Author>{news?.creator}</Author>
        <AccessTimeIcon sx={{ mr: 0.5, ml: 2, color: 'gray600', fontSize: '12px' }} />
        <DateItem>{`Le ${format(news?.createdAt || new Date(), 'dd/MM/yyyy')} à ${format(
          news?.createdAt || new Date(),
          'hh:mm'
        )}`}</DateItem>
      </UserTimeContainer>
      <NewsEditor
        config={readOnlyConfiguration}
        data={news?.body}
        readOnly={true}
        onReady={editor => {
          editor.isReadOnly = true
        }}
      />
      <Grid>
        <ReadCTA news={news} />
        <ReadCTA mode={ctaModePublication} news={news} handleClose={handleClose} />
      </Grid>
    </Dialog>
  )
}

export default ReadModal

ReadModal.defaultProps = {
  onCloseResolve: () => {},
}

ReadModal.propTypes = {
  open: PropTypes.bool.isRequired,
  news: DomainNews.propTypes,
  handleEdit: PropTypes.func.isRequired,
  onCloseResolve: PropTypes.func,
}
