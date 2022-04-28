import axios from "axios"
import { useCallback, useContext, useEffect, useState } from "react";
import {AppContext} from "../context/app-context";

// function handleAuthError(err)
// {
//     console.log('Error occurred. Error details are as follows');
//     console.log(err);
//     if (err.response && err.response.status === 401){
//         console.log('Authentication error from server');
//         const {toggleAuthentication} = useContext(AppContext)
//         return toggleAuthentication();
//     }
// }

/*
Config param can include param and headers together

For example: 
config = {
    params: {},
    headers: {}
}
or with headers alone as follows,
config = {
    headers: {}
}
*/

export const useAxios = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [request, setRequest] = useState(null);
    const [processing, setProcessing] = useState(false);

    const appContext = useContext(AppContext)

    useEffect(() => {

        const fetchData = async () => {
            try{
                const data =  await axios(request);
                setData(data);
            }
            catch(err){
                setError(err)
                if(err.response && err.response.status === 401){
                    appContext.toggleAuthentication();
                }
            }
            finally{
                setProcessing(false);
            }
        };

        if (request != null)
            fetchData();
    }, [request, processing])

    const processUrl = (req) => {
        setRequest(req)
        setProcessing(true);
    }

    return {data, processing, processUrl}
}