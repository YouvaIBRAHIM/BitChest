import { useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import CustomSnackbar from '../components/CustomSnackbar';
import { Button, ButtonGroup } from '@mui/material';
import { DownloadSimple, UploadSimple } from '@phosphor-icons/react';
import LineChart from '../components/AnalyticComponents/LineChart';


const WalletView = () => {
    const [snackBar, setSnackBar] = useState({message: "", showSnackBar: false, type: "info"});


    const handleCloseSnackBar = useCallback((e, reason) => {
        if (reason === 'clickaway') {
          return;
        }

        setSnackBar({message: "", showSnackBar: false, type: "info"});
      }, [])


    return (
    <Box sx={{ width: '100%'}}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <ButtonGroup
            disableElevation
            variant="text"
            aria-label="Action buttons"
            sx={{
              display: "flex",
              justifyContent: {xs: "center", sm: "flex-start"}
            }}
          >
            <Button
              startIcon={<DownloadSimple size={24} weight="duotone" />}
              sx={{
                px: 4,
                py: 1,
                width: {xs: "100%", sm: "auto"}
              }}
            >
              Acheter
            </Button>
            <Button
              startIcon={<UploadSimple size={24} weight="duotone" />}
              sx={{
                px: 4,
                py: 1,
                width: {xs: "100%", sm: "auto"}
              }}
            >
              Vendre
            </Button>
          </ButtonGroup>
        </Box>

        <Box>
          <LineChart />

        </Box>

        <CustomSnackbar open={snackBar.showSnackBar} handleClose={handleCloseSnackBar} type={snackBar.type} message={snackBar.message}/>

    </Box>
    );
}


export default WalletView;