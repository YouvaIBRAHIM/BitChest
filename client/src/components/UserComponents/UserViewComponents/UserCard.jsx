import { Card, CardHeader, CardContent, Avatar, Typography } from '@mui/material';

const UserCard = ({ user }) => {
    return (
        <Card>
            <CardHeader className='bg-green-400' sx={{height: 150, backgroundColor: user.color}}/>
            <Avatar
                alt={`${user.firstname} ${user.lastname}`}
                src={user.avatarUrl}
                sx={{
                    width: 100,
                    height: 100,
                    margin: '0 auto',
                    transform: "translateY(-50%)"
                }}
            />
            <CardContent>
                <Typography variant="h6" sx={{position: 'relative', top: -50, textAlign:"center"}}>{user.firstname} {user.lastname?.toUpperCase()}</Typography>
                <Typography variant="body1" sx={{mb: 2}}>{user.email}</Typography>
                <Typography variant="body2" sx={{mb: 1}}>{user.role?.toUpperCase()}</Typography>
            </CardContent>
        </Card>
    );
};

export default UserCard;
