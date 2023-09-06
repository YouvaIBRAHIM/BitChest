import { Alert, Box, Button } from '@mui/material';
import { Robot } from '@phosphor-icons/react';



const ErrorView = ({ message, refetch }) => {

  return (
    <Box 
      className="flex flex-col gap-10 items-center justify-center w-full min-h-500"
    >
      <Robot size={96} weight="duotone" />
      <Alert severity="error">{message}</Alert>
      <Button
        onClick={refetch}
      >
        Réessayer
      </Button>
    </Box>
  );
}

export default ErrorView;