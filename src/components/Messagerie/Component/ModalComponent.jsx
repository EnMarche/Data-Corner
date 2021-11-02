import {
    Dialog, Box, Button, makeStyles, createStyles,
} from '@material-ui/core';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => createStyles({
    paper: {
        background: theme.palette.whiteCorner,
        borderRadius: '12px',
        padding: '32px',
    },
    title: {
        fontSize: '18px',
        color: theme.palette.gray700,
        fontWeight: '600',
        marginBottom: '10px',
    },
    description: {
        fontSize: '14px',
        color: theme.palette.gray700,
        fontWeight: '400',
        margin: '0 0 32px',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    cancelButton: {
        color: theme.palette.blue600,
        background: theme.palette.whiteCorner,
        border: `1px solid ${theme.palette.blue600}`,
        borderRadius: '8.35px',
        padding: '8px 16px',
        marginRight: '16px',
        '&:hover': {
            background: theme.palette.gray100,
        },
    },
    sendButton: {
        color: theme.palette.whiteCorner,
        background: theme.palette.blue600,
        borderRadius: '8.35px',
        padding: '8px 16px',
        '&:hover': {
            background: theme.palette.blue800,
        },
    },
}));

const ModalComponent = ({
    open, handleClose, handleSendEmail, recipientCount,
}) => {
    const classes = useStyles();

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            classes={{ paper: classes.paper }}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <Box className={classes.title}>Confirmation</Box>
            <Box id="alert-dialog-description" className={classes.description}>
                <span>Êtes-vous sûr de vouloir envoyer le message à {recipientCount} contact{recipientCount > 1 && 's'} ?</span>
            </Box>
            <Box className={classes.buttonContainer}>
                <Button
                    variant="contained"
                    onClick={handleClose}
                    className={classes.cancelButton}
                >
                    Annuler
                </Button>
                <Button
                    variant="contained"
                    onClick={() => {
                        handleSendEmail();
                        handleClose();
                    }}
                    className={classes.sendButton}
                >
                    Envoyer
                </Button>
            </Box>
        </Dialog>
    );
};

export default ModalComponent;

ModalComponent.defaultProps = {
    recipientCount: 0,
};

ModalComponent.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleSendEmail: PropTypes.func.isRequired,
    recipientCount: PropTypes.number,
};
