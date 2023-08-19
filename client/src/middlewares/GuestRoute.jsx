import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthUser } from "../services/Api.service";

// middleware qui interdit d'acceder à la page de login si on est déjà connecté
const GuestRoute = ({children}) => {
    const navigate = useNavigate();
    const [isTokenValid, setIsTokenValid] = useState(true);

    useEffect(()=>{
        getAuthUser()
        .then(user => {
            if (!user) {
                setIsTokenValid(false)
            }else{
                navigate("/home");
            }

        })
        .catch(() => {
            setIsTokenValid(false)
        })
    }, [])

    if (!isTokenValid) {
        return children;
    }
}
export default GuestRoute;