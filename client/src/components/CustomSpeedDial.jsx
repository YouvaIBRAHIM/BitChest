import { useState } from 'react';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import { UserPlus } from '@phosphor-icons/react';
import NewUserDialog from './UserComponents/UsersListViewComponents/NewUserDialog';

const CustomSpeedDial = ({}) => {
    const [open, setOpen] = useState(false);
    const [newUserDialog, setNewUserDialog] = useState(false);
    const handleNewUserDialog = () => setNewUserDialog(true);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
  
    return (
      <Box>
        <NewUserDialog open={newUserDialog} setOpen={setNewUserDialog}/>
        <Backdrop open={open} />
        <SpeedDial
          ariaLabel="SpeedDial tooltip example"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          icon={<SpeedDialIcon />}
          onClose={handleClose}
          onOpen={handleOpen}
          open={open}
        >
          <SpeedDialAction
            icon={<UserPlus size={24} weight="duotone" />}
            tooltipTitle={"Nouvel utilisateur"}
            tooltipOpen
            onClick={handleNewUserDialog}
          />
        </SpeedDial>
      </Box>
    );
}

export default CustomSpeedDial;