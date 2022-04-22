import LoginContainer from './login-main-container';
import '../styles/App.css'

import MainRouter from '../router/main-router';
import AppContextProvider from '../context/app-context';

function App() {
  return (
    <AppContextProvider>
      <MainRouter/>
    </AppContextProvider>
  );
}

export default App;
