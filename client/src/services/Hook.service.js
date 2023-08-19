import { getAuthUser, getUser, getUsers, updateUser } from "./Api.service";
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

export const useGetUser = async (id, setUser, setStatus) => {

  const fetchData = async () => {
      setStatus(oldValue => {return {...oldValue, isLoading: true}});
      try {
          const response = await getUser(id);
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