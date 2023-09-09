import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthUser } from "../services/Api.service";

// middleware qui vérifie si le token que l'utilisateur est valide ou non
// si le token est valide le middleware retourne la page souhaitée
// sinon renvoie vers la page de login
const PrivateRoute = ({ children }) => {
    const navigate = useNavigate();
    const [isTokenValid, setIsTokenValid] = useState(false);

    useEffect(()=>{
        getAuthUser()
        .then(user => {
            if (!user) {
                navigate("/login");
            }else{
                setIsTokenValid(true)
            }
        })
        .catch(() => {
            navigate("/login");
        })
    }, [])

    if (isTokenValid) {
        return children;
    }
}
export default PrivateRoute;