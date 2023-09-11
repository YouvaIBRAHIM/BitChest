import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginView from './views/LoginView';
import PageNotFound from './views/PageNotFound';
import CustomDrawer from './components/NavbarComponents/CustomDrawer';
import { initServiceWorker } from "./services/ServiceWorker.service";
import { useMemo, useState } from 'react';
import HomeView from './views/HomeView';
import { useSelector } from 'react-redux';
import PrivateRoute from './middlewares/PrivateRoute';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import GuestRoute from './middlewares/GuestRoute';
import IndexPage from './middlewares/IndexPage';
import UsersListView from './views/UsersListView';
import UserView from './views/UserView';
import colors from "./services/Tailwind.service";
import WalletView from './views/WalletView';
import IsAdminRoute from './middlewares/IsAdminRoute';
import IsClientRoute from './middlewares/IsClientRoute';
import ConfigView from './views/ConfigView';

const drawerWidth = 240;

function App() {
  //lance le service worker
  initServiceWorker()
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useSelector(state => state.user)
  const { mode } = useSelector(state => state.theme)
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const muiTheme = useMemo(() => {

    return createTheme({
      palette: {
        mode: mode,
        primary: {
          main: colors.green[400]
        },
        secondary: {
          main: "#230C33",
          light: '#230C33',
          dark: '#9984d4',
        },
        danger: {
          main: colors.red[400],
          light: colors.red[600],
          dark: colors.red[400],
        }
      }
    });
  }, [mode]);

  return (
    <BrowserRouter>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <div>
          {
            user &&
            <CustomDrawer 
              mobileOpen={mobileOpen} 
              handleDrawerToggle={handleDrawerToggle} 
              drawerWidth={drawerWidth} 
            />
          }
            <Box
              component="main"
              sx={{ 
                flexGrow: 1, 
                p: 0, 
                width: { sm: user ? `calc(100% - ${drawerWidth}px)` : "100%" }, 
                marginLeft: { sm: user ? `${drawerWidth}px` : "0" } 
              }}
            >
              <Routes>
                <Route path="/" element={<IndexPage />} />

                <Route path="/login" element={
                                              <GuestRoute>
                                                <LoginView />
                                              </GuestRoute>
                                            }
                />
 
                <Route path="/home" element={
                                          <PrivateRoute>
                                            <HomeView />
                                          </PrivateRoute>
                                        } 
                />

                <Route path="/users" element={
                                          <PrivateRoute>
                                            <IsAdminRoute>
                                              <UsersListView />
                                            </IsAdminRoute>
                                          </PrivateRoute>
                                        } 
                />

                <Route path="/users/:id" element={
                                          <PrivateRoute>
                                            <IsAdminRoute>
                                              <UserView />
                                            </IsAdminRoute>
                                          </PrivateRoute>
                                        } 
                />

                <Route path="/profile" element={
                                          <PrivateRoute>
                                            <UserView />
                                          </PrivateRoute>
                                        } 
                />

                
                <Route path="/wallet" element={
                                          <PrivateRoute>
                                            <IsClientRoute>
                                              <WalletView />
                                            </IsClientRoute>
                                          </PrivateRoute>
                                        } 
                />

                <Route path="/config" element={
                                          <PrivateRoute>
                                            <IsAdminRoute>
                                              <ConfigView />
                                            </IsAdminRoute>
                                          </PrivateRoute>
                                        } 
                />


                <Route path="/*" element={<PageNotFound />} />                                                                                                     
              </Routes>
            </Box>
        </div>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;