import { Box, Button, CircularProgress } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getTransactionsHistory } from '../../services/Api.service';
import { useEffect, useMemo } from 'react';

const ViewMoreTransactionHistoryButton = ({filter, setSnackBar, count, id}) => {
  
  const queryClient = useQueryClient()
  
  const { data, isFetching, refetch } = useQuery({ 
      queryKey: ['viewMoreTransactionsHistory'], 
      queryFn: () => getTransactionsHistory(filter, count ?? 0, id),
      retry: 3,
      refetchInterval: false,
      refetchOnWindowFocus: false,
      enabled: false,
      onSuccess: (data) => {
          queryClient.setQueryData(['transactionsHistory'], (oldValue) => {
            return {
              ...oldValue,
              transactionsHistory : [...oldValue.transactionsHistory, ...data.transactionsHistory]
            }
          })
      },
      onError: (error) => setSnackBar({message: error, showSnackBar: true, type: "error"})
  });


  const renderViewMoreButton = useMemo(() => {
    if (count < 10 || (data && data?.transactionsHistory?.length < 10)) {
      return null;
    }
    
    return (
      <Button
          variant="text"
          onClick={() => refetch(filter, count ?? 0, id)}
      >
        Voir plus
      </Button>
    )

  }, [data, filter, count])

  useEffect(() => {
    queryClient.setQueryData(['viewMoreTransactionsHistory'], null)
  }, [filter])


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

export default ViewMoreTransactionHistoryButton;
