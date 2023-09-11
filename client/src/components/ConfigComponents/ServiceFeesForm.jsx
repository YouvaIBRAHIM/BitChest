import { useMutation, useQuery } from '@tanstack/react-query';
import { getTransactionConfig, updateServiceFees } from '../../services/Api.service';
import ErrorView from '../../views/ErrorView';
import { Box, Button, FilledInput, FormControl, IconButton, InputAdornment, InputLabel, Typography } from '@mui/material';
import { ArrowFatLinesUp } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import ServiceFeesFormSkeleton from '../Skeletons/ServiceFeesForm';

const ServiceFeesForm = ({setSnackBar}) => {
    const [ amount, setAmount ] = useState(0)
  
    const { data: config, isFetching, refetch, isError, error} = useQuery({ 
      queryKey: ['user'], 
      queryFn: getTransactionConfig,
      retry: 3,
      refetchInterval: false,
      refetchOnWindowFocus: false,
    });
  
    useEffect(() => {
      if (config?.service_fees) {
        setAmount(config.service_fees)
      }
      
    }, [config])
  
    const handleChange = (e) => {
      if (e.target.value > 20) {
        setAmount(20)
      }else if (e.target.value < 0) {
        setAmount(0)
      }else{
        setAmount(e.target.value)
      }
    }
  
    const updateServiceFeesMutation = useMutation({
      mutationFn: updateServiceFees,
      onSuccess: () => {
          setSnackBar({
            message: "Frais de services mis à jour.", 
            showSnackBar: true, 
            type: "success"
          });
      },
      onError: error => {
        setSnackBar({message: error, showSnackBar: true, type: "error"});
      }
    })
  
    const handleSubmit = (e) => {
      e.preventDefault()
      updateServiceFeesMutation.mutate(amount)
    }
    if (isError) {
      return <ErrorView message={error} refetch={refetch}/>
    }
  
    return (
      <Box
        className="flex flex-col gap-2 w-full"
      >
        <Typography variant="p">Frais de service</Typography>
        {
            isFetching ?
            <ServiceFeesFormSkeleton />
            :
            <form
            onSubmit={handleSubmit}
            className="flex gap-2 flex-wrap md:flex-nowrap"
            >
            <FormControl 
                variant="filled"
                className='w-full'
                size='small'
                sx={{
                maxWidth: 250
                }}
                onChange={handleChange}
            >
                <InputLabel htmlFor="amount">Pourcentage</InputLabel>
                <FilledInput className='rounded'
                    id="amount"
                    name="amount"
                    type="number"
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
                        onClick={() => setAmount(20)}
                        >
                        <ArrowFatLinesUp size={24} weight="duotone" />
                        </IconButton>
                    </InputAdornment>
                    }
                    label="Montant"
                />
            </FormControl>
            <Button 
                type='submit' 
                variant="contained" 
                color="primary"
            >
                Enregistrer
            </Button>
            </form>
        }
      </Box>
    )
}

export default ServiceFeesForm;