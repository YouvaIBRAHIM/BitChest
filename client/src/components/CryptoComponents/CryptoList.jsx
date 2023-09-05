import { Card, CardHeader, CardContent, List, ListItemText, ListItemAvatar, ListItemButton, Box, Typography, Avatar, Icon, ButtonGroup, Button } from '@mui/material';
import colors from "../../services/Tailwind.service";
import { useMemo, useRef } from 'react';
import SearchField from './SearchField';

const CryptoList = ({ cryptos, setSelectedCrypto, selectedCrypto }) => {
    if (!cryptos || cryptos.length === 0) {
        return null
    }
    const total = useRef(0)
    const baseURL = import.meta.env.VITE_API_URL;

    const cryptoList = useMemo(() => {
        total.current = 0;
        return (
            cryptos.map((crypto, index)=> {
                const amount = crypto?.pivot?.amount * crypto?.current_rate;
                total.current = total.current + amount
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
                        onClick={() => setSelectedCrypto({name: crypto.name, code: crypto.code})}
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
                                    color: crypto?.current_rate > crypto?.last_day_rate ? colors.green[400] : colors.red[400],
                                    fontWeight: 600
                                }}
                            >
                                {amount.toFixed(2)}€
                            </Typography>
                            <Typography 
                                variant="body1"
                                sx={{
                                    fontSize: 12
                                }}
                            >
                                {crypto?.current_rate?.toFixed(2)}€
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
                    aria-label="text button group"
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

                    >
                        Tendances
                    </Button>
                    <Button

                    >
                        Populaires
                    </Button>
                    <Button

                    >
                        Récentes
                    </Button>
                </ButtonGroup>
                <SearchField />
                <List dense={false}>
                    {cryptoList}
                </List>
            </CardContent>
        </Card>
    );
};



export default CryptoList;
