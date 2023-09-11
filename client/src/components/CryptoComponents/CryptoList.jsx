import { Card, CardHeader, CardContent, List, ListItemText, ListItemAvatar, ListItemButton, Box, Typography, Avatar, ButtonGroup, Button } from '@mui/material';
import colors from "../../services/Tailwind.service";
import { useEffect, useMemo } from 'react';
import SearchField from './SearchField';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getCryptos, newCryptoView } from '../../services/Api.service';
import { CryptoListSkeleton } from '../Skeletons/CryptoList';
import ListNotFound from '../ListNotFound';
import ViewMoreButton from './ViewMoreButton';

// Liste les cryptomonnaies disponibles dans la base de données
const CryptoList = ({ 
    cryptos, 
    setSelectedCrypto, 
    selectedCrypto, 
    setSnackBar, 
    setSearch, 
    search, 
    debouncedSearch, 
    filter, 
    setFilter 
}) => {
    const queryClient = useQueryClient()

    const { data: searchedCryptos, isFetching, refetch } = useQuery({ 
        queryKey: ['searchedCryptos'], 
        queryFn: () => getCryptos(search, filter),
        retry: 3,
        refetchInterval: false,
        refetchOnWindowFocus: false,
        enabled: false,
        onSuccess: (data) => {
            queryClient.setQueryData(['cryptos'], data)
        },
        onError: (error) => setSnackBar({message: error, showSnackBar: true, type: "error"})
    });

    useEffect(() => {
        refetch(search, filter)
    }, [debouncedSearch, filter])

    const baseURL = import.meta.env.VITE_API_URL;

    const handleClick = (crypto) => {
        setSelectedCrypto({name: crypto.name, code: crypto.code})
        newCryptoView(crypto?.id)
    }
    
    const cryptoList = useMemo(() => {
        if (!cryptos || cryptos.length === 0) {
            return <ListNotFound message="Aucune crypto trouvée."/>
        }
        return (
            cryptos.map((crypto, index)=> {
                const firstRate = crypto.crypto_rates[0][1]
                return (
                    <ListItemButton
                        key={index}
                        sx={{
                            py:1,
                            justifyContent: "space-between",
                            alignItems: "center",
                            backgroundColor: selectedCrypto.code === crypto.code && "#00000030",
                            borderRadius: 1
                        }}
                        onClick={() => handleClick(crypto)}
                    >   
                        <Box
                            className="flex items-center"
                        >
                            <ListItemAvatar>
                                <Avatar
                                    src={baseURL + crypto.logo}
                                    alt={crypto?.code}
                                />
                            </ListItemAvatar>
                            <ListItemText
                                primary={crypto?.name}
                                secondary={crypto?.code}
                            />
                        </Box>
                        <Box
                            className="flex flex-col items-end"
                        >
                            <Typography 
                                variant="body1"
                                sx={{
                                    color: crypto?.latest_crypto_rate?.rate > firstRate ? colors.green[400] : colors.red[400],
                                    fontWeight: 600
                                }}
                            >
                                {crypto?.latest_crypto_rate?.rate.toFixed(2)}€
                            </Typography>
                        </Box>
                    </ListItemButton>
                )
            })
        )
    }, [cryptos, selectedCrypto])


    return (
        <Card>
            <CardHeader
                title="Liste des cryptomonnaies"
                className='bg-green-400'
                sx={{
                    "& .MuiCardHeader-content": {
                        display: "flex",
                        flexDirection: "column-reverse"
                    },
                    "& .MuiCardHeader-title": {
                        fontWeight: 600,
                        fontSize: 32
                    },
                    "& .MuiCardHeader-subheader": {
                        fontWeight: 500,
                        fontSize: 24
                    }
                }}
            />
                

            <CardContent
                className='flex flex-col gap-2'
            >
                <ButtonGroup 
                    variant="text" 
                    aria-label="filter button group"
                    sx={{
                        display: "flex",
                        width: "100%",
                        "& button": {
                            px: {xs: 2, lg: 4},
                            py: 1,
                            width: "100%",
                            fontSize: {xs: 10, lg: 14}
                        }
                    }}

                >
                    <Button
                        variant={`${filter === "trends" ? "contained" : "text"}`}
                        onClick={() => setFilter("trends")}
                    >
                        Tendances
                    </Button>
                    <Button
                        variant={`${filter === "popular" ? "contained" : "text"}`}
                        onClick={() => setFilter("popular")}
                    >
                        Populaires
                    </Button>
                    <Button
                        variant={`${filter === "latest" ? "contained" : "text"}`}
                        onClick={() => setFilter("latest")}
                    >
                        Récentes
                    </Button>
                </ButtonGroup>
                <SearchField 
                    search={search}
                    setSearch={setSearch}
                />
                <List dense={false}>
                    {
                        isFetching ?
                        <CryptoListSkeleton />
                        :
                        cryptoList
                    }
                </List>
                <ViewMoreButton 
                    search={search}
                    filter={filter}
                    count={searchedCryptos?.length ?? 0}
                    setSnackBar={setSnackBar}
                />

            </CardContent>
        </Card>
    );
};



export default CryptoList;
