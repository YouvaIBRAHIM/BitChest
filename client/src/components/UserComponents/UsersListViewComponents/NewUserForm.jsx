import { useState } from 'react';
import {
    Card,
    CardContent,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    InputAdornment,
    IconButton,
    OutlinedInput,
    Grid,
    Typography,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';

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



const NewUserForm = ({ userInfos, handleChange, register, errors }) => {
console.log("🚀 ~ file: NewUserForm.jsx:31 ~ NewUserForm ~ errors:", errors)

    const [ showPassword, setShowPassword ] = useState({
        password: false,
        confirmation: false,
    });

    const [ isPasswordFocus, setIsPasswordFocus ] = useState(false);

    return (
    <Card>
        <CardContent>
                <div className='flex flex-col gap-5'>
                    <div className='flex gap-5'>
                        <TextField
                            name="firstname"
                            {...register("firstname")}
                            label="Prénom"
                            fullWidth
                            variant="outlined"
                            onChange={handleChange}
                        />
                        <TextField
                            name="lastname"
                            {...register("lastname")}
                            label="Nom"
                            fullWidth
                            variant="outlined"
                            onChange={handleChange}
                        />
                    </div>
                    <TextField
                        name="email"
                        {...register("email")}
                        label="Email"
                        fullWidth
                        variant="outlined"
                        onChange={handleChange}
                    />
                    <FormControl>
                        <InputLabel id="RoleId">Rôle</InputLabel>
                        <Select
                            labelId="RoleId"
                            id="RoleId"
                            name='role'
                            defaultValue={"client"}
                            {...register("role")}
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
                        <InputLabel htmlFor="newPassword">Mot de passe</InputLabel>
                        <OutlinedInput className='rounded bg-red'
                            id="password"
                            name="password"
                            {...register("password")}
                            type={showPassword.password ? 'text' : 'password'}
                            endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setShowPassword(oldValue => { return {...oldValue, password: !oldValue.password}})}
                                edge="end"
                                >
                                {showPassword.password ? <Eye size={24} /> : <EyeClosed size={24} />}
                                </IconButton>
                            </InputAdornment>
                            }
                            label="Mot de passe"
                            onChange={handleChange}
                            onFocus={() => setIsPasswordFocus(true)}
                            onBlur={() => setIsPasswordFocus(false)}
                        />
                        {
                            isPasswordFocus &&
                            <Grid item xs={12} md={6}>
                                <Typography 
                                    sx={{ m: 1 }} 
                                    variant="p" component="div"
                                    className='font-poppins text-sm'
                                >
                                    Le mot de passe doit contenir au moins :
                                </Typography>
                                <List 
                                    dense={true}
                                    sx={{ 
                                        p: 0,
                                        "& span" :{
                                            fontSize: "12px!important",
                                            fontFamily: "Poppins!important"
                                        } 
                                    }}
                                >
                                    <ListItem>
                                        <ListItemText
                                            primary="Une minuscule "       
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText
                                            primary="Une majuscule"       
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText
                                            primary="Un caractère spécial (!@,#$%^&*)"       
                                        />
                                    </ListItem>
                                </List>
                            </Grid>
                        }
                    </FormControl>
                    <FormControl variant="outlined">
                        <InputLabel htmlFor="confirmationPassword">Confirmation du mot de passe</InputLabel>
                        <OutlinedInput className='rounded bg-red'
                            id="confirmationPassword"
                            name="confirmationPassword"
                            {...register("confirmationPassword")}
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
        </CardContent>
    </Card>
    );
};

export default NewUserForm;
