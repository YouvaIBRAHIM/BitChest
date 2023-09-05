import { Card, CardHeader, CardContent, CardActions } from '@mui/material';
import PieChart from '../AnalyticComponents/PieChart';
import { useMemo } from 'react';
import FeedBalance from '../FeedBalance';

const BalanceCard = ({ balance, cryptos, setSnackBar }) => {
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
                <FeedBalance setSnackBar={setSnackBar} />
            </CardActions>
        </Card>
    );
};

export default BalanceCard;
