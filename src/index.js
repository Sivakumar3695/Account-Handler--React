import React from 'react';
import ReactDOM from 'react-dom';
import './styles/App.css';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import LoginContainer from './components/login-main-container';
import AppHome from './components/app-home';
import PersonalInfo from './components/personal-info'
import MyApps from './components/myapp'
import SessionInfo from './components/sessions'

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<AppHome/>}>
          <Route path='myinfo' element={<PersonalInfo/>}/>
          <Route path='myapps' element={<MyApps/>}/>
          <Route path='sessions' element={<SessionInfo/>}/>
        </Route>
        <Route path='/' element={<Navigate to='/myinfo' />} />
        <Route path='/login' element={<LoginContainer/>}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
