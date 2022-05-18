import { useContext, useEffect } from "react";
import { AppContext } from "../../context/app-context";
import '../../styles/notifications.css'

const NotificationAlerts = () => {

    const appContext = useContext(AppContext);
    const alert = appContext.contextState.alert;

    useEffect(() => {

        if (alert.show)
        setTimeout(() => appContext.setAlert({show: false, message: '', severity: 'info'}), 5000);

    }, [appContext])


    return (
            <div className={'notification-alert ' + alert.severity} hidden={!alert.show}>
                    {alert.message}
            </div>
        )
}

export default NotificationAlerts;