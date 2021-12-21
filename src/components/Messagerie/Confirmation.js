import { Container, Paper, Button, Grid } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Link } from 'react-router-dom'

const useStyles = makeStyles(theme => ({
  paperContainer: {
    padding: '16px',
    textAlign: 'center !important',
    borderRadius: '8px',
  },
  elementContainer: {
    textAlign: 'center',
  },
  success: {
    marginBottom: '16px',
  },
  returnButton: {
    color: theme.palette.whiteCorner,
    background: theme.palette.blue600,
    '&:hover': {
      background: theme.palette.blue800,
    },
  },
}))

const Confirmation = () => {
  const classes = useStyles()

  return (
    <Container>
      <Paper className={classes.paperContainer}>
        <Grid container className={`${classes.elementContainer} ${classes.success}`}>
          <Grid item xs={12}>
            Félicitations, votre e-mail a bien été envoyé 🎉
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={12}>
            <Link to="../">
              <Button className={classes.returnButton}>Revenir à la messagerie</Button>
            </Link>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  )
}

export default Confirmation
