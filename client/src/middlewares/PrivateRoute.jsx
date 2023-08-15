import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../services/Api.service";

// middleware qui vérifie si le token que l'utilisateur est valide ou non
// si le token est valide le middleware retourne le composant souhaité
// renvoie vers la page de login si ce n'est pas le cas
const PrivateRoute = ({ children }) => {
    // const navigate = useNavigate();
    const [isTokenValid, setIsTokenValid] = useState(true);

    useEffect(()=>{
        getUser()
        .then(user => {
            if (!user) {
                setIsTokenValid(false)
            }
        })
        .catch(() => {
            setIsTokenValid(false)
        })
    }, [])

    if (isTokenValid) {
        return children;
    }
}
export default PrivateRoute;