import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../services/Api.service";

// middleware redirige de la racine vers la view Login ou Home selon si on est connecté ou non
const IndexPage = () => {
    const navigate = useNavigate();

    useEffect(()=>{
        getUser()
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