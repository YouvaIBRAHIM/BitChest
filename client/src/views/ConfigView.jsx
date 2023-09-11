import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import CustomSnackbar from '../components/CustomSnackbar';
import ServiceFeesForm from '../components/ConfigComponents/ServiceFeesForm';


function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Box
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
    </Box>
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

const ConfigView = () => {

    const [tabIndex, setTabIndex] = useState(0);
    const [snackBar, setSnackBar] = useState({message: "", showSnackBar: false, type: "info"});


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
            color: "white!important"
          }}
          bgcolor="secondary.main"   
        >
          <Tabs 
              value={tabIndex} 
              onChange={handleChange} 
              aria-label="user tabs"

          >
            <Tab 
              label="Transactions" 
              {...tabProps(0)}
              sx={{
                color: "white!important"
              }} 
            />
          </Tabs>
        </Box>
              <CustomTabPanel value={tabIndex} index={0}>
                  <div className='flex flex-wrap w-full'>
                    <ServiceFeesForm
                      setSnackBar={setSnackBar}
                    />
                  </div>
              </CustomTabPanel>
        <CustomSnackbar open={snackBar.showSnackBar} handleClose={handleCloseSnackBar} type={snackBar.type} message={snackBar.message}/>

    </Box>
    );
}




export default ConfigView;