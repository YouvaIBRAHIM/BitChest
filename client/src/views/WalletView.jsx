import { useCallback, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import CustomSnackbar from '../components/CustomSnackbar';
import LineChart from '../components/AnalyticComponents/LineChart';
import BalanceCard from '../components/WalletComponents/BalanceCard';
import UserCryptoList from '../components/WalletComponents/UserCryptoList';
import { useQuery } from '@tanstack/react-query';
import { getAuthUserWallet } from '../services/Api.service';
import TransactionCard from '../components/TransactionCard';
import { LineChartSkeleton } from '../components/Skeletons/LineChart';
import { BalanceCardSkeleton } from '../components/Skeletons/BalanceCard';
import { UserCryptoListSkeleton } from '../components/Skeletons/UserCryptoList';
import ErrorView from './ErrorView';


const WalletView = () => {
    const [snackBar, setSnackBar] = useState({message: "", showSnackBar: false, type: "info"});
    const [selectedCrypto, setSelectedCrypto] = useState({
      name: "Total",
      code: "all"
    });
  
    const { data: userWallet, isFetching, refetch, error, isError } = useQuery({ 
      queryKey: ['userWallet'], 
      queryFn: getAuthUserWallet,
      retry: 3,
      refetchInterval: false,
      onError: (error) => setSnackBar({message: error, showSnackBar: true, type: "error"})
    });
  
    const [chartData, setChartData] = useState(userWallet?.total_cryptos_rate);

    useEffect(() => {
      if (userWallet) {
        const cryptoWallet = userWallet?.cryptos_wallet?.find(crypto_wallet => crypto_wallet.crypto.code === selectedCrypto.code)

        if (cryptoWallet) {
          const cryptoRate = cryptoWallet?.crypto?.crypto_rates.map(rate => [rate[0], rate[1] * cryptoWallet.amount ])
          setChartData(cryptoRate)
        }else{
          setChartData(userWallet?.total_cryptos_rate)
        }
      }
    }, [selectedCrypto, userWallet])



    const handleCloseSnackBar = useCallback((e, reason) => {
        if (reason === 'clickaway') {
          return;
        }

        setSnackBar({message: "", showSnackBar: false, type: "info"});
    }, [])

    if (isError) {
      return <ErrorView message={error} refetch={refetch}/>
    }
    
    return (
    <Box sx={{ width: '100%'}}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TransactionCard setSnackBar={setSnackBar} refetchUserData={refetch}/>
        </Box>
        <Box>
          <div className='flex flex-wrap lg:flex-nowrap justify-end w-full'>
            <div className='w-full sm:basis-full lg:basis-2/3 p-2 sm:relative sm:top-0 lg:self-start lg:top-3 lg:sticky'>
              {
                isFetching && !userWallet?.balanceRate ?
                <LineChartSkeleton/>
                :
                <LineChart data={chartData} title={selectedCrypto.name}/>
              }
            </div>
            <div className='flex flex-col gap-5 basis-full lg:basis-1/3 p-2'>

              {
                isFetching ?
                <Box
                  className="w-full"
                >
                  <BalanceCardSkeleton/>
                  <UserCryptoListSkeleton />
                </Box>
                :
                <>
                  <BalanceCard 
                    balance={userWallet?.balance} 
                    cryptos={userWallet?.cryptos_wallet}
                    setSnackBar={setSnackBar}
                  />
                  <UserCryptoList 
                    cryptos={userWallet?.cryptos_wallet} 
                    setSelectedCrypto={setSelectedCrypto} 
                    selectedCrypto={selectedCrypto}
                  />
                </>
              }

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