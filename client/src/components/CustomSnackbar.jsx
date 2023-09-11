import { forwardRef } from 'react';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Slide } from '@mui/material';

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// Notification de la bonne ou mauvaise exécution d'une action
export default function CustomSnackbar({ open, handleClose, message, type }) {

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Snackbar 
        open={open} 
        autoHideDuration={6000} 
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        TransitionComponent={(props) => <Slide {...props} direction="down" />}
      >
        <Alert onClose={handleClose} severity={type ?? "info"} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </Stack>
  );
}