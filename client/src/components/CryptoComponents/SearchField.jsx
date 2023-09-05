import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Icon from '@mui/material/Icon';
import { MagnifyingGlass } from '@phosphor-icons/react';
import colors from "../../services/Tailwind.service";

const SearchField = () => {

  return (
    <Paper
        component="form"
        sx={{ 
            p: '2px 4px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            width: "100%" ,
            backgroundColor: colors.green[400] + "50"
        }}
    >
        <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Rechercher"
            inputProps={{ 'aria-label': 'Rechercher' }}
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
    </Paper>
  );
}

export default SearchField;
