import { useState, useEffect } from "react";
import axios from 'axios'
const useAxios = (url)=>{
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    useEffect(()=>{
        axios.get(url)
        .then(res=>{
            setData(res.data);
            setLoading(false);
        })
        .catch(error=>{
            setError(error);
            setLoading(false);
        });

    },[url]);
    return {data, loading, error}
}
export default useAxios;