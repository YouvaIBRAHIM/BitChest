import { Box, Button, CircularProgress } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getCryptos } from '../../services/Api.service';
import { useEffect, useMemo } from 'react';

// Bouton permettant de récupérer d'autres cryptomonnaies dans la liste (limité à 5 par requête)
const ViewMoreButton = ({search, filter, count, setSnackBar}) => {
  
  const queryClient = useQueryClient()
  
  const cryptosLength = queryClient.getQueryData(["cryptos"])?.length

  const { data: moreCryptos, isFetching, refetch } = useQuery({ 
      queryKey: ['viewMoreCryptos'], 
      queryFn: () => getCryptos(search, filter, cryptosLength ?? 0),
      retry: 3,
      refetchInterval: false,
      refetchOnWindowFocus: false,
      enabled: false,
      onSuccess: (data) => {
          queryClient.setQueryData(['cryptos'], (oldValue) => [...oldValue, ...data])
      },
      onError: (error) => setSnackBar({message: error, showSnackBar: true, type: "error"})
  });


  const renderViewMoreButton = useMemo(() => {
    
    if (count < 5 || moreCryptos?.length < 5) {
      return null;
    }

    return (
      <Button
          variant="text"
          onClick={() => refetch(search, filter, cryptosLength ?? 0)}
      >
        Voir plus
      </Button>
    )

  }, [count, moreCryptos])

  useEffect(() => {
    queryClient.setQueryData(['viewMoreCryptos'], null)
  }, [filter, search])


  return (
    <Box 
      className="flex flex-col gap-5 items-center justify-center w-full "
    >
      {
        isFetching ?
        <CircularProgress />
        :
        renderViewMoreButton
      }
    </Box>
  );
}

export default ViewMoreButton;
