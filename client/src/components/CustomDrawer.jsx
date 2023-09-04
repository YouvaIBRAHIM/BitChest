import Drawer from '@mui/material/Drawer';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { House, User, Users, Wallet, List as ListIcon } from '@phosphor-icons/react';
import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ThemeSwitchButton from './ThemeSwitchButton';
import { roundToTwoDecimals } from '../services/Utils.service';

const links = [
  {
    label: "Accueil",
    endpoint: "/home",
    icon: <House size={20} weight='duotone'/>
  },
  {
    label: "Portefeuille",
    endpoint: "/wallet",
    icon: <Wallet size={20} weight='duotone'/>
  },
  {
    label: "Mon compte",
    endpoint: "/profile",
    icon: <User size={20} weight='duotone'/>
  },
  {
    label: "Utilisateurs",
    endpoint: "/users",
    icon: <Users size={20} weight='duotone'/>
  }
]

function CustomDrawer({ mobileOpen, handleDrawerToggle, drawerWidth }) {
  const { mode } = useSelector(state => state.theme)
  const { user } = useSelector(state => state.user)

  return (
    <Box sx={{ display: 'flex', }}>
      <AppBar
        position="sticky"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          left: { sm: `${drawerWidth}px` },
        }}
        color='secondary'
      >
        <Toolbar
          className='flex justify-between'
        >
          <Box
            sx={{
              display: {xs: "flex", sm: "none"}
            }}
          >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <ListIcon />
          </IconButton>
            <img src='/assets/bitchest_logo_dark.svg' alt='BitChest Logo' className='h-10'/>
          </Box>
          <Box>
            <Typography variant="p">Solde {roundToTwoDecimals(user?.wallet?.balance)}€</Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          <DrawerContent mode={mode}/>
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          <DrawerContent mode={mode}/>
        </Drawer>
      </Box>
    </Box>
  );
}

const DrawerContent = ({mode}) => (

  <div>
    <Toolbar className='items-center justify-center'>
      <img src={`/assets/bitchest_logo_${mode}.svg`} alt='BitChest Logo' className='h-10'/>
    </Toolbar>
    <Divider />
    <List>
      {links.map((link, index) => (
        <ListItem key={index}>
          <NavLink className={({ isActive }) => isActive ? "bg-green-400 w-full rounded" : "rounded w-full"} to={link.endpoint}>
            <ListItemButton sx={{borderRadius: 1}}>
              <ListItemIcon>
                {link.icon}
              </ListItemIcon>
              <ListItemText primary={link.label} />
            </ListItemButton>
          </NavLink>
        </ListItem>
      ))}
    </List>
    <Divider />
    <ThemeSwitchButton />
  </div>
);


export default CustomDrawer;
