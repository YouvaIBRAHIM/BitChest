import { Card, CardHeader, CardContent, Paper, TableContainer, Table, TableBody, TableRow, TableHead, Select, MenuItem, Avatar, ListItemText, Chip } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { useEffect, useMemo, useState } from 'react';
import ListNotFound from '../ListNotFound';
import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { getTransactionsHistory } from '../../services/Api.service';
import { DownloadSimple, UploadSimple } from '@phosphor-icons/react';
import ViewMoreTransactionHistoryButton from './ViewMoreTransactionHistoryButton';
import { roundToTwoDecimals } from '../../services/Utils.service';
import TableSkeleton from '../Skeletons/TableSkeleton';
import { useParams } from 'react-router-dom';

const TransactionHistory = ({ setSnackBar }) => {
    const { id } = useParams();

    const baseURL = import.meta.env.VITE_API_URL;
    const [selectedCrypto, setSelectedCrypto ] = useState("all")
    
    const { data, isFetching, refetch } = useQuery({ 
        queryKey: ['transactionsHistory'], 
        queryFn: () => getTransactionsHistory(selectedCrypto, 0, id),
        retry: 3,
        refetchInterval: false,
        refetchOnWindowFocus: false,
        onError: (error) => setSnackBar({message: error, showSnackBar: true, type: "error"})
    });

    useEffect(() => {
        refetch(selectedCrypto)
    }, [selectedCrypto])

    const transactionList = useMemo(() => {

        if (isFetching) {
            return  <TableSkeleton rows={5} cells={5}/>
        }
        if (!data || data?.transactionsHistory?.length ===0 ) {
            return <ListNotFound message="Aucun historique trouvé."/>
        }
        return (
            <TableBody>
                {
                    data?.transactionsHistory?.map((transaction, index)=> {
                        return (
                            <StyledTableRow
                                key={index}
                            >
                                <TableCell 
                                    component="th" 
                                    scope="row"
                                >
                                    <Avatar
                                        src={baseURL + transaction.crypto_logo}
                                        alt={transaction.crypto_code}
                                    />
                                    <ListItemText 
                                        primary={transaction.crypto_name} 
                                        secondary={transaction.crypto_code} 
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <Chip
                                        icon={transaction.type === "buy" ? <DownloadSimple size={18} weight="duotone" /> : <UploadSimple size={18} weight="duotone" />}
                                        label={transaction.type === "buy" ? "Achat" : "Vente"}
                                    />
                                </TableCell>
                                <TableCell align="right">{roundToTwoDecimals(transaction.amount)}</TableCell>
                                <TableCell align="right">{transaction.crypto_rate.rate}€/{transaction.crypto_code}</TableCell>
                                <TableCell align="right">{new Date(transaction.crypto_rate.timestamp).toLocaleDateString("FR-fr")}</TableCell>
                            </StyledTableRow>
                        )
                    })
                }
            </TableBody>
        )
    }, [data, selectedCrypto, isFetching])


    const cryptoSelectList = useMemo(() => {

        return (
                <Select
                    size='small'
                    id="cryptoSelectList"
                    value={selectedCrypto}
                    sx={{
                        "& img":{
                            width: 25,
                            height: 25,
                        },
                        "& .MuiSelect-select":{
                            display: "flex",
                            alignItems: "center"
                        },
                        "& .MuiMenuItem-root":{
                            display: "flex",
                            alignItems: "center",
                        }
                    }}
                    onChange={(e) => setSelectedCrypto(e.target.value)}
                >
                        <MenuItem 
                            value="all"
                        >
                            <ListItemText 
                                primary="Toutes les cryptomonnaies"
                            />
                        </MenuItem>
                        {
                            data?.cryptos && 
                            data?.cryptos?.map((crypto, index) => {
                                return (
                                    <MenuItem 
                                        key={index} 
                                        value={crypto.code}
                                    >
                                        <Avatar
                                            src={baseURL + crypto.logo}
                                            alt={crypto.code}
                                            sx={{
                                                width: 25,
                                                height: 25,
                                            }}
                                        />
                                        <ListItemText 
                                            primary={crypto.name}
                                            className='ml-2'    
                                        />
                                    </MenuItem>
                                )
                            })
                        }

                </Select>
            )
    }, [data, selectedCrypto, isFetching])

    return (
        <Card>
            <CardHeader
                title="Historique des transactions"
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
                className='flex flex-col gap-5'
            >
                {
                    (!data?.transactionsHistory || data?.transactionsHistory.length === 0) 
                    ?
                    <ListNotFound message="Aucune transaction trouvée."/>
                    :
                    <>
                        <TableContainer component={Paper}>
                            <Table aria-label="history table">
                                <TableHead
                                    color="secondary"
                                >
                                    <TableRow>
                                        <StyledTableCell>{cryptoSelectList}</StyledTableCell>
                                        <StyledTableCell align="right">Type de transaction</StyledTableCell>
                                        <StyledTableCell align="right">Quantité</StyledTableCell>
                                        <StyledTableCell align="right">Cours</StyledTableCell>
                                        <StyledTableCell align="right">Date</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                    {transactionList}
                            </Table>
                        </TableContainer>
                        <ViewMoreTransactionHistoryButton
                            filter={selectedCrypto}
                            setSnackBar={setSnackBar}
                            count={data?.transactionsHistory?.length ?? 0}
                            id={id}
                        />
                    </>
                }
            </CardContent>
        </Card>
    );
};

const StyledTableCell = styled(TableCell)(() => ({
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
      border: 0,
    },
    "& th":{
        display: "flex",
        alignItems: "center",
        gap: 10
    },
    "& img":{
        width: 25,
        height: 25,
    }
  }));

export default TransactionHistory;
