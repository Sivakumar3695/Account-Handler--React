import React, { Component, useState } from 'react';
export const AppContext = React.createContext('cool');


const AppContextProvider = (props) => {
    const [isUserAuthenticated, setIsUserAuthenticated] = useState(true)

    const toggleUserAuthentication = () => {
        setIsUserAuthenticated(!isUserAuthenticated)
    }

    return (
        <AppContext.Provider value={
            {contextState:{isUserAuthenticated: isUserAuthenticated}, toggleAuthentication: toggleUserAuthentication}
        }>
            {props.children}
        </AppContext.Provider>
    );
}
 
export default AppContextProvider;