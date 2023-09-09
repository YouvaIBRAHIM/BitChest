import { useEffect, useMemo, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, FilledInput, FormControl, Icon, IconButton, InputAdornment, InputLabel, MenuItem, Select, Skeleton, Typography } from '@mui/material';
import { ArrowFatLinesUp, CaretDoubleRight} from '@phosphor-icons/react';
import styled from '@emotion/styled';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useMutation, useQuery } from '@tanstack/react-query';
import { buyCrypto, getAuthUserPurchaseResources } from '../../services/Api.service';
import { roundToTwoDecimals } from '../../services/Utils.service';
import { setUser } from '../../reducers/UserReducer';
import { useDispatch } from 'react-redux';


const PurchaseModal = ({ setSnackBar, refetchUserData, open, setOpen }) => {
  const dispatch = useDispatch()

  const [target, setTarget] = useState(null);
  const [targetList, setTargetList] = useState([]);
  const [maxAmount, setMaxAmount] = useState(0);
  const [amount, setAmount] = useState(0);
  const [ totalAmount, setTotalAmount ] = useState(0)
  const [ conversion, setConversion ] = useState(0)

  const { data: resources, isFetching, refetch } = useQuery({ 
    queryKey: ['resources'], 
    queryFn: getAuthUserPurchaseResources,
    retry: 3,
    refetchInterval: false,
    enabled: false,
    onError: (error) => setSnackBar({message: error, showSnackBar: true, type: "error"})
  });

  const userMutation = useMutation({
      mutationFn: buyCrypto,
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
      if (amount <= 0) {
        setSnackBar({message: "Le montant doit être supérieur à 0.", showSnackBar: true, type: "warning"})
        return
      }

      userMutation.mutate({
        target: target.id,
        totalAmount,
      })
  };


  useEffect(() => {
    if (resources?.wallet?.balance && resources?.cryptos) {
      setMaxAmount(resources?.wallet?.balance)
      setTargetList(() => {
        setTarget(resources?.cryptos[0])
        return resources?.cryptos;
      })
    }

  }, [resources?.cryptos])

  useEffect(() => {
    if (open) {
      refetch()
    }

  }, [open])


  const handleSelectChange = (e) => {
    const newTarget = targetList.find(el => el.id === e.target.value)
    if (newTarget) {
      setTarget(newTarget)
    }
  };

  const handleClose = () => {
    setOpen(false);
  };


  const renderFromList = useMemo(() => {
    return (
        <Select
              id="fromList"
              value="EUR"
              sx={{
                maxWidth: 120
              }}
          >
          <MenuItem 
              value="EUR"
            >
              Euro
            </MenuItem>
        </Select>
    )
  }, [])

  const renderTargetList = useMemo(() => {

    return (
      targetList.length > 0 &&
      <Select
        id="targetList"
        value={target?.id}
        onChange={handleSelectChange}
        sx={{
          maxWidth: 120
        }}
      >
      {
        targetList.length > 0 &&
          targetList.map((option, index) => {
              return (
                  <MenuItem key={index} value={option?.id}>{option?.name}</MenuItem>
              )
          })
      }
      </Select>
    )
  }, [target, targetList])

  return (
    <Box>
      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth={"xs"}
        fullWidth={false}
      >
        <DialogTitle>Acheter des cryptomonnaies.</DialogTitle>
        {
          isFetching ?
          <CardSkeleton />
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
              <CustomField 
                max={maxAmount}
                amount={amount}
                setAmount={setAmount}
              />
              <CostsTable 
                target={target} 
                serviceFees={resources?.serviceFees}
                amount={amount}
                setAmount={setAmount}
                totalAmount={totalAmount} 
                setTotalAmount={setTotalAmount}
                maxAmount={maxAmount}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Annuler</Button>
              <Button type="submit">Acheter</Button>
            </DialogActions>
          </form>
        }
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
}));

