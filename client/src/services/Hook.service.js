import { getUsers } from "./Api.service";

export const useUsers = async (setUsers, setStatus, page = 1, perPage = 10, role = "client") => {

    const fetchData = async () => {
        setStatus(oldValue => {return {...oldValue, isLoading: true}});
        try {
            const response = await getUsers(page, perPage, role);
            setUsers(response);
        } catch (err) {
            setStatus(oldValue => {return {...oldValue, error: err?.response?.data ? err?.response?.data?.message : err.message}});
        } finally {
            setStatus(oldValue => {return {...oldValue, isLoading: false}});
        }
    }

    await fetchData();
}