import { useCallback, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import CustomSnackbar from '../components/CustomSnackbar';
import LineChart from '../components/AnalyticComponents/LineChart';
import BalanceCard from '../components/WalletComponents/BalanceCard';
import UserCryptoList from '../components/WalletComponents/UserCryptoList';
import { useQuery } from '@tanstack/react-query';
import { getUserWallet } from '../services/Api.service';
import TransactionCard from '../components/WalletComponents/TransactionCard';
import { LineChartSkeleton } from '../components/Skeletons/LineChart';
import { BalanceCardSkeleton } from '../components/Skeletons/BalanceCard';
import { UserCryptoListSkeleton } from '../components/Skeletons/UserCryptoList';
import ErrorView from './ErrorView';
import TransactionHistory from '../components/WalletComponents/TransactionHistory';
import { useSelector } from 'react-redux';


const WalletView = ({id}) => {
    const { user } = useSelector(state => state.user)

    const [snackBar, setSnackBar] = useState({message: "", showSnackBar: false, type: "info"});
    const [selectedCrypto, setSelectedCrypto] = useState({
      name: "Total",
      code: "all"
    });
  
    const { data: userWallet, isFetching, refetch, error, isError } = useQuery({ 
      queryKey: ['userWallet'], 
      queryFn: () => getUserWallet(id),
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
          const cryptoRate = cryptoWallet?.crypto?.crypto_rates.map(rate => [rate[0], rate[1]])
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
        {
          user?.role === "client" &&
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TransactionCard setSnackBar={setSnackBar} refetchUserData={refetch}/>
          </Box>
        }
        <Box>
          <Box className='flex flex-wrap lg:flex-nowrap justify-end w-full'>
            <Box className='flex flex-col gap-5 w-full sm:basis-full lg:basis-2/3 p-2 sm:relative sm:top-0 lg:self-start lg:top-3 lg:sticky'>
              {
                isFetching && !userWallet?.balanceRate ?
                <>
                  <LineChartSkeleton/>
                </>
                :
                <>
                  <LineChart data={chartData} title={selectedCrypto.name}/>
                  <TransactionHistory 
                    setSnackBar={setSnackBar}
                  />
                </>
              }
            </Box>
            <Box className='flex flex-col gap-5 basis-full lg:basis-1/3 p-2'>

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

            </Box>
          </Box>
        </Box>
        <Box>
        </Box>
        <CustomSnackbar open={snackBar.showSnackBar} handleClose={handleCloseSnackBar} type={snackBar.type} message={snackBar.message}/>

    </Box>
    );
}


export default WalletView;