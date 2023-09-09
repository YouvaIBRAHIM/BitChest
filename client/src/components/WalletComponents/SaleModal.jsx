import { useEffect, useMemo, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, FormControl, Icon, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { CaretDoubleRight } from '@phosphor-icons/react';
import styled from '@emotion/styled';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useMutation, useQuery } from '@tanstack/react-query';
import { sellCrypto, getAuthUserSaleResources } from '../../services/Api.service';
import { roundToTwoDecimals } from '../../services/Utils.service';
import { setUser } from '../../reducers/UserReducer';
import { useDispatch } from 'react-redux';
import { TransactionCardSkeleton } from '../Skeletons/TransactionCardSkeleton';
import colors from "../../services/Tailwind.service";


const SaleModal = ({ setSnackBar, refetchUserData, open, setOpen }) => {
  const dispatch = useDispatch()

  const [from, setFrom] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [fromList, setFromList] = useState([]);

  const { data: resources, isFetching, refetch } = useQuery({ 
    queryKey: ['saleResources'], 
    queryFn: getAuthUserSaleResources,
    retry: 3,
    refetchInterval: false,
    enabled: false,
    onError: (error) => setSnackBar({message: error, showSnackBar: true, type: "error"})
  });

  const userMutation = useMutation({
      mutationFn: sellCrypto,
      onSuccess: data => {
        refetchUserData()
        dispatch(setUser(data));
        handleClose()
        setSnackBar({message: "Transaction réussie.", showSnackBar: true, type: "success"});
      },
      onError: error => {
          setSnackBar({message: error, showSnackBar: true, type: "error"});
      }
  })

  const handleSubmit = (event) => {
      event.preventDefault();

      userMutation.mutate({
        from: from?.crypto.id,
        transaction: selectedTransaction,
      })
  };


  useEffect(() => {
    if (open) {
      refetch()
    }

  }, [open])


  useEffect(() => {
    if (resources?.wallet?.cryptos_wallet) {
      setFromList(resources?.wallet?.cryptos_wallet)
    }

  }, [resources])



  useEffect(() => {
    if (fromList && fromList?.length > 0) {
      setFrom(fromList[0])
      const transaction = resources?.transactionHistory?.find((transaction) => transaction.crypto_id === fromList[0]?.crypto?.id)

      setSelectedTransaction(transaction)
    }
  }, [fromList])


  const handleSelectChange = (e) => {
    const newFrom = fromList.find(el => el?.crypto.id === e.target.value)

    if (newFrom) {
      setFrom(newFrom)
      const transaction = resources?.transactionHistory?.find((transaction) => transaction.crypto_id === newFrom?.crypto.id)
      setSelectedTransaction(transaction)
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const renderFromList = useMemo(() => {

    return (
        (fromList?.length  > 0 && from?.crypto) && 
        <Select
              id="fromList"
              value={from?.crypto.id}
              onChange={handleSelectChange}
          >
          {
            fromList.map((currency, index) => {
                return (
                    <MenuItem 
                      key={index} 
                      value={currency?.crypto.id}
                    >
                      {currency?.crypto.name}
                    </MenuItem>
                )
            })
          }
        </Select>
    )
  }, [from, fromList])

  const renderTargetList = useMemo(() => {

    return (
      <Select
            id="targetList"
            value={"EUR"}
        >
        <MenuItem value={"EUR"}>Euro</MenuItem>
      </Select>
    )
  }, [])

  const renderTransactionList = useMemo(() => {
    const transactionList = resources?.transactionHistory?.filter((transaction) => transaction.crypto_id === from?.crypto.id)
    
    return (
        (transactionList?.length  > 0 && from?.crypto) && 
        <>
          <InputLabel id="transactionListLabel">Quantité</InputLabel>
          <Select
            labelId="transactionListLabel"
            id="transactionList"
            value={selectedTransaction.id}
            label="Quantité"
          >
            {
              transactionList.map((transaction, index) => {
                  return (
                      <MenuItem 
                        key={index} 
                        value={transaction.id}
                      >
                        {transaction.amount}
                      </MenuItem>
                  )
              })
            }
          </Select>
        </>
    )
  }, [from])

  return (
    <div>
      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth={"xs"}
        fullWidth={false}
      >
        <DialogTitle>Vendre vos cryptomonnaies.</DialogTitle>
        {
          isFetching ?
          <TransactionCardSkeleton />
          :
          <form onSubmit={handleSubmit}>
            <DialogContent
              className="flex flex-col gap-5 items-end"
            >
              <Box
                className="flex gap-5 items-end justify-between w-full"
              >
                <Box className='w-full'>
                  <Typography variant="body1" sx={{mb: 2}}>De</Typography>
                  <FormControl sx={{xs: {minWidth: 100}, sm: {minWidth: 120}}} className='w-full' size="small">
                    {renderFromList}
                  </FormControl>
                </Box>
                <Icon
                  className='mb-2'
                >
                  <CaretDoubleRight size={24} weight="duotone" />
                </Icon>
                <Box className='w-full'>
                  <Typography variant="body1" sx={{mb: 2}}>À</Typography>
                  <FormControl sx={{xs: {minWidth: 100}, sm: {minWidth: 120}}} className='w-full' size="small">
                    {renderTargetList}
                  </FormControl>
                </Box>
              </Box>
              
              <FormControl  className='w-full' size="small">
                {renderTransactionList}
              </FormControl>

              <CostsTable 
                from={from} 
                selectedTransaction={selectedTransaction}
                serviceFees={resources?.serviceFees}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Annuler</Button>
              <Button type="submit">Vendre</Button>
            </DialogActions>
          </form>
        }
      </Dialog>
    </div>
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

const CostsTable = ({from, selectedTransaction, serviceFees}) => {
  const [ transactionServiceFees, setTransactionServiceFees ] = useState(0)

  const [ totalAmount, setTotalAmount ] = useState(0)
  const [ totalAmountWithFees, setTotalAmountWithFees ] = useState(0)
  const [ gains, setGains ] = useState({
      amount: 0,
      percent: 0
  })
  useEffect(() => {

    if (serviceFees && from && selectedTransaction) {
      const transactionTotalAmount = roundToTwoDecimals(selectedTransaction.amount * from.crypto.latest_crypto_rate.rate)
      const transactionServiceFees = roundToTwoDecimals((serviceFees / 100) * transactionTotalAmount)
      const transactionTotalAmountWithFees = roundToTwoDecimals(transactionTotalAmount - transactionServiceFees - from?.crypto.current_gas)

      setTotalAmount(transactionTotalAmount)
      setTotalAmountWithFees(transactionTotalAmountWithFees)
      setTransactionServiceFees(transactionServiceFees)


      const purchaseTransactionRate = selectedTransaction?.purchase_crypto_rate.rate;

      const purchaseTransactionTotalAmount = roundToTwoDecimals(selectedTransaction.amount * purchaseTransactionRate)
      const purchaseTransactionServiceFees = roundToTwoDecimals((selectedTransaction.service_fees / 100) * purchaseTransactionTotalAmount)
      const purchaseTotalAmountWithFees = roundToTwoDecimals(purchaseTransactionTotalAmount + purchaseTransactionServiceFees + selectedTransaction.gas_fees)

      const saleGains = roundToTwoDecimals(transactionTotalAmountWithFees - purchaseTotalAmountWithFees)
      setGains({
          amount: saleGains,
          percent: roundToTwoDecimals(saleGains / purchaseTotalAmountWithFees)
      })
    }
  }, [from, serviceFees])

  return (
    <TableContainer component={Paper}>
      <Table aria-label="costs table">
        <TableBody>
            <StyledTableRow >
                <TableCell component="th" scope="row">
                    Prix
                </TableCell>
                <TableCell align="right">
                    {from?.crypto.latest_crypto_rate.rate}€
                </TableCell>
            </StyledTableRow>
            <StyledTableRow >
                <TableCell component="th" scope="row">
                    Quantité
                </TableCell>
                <TableCell align="right">
                    ({totalAmount}€) {selectedTransaction?.amount}
                </TableCell>
            </StyledTableRow>
            <StyledTableRow >
              <TableCell component="th" scope="row">
                Frais de service
              </TableCell>
              <TableCell align="right">({serviceFees}%) {transactionServiceFees}€</TableCell>
            </StyledTableRow>
            <StyledTableRow >
              <TableCell component="th" scope="row">
                Frais de gas
              </TableCell>
              <TableCell align="right">{from?.crypto.current_gas}€</TableCell>
            </StyledTableRow>
            <StyledTableRow >
              <TableCell component="th" scope="row">
                Total
              </TableCell>
              <TableCell align="right">{totalAmountWithFees}€</TableCell>
            </StyledTableRow>
            <StyledTableRow>
                <TableCell 
                  component="th" 
                  className={`${gains.amount >= 0 ? "hasGains" : "hasLosses"}`}
                  scope="row"
                >
                    Gains
                </TableCell>
                <TableCell 
                    align="right"
                    className={`${gains.amount >= 0 ? "hasGains" : "hasLosses"}`}
                >
                ({gains.percent}%) {gains.amount}€
                </TableCell>
            </StyledTableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}


export default SaleModal;