import React, { Component } from 'react';
export const AppContext = React.createContext();


class AppContextProvider extends Component {
    state = { 
        isUserAuthenticated: true,
    } 

    toggleUserAuthentication = () => {
        var prevState = this.state;
        this.setState({...prevState, isUserAuthenticated: !prevState.isUserAuthenticated});
    }

    render() { 
        return (
            <AppContext.Provider value={
                {contextState:{...this.state}, toggleAuthentication: this.toggleUserAuthentication}
            }>
                {this.props.children}
            </AppContext.Provider>
        );
    }
}
 
export default AppContextProvider;