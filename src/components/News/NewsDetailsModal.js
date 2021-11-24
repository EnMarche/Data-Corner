import { Dialog, Grid, Button as MuiButton, Icon, Paper } from '@mui/material'
import { styled } from '@mui/system'
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded'
import NotificationsOffRoundedIcon from '@mui/icons-material/NotificationsOffRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import PropTypes from 'prop-types'
import DomainNews from 'domain/news'
import { shouldForwardProps } from 'components/shared/notification/helpers'

const StyledPaper = styled(Paper)(
  ({ theme }) => `
  padding: ${theme.spacing(4)};
  width: 664px;
  border-radius: 12px;
`
)

const Title = styled(Grid)(
  ({ theme }) => `
  font-size: 16px;
  font-weight: 400;
  color: ${theme.palette.gray800};
  margin-top: ${theme.spacing(1)};
`
)

const ButtonItem = styled(Grid)(
  ({ theme }) => `
  background: ${theme.palette.newsBackground};
  border-radius: 8.35px;
  margin-bottom: ${theme.spacing(4)};
`
)

const Button = styled(MuiButton)(
  ({ theme }) => `
  color: ${theme.palette.orange500};
  padding: ${theme.spacing(0.75, 1)};
`
)

const EditIcon = styled(EditRoundedIcon)(
  ({ theme }) => `
  margin-right: ${theme.spacing(1)};
`
)

const StatusIcon = styled(
  'span',
  shouldForwardProps
)(
  ({ theme, active }) => `
  font-size: 12px;
  font-weight: 500;
  border-radius: 19px;
  padding: ${theme.spacing(0.25, 1)};
  color: ${active ? theme.palette.teal700 : theme.palette.red600};
  background: ${active ? theme.palette.activeLabel : theme.palette.inactiveLabel};
`
)

const DateItem = styled(Grid)(
  ({ theme }) => `
  font-size: 14px;
  margin-top: ${theme.spacing(0.25)};
`
)

const CreatorContainer = styled(Grid)(
  ({ theme }) => `
  margin-bottom: ${theme.spacing(4)};
`
)

const CreatorItem = styled(Grid)(
  ({ theme }) => `
  font-size: 10px;
  color: ${theme.palette.gray600};
  padding: 0;
`
)

const NotificationIcon = styled(Icon)(
  ({ theme }) => `
  padding: ${theme.spacing(0.25, 1)};
  margin: ${theme.spacing(0.25, 0, 0, 0)};
  border: 1px solid ${theme.palette.gray200};
  border-radius: 19px;
  font-size: 14px;
  font-weight: 500;
`
)

const messages = {
  edit: 'Modifier',
  published: 'Publiée',
  unpublished: 'Dépubliée',
}

const NewsDetailsModal = ({ news, handleClose, open }) =>
  news && (
    <Dialog open={open} onClose={handleClose} PaperComponent={StyledPaper}>
      <Grid container justifyContent="space-between">
        <Title item>{news.title}</Title>
        <ButtonItem item>
          <Button>
            <EditIcon />
            {messages.edit}
          </Button>
        </ButtonItem>
      </Grid>
      <Grid container spacing={1}>
        <Grid item>
          <StatusIcon active={news.status}>{news.status ? messages.published : messages.unpublished}</StatusIcon>
        </Grid>
        <Grid item>
          {news?.withNotification && <NotificationIcon component={NotificationsActiveRoundedIcon} />}
          {!news?.withNotification && <NotificationIcon component={NotificationsOffRoundedIcon} />}
        </Grid>
        <DateItem item>{new Date(news.createdAt).toLocaleDateString()}</DateItem>
      </Grid>
      <CreatorContainer container>
        <CreatorItem item>Par {news.creator}</CreatorItem>
      </CreatorContainer>
      <Grid container>
        <Grid item xs={12}>
          {news.body}
        </Grid>
      </Grid>
    </Dialog>
  )

export default NewsDetailsModal

NewsDetailsModal.defaultProps = {
  handleClose: () => {},
  onSubmitRefresh: () => {},
  news: null,
}

NewsDetailsModal.propTypes = {
  handleClose: PropTypes.func,
  onSubmitRefresh: PropTypes.func,
  news: DomainNews.propTypes,
  open: PropTypes.bool.isRequired,
}
