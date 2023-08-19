import { deleteUser, deleteUsers, getAuthUser, getUser, getUsers, updateUser, updateUserPassword } from "./Api.service";
import { useEffect, useRef, useState } from "react";

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


export const useUsers = async (setUsers, setStatus, search, page = 1, perPage = 10, role = "client") => {

  const fetchData = async () => {
      setStatus(oldValue => {return {...oldValue, isLoading: true}});
      try {
          const response = await getUsers(page, perPage, role, search);
          setUsers(response);
      } catch (err) {
          setStatus(oldValue => {return {
              ...oldValue, 
              snackBar: true,
              type: "error", 
              message: err?.response?.data ? err?.response?.data?.message : err
          }});
      } finally {
          setStatus(oldValue => {return {...oldValue, isLoading: false}});
      }
  }

  await fetchData();
}

export const useGetUser = async (setUser, setStatus, id) => {
  const userFetchFunction = id ? getUser : getAuthUser
  const fetchData = async () => {
      setStatus(oldValue => {return {...oldValue, isLoading: true}});
      try {
          const response = await userFetchFunction(id);
          setUser(response);
      } catch (err) {
          setStatus(oldValue => {return {
              ...oldValue, 
              snackBar: true,
              type: "error", 
              message: err?.response?.data ? err?.response?.data?.message : err
          }});
      } finally {
          setStatus(oldValue => {return {...oldValue, isLoading: false}});
      }
  }

  await fetchData();
}

export const useUpdateUser = async (setUser, setStatus, id, userData) => {
  const fetchData = async () => {
      setStatus(oldValue => {return {...oldValue, isLoading: true}});
      try {
          const response = await updateUser(id, userData);
          setUser(response);
          setStatus(oldValue => {return {
            ...oldValue, 
            snackBar: true,
            type: "success", 
            message: "Les données ont été mises à jour."
        }});
      } catch (err) {
          setStatus(oldValue => {return {
              ...oldValue, 
              snackBar: true,
              type: "error", 
              message: err?.response?.data ? err?.response?.data?.message : err
          }});
      } finally {
          setStatus(oldValue => {return {...oldValue, isLoading: false}});
      }
  }

  await fetchData();
}

export const useUpdateUserPassword = async (setStatus, id, userData) => {
  const fetchData = async () => {
      setStatus(oldValue => {return {...oldValue, isLoading: true}});
      try {
        await updateUserPassword(id, userData);

        setStatus(oldValue => {return {
            ...oldValue, 
            snackBar: true,
            type: "success", 
            message: "Le mot de passe a été mis à jour."
        }});
      } catch (err) {
          setStatus(oldValue => {return {
              ...oldValue, 
              snackBar: true,
              type: "error", 
              message: err?.response?.data ? err?.response?.data?.message : err
          }});
      } finally {
          setStatus(oldValue => {return {...oldValue, isLoading: false}});
      }
  }

  await fetchData();
}

export const useDeleteUsers = async (setUser, setStatus, users) => {
    const userFetchFunction = users.length > 1 ? () => deleteUsers(users) : () => deleteUser(users[0])
    const fetchData = async () => {
        setStatus(oldValue => {return {...oldValue, isLoading: true}});
        try {
            const response = await userFetchFunction();
            if (response.data) {
                setUser((oldValue) => { return {
                    ...oldValue, 
                    total: oldValue.total - users.length,
                    data: oldValue.data?.filter(user => users.length > 1 ? !response.data?.includes(user.id) : user.id !== response.data?.id)
                }});
                setStatus(oldValue => {return {
                    ...oldValue, 
                    snackBar: true,
                    type: "success", 
                    message: users.length > 1 ? "Les utilisateurs ont été supprimés." :"L'utilisateur a été supprimé."
                }});
            }

        } catch (err) {
            setStatus(oldValue => {return {
                ...oldValue, 
                snackBar: true,
                type: "error", 
                message: err?.response?.data ? err?.response?.data?.message : err
            }});
        } finally {
            setStatus(oldValue => {return {...oldValue, isLoading: false}});
        }
    }
  
    await fetchData();
  }
  