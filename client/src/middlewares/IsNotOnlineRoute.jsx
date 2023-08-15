import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRandomCollaboraterFromApi } from "../services/Api.service";
import { getFromSessionStorage } from '../services/Storage.service';

// middleware qui interdit d'acceder à la page de login si on est déjà connecté
export default function IsNotOnlineRoute({children}) {
    const navigate = useNavigate();
    let [isNotConnected, setIsNotConnected] = useState(false);
    const token = getFromSessionStorage('token');

    useEffect(()=>{
        if (token) {
            const response = getRandomCollaboraterFromApi();
            response.then((res) => {
                if (res.status == 200) {
                    navigate("/home");
                }else{
                    setIsNotConnected(true);
                }
            })
            .catch(err => {
                setIsNotConnected(true);
            }) 
        }else{
            setIsNotConnected(true);
        }
    }, [])
    if (isNotConnected) {
        return children;
    }
}