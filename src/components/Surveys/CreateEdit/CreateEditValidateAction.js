import PropTypes from 'prop-types'
import { Grid, Button } from '@mui/material'
import { styled } from '@mui/system'

import { shouldForwardProps } from 'components/shared/shouldForwardProps'

const ValidateButton = styled(
  props => <Button fullWidth {...props} />,
  shouldForwardProps
)(
  ({
    theme: {
      palette: { campaign },
    },
    disabled,
  }) => ({
    height: '42px',
    background: !disabled ? campaign.button.background.main : campaign.button.background.disabled,
    color: !disabled ? campaign.button.color.main : campaign.button.color.disabled,
    borderRadius: '8px',
    '&:hover': {
      background: !disabled ? campaign.button.background.main : campaign.button.background.disabled,
      color: !disabled ? campaign.button.color.main : campaign.button.color.disabled,
    },
  })
)

const CreateEditValidateAction = ({ label, handleValidate, disabled }) => (
  <Grid container sx={{ pt: 4 }}>
    <ValidateButton onClick={handleValidate} disabled={disabled}>
      {label}
    </ValidateButton>
  </Grid>
)

CreateEditValidateAction.propTypes = {
  label: PropTypes.string.isRequired,
  handleValidate: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
}

export default CreateEditValidateAction