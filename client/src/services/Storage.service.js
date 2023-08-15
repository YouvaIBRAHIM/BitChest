/**
 * 
 * @param {String} key 
 * @returns recupère du SessionStorage la clé saisi
 */
export function getFromSessionStorage(key) {
    const data = JSON.parse(JSON.parse(sessionStorage.getItem(key)));
    return data;
}


/**
 * 
 * @param {String} key clé de stockage
 * @param {String} data valeur à stocker dans le SessionStorage
 */
export function setToSessionStorage(key, data) {
    sessionStorage.setItem(key, JSON.stringify(data));
}

/**
 * 
 * @param {String} key 
 * @returns supprime du SessionStorage la clé saisi
 */
 export function removeFromSessionStorage(key) {
    sessionStorage.removeItem(key);
}


/**
 * 
 * @param {String} key 
 * @returns recupère du localStorage la clé saisi
 */
 export function getFromLocalStorage(key) {
    const data = JSON.parse(JSON.parse(localStorage.getItem(key)));
    return data;
}


/**
 * 
 * @param {String} key clé de stockage
 * @param {String} data valeur à stocker dans le localStorage
 */
export function setToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}