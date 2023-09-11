import { Card, CardHeader, CardContent, Avatar, Typography } from '@mui/material';

// Affiche une card contenant les informations de l'utilisateur
const UserCard = ({ user }) => {
    return (
        <Card>
            <CardHeader className='bg-green-400' sx={{height: 150, backgroundColor: user.color}}/>
            <Avatar
                alt={`${user.firstname} ${user.lastname}`}
                src={user.avatarUrl}
                sx={{
                    position: "absolute",
                    width: 100,
                    height: 100,
                    margin: '0 auto',
                    top: "75px",
                    left: "50%",
                    transform: "translate(-50%, -50%)"
                }}
            />
            <CardContent>
                <Typography variant="h6" sx={{textAlign:"center", mb: 2}}>{user.firstname} {user.lastname?.toUpperCase()}</Typography>
                <Typography variant="body1" sx={{mb: 2}}>{user.email}</Typography>
                <Typography variant="body2">{user.role?.toUpperCase()}</Typography>
            </CardContent>
        </Card>
    );
};

export default UserCard;
