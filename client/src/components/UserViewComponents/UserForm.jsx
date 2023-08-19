import { useEffect, useState } from 'react';
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

const UserForm = ({ user }) => {

    const [updatedUser, setUpdatedUser] = useState(user);

    useEffect(() => {
        setUpdatedUser(user)
    }, [user])

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUpdatedUser((prevUser) => ({ ...prevUser, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // onUpdate(updatedUser);
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
                            value={updatedUser.firstname}
                            onChange={handleChange}
                        />
                        <TextField
                            name="lastname"
                            label="Nom"
                            fullWidth
                            variant="outlined"
                            value={updatedUser.lastname}
                            onChange={handleChange}
                        />
                    </div>
                    <TextField
                        name="email"
                        label="Email"
                        fullWidth
                        variant="outlined"
                        value={updatedUser.email}
                        onChange={handleChange}
                    />
                    <FormControl>
                        <InputLabel id="RoleId">Rôle</InputLabel>
                        <Select
                            labelId="RoleId"
                            id="RoleId"
                            name='role'
                            value={updatedUser.role}
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
