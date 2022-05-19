import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import React, { Suspense } from 'react';
import Loader from '../components/common/loader';
import AppHome from '../components/app-home';

const LoginContainer = React.lazy(() => import('../components/login/login-main-container'))
// const AppHome = React.lazy(() => import('../components/app-home'))
const PersonalInfo = React.lazy(() => import('../components/main/personal-info/personal-info'))
const MyApps = React.lazy(() => import('../components/main/myapp'))
const SessionInfo = React.lazy(() => import('../components/main/sessions'))

const MainRouter = function(){
   return (
           <BrowserRouter>
                <Routes>
                    <Route path='login' element={<Suspense fallback={<Loader/>}><LoginContainer/> </Suspense> } />
                        
                    <Route path='/' element={<Navigate to='/myinfo' />} />
                    <Route element={<AppHome/>}>
                        <Route path='myinfo' element={<Suspense fallback={<Loader/>}><PersonalInfo/> </Suspense>}/>
                        <Route path='myapps' element={<Suspense fallback={<Loader/>}><MyApps/> </Suspense>}/>
                        <Route path='sessions' element={<Suspense fallback={<Loader/>}><SessionInfo/> </Suspense>}/>
                    </Route>
                </Routes>
            </BrowserRouter>
   )
}

export default MainRouter