import axios from "axios";

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


export const onLogout = async () => {
  try {
    const response = await instance.post("/logout");    
    return response;
  } catch (error) {
    return Promise.reject(error.response?.data?.message ?? error.message);
  }
}



export const getAuthUser = async () => {
  await getToken();

  try {
    const response = await instance.get(`/api/auth-user/`);
    return response.data;
  } catch (error) {
    return null;
  }
}


export const getUsers = async (page, perPage, role, search) => {
  try {
    const response = await instance.get(`/api/users?page=${page}&perPage=${perPage}&role=${role}&searchFilter=${search.filter}&searchText=${search.text}`);
    return response.data;
  } catch (error) {
    return Promise.reject(error.response?.data?.message ?? error.message);
  }
}

export const getUser = async (id) => {

  try {
    const response = await instance.get(`/api/users/${id}`);
    return response.data;
  } catch (error) {
    return Promise.reject(error.response?.data?.message ?? error.message);
  }
}


/**
 * ajoute un collaborateur via une requete API
 * @param {Object} data informations du nouveau collaborateur
 * @returns la réponse de la requete API axios 
 */
export async function addUser(data) {
  
  try {
    const response = await instance.post("/api/users/", data);
    return response;
  } catch (error) {
    return Promise.reject(error.response?.data?.message ?? error.message);
  }
}

/**
 * modifie un collaborateur via une requete API
 * @param {Object} data informations du collaborateur à modifier
 * @param {Number} id id du collaborateur à modifier
 * @returns la réponse de la requete API axios 
 */
export async function updateUser(user) {
  
  try {
    const response = await instance.put(`/api/users/${user.id}`, user)
    return response.data;
  } catch (error) {
    return Promise.reject(error.response?.data?.message ?? error.message);
  }
}

export async function updateUserPassword(user) {
  
  try {
    const response = await instance.put(`/api/users/password/${user.id}`, user.data)
    return response.data;
  } catch (error) {
    return Promise.reject(error.response?.data?.message ?? error.message);
  }
}


/**
 * supprime un utilisateur via une requete API
 * @param {Number} id id du utilisateur à supprimer
 * @returns la réponse de la requete API axios 
 */
export async function deleteUser(id) {
  try {
    const response = await instance.delete(`/api/users/${id}`)

    return response;
  } catch (error) {
    return Promise.reject(error.response?.data?.message ?? error.message);
  }
}

export async function deleteUsers(users) {
  try {
    const response = await instance.post(`/api/users/delete/multiple`, {users})
    return response;
  } catch (error) {
    return Promise.reject(error.response?.data?.message ?? error.message);
  }
}


// wallets

export const getUserWallet = async (id) => {
  
  try {
    const response = await instance.get(`/api/auth-user/wallet${id ? "?id=" + id : ""}`);
    return response.data;
  } catch (error) {
    return Promise.reject(error.response?.data?.message ?? error.message);
  }
}

export const getAuthUserPurchaseResources = async () => {
  try {
    const response = await instance.get(`/api/auth-user/resources/purchase`);
    return response.data;
  } catch (error) {
    return Promise.reject(error.response?.data?.message ?? error.message);
  }
}

export const getAuthUserSaleResources = async () => {
  try {
    const response = await instance.get(`/api/auth-user/resources/sale`);
    return response.data;
  } catch (error) {
    return Promise.reject(error.response?.data?.message ?? error.message);
  }
}



export const getAuthUserBalance = async () => {
  try {
    const response = await instance.get(`/api/auth-user/balance`);
    return response.data;
  } catch (error) {
    return Promise.reject(error.response?.data?.message ?? error.message);
  }
}

// Transaction
export const addBalance = async (amount) => {
  try {
    const response = await instance.post(`/api/auth-user/add/balance`, {amount});
    return response.data;
  } catch (error) {
    return Promise.reject(error.response?.data?.message ?? error.message);
  }
}

export const transferBalance = async (amount) => {
  try {
    const response = await instance.post(`/api/auth-user/transfer/balance`, {amount});
    return response.data;
  } catch (error) {
    return Promise.reject(error.response?.data?.message ?? error.message);
  }
}
export const buyCrypto = async (data) => {
  try {
    const response = await instance.post(`/api/transaction/buy`, data);
    return response.data;
  } catch (error) {
    return Promise.reject(error.response?.data?.message ?? error.message);
  }
}

export const sellCrypto = async (data) => {
  try {
    const response = await instance.post(`/api/transaction/sell`, data);
    return response.data;
  } catch (error) {
    return Promise.reject(error.response?.data?.message ?? error.message);
  }
}

export const getTransactionsHistory = async (filter, offset = 0, id) => {
  try {
    const response = await instance.get(`/api/transaction/history?filter=${filter}&offset=${offset}${id ? "&id=" + id : ""}`);
    return response.data;
  } catch (error) {
    return Promise.reject(error.response?.data?.message ?? error.message);
  }
}



// Cryptos

export const getCryptos = async (search = "", filter = "trends", offset = 0) => {
  try {
    const response = await instance.get(`/api/cryptos?search=${search}&filter=${filter}&offset=${offset}`);
    return response.data;
  } catch (error) {
    return Promise.reject(error.response?.data?.message ?? error.message);
  }
}


export const newCryptoView = async (cryptoId) => {
  try {
    const response = await instance.post(`/api/crypto/newView`, {id: cryptoId});
    return response.data;
  } catch (error) {
    return Promise.reject(error.response?.data?.message ?? error.message);
  }
}

