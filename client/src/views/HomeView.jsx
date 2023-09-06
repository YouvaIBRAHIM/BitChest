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
import CryptoList from '../components/CryptoComponents/CryptoList';


const HomeView = () => {
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
      refetchOnWindowFocus: false,
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


    return (
    <Box sx={{ width: '100%'}}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TransactionCard setSnackBar={setSnackBar} refetchUserData={refetch}/>
        </Box>
        <Box>
          <Box className='flex flex-wrap lg:flex-nowrap justify-end w-full'>
            <Box className='w-full sm:basis-full sm:basis-2/3 p-2 sm:relative sm:top-0 lg:self-start lg:top-3 lg:sticky'>
              {
                isFetching && !userWallet?.balanceRate ?
                <Box
                  className="flex-col w-full gap-5 mt-5"
                >
                  <LineChartSkeleton/>
                  <Box
                    className="flex flex-wrap md:flex-nowrap w-full gap-5"
                  >
                    <Box
                      className="w-full lg:basis-2/4"
                    >
                      <BalanceCardSkeleton/>
                    </Box>
                    <Box
                      className="w-full lg:basis-2/4"
                    >
                      <UserCryptoListSkeleton />
                    </Box>
                  </Box>
                </Box>
                :
                <Box
                  className="flex-col w-full gap-5"
                >
                  <LineChart data={chartData} title={selectedCrypto.name}/>
                  <Box
                    className="flex flex-wrap w-full gap-5 mt-5"
                  >
                    <Box
                      className="w-full lg:basis-2/5"
                    >
                      <BalanceCard 
                        balance={userWallet?.balance} 
                        cryptos={userWallet?.cryptos_wallet}
                        setSnackBar={setSnackBar}
                      />
                    </Box>
                    <Box
                      className="w-full lg:basis-2/5"
                    >
                      <UserCryptoList 
                        cryptos={userWallet?.cryptos_wallet} 
                        setSelectedCrypto={setSelectedCrypto} 
                        selectedCrypto={selectedCrypto}
                      />
                    </Box>
                  </Box>
                </Box>
              }

            </Box>
            <Box className='flex flex-col gap-5 basis-full lg:basis-1/3 lg:max-w-1/3 p-2'>

              {
                isFetching ?
                <UserCryptoListSkeleton />
                :
                <CryptoList 
                  cryptos={userWallet?.cryptos} 
                  setSelectedCrypto={setSelectedCrypto} 
                  selectedCrypto={selectedCrypto}
                />
              }

            </Box>
          </Box>
        </Box>
        <Box>
          
        </Box>
        <CustomSnackbar open={snackBar.showSnackBar} handleClose={handleCloseSnackBar} type={snackBar.type} message={snackBar.message}/>

    </Box>
    );
}


export default HomeView;