import { Card, CardHeader, CardContent, CardActions } from '@mui/material';
import PieChart from '../AnalyticComponents/PieChart';
import { useMemo } from 'react';
import FeedBalance from './FeedBalance';
import { roundToTwoDecimals } from '../../services/Utils.service';
import { useSelector } from 'react-redux';

// Card permettant de voir le solde d'un utilisateur et la répartition des cryptomonnaies dans son portefeuille
const BalanceCard = ({ balance, cryptos, setSnackBar }) => {
    const { user } = useSelector(state => state.user)

    const pieChartData = useMemo(() => {
        const labels = [];
        const pieColors = [];
        const data = [];

        if (cryptos) {
            cryptos.map(cryptoWallet => {
                labels.push(cryptoWallet.crypto.name)
                data.push(cryptoWallet.amount)
                pieColors.push(cryptoWallet.crypto.color)
            })
        }
        return {
            labels,
            data,
            pieColors
        }
    }, [cryptos])
    return (
        <Card>
            <CardHeader
                title={`${roundToTwoDecimals(balance)}€`}
                subheader={`${user.role === "client" ? "Votre solde": "Solde"}`}
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
            {
                user?.role === "client" &&
                <CardActions
                    className='justify-center'
                >
                    <FeedBalance setSnackBar={setSnackBar} />
                </CardActions>
            }

        </Card>
    );
};

export default BalanceCard;
