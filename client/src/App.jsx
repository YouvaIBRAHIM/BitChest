import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './views/LoginPage';
import PageNotFound from './views/PageNotFound';
import CustomDrawer from './components/CustomDrawer';
import { initServiceWorker } from "./services/ServiceWorker.service";
import { useMemo, useState } from 'react';
import HomePage from './views/HomePage';
import { useSelector } from 'react-redux';
import PrivateRoute from './middlewares/PrivateRoute';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import GuestRoute from './middlewares/GuestRoute';
import IndexPage from './middlewares/IndexPage';
import UsersListView from './views/UsersListView';
import UserView from './views/UserView';
import colors from "./services/Tailwind.service";

const drawerWidth = 240;

function App() {
  //lance le service worker
  // initServiceWorker()
  
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
          main: colors.green[500]
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
                                                <LoginPage />
                                              </GuestRoute>
                                            }
                />

                <Route path="/home" element={
                                          <PrivateRoute>
                                            <HomePage />
                                          </PrivateRoute>
                                        } 
                />

                <Route path="/users" element={
                                          <PrivateRoute>
                                            <UsersListView />
                                          </PrivateRoute>
                                        } 
                />

                <Route path="/users/:id" element={
                                          <PrivateRoute>
                                            <UserView />
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