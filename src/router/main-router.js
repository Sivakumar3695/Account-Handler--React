import LoginContainer from '../components/login-main-container';
import AppHome from '../components/app-home';
import PersonalInfo from '../components/personal-info'
import MyApps from '../components/myapp'
import SessionInfo from '../components/sessions'

import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';

const MainRouter = function(){
   return (
    <BrowserRouter>
        <Routes>
            <Route path='login' element={<LoginContainer/>} />
                
            <Route path='/' element={<Navigate to='/myinfo' />} />
            <Route element={<AppHome/>}>
                <Route path='myinfo' element={<PersonalInfo/>}/>
                <Route path='myapps' element={<MyApps/>}/>
                <Route path='sessions' element={<SessionInfo/>}/>
            </Route>
        </Routes>
    </BrowserRouter>
   )
}

export default MainRouter