const CostsTable = ({target, serviceFees, amount, setAmount, totalAmount, setTotalAmount, maxAmount}) => {
  const [ transactionServiceFees, setTransactionServiceFees ] = useState(0)
  const [ totalAmountWithFees, setTotalAmountWithFees ] = useState(0)

  useEffect(() => {
    if (target && serviceFees) {
      let newAmount = parseFloat(amount);
      const transactionTotalAmount = newAmount / target.latest_crypto_rate.rate
      const transactionServiceFees = roundToTwoDecimals((serviceFees / 100) * newAmount)
      const transactionTotalAmountWithFees = roundToTwoDecimals(newAmount + transactionServiceFees + target.current_gas)

      setTotalAmount(transactionTotalAmount)
      setTotalAmountWithFees(transactionTotalAmountWithFees)
      setTransactionServiceFees(transactionServiceFees)

      if (transactionTotalAmountWithFees > maxAmount) {

        const pourcentageDecimal = (serviceFees / 100)
        newAmount = (maxAmount - target.current_gas) / (1 + pourcentageDecimal);

        setAmount(newAmount)
      }
    }
  }, [target, amount, serviceFees])


  if (!target) {
    return null
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label="costs table">
        <TableBody>
            <StyledTableRow >
                <TableCell component="th" scope="row">
                    Prix
                </TableCell>
                <TableCell align="right">
                    {target?.latest_crypto_rate.rate}€
                </TableCell>
            </StyledTableRow>
            <StyledTableRow >
                <TableCell component="th" scope="row">
                    Quantité
                </TableCell>
                <TableCell align="right">
                    {`${totalAmount} ${target.code}`}
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
              <TableCell align="right">{target?.current_gas?.toFixed(2)}€</TableCell>
            </StyledTableRow>
            <StyledTableRow >
              <TableCell component="th" scope="row">
                Total
              </TableCell>
              <TableCell align="right">{amount == 0 ? 0 :  totalAmountWithFees}€</TableCell>
            </StyledTableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

const CustomField = ({max, setAmount, amount}) => {

  useEffect(() => {
    if (amount > max) {
      setAmount(max)
    }
    if (amount < 0) {
      setAmount(0)
    }
  }, [max]);


  const handleChange = (e) => {
    if (e.target.value > max) {
      setAmount(max)
    }else if (e.target.value < 0) {
      setAmount(0)
    }else{
      setAmount(e.target.value)
    }
  }


  return (
    <FormControl 
      variant="filled"
      className='w-full'
      size='small'
    >
      <InputLabel htmlFor="amount">Montant</InputLabel>
      <FilledInput className='rounded'
          id="amount"
          name="amount"
          type="number"
          onChange={handleChange}
          inputlabelprops={{
            shrink: true,
          }}
          value={amount}
          endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle amount"
              edge="end"
              title='Montant maximum'
              onClick={() => setAmount(max)}
            >
              <ArrowFatLinesUp size={24} weight="duotone" />
            </IconButton>
          </InputAdornment>
          }
          label="Montant"
      />
    </FormControl>
  )
}


const CardSkeleton = () => {

  return (
    <div className="flex flex-col items-center gap-2 m-5">
      <div className="flex justify-center gap-2 w-full">
          <Skeleton variant="text" sx={{ fontSize: '1rem' }} className="w-4/12"/>
          <Skeleton variant="text" sx={{ fontSize: '1rem' }} className="w-4/12"/>
      </div>
      <Skeleton variant="text" sx={{ fontSize: '1rem', mb: 2 }} className='w-10/12'/>

      <Skeleton variant="text" sx={{ fontSize: '1rem' }} className='w-10/12'/>
      <Skeleton variant="text" sx={{ fontSize: '1rem' }} className='w-10/12'/>
      <Skeleton variant="text" sx={{ fontSize: '1rem' }} className='w-10/12'/>

      <div className="flex gap-2 w-6/12 self-end mt-5">
          <Skeleton variant="text" sx={{ fontSize: '1rem' }} className='w-9/12'/>
          <Skeleton variant="text" sx={{ fontSize: '1rem' }} className='w-9/12'/>
      </div>
    </div>
  )
};


export default PurchaseModal;