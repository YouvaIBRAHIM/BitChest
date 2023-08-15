import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getRandomCollaboraterFromApi } from "../services/Api.service";
import { disconnect } from "../services/Disconnect.service";

// middleware redirige de la racine vers la view Login ou Home selon si on est connecté ou non
export default function IndexPageRoute({ setIsConnected }) {
    const navigate = useNavigate();

    useEffect(()=>{
        const response = getRandomCollaboraterFromApi();
        response.then((res) => {
            if (res.status == 200) {
                setIsConnected(true);
                navigate("/home");
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
}