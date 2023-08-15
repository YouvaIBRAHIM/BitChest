import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getRandomCollaboraterFromApi } from "../services/Api.service";
import { disconnect } from "../services/Disconnect.service";

// middleware qui vérifie si le token que l'utilisateur est valide ou non
// si le token est valide le middleware retourne le composant souhaité
// renvoie vers la page de login si ce n'est pas le cas
export default function PrivateRoute({ children, setIsConnected }) {
    const navigate = useNavigate();
    const [isTokenValid, setIsTokenValid] = useState(true);

    useEffect(()=>{
        const response = getRandomCollaboraterFromApi();
        response.then((res) => {
            if (res.status == 200) {
                setIsConnected(true);
                setIsTokenValid(true)
            }else{
                setIsConnected(false);
                disconnect(navigate);
            }
        })
        .catch(err => {
            setIsConnected(false);
            disconnect(navigate);
        }) 
    }, [])

    if (isTokenValid) {
        return children;
    }
}