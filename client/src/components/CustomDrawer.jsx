import Drawer from '@mui/material/Drawer';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { House, User, Users, Wallet, List as ListIcon, SignOut } from '@phosphor-icons/react';
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ThemeSwitchButton from './ThemeSwitchButton';
import { roundToTwoDecimals } from '../services/Utils.service';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from "react-router-dom";
import CustomSnackbar from './CustomSnackbar';
import { clearUser } from '../reducers/UserReducer';
import { onLogout } from '../services/Api.service';

const links = [
  {
    label: "Accueil",
    endpoint: "/home",
    icon: <House size={20} weight='duotone'/>,
    roles: ["admin", "client"]
  },
  {
    label: "Portefeuille",
    endpoint: "/wallet",
    icon: <Wallet size={20} weight='duotone'/>,
    roles: ["client"]
  },
  {
    label: "Mon compte",
    endpoint: "/profile",
    icon: <User size={20} weight='duotone'/>,
    roles: ["admin", "client"]
  },
  {
    label: "Utilisateurs",
    endpoint: "/users",
    icon: <Users size={20} weight='duotone'/>,
    roles: ["admin"]
  }
]

const CustomDrawer = ({ mobileOpen, handleDrawerToggle, drawerWidth }) => {
  const { mode } = useSelector(state => state.theme)
  const { user } = useSelector(state => state.user)
  const [snackBar, setSnackBar] = useState({message: "", showSnackBar: false, type: "info"});
  const dispatch = useDispatch();

  const handleCloseSnackBar = useCallback((e, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackBar({message: "", showSnackBar: false, type: "info"});
}, [])

  const navigate = useNavigate();

  const linkList = useMemo(() => {

    {return links.map((link, index) => {
        if (!link.roles.includes(user.role)) return null
        return (
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
        )
      }
    )}
  }, [user])

  const handleLogout = async () => {
    try {
      const response = await onLogout()

      if (response.status === 204) {
        dispatch(clearUser());
        navigate("/login");
      }
    } catch (error) {
      setSnackBar({message: error?.message, showSnackBar: true, type: "error"})
    }
  }

  return (
    <Box sx={{ display: 'flex', position: "sticky", top: "0px", zIndex: 50 }}>
      <AppBar
        position="sticky"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          left: { sm: `${drawerWidth}px` },
          
        }}
        color='secondary'
        enableColorOnDark
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
          {
            user?.role === "client" &&
            <Box>
              <Typography variant="p">Solde {roundToTwoDecimals(user?.wallet?.balance)}€</Typography>
            </Box>
          }
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
          <DrawerContent 
            mode={mode} 
            user={user}
            linkList={linkList}
            handleLogout={handleLogout}
          />
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          <DrawerContent 
            mode={mode} 
            linkList={linkList}
            handleLogout={handleLogout}
          />
        </Drawer>
      </Box>
      <CustomSnackbar open={snackBar.showSnackBar} handleClose={handleCloseSnackBar} type={snackBar.type} message={snackBar.message}/>

    </Box>
  );
}

const DrawerContent = ({mode, linkList, handleLogout}) => {
  

  return (
    <Box 
      className='flex flex-col h-full justify-between'
    >
      <Box>
        <Toolbar className='items-center justify-center'>
          <img src={`/assets/bitchest_logo_${mode}.svg`} alt='BitChest Logo' className='h-10'/>
        </Toolbar>
        <Divider />
        <List>
          {linkList}
        </List>
        <Divider />
        <ThemeSwitchButton />
      </Box>
      <Button 
        variant="contained" 
        startIcon={<SignOut size={24} weight="duotone" />}
        sx={{
          borderRadius: 0
        }}
        color="secondary"
        onClick={handleLogout}
      >
        Se déconnecter
      </Button>
    </Box>
  )
};


export default CustomDrawer;
