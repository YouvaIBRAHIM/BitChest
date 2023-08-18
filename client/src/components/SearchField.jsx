import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import { MagnifyingGlass } from '@phosphor-icons/react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

const SearchField = ({setSearch, search, filterOptions}) => {
  return (
    <Box className="flex gap-1">
        <Search>
            <SearchIconWrapper>
                <MagnifyingGlass />
            </SearchIconWrapper>
            <StyledInputBase
                placeholder="Rechercher"
                inputProps={{ 'aria-label': 'search' }}
                onChange={(e) => setSearch(oldValue => {return {...oldValue, text: e.target.value}})}
            />
        </Search>
        <FormControl sx={{ width: 120 }} size="small">
            <InputLabel id="RoleId">Par</InputLabel>
            <Select
                labelId="RoleId"
                id="RoleId"
                value={search.filter}
                label="Par"
                onChange={(e) => setSearch(oldValue => {return {...oldValue, filter: e.target.value}})}
            >
            {
                filterOptions.map((option, index) => {
                    return (
                        <MenuItem key={index} value={option.value}>{option.label}</MenuItem>
                    )
                })
            }
            </Select>
        </FormControl>
    </Box>
  );
}

export default SearchField;