import { useCallback, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import CustomSnackbar from '../components/CustomSnackbar';
import LineChart from '../components/AnalyticComponents/LineChart';
import { useQuery } from '@tanstack/react-query';
import { getCryptos } from '../services/Api.service';
import TransactionCard from '../components/WalletComponents/TransactionCard';
import { LineChartSkeleton } from '../components/Skeletons/LineChart';
import { CryptoListCardSkeleton } from '../components/Skeletons/CryptoListCard';
import CryptoList from '../components/CryptoComponents/CryptoList';
import ErrorView from './ErrorView';
import { useDebounce } from '../services/Hook.service';
import { useSelector } from 'react-redux';


const HomeView = () => {
    const { user } = useSelector(state => state.user)
    const [snackBar, setSnackBar] = useState({message: "", showSnackBar: false, type: "info"});
    const [selectedCrypto, setSelectedCrypto] = useState({
      name: "",
      code: ""
    });
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("trends");
    const debouncedSearch = useDebounce(search, 500);

    const { data: cryptos, isFetching, refetch, isError, error } = useQuery({ 
      queryKey: ['cryptos'], 
      queryFn: () => getCryptos(search, filter),
      retry: 3,
      refetchInterval: false,
      refetchOnWindowFocus: false,
      onError: (error) => setSnackBar({message: error, showSnackBar: true, type: "error"})
    });
  
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
      if (cryptos) {
        const crypto = cryptos?.find(crypto => crypto.code === selectedCrypto.code)

        if (crypto) {
          const cryptoRate = crypto?.crypto_rates
          setChartData(cryptoRate)
        }
      }
    }, [selectedCrypto])

    useEffect(() => {
      if (cryptos && selectedCrypto.name === "") {
          const crypto = cryptos[0];
          setSelectedCrypto({
            name: crypto?.name,
            code: crypto?.code,
          })
          setChartData(cryptos[0]?.crypto_rates)
        }
    }, [cryptos])


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
    <Box 
      sx={{ width: '100%'}}
    >
        {
          user?.role === "client" &&
          <Box       
          sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',  
            position: "sticky", 
            top: {xs: "56px", sm: "64px"},  
            zIndex: 45,
    
          }}>
            <TransactionCard setSnackBar={setSnackBar} refetchUserData={refetch}/>
          </Box>
        }
        <Box>
          <Box className='flex flex-wrap lg:flex-nowrap justify-end w-full'>
            <Box className='w-full sm:basis-full lg:basis-2/3 p-2 sm:relative sm:top-0 lg:self-start lg:top-3 lg:sticky'>
              {
                isFetching && !cryptos?.balanceRate ?
                <LineChartSkeleton/>
                :
                <LineChart data={chartData} title={selectedCrypto.name}/>
              }
            </Box>
            <Box className='flex flex-col gap-5 basis-full lg:basis-1/3 p-2'>
              {
                isFetching ?
                <CryptoListCardSkeleton />
                :
                <CryptoList 
                  cryptos={cryptos} 
                  setSelectedCrypto={setSelectedCrypto} 
                  selectedCrypto={selectedCrypto}
                  setSnackBar={setSnackBar}
                  setSearch={setSearch}
                  search={search}
                  debouncedSearch={debouncedSearch}
                  filter={filter}
                  setFilter={setFilter}
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