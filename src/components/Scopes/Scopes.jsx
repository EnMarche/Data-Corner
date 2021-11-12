import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Grid, Button, Menu, MenuItem, Divider, Box } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { getCurrentUser, getUserScopes } from '../../redux/user/selectors'
import { useUserScope } from '../../redux/user/hooks'
import vector from 'assets/vector.svg'

const useStyles = makeStyles(theme => ({
  root: {
    '&:first-child': {
      width: '240px',
    },
    '&:not(:first-child)': {
      padding: '0',
    },
    '&:not(:last-child)': {
      marginBottom: theme.spacing(1),
    },
  },
  list: {
    maxHeight: '500px',
  },
  menuPaper: {
    marginTop: theme.spacing(6.25),
    background: theme.palette.whiteCorner,
    width: '240px',
  },
  scopeButton: {
    background: theme.palette.gray100,
    margin: theme.spacing(0, 2, 2),
    width: '240px',
    height: '34px',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 1.5),
    '&:hover': {
      background: theme.palette.gray200,
    },
  },
  menuItem: {
    color: 'black',
    fontSize: '14px',
    fontWeight: '400',
    padding: theme.spacing(1, 2),
    width: '210px',
    backgroundColor: '#F7F9FC',
    borderRadius: '6px',
    '&:hover': {
      background: 'linear-gradient(0deg,rgba(0,0,0,.05),rgba(0,0,0,.05)),#f7f9fc',
    },
  },
  divider: {
    margin: theme.spacing(1, 0),
    color: theme.palette.gray100,
  },
  profilePlace: {
    fontSize: '10px',
    fontWeight: '400',
  },
  returnButton: {
    color: 'black',
  },
  activeScope: {
    fontSize: '14px',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
}))

function Scopes() {
  const currentUser = useSelector(getCurrentUser)
  const [currentScope, updateCurrentScope] = useUserScope()
  const userScopes = useSelector(getUserScopes)
  const history = useHistory()
  const filteredScopes = userScopes.filter(scope => scope.apps.includes('data_corner'))
  const [anchorEl, setAnchorEl] = useState(null)
  const classes = useStyles()

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const redirect = scope => {
    if (scope.code === 'phoning_national_manager') {
      history.push('/equipes')
    } else {
      history.push('/')
    }
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleChange = userScope => {
    updateCurrentScope(userScope)
    setAnchorEl(null)
    redirect(userScope)
  }

  const scopesContent = scope => {
    if (scope?.zones?.length === 1) {
      return (
        <Box className="zone">
          {scope.zones[0].name} ({scope.zones[0].code})
        </Box>
      )
    }
    if (scope?.zones?.length > 1) {
      return (
        <Box className="zone">
          {`${scope.zones[0].name} (${scope.zones[0].code})`} + {scope.zones.slice(1).length} zone
          {scope.zones.slice(1).length > 1 && 's'}
        </Box>
      )
    }
    return null
  }

  return (
    <Grid className="scopes-container">
      {currentUser && filteredScopes?.length > 0 && (
        <>
          <Button onClick={handleClick} className={classes.scopeButton}>
            <span className={classes.activeScope}>
              {currentUser.firstName} {currentUser.lastName}
            </span>
            <img className="caret-dropdown" src={vector} alt="caret" />
          </Button>
          <Menu
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
            classes={{ paper: classes.menuPaper, list: classes.list }}
          >
            <MenuItem classes={{ root: classes.root }} className={classes.menuItem}>
              <a href={process.env.REACT_APP_OAUTH_HOST} className={classes.returnButton}>
                Retour sur en-marche.fr
              </a>
            </MenuItem>

            {filteredScopes?.length > 1 && <Divider className={classes.divider} />}

            {filteredScopes?.map((userScope, i) => (
              <MenuItem key={i} onClick={() => handleChange(userScope)} disableGutters classes={{ root: classes.root }}>
                <span
                  style={{ backgroundColor: userScope?.code === currentScope?.code ? '#D9EAFF' : '#F7F9FC' }}
                  className={classes.menuItem}
                >
                  {userScope?.name} <br />
                  {scopesContent(userScope)}
                </span>
              </MenuItem>
            ))}
          </Menu>
        </>
      )}
    </Grid>
  )
}

export default Scopes
