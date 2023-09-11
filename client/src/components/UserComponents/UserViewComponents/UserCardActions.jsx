import { Box, Button, Card, CardActions } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { deleteUser, restoreUsers } from '../../../services/Api.service';
import { useSelector } from 'react-redux';
import { ArrowCounterClockwise, Trash } from '@phosphor-icons/react';
import { useMemo, useState } from 'react';
import CustomConfirmationDialog from './CustomConfirmationDialog';
import { useNavigate } from 'react-router-dom';

// Actions possibles sur un utilisateur (suppression, suppression définitive et restauration). Visible uniquement pour les administrateurs
const UserCardActions = ({ user, setSnackBar, refetchUserData }) => {
    const [ dialog, setDialog ] = useState(false)
    const [ message, setMessage ] = useState("")
    const [ action, setAction ] = useState("")
    const { user: authUser } = useSelector(state => state.user)
    const navigate = useNavigate();    

    const restoreUsersMutation = useMutation({
        mutationFn: restoreUsers,
        onSuccess: (data) => {
            setSnackBar({
              message: "L'utilisateur a été restauré.", 
              showSnackBar: true, 
              type: "success"
            });
            setDialog(false)
            setAction("")
            setMessage("")
            refetchUserData()
        },
        onError: error => {
          setSnackBar({message: error, showSnackBar: true, type: "error"});
        }
    })

    const deleteUserMutation = useMutation({
        mutationFn: () => deleteUser(user.id, user.deleted_at ? "disabled" : "enabled"),
        onSuccess: (data) => {

            setSnackBar({
              message: "L'utilisateur a été supprimé.", 
              showSnackBar: true, 
              type: "success"
            });

            setDialog(false)
            setAction("")
            setMessage("")
            if (user.deleted_at) {
                navigate("/users")
            }else{
                refetchUserData()
            }
            
        },
        onError: error => {
          setSnackBar({message: error, showSnackBar: true, type: "error"});
        }
    })

    const handleDeleteUser = () => {
        deleteUserMutation.mutate(user.id, user.deleted_at ? "disabled" : "enabled") 
    }

    const handleRestoreUser = () => {
        restoreUsersMutation.mutate([user.id]) 
    }

    const handleClickButton = (action, message) => {
        setDialog(true)
        setAction(action)
        setMessage(message)
    }

    const renderDeleteButton = useMemo(() => {
        if (authUser.role === "client") {
            return null;
        }
        return (
            <Button 
                variant="contained" 
                startIcon={<Trash size={24} weight="duotone" />}
                    sx={{
                }}
                onClick={() => handleClickButton("delete", `Voulez-vous vraiment supprimer${user.deleted_at ? " définitivement" : ""} cet utilisateur ?`)}
                color='danger'

            >
                Supprimer {user.deleted_at ? "définitivement" : ""}
            </Button>
        )
    }, [user])

    const renderRestoreButton = useMemo(() => {
        if (!user.deleted_at) {
            return null;
        }
        return (
            <Button 
                variant="contained" 
                startIcon={<ArrowCounterClockwise size={24} weight="duotone" />}
                    sx={{
                }}
                onClick={() => handleClickButton("restore", `Voulez-vous vraiment restaurer cet utilisateur ?`)}
            >
                Restaurer
            </Button>
        )
    }, [user])

    return (
        <Card>
            <CardActions
            >
                <Box
                    className='flex flex-col md:flex-row justify-center items-center flex-wrap gap-5 w-full'
                >
                    {renderDeleteButton}
                    {renderRestoreButton}
                </Box>
            </CardActions>

            <CustomConfirmationDialog 
                dialog={dialog}
                setDialog={setDialog}
                user={user} 
                message={message} 
                onConfirm={action === "delete" ? handleDeleteUser : handleRestoreUser}
            />
        </Card>
    );
};

export default UserCardActions;
