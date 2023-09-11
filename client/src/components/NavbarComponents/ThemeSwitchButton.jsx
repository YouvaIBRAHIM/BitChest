import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { SunDim, Moon } from '@phosphor-icons/react';
import { useDispatch } from 'react-redux';
import { setThemeMode } from '../../reducers/ThemeReducer';

// Bouton permettant de changer le thème du site
const ThemeSwitchButton = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  return (
    <Box
      className="flex w-full items-center justify-center text-primary p-3"
    >
      Mode {theme.palette.mode === "dark" ? "sombre" : "clair"}
      <IconButton sx={{ ml: 1 }} onClick={() => dispatch(setThemeMode())} color="inherit">
        {theme.palette.mode === 'dark' ? <Moon /> : <SunDim/>}
      </IconButton>
    </Box>
  );
}

export default ThemeSwitchButton;