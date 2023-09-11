import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

// Modal de confirmation d'une action sur les utilisateurs
const CustomConfirmationDialog = ({dialog, user, message, onConfirm, setDialog}) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const handleClose = () => {
        setDialog(false);
    };

    return (
        <div>
            <Dialog
                fullScreen={fullScreen}
                open={Boolean(dialog)}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
                maxWidth={"xs"}
            >
                <DialogTitle id="responsive-dialog-title">
                {message}
                </DialogTitle>
                <DialogContent>
                    <ul>
                        {
                            <li>{user.email}</li>
                        }
                    </ul>
                </DialogContent>
                <DialogActions>
                <Button autoFocus onClick={handleClose}>
                    Annuler
                </Button>
                <Button onClick={() => onConfirm(dialog)} autoFocus>
                    Confirmer
                </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default CustomConfirmationDialog;