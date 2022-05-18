import React, { useEffect, useState } from 'react';
import axios from "axios"

export const AppContext = React.createContext();


const AppContextProvider = (props) => {
    const [isUserAuthenticated, setIsUserAuthenticated] = useState(null)
    const [alert, setAlert] = useState({show: false, message: '', severity: 'info'});

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
            {contextState:{isUserAuthenticated: isUserAuthenticated, alert: alert}, 
            toggleAuthentication: toggleUserAuthentication,
            setAlert: setAlert}
        }>
            {props.children}
        </AppContext.Provider>
    );
}
 
export default AppContextProvider;