import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './views/LoginPage';
import PageNotFound from './views/PageNotFound';
import CustomDrawer from './components/CustomDrawer';
import { initServiceWorker } from "./services/ServiceWorker.service";
import { useState } from 'react';
import Home from './views/Home';
import { useSelector } from 'react-redux';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

import { List as ListIcon } from '@phosphor-icons/react';
import Toolbar from '@mui/material/Toolbar';
import PrivateRoute from './middlewares/PrivateRoute';


const drawerWidth = 240;

function App() {
  //lance le service worker
  // initServiceWorker()
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useSelector(state => state.user)
  if (!user) {
    return <LoginPage />
  }


  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };


  return (
    <BrowserRouter>
      <div>
          <Box sx={{ display: 'flex' }}>
            <AppBar
              position="fixed"
              sx={{
                width: { sm: `calc(100% - ${drawerWidth}px)` },
                ml: { sm: `${drawerWidth}px` },
                display: {xs: "block", sm: "none"}
              }}
            >
              <Toolbar>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2, display: { sm: 'none' } }}
                >
                  <ListIcon />
                </IconButton>
                <img src='/assets/bitchest_logo.png' alt='BitChest Logo' className='h-10'/>
              </Toolbar>
            </AppBar>
            <Box
              component="nav"
              sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
              aria-label="mailbox folders"
            >
              <CustomDrawer 
                mobileOpen={mobileOpen} 
                handleDrawerToggle={handleDrawerToggle} 
                drawerWidth={drawerWidth} 
              />
            </Box>
            <Box
              component="main"
              sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
            >
              <Routes>
                <Route path="/" element={
                                          <PrivateRoute>
                                            <Home />
                                          </PrivateRoute>
                                        } 
                />
                           
                <Route path="/*" element={<PageNotFound />} />                                                                                                     
              </Routes>
            </Box>
          </Box>
      </div>
    </BrowserRouter>
  );
}

export default App;