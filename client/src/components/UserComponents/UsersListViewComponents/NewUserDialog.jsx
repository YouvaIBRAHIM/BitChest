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
import { signUpSchema } from '../../../services/FormSchema.service';


const NewUserDialog = ({ open, setOpen, setSnackBar }) => {

  const queryClient = useQueryClient()


  const userMutation = useMutation({
      mutationFn: addUser,
      onSuccess: data => {
          const newUser = data.data
          newUser.isNewRow = true
          
          queryClient.setQueryData(['userList'], (oldValue) => {
            return {
              ...oldValue,
              total: oldValue.total + 1,
              data : [newUser, ...oldValue.data]
            }
          })  
          setOpen(false)
          setSnackBar({message: `L'utilisateur ${newUser.firstname} ${newUser.lastname} a bien été ajouté.`, showSnackBar: true, type: "success"});
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

  const handleClose = () => {
    setOpen(false);
  };


  const onSubmit = (data) => {
      userMutation.mutate(data)
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
              register={register}
              errors={errors}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleClose}
            >
              Fermer
            </Button>
            <Button type='submit' autoFocus>
              Ajouter
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
export default NewUserDialog;
