import axios from "axios"
import { useContext, useEffect, useState } from "react";
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
    const [error, setError] = useState(null)
    const appContext = useContext(AppContext)

    const fetchData = async (req) => {
        try{
            return await axios(req);
        }
        catch(err){
            setError(err)
            if(err.response && err.response.status === 401){
                appContext.toggleAuthentication();
            }
        }
    }

    // useEffect(() => {
    //     if (processApi && request){
    //         console.log('Cooolllsss.....');
    //         fetchData();
    //     }
    //     setRequest(null);
    // }, [processApi, request])

    const processUrl = async (requestDetails) => {
        return await fetchData(requestDetails);
    }

    return {processUrl};
}