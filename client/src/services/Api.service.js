import axios from "axios";
import { getFromSessionStorage } from "./Storage.service";

axios.defaults.withCredentials = true;
const baseURL = import.meta.env.VITE_API_URL;

// initialisation d'une instance axios
const instance = axios.create({
  baseURL: baseURL,
  headers: {
    Accept: 'Content-Type',
    "Content-Type": "application/json",
    withCredentials: true
  },
});

// instance.interceptors.request.use((config) => {
//   const token = getFromSessionStorage('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export const getToken = async () => {
  await axios.get(baseURL + "/sanctum/csrf-cookie");
}

/**
 * permet de s'authentifier via une requete API de type POST 
 * @param {Object} credentials contient les clés "email" et "password" nécessaires pour s'authentifier
 * @returns Si les identifiants sont correctes, la fonction retourne les informations de l'utilisateur et un token valide, sinon elle retourne une erreur
 */
export const onLogin = async (credentials) => {
  await getToken();

  try {
    const response = await instance.post('/login', credentials);
    return response;
  } catch (error) {
    return Promise.reject(error.response?.data?.message ?? error.message);
  }
}


export const getUser = async () => {
  await getToken();

  try {
    const response = await instance.get("/api/user");
    return response.data;
  } catch (error) {
      console.log("🚀 ~ file: Api.service.js:54 ~ getUser ~ error:", error)
      return false;
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
