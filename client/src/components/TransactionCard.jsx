import { useEffect, useMemo, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, ButtonGroup, FilledInput, FormControl, Icon, IconButton, InputAdornment, InputLabel, MenuItem, Select, Skeleton, Typography } from '@mui/material';
import { ArrowFatLinesUp, CaretDoubleRight, DownloadSimple, UploadSimple } from '@phosphor-icons/react';
import styled from '@emotion/styled';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { buyCrypto, sellCrypto, getAuthUserResources } from '../services/Api.service';
import { roundToTwoDecimals } from '../services/Utils.service';
import { setUser } from '../reducers/UserReducer';
import { useDispatch } from 'react-redux';


const TransactionCard = ({ setSnackBar, refetchUserData }) => {
  const dispatch = useDispatch()

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

  const { data: resources, isFetching, refetch } = useQuery({ 
    queryKey: ['resources'], 
    queryFn: getAuthUserResources,
    retry: 3,
    refetchInterval: false,
    enabled: false,
    onError: (error) => setSnackBar({message: error, showSnackBar: true, type: "error"})
  });

  const userMutation = useMutation({
      mutationFn: type === "buy" ? buyCrypto : sellCrypto,
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
        from: from.code,
        target: target.code,
        amount,
        total
      })
  };




  useEffect(() => {
    if (resources?.wallet?.userCurrencies) {
      setFromList(resources?.wallet?.userCurrencies)
      if (resources?.cryptos && type === "buy") {

        setFrom(resources?.wallet?.userCurrencies[0])
        setMaxAmount(resources?.wallet?.userCurrencies[0].balance)
        setTargetList(() => {
          setTarget(resources?.cryptos[0])
          return resources?.cryptos;
        })

      }else if (resources?.cryptos && type === "sell") {

        setFromList(() => {
          const filteredCryptos = []
          resources?.cryptos.forEach(crypto => {
            resources?.wallet?.userCurrencies.forEach(userCrypto => {
              if (userCrypto.code !== "EUR" && crypto.code === userCrypto.code && userCrypto?.balance) {
                crypto.balance = userCrypto.balance
                filteredCryptos.push(crypto)
              }
            });
          });

          setMaxAmount(filteredCryptos[0]?.balance)
          return filteredCryptos;
        })
  
        setTargetList(() => {
          const filteredCryptos = resources?.wallet?.userCurrencies?.find(crypto => crypto.code ===  "EUR");
          setTarget(filteredCryptos)
          return [filteredCryptos];
        })
      }
    }

  }, [resources, type])

  useEffect(() => {
    if (from) {
      setMaxAmount(from.balance)
      if (type === "buy") {
        setTargetList(() => {
          const filteredCryptos = resources?.cryptos.filter(crypto => crypto.code !== from.code);
          setTarget(filteredCryptos[0])
          return filteredCryptos;
        })
      }
    }
  }, [from])


  useEffect(() => {
    if (fromList && !from) {
      setFrom(fromList[0])
    }

    if (targetList && !target) {
      setTarget(targetList[0])
    }

  }, [fromList, targetList])

  const handleClickOpen = (type) => {
    refetch();
    setType(type)
    setOpen(true);
  };

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
          headerTitle: "Acheter ou échanger des cryptomonnaies.",
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

  const renderFromList = useMemo(() => {

    return (
        (fromList?.length  > 0 && from?.code) && 
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
    )
  }, [from, fromList])

  const renderTargetList = useMemo(() => {

    return (
      (targetList.length > 0 && target?.code) &&
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
    )
  }, [target, targetList])

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
                min={minAmount} 
                max={maxAmount}
                amount={amount}
                setAmount={setAmount}
              />
              <CostsTable 
                from={from} 
                target={target} 
                serviceFees={resources?.serviceFees}
                amount={amount}
                setAmount={setAmount}
                total={total} 
                setTotal={setTotal}
                conversion={conversion}
                setConversion={setConversion}
                type={type}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Annuler</Button>
              <Button type="submit">{render.confirmButton}</Button>
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

const CostsTable = ({from, target, serviceFees, amount, setAmount, total, setTotal, conversion, setConversion, type}) => {
  const [ fees, setFees ] = useState(0)
  const [ rate, setRate ] = useState(0)
  const [ isAmountSetted, setIsAmountSetted ] = useState(false)

  useEffect(() => {
    if (target && serviceFees && from && target) {
      if (type === "buy") {
        const currentRate = roundToTwoDecimals(target.current_rate);
        setRate(currentRate)
        let convertedAmount = amount / currentRate
        
        let amountFees = roundToTwoDecimals((serviceFees / 100) * amount)
        let totalAmount = parseFloat(amount) + parseFloat(amountFees) + parseFloat(target.current_gas)
  
        if (roundToTwoDecimals(totalAmount) >= roundToTwoDecimals(from.balance)) {
          convertedAmount = from.balance / currentRate
          
          amountFees = roundToTwoDecimals((serviceFees / 100) * from.balance)
          totalAmount = from.balance
        
          const newAmount = roundToTwoDecimals(from.balance - (roundToTwoDecimals(amountFees) + roundToTwoDecimals(target.current_gas)));
          setAmount(newAmount >= 0 ? newAmount : 0)
          setConversion(roundToTwoDecimals(convertedAmount))
          setFees(amountFees)
          setTotal(roundToTwoDecimals(totalAmount))
          setIsAmountSetted(true)
          return
        }
        if (!isAmountSetted) {
          setConversion(roundToTwoDecimals(convertedAmount))
          setFees(amountFees)
          setTotal(roundToTwoDecimals(totalAmount))
        }
      }else{
        const currentRate = roundToTwoDecimals(from.current_rate);
        
        setRate(currentRate)
        if (amount) {
          setConversion(roundToTwoDecimals(amount));

          let amountFees = roundToTwoDecimals((serviceFees / 100) * amount)
          let totalAmount = parseFloat(amount) + parseFloat(amountFees)

          if (roundToTwoDecimals(totalAmount) >= roundToTwoDecimals(from.balance)) {
            
            amountFees = roundToTwoDecimals((serviceFees / 100) * from.balance)
          
            setAmount(roundToTwoDecimals(from.balance - amountFees))
            setConversion(roundToTwoDecimals(amount))
            setFees(amountFees)
            setTotal(roundToTwoDecimals(from.balance))
            setIsAmountSetted(true)
            return
          }

          if (!isAmountSetted) {
            setConversion(roundToTwoDecimals(amount))
            setFees(amountFees)
            setTotal(roundToTwoDecimals(totalAmount))
          }
        }

 
      }
    }
  }, [from, target, amount, serviceFees, type])

  useEffect(() => {
    setIsAmountSetted(false)
  }, [target, from])

  if (!target) {
    return null
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label="costs table">
        <TableBody>
              <StyledTableRow >
                <TableCell component="th" scope="row">
                  {type === "buy" ? "Conversion" : "Montant à créditer"}
                </TableCell>
                <TableCell align="right">
                  {type === "buy" && `(${rate.toFixed(2)}€/${target?.code})`} {conversion} {target?.code}
                </TableCell>
              </StyledTableRow>
          {
            type === "buy" &&
              <StyledTableRow >
                <TableCell component="th" scope="row">
                  Frais de gas
                </TableCell>
                <TableCell align="right">{target?.current_gas?.toFixed(2)}€</TableCell>
              </StyledTableRow>
          }
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
    if (amount < 0) {
      setAmount(0)
    }
  }, [min, max]);


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


export default TransactionCard;