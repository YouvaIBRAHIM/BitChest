import { useState } from 'react';
import Button from '@mui/material/Button';
import { Box, ButtonGroup } from '@mui/material';
import { DownloadSimple, UploadSimple } from '@phosphor-icons/react';
import SaleModal from './SaleModal';
import PurchaseModal from './PurchaseModal';

const TransactionCard = ({ setSnackBar, refetchUserData }) => {
  const [openPurchaseModal, setOpenPurchaseModal] = useState(false);
  const [openSaleModal, setOpenSaleModal] = useState(false);


  return (
    <Box
      sx={{ 
        borderBottom: 1, 
        borderColor: 'divider',  
        position: "sticky", 
        top: {xs: "56px", sm: "64px"},  
        zIndex: 45,

      }}
      bgcolor="secondary.main"
    >
      <ButtonGroup
        disableElevation
        variant="contained"
        aria-label="Action buttons"
        sx={{
          display: "flex",
          justifyContent: {xs: "center", sm: "flex-start"},
          borderRadius: 0
        }}
        color='secondary'
      >
        <Button
          startIcon={<DownloadSimple size={24} weight="duotone" />}
          sx={{
            px: 4,
            py: 1,
            width: {xs: "100%", sm: "auto"},
            borderRadius: 0
          }}
          onClick={() => setOpenPurchaseModal(true)}
        >
          Acheter
        </Button>
        <Button
          startIcon={<UploadSimple size={24} weight="duotone" />}
          sx={{
            px: 4,
            py: 1,
            width: {xs: "100%", sm: "auto"},
            borderRadius: 0
          }}
          onClick={() => setOpenSaleModal(true)}
        >
          Vendre
        </Button>
      </ButtonGroup>
      
      <PurchaseModal 
        open={openPurchaseModal}
        setOpen={setOpenPurchaseModal}
        setSnackBar={setSnackBar} 
        refetchUserData={refetchUserData}
      />
      <SaleModal 
        open={openSaleModal}
        setOpen={setOpenSaleModal}
        setSnackBar={setSnackBar} 
        refetchUserData={refetchUserData}
      />
    </Box>
  );
}




export default TransactionCard;