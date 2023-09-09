import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, ListItemText, Paper, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import styled from '@emotion/styled';
import { roundToTwoDecimals } from '../../services/Utils.service';
import colors from "../../services/Tailwind.service";

const TransactionHistoryDetails = ({ open, setOpen, transaction }) => {  
    const [ serviceFees, setServiceFees ] = useState(0)
    const [ rate, setRate ] = useState(0)
    const [ totalAmount, setTotalAmount ] = useState(0)
    const [ totalAmountWithFees, setTotalAmountWithFees ] = useState(0)
    const [ gains, setGains ] = useState({
        amount: 0,
        percent: 0
    })

    useEffect(() => {
        if (transaction) {
            const transactionRate = transaction.type === "buy" ? transaction.purchase_crypto_rate.rate : transaction.sale_crypto_rate.rate;

            const transactionTotalAmount = roundToTwoDecimals(transaction.amount * transactionRate)
            const transactionServiceFees = roundToTwoDecimals((transaction.service_fees / 100) * transactionTotalAmount)

            setServiceFees(transactionServiceFees)
            setTotalAmount(transactionTotalAmount)
            setRate(transactionRate)

            if (transaction.type === "buy"){
                setTotalAmountWithFees(roundToTwoDecimals(transactionTotalAmount + transactionServiceFees + transaction.gas_fees))
            } else if (transaction.type === "sell") {
                setTotalAmountWithFees(roundToTwoDecimals(transactionTotalAmount - transactionServiceFees - transaction.gas_fees))

                const purchaseTransactionRate = transaction.purchase_crypto_rate.rate;
                const saleTransactionRate = transaction.sale_crypto_rate.rate;

                const purchaseTransactionTotalAmount = roundToTwoDecimals(transaction.amount * purchaseTransactionRate)
                const purchaseTransactionServiceFees = roundToTwoDecimals((transaction.service_fees / 100) * purchaseTransactionTotalAmount)
                const purchaseTotalAmountWithFees = roundToTwoDecimals(purchaseTransactionTotalAmount + purchaseTransactionServiceFees + transaction.gas_fees)

                const saleTransactionTotalAmount = roundToTwoDecimals(transaction.amount * saleTransactionRate)
                const saleTransactionServiceFees = roundToTwoDecimals((transaction.service_fees / 100) * saleTransactionTotalAmount)
                const saleTotalAmountWithFees = roundToTwoDecimals(saleTransactionTotalAmount - saleTransactionServiceFees - transaction.gas_fees)

                const saleGains = roundToTwoDecimals(saleTotalAmountWithFees - purchaseTotalAmountWithFees)
                setGains({
                    amount: saleGains,
                    percent: roundToTwoDecimals(saleGains /purchaseTotalAmountWithFees)
                })
            }else{
                setGains({
                    amount: 0,
                    percent: 0
                })
            }
        }
    }, [transaction])
    const handleClose = () => {
      setOpen(false);
    };
  
    return (
      <Box>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
              Détails de la transaction
            </DialogTitle>
            <DialogContent>
                {
                    transaction &&
                    <TableContainer component={Paper}>
                        <Table aria-label="costs table">
                            <TableBody>
                                <StyledTableRow >
                                    <TableCell component="th" scope="row">
                                        Cryptomonnaie
                                    </TableCell>
                                    <TableCell align="right">
                                        <ListItemText
                                            primary={transaction.crypto_name}
                                            secondary={transaction.crypto_code}
                                        />
                                    </TableCell>
                                </StyledTableRow>
                                <StyledTableRow >
                                    <TableCell component="th" scope="row">
                                        Type de transaction
                                    </TableCell>
                                    <TableCell align="right">
                                        {transaction.type === "buy" ? "Achat" : "Vente"}
                                    </TableCell>
                                </StyledTableRow>
                                <StyledTableRow >
                                    <TableCell component="th" scope="row">
                                        Date
                                    </TableCell>
                                    <TableCell align="right">
                                        {new Date(transaction.type === "buy" ? transaction?.purchase_crypto_rate.timestamp : transaction?.sale_crypto_rate.timestamp).toLocaleDateString("FR-fr")}
                                    </TableCell>
                                </StyledTableRow>
                                <StyledTableRow >
                                    <TableCell component="th" scope="row">
                                        Prix
                                    </TableCell>
                                    <TableCell align="right">
                                        {rate}€
                                    </TableCell>
                                </StyledTableRow>
                                <StyledTableRow >
                                    <TableCell component="th" scope="row">
                                        Quantité
                                    </TableCell>
                                    <TableCell align="right">
                                        ({totalAmount}€) {transaction.amount}
                                    </TableCell>
                                </StyledTableRow>
                                <StyledTableRow >
                                    <TableCell component="th" scope="row">
                                        Frais de service
                                    </TableCell>
                                    <TableCell align="right">
                                        ({transaction.service_fees}%) {serviceFees}€
                                    </TableCell>
                                </StyledTableRow>
                                <StyledTableRow >
                                    <TableCell component="th" scope="row">
                                        Frais de gas
                                    </TableCell>
                                    <TableCell align="right">
                                        {transaction.gas_fees}€
                                    </TableCell>
                                </StyledTableRow>
                                <StyledTableRow >
                                    <TableCell component="th" scope="row">
                                        Total
                                    </TableCell>
                                    <TableCell align="right">
                                        {totalAmountWithFees}€
                                    </TableCell>
                                </StyledTableRow>
                                {
                                    transaction.type === "sell" &&
                                    <StyledTableRow>
                                        <TableCell 
                                        component="th" 
                                        className={`${gains.amount >= 0 ? "hasGains" : "hasLosses"}`}
                                        scope="row">
                                            Gains
                                        </TableCell>
                                        <TableCell 
                                            align="right"
                                            className={`${gains.amount >= 0 ? "hasGains" : "hasLosses"}`}
                                        >
                                        ({gains.percent}%) {gains.amount}€
                                        </TableCell>
                                    </StyledTableRow>
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                }
            </DialogContent>
            <DialogActions>
                <Button 
                    autoFocus
                    onClick={handleClose}
                >
                    Fermer
                </Button>
            </DialogActions>
        </Dialog>
      </Box>
    );
}

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
      border: 0,
    },
    '& .hasGains': {
        color: colors.green[600],
        fontWeight: "600",
    },
    '& .hasLosses': {
        color: colors.red[600],
        fontWeight: "600"
    },
}));


export default TransactionHistoryDetails;
