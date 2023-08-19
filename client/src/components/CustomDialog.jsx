import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';

const CustomDialog = ({dialog, setDialog, items, itemKey, message, onConfirm}) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [ itemsToDelete, setItemsToDelete ] = useState([])


    const handleClose = () => {
        setDialog(false);
    };

    useEffect(() => {
        if (items && Boolean(dialog)) {
            setItemsToDelete(() => {
                return items.filter((item) => dialog.includes(item.id))
            })
        }
    }, [items, dialog])

    return (
        <div>
            <Dialog
                fullScreen={fullScreen}
                open={Boolean(dialog)}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                {message}
                </DialogTitle>
                <DialogContent>
                    <ul>
                        {
                            itemsToDelete.map((item, index) => <li key={index}>{item[itemKey]}</li>)
                        }
                    </ul>
                </DialogContent>
                <DialogActions>
                <Button autoFocus onClick={handleClose}>
                    Annuler
                </Button>
                <Button onClick={onConfirm} autoFocus>
                    Confirmer
                </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default CustomDialog;