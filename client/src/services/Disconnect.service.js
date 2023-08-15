
/**
 * déconnecte l'utilisateur et redirige vers la page de login
 * @param {Function} navigate hook permettant de changer le route
 */
export function disconnect(navigate) {
    navigate('/login');
}