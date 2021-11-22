import { useState } from 'react'
import { IconButton } from '@mui/material'
import { makeStyles } from '@mui/styles'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import PropTypes from 'prop-types'

const useStyles = makeStyles(theme => ({
  iconButton: {
    marginTop: theme.spacing(1.25),
  },
  list: {
    fontSize: '13px',
    padding: 0,
    borderRadius: '8.35px',
  },
}))

const RiposteEnableStatus = ({ id, status, toggleStatus }) => {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div>
      <IconButton
        size="small"
        className={classes.iconButton}
        aria-label="more"
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={event => {
          setAnchorEl(event.currentTarget)
        }}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        classes={{ list: classes.list }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <MenuItem
          onClick={() => {
            handleClose()
            toggleStatus(id)
          }}
          style={{ fontSize: '13px' }}
        >
          {status ? 'Désactiver' : 'Activer'}
        </MenuItem>
      </Menu>
    </div>
  )
}

export default RiposteEnableStatus

RiposteEnableStatus.propTypes = {
  id: PropTypes.string.isRequired,
  status: PropTypes.bool.isRequired,
  toggleStatus: PropTypes.func.isRequired,
}
