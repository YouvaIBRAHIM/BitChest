import { Card, CardHeader, CardContent, List, ListItemText, ListItemAvatar, ListItemButton, Box, Typography, Avatar, Icon } from '@mui/material';
import colors from "../../services/Tailwind.service";
import { Coins } from '@phosphor-icons/react';
import { useTheme } from '@emotion/react';
import { useMemo, useRef } from 'react';
import ListNotFound from '../ListNotFound';
import { useSelector } from 'react-redux';

// Liste les cryptomonnaies qu'un utilisateur a en sa possession
const UserCryptoList = ({ cryptos, setSelectedCrypto, selectedCrypto }) => {

    const { user } = useSelector(state => state.user)
    const theme = useTheme();
    const total = useRef(0)
    const baseURL = import.meta.env.VITE_API_URL;
    

    const cryptoList = useMemo(() => {
        if (!cryptos || cryptos.length === 0) {
            return <ListNotFound  message="Aucune crypto trouvée."/>
        }
        total.current = 0;
        return (
            cryptos.map((cryptoWallet, index)=> {
                const amount = cryptoWallet?.amount * cryptoWallet?.current_rate;
                total.current = total.current + amount
                const crypto = cryptoWallet?.crypto

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
                        onClick={() => setSelectedCrypto({name: `Solde ${crypto.name}`, code: crypto.code})}
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
                                    color: amount > crypto?.crypto_rates[0][1] ? colors.green[400] : colors.red[400],
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
                                {cryptoWallet?.current_rate?.toFixed(2)}€
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
                title={`${user.role === "client" ? "Vos cryptomonnaies": "Cryptomonnaies"}`}
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
                

            <CardContent>
                <List dense={false}>
                    <ListItemButton
                        sx={{
                            py:1,
                            justifyContent: "space-between",
                            alignItems: "center",
                            backgroundColor: selectedCrypto.code === "all" && "#00000030",
                            borderRadius: 1
                        }}
                        onClick={() => setSelectedCrypto({name: "Votre solde de cryptomonnaies", code: "all"})}
                    >   
                        <Box
                            className="flex items-center"
                        >
                            <ListItemAvatar>
                                <Avatar
                                    sx={{
                                        background: "transparent"
                                    }}
                                >
                                    <Coins size={32} weight="duotone" color={theme.palette.mode === "dark" ? "white" : "black"} />
                                </Avatar>
                                
                            </ListItemAvatar>
                            <ListItemText
                                primary="Total"
                            />
                        </Box>
                        <Box
                            className="flex flex-col items-end"
                        >
                            <Typography 
                                variant="body1"
                            >
                                {total.current.toFixed(2)}€
                            </Typography>
                        </Box>
                    </ListItemButton>
                    {cryptoList}
                </List>
            </CardContent>
        </Card>
    );
};

export default UserCryptoList;
