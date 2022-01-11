import PropTypes from 'prop-types'
import { Grid, Box } from '@mui/material'
import PageTitle from 'ui/PageTitle'
import MainButton from 'ui/MainButton'
import AddIcon from '@mui/icons-material/Add'

export const PageHeaderButton = ({ onClick, label, icon = <AddIcon /> }) => (
  <MainButton onClick={onClick}>
    {icon}
    <Box component="span" sx={{ ml: 1 }}>
      {label}
    </Box>
  </MainButton>
)

PageHeaderButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.object,
}

const PageHeader = ({ title, button }) => (
  <>
    <Grid item data-cy="ui-page-header">
      <PageTitle title={title} />
    </Grid>
    {button && (
      <Grid item data-cy="ui-page-header-button">
        {button}
      </Grid>
    )}
  </>
)

export default PageHeader

PageHeader.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  button: PropTypes.node,
}
