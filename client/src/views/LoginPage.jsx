import {useState} from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setUserInfo } from "../features/UserReducer";
import { onLogin } from "../services/Api.service";
import { TextField, styled } from '@mui/material';
import Button from '@mui/joy/Button';
/**
 * @param {Function} setIsConnected permet de mettre à jour le state indiquant si l'utilisateur est connecté ou non
 * @returns une page de connexion
 */
const LoginPage = ({ setIsConnected }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [errorMessage, setErrorMessage] = useState('');

    const dispatch = useDispatch();
    // dispatch(setUserInfo({ user : user }));

    const navigate = useNavigate();
    // navigate("/home");

    const onHandleChange = (event, setState) =>{
        const value = event.target.value;
        setState(value);
    }
    
    function onHandleSubmit(){

    }

    return (
        <Container className="flex items-center justify-center w-full h-screen">
            <div className='flex flex-col items-center justify-center gap-5'>
                <img
                    src="/assets/bitchest_logo.png"
                    alt="BitChest Logo"
                    loading="lazy"
                />
                <form className='flex flex-col gap-5' action="" method="post">
                    <TextField id="outlined-basic" label="Email" variant="outlined" />
                    <TextField id="outlined-basic" label="Mot de passe" variant="outlined" type='password'/>
                    <Button variant="soft" endDecorator="{<KeyboardArrowRight />}" color="success">
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