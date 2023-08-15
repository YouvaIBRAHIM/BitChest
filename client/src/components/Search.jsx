import { useRef, useState } from "react";
import styles from "../styles/Search.module.css";
import {useSelector, useDispatch} from "react-redux";
import { filterCollaboratersToDisplay, displayTenFirstCollaboraters } from "../reducers/CollaboratersReducer";

/**
 * @param {Object} enableNextResult Permet de désactiver les prochains résultats une fois en bas de la page
 * @returns composant représentant la barre de recherche avec les filtres
 */
const Search = ({enableNextResult}) => {
    const { collaboraters } = useSelector(state => state.collaboraters)
    const searchValue = useRef('')
    const typeFilter = useRef('name')
    const serviceFilter = useRef('noFilter')
    const [isFoundResult, setIsFoundResult] = useState(true);
    const dispatch = useDispatch();

    // filtre la recherche par nom ou localisation
    const onHandleTypeFilter = (event) => {
        if (event.target.type === "radio") {
            typeFilter.current = event.target.id
            filter();
        }
    }

    // filtre la recherche selon le service
    const onHandleServiceFilter = (event) => {
        if (event.target.type === "radio") {
            serviceFilter.current = event.target.id
            filter();
        }
    }

    // séléctionne la chaine de caractère à vérifier lors de la recherche 
    const getTypeFieldToFilter = (collaborater) => {
        switch (typeFilter.current) {
            case 'name':
                return `${collaborater.firstname} ${collaborater.lastname}`.toLowerCase();
            case 'location':
                return `${collaborater.city} ${collaborater.country}`.toLowerCase();
            default:
                return `${collaborater.firstname} ${collaborater.lastname}`.toLowerCase();
        }
    }

    const onSearch = (event) => {
        searchValue.current = event.target.value;
        // si le contenu de la recherche est vide, on affiche les premiers 10 collaborateurs
        if (searchValue.current.trim() == "") {
            enableNextResult.current = true;
            setIsFoundResult(true);
            return dispatch(displayTenFirstCollaboraters())
        }
        filter();
    }

    const filter = () => {
        const filtredCollaboraters =  collaboraters.filter((collaborater) => {
            const fieldToFilter = getTypeFieldToFilter(collaborater);

            let isMatch = false;

            // recherche que dans un seul service
            if (serviceFilter.current !== "noFilter") {
                if (fieldToFilter.includes(searchValue.current.trim().toLowerCase()) && collaborater.service.toLowerCase() === serviceFilter.current) {
                    isMatch = true;
                }
            }else{
                // recherche dans tous les services
                isMatch = fieldToFilter.includes(searchValue.current.trim().toLowerCase());
            }
            return isMatch;
        });

        enableNextResult.current = false;
        // met à jour la liste des collaborateurs à afficher
        dispatch(filterCollaboratersToDisplay({collaboratersToDisplay: filtredCollaboraters}))

        // affiche un message quand aucun resultat n'est trouvé
        if (filtredCollaboraters.length == 0) {
            setIsFoundResult(false);
        }else{
            setIsFoundResult(true);
        }
    }

    return (
        <div className={styles.searchContainer}>
            <div className={styles.inputContainer}>
                <input onChange={onSearch} type="search" placeholder="Rechercher"/>
                {
                    !isFoundResult &&
                    <span>Aucun resultat trouvé</span>
                }
            </div>
            <div className={styles.filterContainer}>
                <div className={styles.typeFilter}>
                    <h5>Rechercher par</h5>
                    <div onChange={onHandleTypeFilter} className={styles.select} tabIndex="1">
                        <input className={styles.selectopt} name="typeFilter" type="radio" id="name" defaultChecked/>
                        <label htmlFor="name" className={styles.option}>Nom</label>

                        <input className={styles.selectopt} name="typeFilter" type="radio" id="location"/>
                        <label htmlFor="location" className={styles.option}>Localisation</label>
                    </div>
                </div>
                <div className={styles.serviceFilter}>
                    <h5>Catégorie</h5>
                    <div onChange={onHandleServiceFilter} className={styles.select} tabIndex="1">
                        <input className={styles.selectopt} name="serviceFilter" type="radio" id="noFilter" defaultChecked/>
                        <label htmlFor="noFilter" className={styles.option}>-- Aucune --</label>

                        <input className={styles.selectopt} name="serviceFilter" type="radio" id="client" />
                        <label htmlFor="client" className={styles.option}>Client</label>

                        <input className={styles.selectopt} name="serviceFilter" type="radio" id="technique"/>
                        <label htmlFor="technique" className={styles.option}>Technique</label>

                        <input className={styles.selectopt} name="serviceFilter" type="radio" id="marketing"/>
                        <label htmlFor="marketing" className={styles.option}>Marketing</label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Search;