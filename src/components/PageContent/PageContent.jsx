import PropTypes from 'prop-types'
import { useLocation } from 'react-router-dom'
import { Container, Grid } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import createStyles from '@mui/styles/createStyles'
import { MENU } from '../../Routes'
import list from 'assets/list.svg'

const useStyles = makeStyles(theme =>
  createStyles({
    pageContent: {
      width: `calc(100% - ${theme.spacing(34)})`,
      margin: theme.spacing(2, 0, 0, 34),
      transition: 'all 0.4s',
      '&.active': {
        width: '100%',
        marginLeft: 0,
      },
      [theme.breakpoints.down('md')]: {
        width: '100%',
        marginLeft: 0,
        '&.active': {
          width: `calc(100% - ${theme.spacing(34)})`,
          marginLeft: theme.spacing(34),
        },
      },
    },
    container: {
      padding: theme.spacing(0, 2),
    },
    toggleButton: {
      height: '34px',
      width: '40px',
      color: theme.palette.grayCorner3,
      backgroundColor: theme.palette.whiteCorner,
      border: 'none',
      cursor: 'pointer',
      marginTop: theme.spacing(0.75),
    },
    title: {
      fontSize: '32px',
      fontWeight: '600',
    },
  })
)

const PageContent = ({ children }) => {
  const { pathname } = useLocation()
  const pathIndex = MENU.findIndex(path => path.route === pathname)
  const classes = useStyles()
  let pageTitle
  if (pathIndex !== -1) {
    pageTitle = MENU[pathIndex].label || null
  }

  return (
    <div id="pageContent" className={classes.pageContent}>
      <Container maxWidth="xl" className={classes.container}>
        <Grid container spacing={2}>
          <Grid item>
            <button id="toggleButton" className={`dc-container ${classes.toggleButton}`}>
              <img src={list} alt="Menu button" />
            </button>
          </Grid>
          <Grid item>
            {pageTitle && pageTitle !== 'Messagerie' && pageTitle !== 'Ripostes' && pageTitle !== 'Équipes' && (
              <span className={classes.title}>{pageTitle}</span>
            )}
          </Grid>
        </Grid>
        {children}
      </Container>
    </div>
  )
}

export default PageContent

PageContent.propTypes = {
  children: PropTypes.instanceOf(Object).isRequired,
}
