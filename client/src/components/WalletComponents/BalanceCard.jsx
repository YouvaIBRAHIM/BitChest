import { Card, CardHeader, CardContent, Avatar, Typography, ButtonGroup, Button } from '@mui/material';
import { Bank, CreditCard } from '@phosphor-icons/react';

const BalanceCard = ({ balance }) => {
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
            <ButtonGroup
                disableElevation
                variant="text"
                aria-label="Action buttons"
                sx={{
                display: "flex",
                justifyContent: "center"
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
            </CardContent>
        </Card>
    );
};

export default BalanceCard;
