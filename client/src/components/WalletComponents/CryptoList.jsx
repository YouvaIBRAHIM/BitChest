import { Card, CardHeader, CardContent, List, ListItemText, ListItemAvatar, ListItemButton, Box, Typography, Avatar } from '@mui/material';
import colors from "../../services/Tailwind.service";

const CryptoList = ({ cryptos, setSelectedCrypto }) => {
    const baseURL = import.meta.env.VITE_API_URL;

    return (
        <Card>
            <CardHeader
                title="Vos cryptomonnaies"
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
                    {
                        cryptos &&
                        cryptos.map((crypto, index)=> {
                            const amount = crypto?.pivot?.amount * crypto?.current_rate;
                            return (
                                <ListItemButton
                                    key={index}
                                    sx={{
                                        py:1,
                                        justifyContent: "space-between",
                                        alignItems: "center"
                                    }}
                                    onClick={() => setSelectedCrypto(crypto.code)}
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
                                                color: crypto?.current_rate > crypto?.last_day_rate ? colors.green[400] : colors.red[400]
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
                    }

                </List>
            </CardContent>
        </Card>
    );
};

export default CryptoList;
