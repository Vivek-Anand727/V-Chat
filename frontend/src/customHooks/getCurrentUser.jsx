import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { setUserData } from "../redux/userSlice"
import { serverUrl } from "../main"

const getCurrentUser = () => {
    const dispatch = useDispatch();
    const { userData } = useSelector((state) => state.user);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            if (userData) return;

            setLoading(true);
            setError(null);

            try {
                const result = await axios.get(`${serverUrl}/api/user/current`, {
                    withCredentials: true
                });
                dispatch(setUserData(result.data));
            } catch (error) {
                console.error("Current User Error:", error);
                
                if (error.response?.status === 401) {
                    setError('Not authenticated');
                } else if (error.response?.status === 500) {
                    setError('Server error - please try again later');
                } else {
                    setError('Failed to fetch user data');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userData]); 

    return { userData, loading, error };
};

export default getCurrentUser;