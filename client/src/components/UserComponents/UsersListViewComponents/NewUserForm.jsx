import { useState } from 'react';
import {
    Card,
    CardHeader,
    CardContent,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    InputAdornment,
    IconButton,
    OutlinedInput,
} from '@mui/material';
import { addUser } from '../../../services/Api.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Eye, EyeClosed } from '@phosphor-icons/react';

const roles = [
    {
      label: "Client",
      value: "client"
    },
    {
      label: "Admin",
      value: "admin"
    },
]

const NewUserForm = ({ setSnackBar }) => {
    const queryClient = useQueryClient()

    const userMutation = useMutation({
        mutationFn: addUser,
        onSuccess: data => {
            // queryClient.setQueryData(['user'], data)  
            // setSnackBar({message: "Les données ont été mises à jour.", showSnackBar: true, type: "success"});
        },
        onError: error => {
            setSnackBar({message: error, showSnackBar: true, type: "error"});
        }
    })

    const [userInfos, setUserInfos] = useState([]);
    const [ showPassword, setShowPassword ] = useState({
        password: false,
        confirmation: false,
    });
    const handleChange = (event) => {
        const { name, value } = event.target;
        setUserInfos((prevUser) => ({ ...prevUser, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        userMutation.mutate(userInfos)
    };

    return (
    <Card>
        <CardContent>
            <form onSubmit={handleSubmit}>
                <div className='flex flex-col gap-5'>
                    <div className='flex gap-5'>
                        <TextField
                            name="firstname"
                            label="Prénom"
                            fullWidth
                            variant="outlined"
                            value={userInfos.firstname}
                            onChange={handleChange}
                        />
                        <TextField
                            name="lastname"
                            label="Nom"
                            fullWidth
                            variant="outlined"
                            value={userInfos.lastname}
                            onChange={handleChange}
                        />
                    </div>
                    <TextField
                        name="email"
                        label="Email"
                        fullWidth
                        variant="outlined"
                        value={userInfos.email}
                        onChange={handleChange}
                    />
                    <FormControl>
                        <InputLabel id="RoleId">Rôle</InputLabel>
                        <Select
                            labelId="RoleId"
                            id="RoleId"
                            name='role'
                            value={userInfos.role}
                            label="Rôle"
                            onChange={handleChange}
                        >
                        {
                            roles.map((option, index) => {
                                return (
                                    <MenuItem key={index} value={option.value}>{option.label}</MenuItem>
                                )
                            })
                        }
                        </Select>
                    </FormControl>
                    <FormControl variant="outlined">
                        <InputLabel htmlFor="newPassword">Nouveau mot de passe</InputLabel>
                        <OutlinedInput className='rounded bg-red'
                            id="newPassword"
                            name="newPassword"
                            type={showPassword.new ? 'text' : 'password'}
                            endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setShowPassword(oldValue => { return {...oldValue, password: !oldValue.password}})}
                                edge="end"
                                >
                                {showPassword.new ? <Eye size={24} /> : <EyeClosed size={24} />}
                                </IconButton>
                            </InputAdornment>
                            }
                            label="Nouveau mot de passe"
                            onChange={handleChange}
                        />
                    </FormControl>
                    <FormControl variant="outlined">
                        <InputLabel htmlFor="confirmationPassword">Confirmation du nouveau mot de passe</InputLabel>
                        <OutlinedInput className='rounded bg-red'
                            id="confirmationPassword"
                            name="confirmationPassword"
                            type={showPassword.confirmation ? 'text' : 'password'}
                            endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => setShowPassword(oldValue => { return {...oldValue, confirmation: !oldValue.confirmation}})}
                                    edge="end"
                                >
                                {showPassword.confirmation ? <Eye size={24} /> : <EyeClosed size={24} />}
                                </IconButton>
                            </InputAdornment>
                            }
                            label="Confirmation du nouveau mot de passe"
                            onChange={handleChange}
                        />
                    </FormControl>
                </div>
            </form>
        </CardContent>
    </Card>
    );
};

export default NewUserForm;
