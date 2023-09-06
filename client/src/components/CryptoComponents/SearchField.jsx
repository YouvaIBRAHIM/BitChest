import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Icon from '@mui/material/Icon';
import { MagnifyingGlass } from '@phosphor-icons/react';
import colors from "../../services/Tailwind.service";
import { Box } from '@mui/material';

const SearchField = ({setSearch, search}) => {

  return (
    <Box
        component="form"
        sx={{ 
            p: '2px 4px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            width: "100%" ,
            backgroundColor: colors.green[400] + "50",
            borderRadius: 1
        }}
    >
        <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Rechercher"
            inputProps={{ 'aria-label': 'Rechercher' }}
            onChange={(e) => setSearch(e.target.value)}
            value={search}
        />
        <Icon 
            aria-label="search"
            sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
            }}
        >
            <MagnifyingGlass size={14} weight="duotone" />
        </Icon>
    </Box>
  );
}

export default SearchField;
