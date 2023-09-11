import { Robot } from '@phosphor-icons/react';
import { Box, Typography } from '@mui/material';

// Affiché quand aucun résultat n'est trouvé lors d'une requete
const ListNotFound = ({message}) => {

  return (
    <Box
      className="flex flex-col gap-5 items-center justify-center w-full my-5"
    >
      <Robot size={48} weight="duotone" />
      <Typography variant="p">{message ?? "Aucun résultat"}</Typography>
    </Box>
  );
}

export default ListNotFound;
