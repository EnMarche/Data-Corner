import PropTypes from 'prop-types'
import { Grid, LinearProgress, Typography } from '@mui/material'
import { styled } from '@mui/system'

const ProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: '8px',
  borderRadius: '6px',
  background: theme.palette.campaign.background.progressBar.empty,
  '& .MuiLinearProgress-bar1Determinate': {
    background: theme.palette.main,
  },
}))

const Current = styled(Typography)(
  ({ theme }) => `
  color: ${theme.palette.main};
  font-size: 28px;
  font-weight: 600;
  line-height: 28px;
`
)

const messages = {
  separator: '/',
}

const UIRatioProgress = ({ count, totalCount }) => {
  const value = Math.round((count / totalCount) * 100)
  return (
    <div>
      <Grid container alignItems="flex-end" data-cy="ui-ratio-progress">
        <Current>{count}</Current>
        <Typography variant="subtitle1" sx={{ pl: 0.3, color: 'campaign.background.ratio.max' }}>
          {messages.separator}
          {totalCount}
        </Typography>
      </Grid>
      <ProgressBar variant="determinate" value={value > 100 ? 100 : value} sx={{ mt: 0.5 }} />
    </div>
  )
}

UIRatioProgress.propTypes = {
  count: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
}

export default UIRatioProgress
