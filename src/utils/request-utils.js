import axios from "axios"
import { useContext, useEffect, useState } from "react";
import {AppContext} from "../context/app-context";

export const useAxios = () => {
    const [data, setData] = useState(null);
    const [request, setRequest] = useState(null);
    const [processing, setProcessing] = useState(false);

    const appContext = useContext(AppContext)

    // useEffect(() => {
    //     console.log(appContext.contextState.isUserAuthenticated)
    // }, [appContext.contextState.isUserAuthenticated])

    const handleFailure = (err, isUserAuthDecided) => {
        if(err.response && err.response.status === 401){
            if (isUserAuthDecided && appContext.contextState.isUserAuthenticated)
                appContext.toggleAuthentication();
            else if (!appContext.contextState.isUserAuthenticated)
                appContext.setAlert({show: true, message: err.response.data.message, severity: 'error' })
        }
        else if (err.response)
            appContext.setAlert({show: true, message: err.response.data.message, severity: 'error' })
    }

    const handlePostRequest = () => {
        setProcessing(false);
        setRequest(null);
    }

    useEffect(() => {
        const isUserAuthDecided = appContext.contextState.isUserAuthenticated != null

        const fetchData = async () => {

            if (isUserAuthDecided){

                try{
                    // if (target) target.classList.add('btn-loading')
                    // console.log(target.classList);
                    const resp = await axios(request);
                    setData(resp)
                }
                catch(err){
                    console.log('Error occurred');

                    handlePostRequest();
                    handleFailure(err, isUserAuthDecided);   
                }
            }
        };

        if (request != null){
            fetchData();
        }
            // setTimeout(fetchData, 10000)
    }, [request, appContext])

    useEffect(() => {

        if (data && data.status){
            
            if (data.data.message)
                    appContext.setAlert({show: true, message: data.data.message, severity: data.status === 200 ? 'info':'error' })

            handlePostRequest()
        }

    }, [data])

    // useEffect(() => {
    //     console.log(data);
    //     console.log(request);
    //     console.log(processing);
    //     console.log(resp);
    // },[data, request, processing, resp])

    const processUrl = (req) => {
        setRequest(req)
        setProcessing(true);
    }

    const getData = () => {
        if (!data)
            return data

        const dataCopy = {...data}
        setData(null)
        console.log(data);
        return dataCopy;
    }

    return {getData, processing, processUrl}
}

export const useResponse = (resp) => {
    
    const [response] = useState(resp)
    const [responseStatus, setResponseStatus] = useState(null);
    const [responseData, setResponseData] = useState(null)

    console.log(response);
    useEffect(() => {
        console.log('chill');
        if (response){
            setResponseData(response.data)
            setResponseStatus(response.status)
        }
        console.log(responseStatus);
        console.log(responseData);
    }, [response])

    return {responseStatus, responseData}

}