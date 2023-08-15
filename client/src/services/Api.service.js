import axios from "axios";
import { getFromSessionStorage } from "./Storage.service";

const baseURL = import.meta.env.VITE_SERVER_URL;
// initialisation d'une instance axios
const instance = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use((config) => {
  const token = getFromSessionStorage('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * permet de s'authentifier via une requete API de type POST 
 * @param {Object} identifiers contient les clés "email" et "password" nécessaires pour s'authentifier
 * @returns Si les identifiants sont correctes, la fonction retourne les informations de l'utilisateur et un token valide, sinon elle retourne une erreur
 */
export async function onLogin(identifiers) {
  const loginApi = import.meta.env.VITE_LOGIN_API;  
  
  try {
    const response = await instance.post(loginApi, identifiers)

    return response;
  } catch (error) {
    return error.response;
  }
}

/**
 * récupère un collaborateur au hasard via une requete API
 * @returns la réponse de la requete API axios 
 */
export async function getRandomCollaboraterFromApi() {
  const randomCollaboraterApi = import.meta.env.VITE_RANDOM_COLLABORATER_API;  
  
  try {
    const response = await instance.get(randomCollaboraterApi)
    return response;
  } catch (error) {
    return error.response;
  }
}

/**
 * récupère la liste de tous les collaborateurs via une requete API
 * @returns un tableau d'objets de tous les collaborateurs 
 */
 export async function getCollaboratersListFromApi() {
  const collaboraterListApi = import.meta.env.VITE_COLLABORATERS_LIST_API;  
  
  try {
    const response = await instance.get(collaboraterListApi)

    return response;
  } catch (error) {
    return error.response;
  }
}

/**
 * ajoute un collaborateur via une requete API
 * @param {Object} data informations du nouveau collaborateur
 * @returns la réponse de la requete API axios 
 */
export async function addeUser(data) {
  const handleUserApi = import.meta.env.VITE_HANDLE_USER_API;  
  
  try {
    const response = await instance.post(handleUserApi, data);

    return response;
  } catch (error) {

    return error.message;
  }
}

/**
 * modifie un collaborateur via une requete API
 * @param {Object} data informations du collaborateur à modifier
 * @param {Number} id id du collaborateur à modifier
 * @returns la réponse de la requete API axios 
 */
export async function updateUser(data, id) {
  const handleUserApi = import.meta.env.VITE_HANDLE_USER_API;  
  
  try {
    const response = await instance.put(`${handleUserApi}/${id}`, data)

    return response;
  } catch (error) {
    return error.message;
  }
}

/**
 * supprime un collaborateur via une requete API
 * @param {Number} id id du collaborateur à supprimer
 * @returns la réponse de la requete API axios 
 */
export async function deleteUser(id) {
  const handleUserApi = import.meta.env.VITE_HANDLE_USER_API;  
  
  try {
    const response = await instance.delete(`${handleUserApi}/${id}`)

    return response;
  } catch (error) {

    return error.response.data.error;
  }
}
