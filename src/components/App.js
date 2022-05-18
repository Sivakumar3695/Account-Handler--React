import LoginContainer from './login-main-container';
import '../styles/App.css'

import MainRouter from '../router/main-router';
import AppContextProvider from '../context/app-context';
import NotificationAlerts from './common/notifications';

function App() {
  return (
    <AppContextProvider>
      <NotificationAlerts/>
      <MainRouter/>
    </AppContextProvider>
  );
}

export default App;
