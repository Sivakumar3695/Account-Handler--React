import React, { Component } from 'react';
import { Link, Outlet} from 'react-router-dom';
import '../styles/app-home.css'

const PERSONAL_INF_ELEMENT = 'personal-info'
const MY_APP_ELEMENT = 'myapps'
const SESSION_ELEMENT = 'active-sessions'

const ELEMENT_INFO = [
    {
        name: PERSONAL_INF_ELEMENT,
        path: '/myinfo',
        text: 'Persornal Information'
    },
    {
        name: MY_APP_ELEMENT,
        path: '/myapps',
        text: 'My Apps'
    },
    {
        name: SESSION_ELEMENT,
        path: '/sessions',
        text: 'Active Sessions'
    }
]


class AppHome extends Component {

    state = {
        activeElement:PERSONAL_INF_ELEMENT ,
    }

    getClasses(element){
        if (element === this.state.activeElement)
            return "nav-link nav-link-active"
        
        return "nav-link"
    }

    handleElementOnClick(elementName){
        this.setState((prevState) => {
            return ({...prevState, activeElement:elementName})
        })
    }

    renderNavLinks(element){
        return (
            <li className={this.getClasses(element.name)} key={element.name}>
                <Link to={element.path} onClick={this.handleElementOnClick.bind(this, element.name)}>{element.text}</Link>
            </li>
        )
    }

    test(){
        var navLinkDom = ELEMENT_INFO.map(element => {
            return this.renderNavLinks(element)
        })
        return navLinkDom;
    }

    navBar(){
        return (
            <div className='top-navbar'>
                <div className='nav-links'>
                    {this.test()}
                </div>
            </div>
        )
    }

    mainAppContentHolder(){
        return (
            <div className='main-app-content-holder'>
                <Outlet/>
            </div>
        )
    }

    render() { 
        return (
            
            <React.Fragment>
                {this.navBar()}
                {this.mainAppContentHolder()}
            </React.Fragment>
        );
    }
}
 
export default AppHome;