import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

// middleware qui vérifie si l'utilisateur connecté est un client
const IsClientRoute = ({children}) => {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    const { user } = useSelector(state => state.user)

    useEffect(()=>{
        if (user?.role === "client") {
            setIsAdmin(true)
        }else{
            navigate("/home")
        }
    }, [])

    if (isAdmin) {
        return children;
    }
}

export default IsClientRoute