import { Card, CardHeader, CardContent, Avatar, Typography, ButtonGroup, Button, CardActions } from '@mui/material';
import { Bank, CreditCard } from '@phosphor-icons/react';
import PieChart from '../AnalyticComponents/PieChart';
import { useMemo } from 'react';

const BalanceCard = ({ balance, cryptos }) => {
    const pieChartData = useMemo(() => {
        const labels = [];
        const data = [];

        if (cryptos) {
            cryptos.map(crypto => {
                labels.push(crypto.name)
                data.push(crypto.pivot.amount * crypto.current_rate)
            })
        }
        return {
            labels,
            data
        }
    }, [cryptos])
    return (
        <Card>
            <CardHeader
                title={`${balance}€`}
                subheader="Votre solde"
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
                {
                    cryptos?.length > 0 &&
                    <PieChart {...pieChartData}/>
                }
            </CardContent>
            <CardActions
                className='justify-center'
            >
                <ButtonGroup
                    disableElevation
                    variant="text"
                    aria-label="Action buttons"
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        width: "100%"

                    }}
                >
                    <Button
                        startIcon={<CreditCard size={24} weight="duotone" />}
                        sx={{
                            px: 4,
                            py: 1,
                            width: "100%"
                        }}
                    >
                        Ajouter
                    </Button>
                    <Button
                        startIcon={<Bank size={24} weight="duotone" />}
                        sx={{
                            px: 4,
                            py: 1,
                            width: "100%"
                        }}
                    >
                        Transférer
                    </Button>
                </ButtonGroup>
            </CardActions>
        </Card>
    );
};

export default BalanceCard;
