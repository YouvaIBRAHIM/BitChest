import { useEffect, useRef, useState } from "react";

// Evite d'effectuer une requete à chaque saisie dans le champ de recherche
// Une requete est effectuée dans un intervalle donné
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState("");
  const timerRef = useRef();

  useEffect(() => {
    timerRef.current = setTimeout(() => setDebouncedValue(value), delay);

    return () => {
      clearTimeout(timerRef.current);
    };
  }, [value, delay]);

  return debouncedValue;
};
