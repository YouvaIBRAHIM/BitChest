import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from "../reducers/UserReducer";
import { onLogin } from "../services/Api.service";
import { Button, TextField, styled } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import { CursorClick, Eye, EyeClosed } from '@phosphor-icons/react';

const LoginPage = () => {
    const [ showPassword, setShowPassword ] = useState(false);
    const [ credentials, setCredentials ] = useState({ email: '', password: ''});
    const [ error, setError ] = useState('');
    const { mode } = useSelector(state => state.theme);

    const dispatch = useDispatch();
    const navigate = useNavigate();    

    const onHandleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await onLogin(credentials)
            dispatch(setUser({ user : response.data.user }));
            navigate('/home');
        } catch (error) {
            setError(error);
        }
    }

    return (
        <Container className="flex items-center justify-center w-full h-screen">
            <div className='flex flex-col items-center justify-center gap-5'>
                <img
                    src={`/assets/bitchest_logo_${mode}.svg`}
                    alt="BitChest Logo"
                    loading="lazy"
                />
                {
                    error !== "" &&
                    <span className='font-poppins text-center text-white bg-red-400 rounded w-full p-2 '>
                        {error}
                    </span>
                }
                <form className='flex flex-col gap-5 w-full' method="post" onSubmit={onHandleSubmit}>
                    <TextField 
                        id="email" 
                        name="email" 
                        label="Email" 
                        variant="outlined" 
                        className='rounded' 
                        onChange={e => setCredentials({...credentials, email: e.target.value})}
                    />
                    <FormControl variant="outlined">
                        <InputLabel htmlFor="password">Mot de passe</InputLabel>
                        <OutlinedInput className='rounded bg-red'
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                                >
                                {showPassword ? <Eye size={24} /> : <EyeClosed size={24} />}
                                </IconButton>
                            </InputAdornment>
                            }
                            label="Mot de passe"
                            onChange={e => setCredentials({...credentials, password: e.target.value})}
                        />
                    </FormControl>
                    <Button 
                        type='submit'
                        variant="contained" 
                        endIcon={<CursorClick size={18} />} 
                        color="success" 
                        className='rounded font-medium'
                    >
                        Connexion
                    </Button>
                </form>
            </div>
        </Container>
    );
};

const Container = styled('div')({
    "& img":{
        width: "250px"
    }
});

export default LoginPage;