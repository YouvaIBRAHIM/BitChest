import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthUser } from "../services/Api.service";

// middleware redirige de la racine vers la page de Login ou d'accueil selon si on est connecté ou non
const IndexPage = () => {
    const navigate = useNavigate();

    useEffect(()=>{
        getAuthUser()
        .then(user => {
            if (!user) {
                navigate("/login");
            }else{
                navigate("/home");
            }
        })
        .catch(() => {
            navigate("/login");
        })
    }, [])

}

export default IndexPage;