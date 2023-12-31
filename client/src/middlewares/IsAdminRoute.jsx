import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

// middleware qui vérifie si l'utilisateur connecté est un administrateur
const IsAdminRoute = ({children}) => {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    const { user } = useSelector(state => state.user)

    useEffect(()=>{
        if (user?.role === "admin") {
            setIsAdmin(true)
        }else{
            navigate("/home")
        }
    }, [])

    if (isAdmin) {
        return children;
    }
}

export default IsAdminRoute