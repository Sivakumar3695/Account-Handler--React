import React, { Component, useEffect, useState } from 'react';
import axios from "axios"
export const AppContext = React.createContext();


const AppContextProvider = (props) => {
    const [isUserAuthenticated, setIsUserAuthenticated] = useState(null)

    const toggleUserAuthentication = () => {
        setIsUserAuthenticated(!isUserAuthenticated)
    }

    useEffect(() => {
        const callAuthCheckApi = async() => {
            try{
                await axios({
                    method: 'GET',
                    url:  'http://localhost:8080/',
                    withCredentials: true
                });
                setIsUserAuthenticated(true)
            }
            catch(err){
                if(err.response && err.response.status === 401){
                    console.log('Unauthenticated...');
                    setIsUserAuthenticated(false);
                }
            }
        }

        setTimeout(callAuthCheckApi, 500)
        // callAuthCheckApi();
    },[])

    return (
        <AppContext.Provider value={
            {contextState:{isUserAuthenticated: isUserAuthenticated}, toggleAuthentication: toggleUserAuthentication}
        }>
            {props.children}
        </AppContext.Provider>
    );
}
 
export default AppContextProvider;