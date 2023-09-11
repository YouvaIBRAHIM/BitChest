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

// ouvre une session laravel et stocke le token "XSRF-TOKEN"
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

// déconnexion
export const onLogout = async () => {
  try {
    const response = await instance.post("/logout");    
    return response;
  } catch (error) {
    return Promise.reject(error.response?.data?.message ?? error.message);
  }
}

// récupérer les informations de l'utilisateur connecté
export const getAuthUser = async () => {
  await getToken();

  try {
    const response = await instance.get(`/api/auth-user/`);
    return response.data;
  } catch (error) {
    return null;
  }
}

// récupérer les utilisateurs enregistrés dans la base de données
export const getUsers = async (page, perPage, role, search, userStatus = "enabled") => {
  try {
    const response = await instance.get(`/api/users?page=${page}&perPage=${perPage}&role=${role}&searchFilter=${search.filter}&searchText=${search.text}&userStatus=${userStatus}`);
    return response.data;
  } catch (error) {
    return Promise.reject(error.response?.data?.message ?? error.message);
  }
}

// Récupère les information d'un utilisateur selon son id
export const getUser = async (id) => {

  try {
    const response = await instance.get(`/api/users/${id}`);
    return response.data;
  } catch (error) {
    return Promise.reject(error.response?.data?.message ?? error.message);
  }
}


/**
 * ajoute un utilisateur
 * @param {Object} data informations du nouveau utilisateur
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
 * modifie un utilisateur
 * @param {Object} data informations de l'utilisateur à modifier
 * @param {Number} id id de l'utilisateur à modifier
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

// met à jour le mot de passe
export async function updateUserPassword(user) {
  
  try {
    const response = await instance.put(`/api/users/password/${user.id}`, user.data)
    return response.data;
  } catch (error) {
    return Promise.reject(error.response?.data?.message ?? error.message);
  }
}


/**
 * supprime un utilisateur
 * @param {Number} id id du utilisateur à supprimer
 * @returns la réponse de la requete API axios 
 */
export async function deleteUser(id, userStatus) {
  try {
    const response = await instance.delete(`/api/users/${id}?userStatus=${userStatus}`)

    return response;
  } catch (error) {
    return Promise.reject(error.response?.data?.message ?? error.message);
  }
}

/**
 * supprime plusieurs utilisateurs
 * @param {Array} users tableau d'id d'utilisateurs à supprimer
 * @param {Array} userStatus spécifie si on souhaite supprimer définitivement des utilisateurs déjà supprimé en "soft delete"
 * @returns la réponse de la requete API axios 
 */
export async function deleteUsers(users, userStatus) {
  try {
    const response = await instance.post(`/api/users/delete/multiple?userStatus=${userStatus}`, {users})
    return response;
  } catch (error) {
    return Promise.reject(error.response?.data?.message ?? error.message);
  }
}

/**
 * restaure plusieurs utilisateurs
 * @param {Array} users tableau d'id d'utilisateurs à restaurer
 * @returns la réponse de la requete API axios 
 */
export async function restoreUsers(users) {
  try {
    const response = await instance.post(`/api/users/restore`, {users})
    return response;
  } catch (error) {
    return Promise.reject(error.response?.data?.message ?? error.message);
  }
}

// wallets

// récupère le portefeuille d'un utilisateur selon l'id
export const getUserWallet = async (id) => {
  
  try {
    const response = await instance.get(`/api/auth-user/wallet${id ? "?id=" + id : ""}`);
    return response.data;
  } catch (error) {
    return Promise.reject(error.response?.data?.message ?? error.message);
  }
}

// récupère les cryptomonnaies et le solde en euro de l'utilisateur connecté pour effectuer un achat
export const getAuthUserPurchaseResources = async () => {
  try {
    const response = await instance.get(`/api/auth-user/resources/purchase`);
    return response.data;
  } catch (error) {
    return Promise.reject(error.response?.data?.message ?? error.message);
  }
}

// récupère les cryptomonnaies que l'utilisateur peut vendre
export const getAuthUserSaleResources = async () => {
  try {
    const response = await instance.get(`/api/auth-user/resources/sale`);
    return response.data;
  } catch (error) {
    return Promise.reject(error.response?.data?.message ?? error.message);
  }
}

// Récupère le solde de l'utilisateur connecté
export const getAuthUserBalance = async () => {
  try {
    const response = await instance.get(`/api/auth-user/balance`);
    return response.data;
  } catch (error) {
    return Promise.reject(error.response?.data?.message ?? error.message);
  }
}

// Transactions

// Ajoute de l'argent dans le solde en euros
export const addBalance = async (amount) => {
  try {
    const response = await instance.post(`/api/auth-user/add/balance`, {amount});
    return response.data;
  } catch (error) {
    return Promise.reject(error.response?.data?.message ?? error.message);
  }
}

//Transfère le solde en euros vers un compte bancaire
export const transferBalance = async (amount) => {
  try {
    const response = await instance.post(`/api/auth-user/transfer/balance`, {amount});
    return response.data;
  } catch (error) {
    return Promise.reject(error.response?.data?.message ?? error.message);
  }
}

// effectue l'achat d'une cryptomonnaie
export const buyCrypto = async (data) => {
  try {
    const response = await instance.post(`/api/transaction/buy`, data);
    return response.data;
  } catch (error) {
    return Promise.reject(error.response?.data?.message ?? error.message);
  }
}

// effectue la vente d'une cryptomonnaie
export const sellCrypto = async (data) => {
  try {
    const response = await instance.post(`/api/transaction/sell`, data);
    return response.data;
  } catch (error) {
    return Promise.reject(error.response?.data?.message ?? error.message);
  }
}

// Récupère l'historique des transactions
export const getTransactionsHistory = async (filter, offset = 0, id) => {
  try {
    const response = await instance.get(`/api/transaction/history?filter=${filter}&offset=${offset}${id ? "&id=" + id : ""}`);
    return response.data;
  } catch (error) {
    return Promise.reject(error.response?.data?.message ?? error.message);
  }
}

// Récupère la configuration relative aux transactions
export const getTransactionConfig = async () => {
  try {
    const response = await instance.get(`/api/config/transaction`);
    return response.data;
  } catch (error) {
    return Promise.reject(error.response?.data?.message ?? error.message);
  }
}

// Met à jour la configuration relative aux transactions
export const updateServiceFees = async (amount) => {
  try {
    const response = await instance.put(`/api/config/transaction`, {amount});
    return response.data;
  } catch (error) {
    return Promise.reject(error.response?.data?.message ?? error.message);
  }
}


// Cryptos

// Récupère les crypto monnaies disponibles dans la base de données
export const getCryptos = async (search = "", filter = "trends", offset = 0) => {
  try {
    const response = await instance.get(`/api/cryptos?search=${search}&filter=${filter}&offset=${offset}`);
    return response.data;
  } catch (error) {
    return Promise.reject(error.response?.data?.message ?? error.message);
  }
}

// Ajoute un "vu" sur la crypto monnaie sur laquelle on a cliqué
export const newCryptoView = async (cryptoId) => {
  try {
    const response = await instance.post(`/api/crypto/newView`, {id: cryptoId});
    return response.data;
  } catch (error) {
    return Promise.reject(error.response?.data?.message ?? error.message);
  }
}

