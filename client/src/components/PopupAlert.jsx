import styles from "../styles/PopupAlert.module.css";


/**
 * @param {String} type type de l'alerte. Peut être de type "Info", "Attention" ou "Erreur"
 * @param {Function} onConfirm fonction à exécuter lors de la confirmation
 * @param {String} message Message à afficher sur l'alerte
 * @param {Boolean} typeValidate permet d'indiquer l'alerte nécéssite une confirmation
 * @param {Function} setDisplayPopupAlert Permet de fermer l'alerte
 */
const PopupAlert = ({type, onConfirm, message, typeValidate, setDisplayPopupAlert}) => {
    let typeStyle;

    // Change la couleur de la police selon le type de l'alerte
    if (type) {
        switch (type) {
            case "Info":
                typeStyle = styles.success;
                break;

            case "Attention":
                typeStyle = styles.warning;
                break;

            case "Erreur":
                typeStyle = styles.error;
                break;       
            default:
                typeStyle = styles.success;
                break;
        }
    }
    
    return (
        <>
            <div  className={styles.modal}>
              <div className={styles.customBox}>
                <h2 className={type && typeStyle}>{type && type}</h2>
                <h3>{message}</h3>
                {
                    typeValidate &&
                    <div className={styles.buttonsContainer}>
                        <button onClick={onConfirm && onConfirm}>Confirmer</button>
                        <button onClick={() => setDisplayPopupAlert(false)}>Annuler</button>
                    </div>
                }
                {
                    !typeValidate &&
                    <>
                        <button onClick={() => setDisplayPopupAlert(false)}>OK</button>
                    </>
                }
              </div>
          </div>
        </>
    );
};

export default PopupAlert;