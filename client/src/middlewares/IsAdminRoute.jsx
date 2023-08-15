import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFromSessionStorage } from '../services/Storage.service';

// middleware qui vérifie si l'utilisateur connecté est un administrateur ou non
export default function IsAdminRoute({children}) {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);

    const user = getFromSessionStorage('user');

    useEffect(()=>{
        if (user?.isAdmin) {
            setIsAdmin(true)
        }else{
            navigate("/home")
        }
    }, [])

    if (isAdmin) {
        return children;
    }
}