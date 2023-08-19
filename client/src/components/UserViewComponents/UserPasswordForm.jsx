import { useState } from 'react';
import {
    Card,
    CardHeader,
    CardContent,
    TextField,
    Button,
    FormControl,
    InputLabel,
    OutlinedInput,
    InputAdornment,
    IconButton,
} from '@mui/material';
import { Eye, EyeClosed } from '@phosphor-icons/react';

const UserPasswordForm = ({ user }) => {
    const [ showPassword, setShowPassword ] = useState({
        old: false,
        new: false,
        confirmation: false,
    });

    const [updatedUser, setUpdatedUser] = useState(user);

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
        <CardHeader title="Modifier le mot de passe" />
        <CardContent>
            <form onSubmit={handleSubmit}>
                <div className='flex flex-col gap-5'>
                <FormControl variant="outlined">
                        <InputLabel htmlFor="oldPassword">Ancien mot de passe</InputLabel>
                        <OutlinedInput className='rounded bg-red'
                            id="oldPassword"
                            name="oldPassword"
                            type={showPassword.old ? 'text' : 'password'}
                            endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => setShowPassword(oldValue => { return {...oldValue, old: !oldValue.old}})}
                                    edge="end"
                                >
                                {showPassword.old ? <Eye size={24} /> : <EyeClosed size={24} />}
                                </IconButton>
                            </InputAdornment>
                            }
                            label="Ancien mot de passe"
                            onChange={handleChange}
                        />
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
                                onClick={() => setShowPassword(oldValue => { return {...oldValue, new: !oldValue.new}})}
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

                    <Button type="submit" variant="contained" color="primary">
                        Enregistrer
                    </Button>
                </div>
            </form>
        </CardContent>
    </Card>
    );
};

export default UserPasswordForm;
