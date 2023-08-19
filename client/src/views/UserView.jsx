import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import UserCard from '../components/UserViewComponents/UserCard';
import UserForm from '../components/UserViewComponents/UserForm';
import UserPasswordForm from '../components/UserViewComponents/UserPasswordForm';
import { useLocation, useParams } from 'react-router-dom';
import { useGetUser } from '../services/Hook.service';
import CustomSnackbar from '../components/CustomSnackbar';



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
    const { pathname } = useLocation();
    const [tabIndex, setTabIndex] = useState(0);
    const [status, setStatus] = useState({isLoading: false, type: "", message: "", snackBar: false});

    const [user, setUser] = useState(null);

    useEffect(() => {
        if (pathname === `/users/${id}` || pathname === "/profile") {
            useGetUser(setUser, setStatus, id)
        }
    }, [])

    const handleChange = (event, newValue) => {
        setTabIndex(newValue);
    };
    const handleCloseSnackBar = useCallback((e, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setStatus(oldValue => { return {...oldValue, snackBar: false}});
      }, [])


    return (
    <Box sx={{ width: '100%'}}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
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
                                <UserCard user={user} />
                            </div>
                            <div className='sm:basis-full lg:basis-2/3 grow p-2'>
                                <UserForm user={user} setUser={setUser} setStatus={setStatus}/>
                            </div>
                            <div className='lg:basis-2/3 basis-full p-2'>
                                <UserPasswordForm user={user} setStatus={setStatus} />
                            </div>
                        </div>
                    </CustomTabPanel>
                    {
                        id &&
                        <CustomTabPanel value={tabIndex} index={1}>
                            Item Two
                        </CustomTabPanel>                    
                    }

                </>
            }
        <CustomSnackbar open={status.snackBar} handleClose={handleCloseSnackBar} type={status.type} message={status.message}/>

    </Box>
    );
}


export default UserView;