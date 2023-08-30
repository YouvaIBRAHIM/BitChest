import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import NewUserForm from './NewUserForm';
import { addUser } from '../../../services/Api.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from 'yup';

const signUpSchema = yup.object().shape({
    firstname: yup.string()
        .min(1, 'Trop court.')
        .max(50, 'Trop long.')
        .required('Champ obligatoire.'),
    lastname: yup.string()
        .min(1, 'Trop long.')
        .max(50, 'Trop long.')
        .required('Champ obligatoire.'),
    role: yup.string()
        .required('Champ obligatoire.'),
    email: yup.string()
        .email('Email invalide.')
        .required('Champ obligatoire.'),
    password: yup.string()
        .min(8, 'Trop court.')
        .max(50, 'Trop long.')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@,#\$%\^&\*])(?=.{8,})/,),
    confirmationPassword: yup.string()
        .oneOf([yup.ref('password'), null], 'Les mots de passe doivent être similaires.')
        .required('Champ obligatoire.'),
});

const NewUserDialog = ({ open, setOpen, setSnackBar }) => {

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signUpSchema),
    mode: "all"
  })

  const [userInfos, setUserInfos] = useState({
                                              confirmationPassword: "",
                                              email: "",
                                              firstName: "",
                                              lastName: "",
                                              password: "",
                                              role: "",
                                            });

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    // setUserInfos((prevUser) => ({ ...prevUser, [name]: value }));
};

  const onSubmit = (event) => {
      event.preventDefault();
      // userMutation.mutate(userInfos)
      console.log("🚀 ~ file: NewUserDialog.jsx:40 ~ handleSubmit ~ userInfos:", userInfos)
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle id="alert-dialog-title">
            Nouvel utilisateur
          </DialogTitle>
          <DialogContent>
            <NewUserForm 
              userInfos={userInfos} 
              handleChange={handleChange}
              register={register}
              errors={errors}
            />
          </DialogContent>
          <DialogActions>
            <Button type='submit' autoFocus>
              Agree
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
export default NewUserDialog;
