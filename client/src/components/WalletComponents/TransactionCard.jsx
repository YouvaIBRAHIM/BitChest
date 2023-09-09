import { useState } from 'react';
import Button from '@mui/material/Button';
import { ButtonGroup } from '@mui/material';
import { DownloadSimple, UploadSimple } from '@phosphor-icons/react';
import SaleModal from './SaleModal';


const TransactionCard = ({ setSnackBar, refetchUserData }) => {
  const [openSaleModal, setOpenSaleModal] = useState(false);


  return (
    <div>
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
          onClick={() => setOpenSaleModal(true)}
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
      
      <SaleModal 
        open={openSaleModal}
        setOpen={setOpenSaleModal}
        setSnackBar={setSnackBar} 
        refetchUserData={refetchUserData}
      />
    </div>
  );
}




export default TransactionCard;