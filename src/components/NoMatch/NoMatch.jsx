import { useLocation, Link } from 'react-router-dom'
import { Grid, Container } from '@mui/material'
import { makeStyles } from '@mui/styles'
import PATHS from '../../paths'

const useStyles = makeStyles(theme => ({
  noMatchGridContainer: {
    textAlign: 'center',
    padding: '16px',
    margin: '16px auto',
  },
  noMatchText: {
    marginBottom: '16px',
  },
  noMatchButton: {
    color: 'white',
    background: theme.palette.blueCorner,
    borderRadius: '8.35px',
    padding: '8px 16px',
  },
}))

function NoMatch() {
  const location = useLocation()
  const classes = useStyles()

  return (
    <Container fixed className={`${classes.noMatchGridContainer} with-background dc-container`}>
      <Grid item xs={12} className={classes.noMatchText}>
        L&apos;URL recherchée <strong>{location.pathname}</strong> n&apos;existe pas ou vous n&apos;avez pas les droits
        pour y accéder
      </Grid>
      <Grid item xs={12}>
        <Link to={PATHS.DASHBOARD.route} className={classes.noMatchButton}>
          Retournez à l&apos;accueil
        </Link>
      </Grid>
    </Container>
  )
}

export default NoMatch
