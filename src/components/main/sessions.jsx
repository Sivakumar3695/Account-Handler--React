import React, { useEffect, useState } from 'react';
import { useAxios } from '../../hooks/request-hook';
import { Btn } from '../common/button';
import { useContext } from 'react';
import { AppContext } from '../../context/app-context';

import "../../styles/sessions.css"

const SessionInfo = () => {

    const [devices, setDevices] = useState([])
    const appContext = useContext(AppContext)
    const {getData, processing, processUrl} = useAxios();
    const [fetchDevices, setFetchDevices] = useState(true)

    useEffect(() => {
        if (fetchDevices){

            processUrl({
                method: 'GET',
                url:  process.env.REACT_APP_SERVER_URL_BASE + '/sessions',
                withCredentials: true
            })

            setFetchDevices(false);
        }
    }, [fetchDevices])

    useEffect(() => {
        const response = getData();
        if (response){
            
            if (response.status !== 200)
                return;

            const responseData = response.data;
            let code = responseData.code
            
            if (code === 'log_out')
                appContext.toggleAuthentication();
            else if (code === 'remote_logout')
                setFetchDevices(true);
            else if (code === 'session_info')
                setDevices(responseData.device_details_list)
        }
    }, [processing])

    const handleLogout = (device) => {
        console.log("handling logout....");
        if (device.this_device){
            processUrl({
                method: 'POST',
                url: process.env.REACT_APP_SERVER_URL_BASE + '/logout',
                withCredentials: true
            })   
        }
        else{
            processUrl({
                method: 'POST',
                url: process.env.REACT_APP_SERVER_URL_BASE + '/devices/' + device.device_id + '/logout',
                withCredentials: true
            })
        }
    };

    const showCurrentDevice = () => {
        return (
            <React.Fragment>
                <div className='green-light'></div>
                <span>current</span>
            </React.Fragment>
        )
    }

    const renderDeviceDetails = (device) => {
        return (
            <div className='device-details' key={device.device_id}>
                <div className='device-type-image'>
                    <img width="100%" height="100%" src={process.env.PUBLIC_URL + "/images/desktop.png"} alt='device-img'/>
                </div>
                <div className='device-info'>
                    {device.this_device && showCurrentDevice()}
                    <div className='info-holder'>
                        <label htmlFor='device-name'>Device</label>
                        <span id='device-name' className='info device-name'>{device.device}</span>
                    </div>
                    <div className='info-holder'>
                        <label htmlFor='ip-address'>IP</label>
                        <span id='ip-address' className='info ip-address'>{device.ip_address}</span>
                    </div>
                    <div className='info-holder'>
                        <label htmlFor='location'>Location</label>
                        <span id='location' className='info location'>{device.location}</span>
                    </div>
                    <div className='info-holder'>
                        <label htmlFor='last-active-time'>Lastly Active On</label>
                        <span id='last-active-time' className='info last-active-time'>{device.last_activity_time}</span>
                    </div>
                    <div className='info-holder'>
                        <label htmlFor='login-time'>Login Time</label>
                        <span id='login-time' className='info login-time'>{device.login_time}</span>
                    </div>

                    <Btn 
                        center={true} 
                        displayContent="Logout" 
                        properties="btn-primary border-curved"
                        onClick={() => handleLogout(device)}/>
                </div>
            </div>
        )
    }

    const renderDeviceList = () => {
        var deviceDetaislList = devices.map(device => {
            return renderDeviceDetails(device);
        })

        return (
            <div className='device-list'>
                {deviceDetaislList}
            </div>
        )
    }

    return renderDeviceList()
}

export default SessionInfo;