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
} from '@mui/material';
import { updateUser } from '../../../services/Api.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';

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

// Formulaire pour changer les informations d'un utilisateur
// Le champ "role" n'est pas visible pour les clients
// Un administrateur ne peut pas changer son propre role pour éviter l'eventualité de n'avoir aucun administrateur sur le site
const UserForm = ({ user, setSnackBar }) => {
    const { user: authUser } = useSelector(state => state.user)

    const [userInfos, setUserInfos] = useState(user);
    
    const queryClient = useQueryClient()
    const userMutation = useMutation({
        mutationFn: updateUser,
        onSuccess: data => {
            queryClient.setQueryData(['user'], data)  
            setSnackBar({message: "Les données ont été mises à jour.", showSnackBar: true, type: "success"});
        },
        onError: error => {
            setSnackBar({message: error, showSnackBar: true, type: "error"});
        }
    })

    const handleSubmit = (event) => {
        event.preventDefault();
        userMutation.mutate(userInfos)
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUserInfos((prevUser) => ({ ...prevUser, [name]: value }));
    };



    return (
    <Card>
        <CardHeader title="Informations de l'utilisateur" />
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
                    {
                        (authUser.role === "admin" && authUser.id !== user.id)&&
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
                    }

                    <Button type="submit" variant="contained" color="primary">
                        Enregistrer
                    </Button>
                </div>
            </form>
        </CardContent>
    </Card>
    );
};

export default UserForm;
