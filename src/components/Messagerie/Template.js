import { useState } from 'react'
import { Grid, TextField } from '@mui/material'
import { styled } from '@mui/system'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useUserScope } from '../../redux/user/hooks'
import { notifyVariants, notifyMessages } from '../shared/notification/constants'
import { useCustomSnackbar } from '../shared/notification/hooks'
import Editor from './Component/Editor'
import StepButton from './Component/StepButton'
import { createMessageContent, updateMessageContent } from 'api/messagerie'
import PropTypes from 'prop-types'
import messageriePaths from './shared/paths'
import * as Sentry from '@sentry/react'
import paths from '../../shared/paths'

const clearBody = body => body.substring(body.indexOf('<table'), body.lastIndexOf('</table>') + 8)

const Title = styled('div')(
  ({ theme }) => `
  font-size: 24px;
  font-weight: 400;
  color: ${theme.palette.blue600};
  margin-bottom: ${theme.spacing(2)};
`
)

const Container = styled(Grid)(
  ({ theme }) => `
  background: ${theme.palette.whiteCorner};
  padding: ${theme.spacing(2)};
  border-radius: 12px 12px 0 0;
`
)

const messages = {
  title: 'Messagerie',
  titleSuffix: 'Créer un message',
  createSuccess: 'Message créé avec succès',
  updateSuccess: 'Message modifié avec succès',
}

const Template = ({ modeUpdate = false }) => {
  const [messageSubject, setMessageSubject] = useState('')
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [currentScope] = useUserScope()
  const navigate = useNavigate()
  const { messageUuid } = useParams()
  const { enqueueSnackbar } = useCustomSnackbar()

  const editEmail = () => {
    const body = {
      type: currentScope.code,
      label: `DataCorner: ${messageSubject}`,
      subject: messageSubject,
      content: clearBody(message.chunks.body),
      json_content: JSON.stringify(message.design),
    }

    if (messageUuid) return updateMessageContent(messageUuid, body)
    return createMessageContent(body)
  }

  const handleClickNext = async () => {
    try {
      setLoading(true)
      const body = await editEmail()
      setMessage(body)
      enqueueSnackbar(modeUpdate ? messages.updateSuccess : messages.createSuccess, notifyVariants.success)
      modeUpdate ? navigate(`../${messageriePaths.filter}`) : navigate(`../${body.uuid}/${messageriePaths.filter}`)
    } catch (e) {
      Sentry.captureException(e)
      enqueueSnackbar(notifyMessages.errorTitle, notifyVariants.error)
    }
  }

  return (
    <>
      <Title>
        <Link to={paths.messagerie}>{messages.title}</Link> &gt; {messages.titleSuffix}
      </Title>
      <Container container>
        <Grid item xs={4} sx={{ justifyContent: 'spaceBetween', mr: 2 }}>
          <TextField
            size="small"
            label="Objet du mail"
            variant="outlined"
            value={messageSubject}
            onChange={event => setMessageSubject(event.target.value)}
            sx={{ width: '100%' }}
          />
        </Grid>
        <Grid item xs={5} />
        <Grid item xs>
          <StepButton
            label="Suivant"
            loading={loading}
            disabled={loading || !messageSubject || !message}
            onClick={handleClickNext}
          />
        </Grid>
      </Container>
      <Editor onMessageSubject={setMessageSubject} onMessageUpdate={setMessage} />
    </>
  )
}

export default Template

Template.propTypes = {
  modeUpdate: PropTypes.bool,
}
