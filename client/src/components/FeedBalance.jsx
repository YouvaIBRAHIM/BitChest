import { useEffect, useMemo, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, ButtonGroup, FilledInput, FormControl, Icon, IconButton, InputAdornment, InputLabel, MenuItem, Select, Skeleton, Typography } from '@mui/material';
import { ArrowFatLinesUp, Bank, CreditCard } from '@phosphor-icons/react';
import styled from '@emotion/styled';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addBalance, getAuthUserBalance, transferBalance } from '../services/Api.service';
import { roundToTwoDecimals } from '../services/Utils.service';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../reducers/UserReducer';


const FeedBalance = ({ setSnackBar }) => {
  const [type, setType] = useState("add");
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(10);
  const [max, setMax] = useState(0);
  const { user } = useSelector(state => state.user)


  const dispatch = useDispatch()
  const { data: resources, isFetching, refetch } = useQuery({ 
    queryKey: ['balance'], 
    queryFn: getAuthUserBalance,
    retry: 3,
    refetchInterval: false,
    enabled: false,
    onError: (error) => setSnackBar({message: error, showSnackBar: true, type: "error"})
  });

  const queryClient = useQueryClient()
  const userMutation = useMutation({
      mutationFn: type === "transfer" ? transferBalance : addBalance,
      onSuccess: data => {
        queryClient.setQueryData(['userWallet'], (oldValue) => {return  {...oldValue, balance: data.balance}})

        dispatch(setUser({ wallet : {...user.wallet, balance: data.balance} }));
        handleClose()
        setSnackBar({message: "Solde mis à jour.", showSnackBar: true, type: "success"});
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
      userMutation.mutate(amount)
  };




  const handleClickOpen = (type) => {
    refetch();
    setType(type)
    setOpen(true);
  };

  useEffect(() => {
    if (type === "transfer" && resources) {
      setMax(resources?.wallet?.balance)
    }
    setAmount(resources?.wallet?.balance > 10 ? 10 : 0);
  }, [type, resources])

  const handleClose = () => {
    setOpen(false);
  };

  const render = useMemo(() => {

    switch (type) {
      case "add":
        return {
          headerTitle: "Alimenter votre solde.",
          confirmButton: "Ajouter",
        }
      case "transfer":
        return {
          headerTitle: "Transférer votre solder vers un compte bancaire.",
          confirmButton: "Vendre",
        }   
      default:
        return {
          headerTitle: "Alimenter votre solde.",
          confirmButton: "Ajouter",
        }
    }
  }, [type])


  return (
    <div>
      <ButtonGroup
        disableElevation
        variant="text"
        aria-label="Action buttons"
        sx={{
          display: "flex",
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
          className='w-full'
          onClick={() => handleClickOpen("add")}
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
          className='w-full'

          onClick={() => handleClickOpen("transfer")}
        >
          Transférer
        </Button>
      </ButtonGroup>
      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth={"xs"}
        fullWidth={false}
      >
        <DialogTitle>{render.headerTitle}</DialogTitle>
        {
          isFetching ?
          <CardSkeleton/>
          :
          <form onSubmit={handleSubmit}>
            <DialogContent
              className="flex flex-col items-center gap-2 items-end"
            >
              <Typography variant="body1">Solde actuel</Typography>
              <Typography variant="body1" sx={{mb: 2}}>{roundToTwoDecimals(resources?.wallet?.balance)}€</Typography>
              <CustomField 
                amount={amount}
                max={max}
                type={type}
                setAmount={setAmount}
              />
              {
                type === "transfer" && 
                <CostsTable 
                  serviceFees={resources?.serviceFees}
                  amount={amount}
                />
              }
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Annuler</Button>
              <Button type='submit'>{render.confirmButton}</Button>
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
}));

const CostsTable = ({serviceFees, amount}) => {
  const [ fees, setFees ] = useState(0)
  const [ total, setTotal ] = useState(0)

  useEffect(() => {
    if (serviceFees, amount) {
      const feesAmount = roundToTwoDecimals((serviceFees / 100) * amount)
      setFees(feesAmount)
      setTotal(amount - feesAmount)
    }
  }, [amount, serviceFees])

  return (
    <TableContainer component={Paper}>
      <Table aria-label="costs table">
        <TableBody>
            <StyledTableRow >
              <TableCell component="th" scope="row">
                Frais de service
              </TableCell>
              <TableCell align="right">({serviceFees}%) {fees}€</TableCell>
            </StyledTableRow>
            <StyledTableRow >
              <TableCell component="th" scope="row">
                Montant crédité
              </TableCell>
              <TableCell align="right">{total}€</TableCell>
            </StyledTableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

const CustomField = ({type, max, setAmount, amount}) => {

  const handleChange = (e) => {
    if (type == "transfer" && e.target.value > max) {
      setAmount(max)
    }else{
      setAmount(e.target.value < 0 ? 0 : e.target.value)
    }
  }

  useEffect(() => {
    if (type == "transfer" && amount > max) {
      setAmount(max)
    }
  }, [type, max])

  return (
    <>
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
              type== "transfer" &&
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
    </>
  )
}

const CardSkeleton = () => {

  return (
    <div className="flex flex-col items-center gap-2 m-5">
      <div className="flex flex-col gap-2 w-6/12">
          <Skeleton variant="text" sx={{ fontSize: '1rem' }}/>
          <Skeleton variant="text" sx={{ fontSize: '1rem' }}/>
      </div>
      <Skeleton variant="text" sx={{ fontSize: '1rem' }} className='w-9/12'/>

      <div className="flex gap-2 w-6/12 self-end mt-5">
          <Skeleton variant="text" sx={{ fontSize: '1rem' }} className='w-9/12'/>
          <Skeleton variant="text" sx={{ fontSize: '1rem' }} className='w-9/12'/>
      </div>
    </div>
  )
};


export default FeedBalance;