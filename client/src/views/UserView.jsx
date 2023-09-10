import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import UserCard from '../components/UserComponents/UserViewComponents/UserCard';
import UserForm from '../components/UserComponents/UserViewComponents/UserForm';
import UserPasswordForm from '../components/UserComponents/UserViewComponents/UserPasswordForm';
import { useLocation, useParams } from 'react-router-dom';
import CustomSnackbar from '../components/CustomSnackbar';
import { useQuery } from '@tanstack/react-query';
import { getAuthUser, getUser } from '../services/Api.service';
import { UserCardSkeleton, UserFormSkeleton, UserPasswordFormSkeleton } from '../components/Skeletons/UserProfile';
import WalletView from './WalletView';
import zIndex from '@mui/material/styles/zIndex';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function tabProps(index) {
  return {
    id: `user-tab-${index}`,
    'aria-controls': `user-tabpanel-${index}`,
  };
}

const UserView = () => {
    const { id } = useParams();
    const {pathname} = useLocation();
    const [tabIndex, setTabIndex] = useState(0);
    const [snackBar, setSnackBar] = useState({message: "", showSnackBar: false, type: "info"});

    const { data: user, isFetching, refetch} = useQuery({ 
      queryKey: ['user'], 
      queryFn: () => id ? getUser(id) : getAuthUser(),
      retry: 3,
      refetchInterval: false
    });


    useEffect(() => {
      refetch(id)
    }, [pathname])

    const handleChange = (event, newValue) => {
        setTabIndex(newValue);
    };
    const handleCloseSnackBar = useCallback((e, reason) => {
        if (reason === 'clickaway') {
          return;
        }

        setSnackBar({message: "", showSnackBar: false, type: "info"});
      }, [])


    return (
      <Box sx={{ width: "100%" }}>
        <Box 
          sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',  
            position: "sticky", 
            top: {xs: "56px", sm: "64px"},  
            zIndex: 45,

          }}
          bgcolor="secondary.main"   
        >
            <Tabs 
                value={tabIndex} 
                onChange={handleChange} 
                aria-label="user tabs"
            >
              <Tab label="Profil" {...tabProps(0)} />
              {
                  id &&
                  <Tab label="Portefeuille" {...tabProps(1)} />  
              }
            </Tabs>
        </Box>
            {
                user && 
                <>
                    <CustomTabPanel value={tabIndex} index={0}>
                        <div className='flex flex-wrap justify-end w-full'>
                            <div className='sm:basis-full lg:basis-1/3 sm:relative sm:top-0 lg:self-start lg:top-3 lg:sticky  grow p-2'>
                              {
                                isFetching ?
                                <UserCardSkeleton />
                                :
                                <UserCard user={user} />
                              }
                            </div>
                            <div className='sm:basis-full lg:basis-2/3 grow p-2'>
                            {
                              isFetching ?
                              <UserFormSkeleton />
                              :
                              <UserForm user={user} setSnackBar={setSnackBar}/>
                            }
                            </div>
                            <div className='lg:basis-2/3 basis-full p-2'>
                            {
                              isFetching ?
                              <UserPasswordFormSkeleton />
                              :
                              <UserPasswordForm user={user} setSnackBar={setSnackBar} />
                            }
                            </div>
                        </div>
                    </CustomTabPanel>
                    {
                        id &&
                        <CustomTabPanel value={tabIndex} index={1}>
                          <WalletView id={id}/> 
                        </CustomTabPanel>                    
                    }

                </>
            }
        <CustomSnackbar open={snackBar.showSnackBar} handleClose={handleCloseSnackBar} type={snackBar.type} message={snackBar.message}/>

    </Box>
    );
}


export default UserView;