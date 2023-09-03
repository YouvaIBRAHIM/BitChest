import { useEffect, useMemo, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, ButtonGroup, FilledInput, FormControl, Icon, IconButton, InputAdornment, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { ArrowFatLinesUp, CaretDoubleRight, DownloadSimple, UploadSimple } from '@phosphor-icons/react';
import styled from '@emotion/styled';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useQuery } from '@tanstack/react-query';
import { getAuthUserResources } from '../services/Api.service';


const TransactionCard = ({  }) => {

  const { data: resources, isFetching, refetch } = useQuery({ 
    queryKey: ['resources'], 
    queryFn: getAuthUserResources,
    retry: 3,
    refetchInterval: false,
    enabled: false,
    onError: (error) => setSnackBar({message: error, showSnackBar: true, type: "error"})
  });


  const [type, setType] = useState("buy");
  const [open, setOpen] = useState(false);
  const [from, setFrom] = useState(null);
  const [target, setTarget] = useState(null);
  const [fromList, setFromList] = useState([]);
  const [targetList, setTargetList] = useState([]);
  const [maxAmount, setMaxAmount] = useState(0);
  const [minAmount, setMinAmount] = useState(1);
  const [amount, setAmount] = useState(0);
  const [total, setTotal] = useState(0);
  const [ conversion, setConversion ] = useState(0)

  

  useEffect(() => {
    if (resources?.wallet?.userCurrencies) {
      setFromList(resources?.wallet?.userCurrencies)
      setFrom(resources?.wallet?.userCurrencies[0])
      setMaxAmount(getMaxAmount(resources?.wallet?.userCurrencies[0].balance, resources?.serviceFees, resources?.cryptos[0]))
    }
    if (resources?.cryptos) {
      setTargetList(resources?.cryptos)
      setTarget(resources?.cryptos[0])
    }
  }, [resources])


  const handleClickOpen = (type) => {
    refetch();
    setType(type)
    setOpen(true);
  };

  const getMaxAmount = (balance, serviceFees, target) => {
    const amountFees = ((serviceFees / 100) * balance)
    const totalFees = parseFloat(amountFees) + parseFloat(target.current_gas)
    console.log("🚀 ~ file: TransactionCard.jsx:68 ~ getMaxAmount ~ totalFees:", balance)
    
    const totalAmount = balance - totalFees
    return totalAmount
  }

  const handleSelectChange = (setter, array, value) => {
    const findedElement = array.find(el => el.code === value)
    if (findedElement) {
      setter(findedElement)
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const render = useMemo(() => {

    switch (type) {
      case "buy":
        return {
          headerTitle: "Acheter ou échanger vos cryptomonnaies.",
          confirmButton: "Acheter/Échanger",
        }
      case "sell":
        return {
          headerTitle: "Vendre vos cryptomonnaies.",
          confirmButton: "Vendre",
        }   
      default:
        break;
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
          justifyContent: {xs: "center", sm: "flex-start"}
        }}
      >
        <Button
          startIcon={<DownloadSimple size={24} weight="duotone" />}
          sx={{
            px: 4,
            py: 1,
            width: {xs: "100%", sm: "auto"}
          }}
          onClick={() => handleClickOpen("buy")}
        >
          Acheter
        </Button>
        <Button
          startIcon={<UploadSimple size={24} weight="duotone" />}
          sx={{
            px: 4,
            py: 1,
            width: {xs: "100%", sm: "auto"}
          }}
          onClick={() => handleClickOpen("sell")}
        >
          Vendre
        </Button>
      </ButtonGroup>
      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth={"xs"}
        fullWidth={false}
      >
        <DialogTitle>{render.headerTitle}</DialogTitle>
        <DialogContent
          className="flex flex-col gap-5 items-end"
        >
          <Box
            className="flex gap-5 items-end justify-between w-full"
          >
            <Box className='w-full'>
              <Typography variant="body1" sx={{mb: 2}}>De</Typography>
              <FormControl sx={{xs: {minWidth: 100}, sm: {minWidth: 120}}} className='w-full' size="small">
                {
                  fromList?.length > 0 && 
                  <Select
                        id="fromList"
                        value={from.code}
                        onChange={(e) => handleSelectChange(setFrom, fromList, e.target.value, true)}
                    >
                    {
                      fromList.map((currency, index) => {
                          return (
                              <MenuItem 
                                key={index} 
                                value={currency.code}
                              >
                                {currency.name}
                              </MenuItem>
                          )
                      })
                    }
                  </Select>
                }
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
                {
                  targetList.length > 0 &&
                  <Select
                        id="targetList"
                        value={target.code}
                        onChange={(e) => handleSelectChange(setTarget, targetList, e.target.value)}

                    >
                    {
                        targetList.map((option, index) => {
                            return (
                                <MenuItem key={index} value={option.code}>{option.name}</MenuItem>
                            )
                        })
                    }
                  </Select>
                }
              </FormControl>
            </Box>
          </Box>
          <CustomField 
            min={minAmount} 
            max={maxAmount}
            amount={amount}
            setAmount={setAmount}
          />
          <CostsTable 
            target={target} 
            serviceFees={resources?.serviceFees}
            amount={amount}
            total={total} 
            setTotal={setTotal}
            conversion={conversion}
            setConversion={setConversion}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button onClick={handleClose}>{render.confirmButton}</Button>
        </DialogActions>
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

const CostsTable = ({target, serviceFees, amount, total, setTotal, conversion, setConversion}) => {
  const [ fees, setFees ] = useState(0)

  useEffect(() => {
    if (target && amount && serviceFees) {
      console.log("🚀 ~ file: TransactionCard.jsx:244 ~ useEffect ~ amount:", amount)
      const currentRate = target.current_rate.toFixed(2);
      const convertedAmount = amount / currentRate
      setConversion(convertedAmount.toFixed(2))
  
      const amountFees = ((serviceFees / 100) * amount).toFixed(2)
      setFees(amountFees)
      const totalAmount = amount + parseFloat(amountFees) + parseFloat(target.current_gas)
  
      setTotal(parseFloat(totalAmount).toFixed(2))
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
                Conversion
              </TableCell>
              <TableCell align="right">({target.current_rate.toFixed(2)}€) {conversion} {target.code}</TableCell>
            </StyledTableRow>
            <StyledTableRow >
              <TableCell component="th" scope="row">
                Frais de gas
              </TableCell>
              <TableCell align="right">{target.current_gas.toFixed(2)}€</TableCell>
            </StyledTableRow>
            <StyledTableRow >
              <TableCell component="th" scope="row">
                Frais de service
              </TableCell>
              <TableCell align="right">({serviceFees}%) {fees}€</TableCell>
            </StyledTableRow>
            <StyledTableRow >
              <TableCell component="th" scope="row">
                Total
              </TableCell>
              <TableCell align="right">{total}€</TableCell>
            </StyledTableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

const CustomField = ({min, max, setAmount, amount}) => {

  useEffect(() => {
    if (amount > max) {
      setAmount(max)
    }
    if (amount < min) {
      setAmount(min)
    }
  }, [min, max]);


  const handleChange = (e) => {
    if (e.target.value > max) {
      setAmount(max)
    }else if (e.target.value < min) {
      setAmount(min)
    }else{
      setAmount(e.target.value)
    }
  }


  return (
    <FormControl 
      variant="outlined"
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


export default TransactionCard;