import Drawer from '@mui/material/Drawer';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { CursorClick, House, User, Wallet, List as ListIcon } from '@phosphor-icons/react';
import { Toolbar } from '@mui/material';

const links = [
  {
    label: "Accueil",
    endpoint: "/",
    icon: <House />
  },
  {
    label: "Portefeuille",
    endpoint: "/wallet",
    icon: <Wallet />
  },
  {
    label: "Mon compte",
    endpoint: "/User",
    icon: <User />
  }
]

function CustomDrawer({ mobileOpen, handleDrawerToggle, drawerWidth }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();


  return (
    <>
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
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
    </>
  );
}

const drawer = (
  <div>
    <Toolbar>
      <img src='/assets/bitchest_logo.png' alt='BitChest Logo' className='h-10'/>
    </Toolbar>
    <Divider />
    <List>
      {links.map((link, index) => (
        <ListItem key={link.label} disablePadding>
          <NavLink className={`${({ isActive }) => isActive ? "bg-red-400" : ""} w-full`} to={link.endpoint}>
            <ListItemButton>
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
  </div>
);


export default CustomDrawer;
