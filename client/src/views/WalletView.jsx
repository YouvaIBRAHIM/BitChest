import { useCallback, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import CustomSnackbar from '../components/CustomSnackbar';
import { Button, ButtonGroup } from '@mui/material';
import { DownloadSimple, UploadSimple } from '@phosphor-icons/react';
import LineChart from '../components/AnalyticComponents/LineChart';
import BalanceCard from '../components/WalletComponents/BalanceCard';
import CryptoList from '../components/WalletComponents/CryptoList';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getAuthUserWallet } from '../services/Api.service';


const WalletView = () => {
    const [snackBar, setSnackBar] = useState({message: "", showSnackBar: false, type: "info"});
    const [selectedCrypto, setSelectedCrypto] = useState({
      name: "Total",
      code: "all"
    });
  
    const { data: userWallet, isFetching, refetch } = useQuery({ 
      queryKey: ['userWallet'], 
      queryFn: getAuthUserWallet,
      retry: 3,
      refetchInterval: false,
      onError: (error) => setSnackBar({message: error, showSnackBar: true, type: "error"})
    });
  
    const [chartData, setChartData] = useState(userWallet?.balanceRate);

    useEffect(() => {
      if (userWallet) {
        const crypto = userWallet?.cryptos?.find(crypto => crypto.code === selectedCrypto.code)

        if (crypto) {
          const cryptoRate = crypto.crypto_rate.map(rate => [rate[0], rate[1] * crypto.pivot.amount ])
          setChartData(cryptoRate)
        }else{
          setChartData(userWallet?.balanceRate)
        }
      }
    }, [selectedCrypto, userWallet])
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
          <div className='flex flex-wrap lg:flex-nowrap justify-end w-full'>
            <div className='w-full sm:basis-full lg:basis-2/3 p-2 sm:relative sm:top-0 lg:self-start lg:top-3 lg:sticky'>
              {
                userWallet?.balanceRate &&
                <LineChart data={chartData} title={selectedCrypto.name}/>
              }
            </div>
            <div className='flex flex-col gap-5 sm:basis-full lg:basis-1/3 p-2'>
              <BalanceCard 
                balance={userWallet?.balance} 
                cryptos={userWallet?.cryptos}
              />
              <CryptoList 
                cryptos={userWallet?.cryptos} 
                setSelectedCrypto={setSelectedCrypto} 
                selectedCrypto={selectedCrypto}
              />
            </div>
          </div>
        </Box>
        <Box>
          
        </Box>
        <CustomSnackbar open={snackBar.showSnackBar} handleClose={handleCloseSnackBar} type={snackBar.type} message={snackBar.message}/>

    </Box>
    );
}


export default WalletView;