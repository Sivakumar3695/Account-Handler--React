import React from 'react';
import axios from 'axios';
import '../styles/login-container.css';
import {Navigate} from 'react-router-dom';
import { AppContext } from '../context/app-context';
import { Btn } from './common/button';
import { useState } from 'react';
import { useContext } from 'react';
import useInputHandler from '../utils/input-hook';
import { useRef } from 'react';
import GoogleSigninBtn from './google-login-handler';

// import '../styles/gsignin-btn.css'

const LOGIN_META = {
    mobileNumber: {
        label: 'Your Mobile number:',
        type: 'text',
        isMandatory: true,
        canEdit: true,
        allowedStrPattern:/[1-9][0-9]{9}/,
    },
    otp: {
        label: 'Enter the otp sent to your mobile number',
        type: 'text',
        isMandatory: true,
        canEdit: true,
        allowedStrPattern:/[0-9]{4}/,
    }
}

const LoginContainer = () => {

    const [otpSent, setOtpSent] = useState(false);

    const mobileNumberInput = useRef();
    const otpInput = useRef();
    
    const appContext = useContext(AppContext)

    const {errorInputs, editState, editSpecificElement} = useInputHandler({
        mobileNumber: '',
        otp: ''
    }, LOGIN_META);

    const renderSignInWithFb = () => {
        return(
            <div className='f-signin-btn'>
                <div className="fb-login-button" data-size="large" data-button-type="continue_with" data-layout="default" data-auto-logout-link="false" data-use-continue-as="false"></div>
            </div>
        )
    }

    const renderCustomSignin = () => {
        if (otpSent){
            return loadPostOtpElement();
        }
        else {
            return loadPreOtpElement();
        }
    }

    const handleSendOtp = (event) => {
        
        event.target.classList.add('btn-loading');

        axios.post('http://localhost:8080/sendOTP', null, {
            params:{
                phoneNumber: editState.mobileNumber
            }
        })
        .then((resp) => {
            event.target.classList.remove('btn-loading')
            setOtpSent(true)
            appContext.setAlert({show: true, message: resp.data.message, severity: 'info'})
        })
        .catch(
            (e) => {
                event.target.classList.remove('btn-loading')
                console.log("There is an error in processing /sendOTP API call");
                console.log(e);
                setOtpSent(false);
                appContext.setAlert({show: true, message: e.response.data.message, severity: 'error' })
            }    
            
        )
    }

    const handleVerifyOtp = (event) => {

        let formData = new FormData();
        formData.append('phoneNumber', editState.mobileNumber);
        formData.append('otp', editState.otp);
        event.target.classList.add('btn-loading')

        axios.post('http://localhost:8080/verifyOTP', formData,
        {
            withCredentials: true
        })
        .then(
            (response) => {
                
                event.target.classList.remove('btn-loading')
                if (response.status === 200){
                    appContext.setAlert({show: true, message: response.data.message, severity: 'info'})
                    appContext.toggleAuthentication();
                }
            }
        )
        .catch( (e) => {

            event.target.classList.remove('btn-loading')
            console.log("There is an error in processing /verifyOTP API call");
            console.log(e);  
            appContext.setAlert({show: true, message: e.response.data.message, severity: 'error' })  
        })
    }

    const loadPreOtpElement = () => {
        return (
            <div className='custom-signin'>
                <input 
                    ref={mobileNumberInput}
                    maxLength='10' placeholder='Your mobile number' type='text' className='login-input' value={editState['mobileNumber']} onChange={(event) => editSpecificElement('mobileNumber', event.target.value)}/>
                
                <Btn 
                    displayContent="Send OTP" 
                    properties="btn-primary-light full-width" 
                    onClick={handleSendOtp}
                    isDisabled={errorInputs.includes('mobileNumber')} />
            </div>
        )
    }

    const loadPostOtpElement = () => {

        return (
            <div className='custom-signin'>
                <label className='login-label'>
                    Enter the OTP sent to &nbsp;
                    <span className='phone-number-otp-screen'>
                        {editState.mobileNumber}
                    </span>
                    &nbsp;
                    <Btn 
                        displayContent="EDIT"
                        onClick={() => {setOtpSent(false); editSpecificElement('otp', '')}}
                        properties="btn-xx-small border-curved"
                    />

                </label>
                
                <br></br>

                <div className='otp-holder-outer'>
                    <div className='otp-holder-inner'>
                        <input 
                            ref={otpInput}
                            type='text' 
                            className='login-input otp-input' 
                            value={editState['otp']} 
                            placeholder="****"
                            onChange={(event) => {
                                editSpecificElement('otp', event.target.value)
                                if (event.target.value.length === 4){
                                    otpInput.current.blur();
                                    }
                                }
                            }
                            maxLength='4'
                        />    
                    </div>
                </div>                

                <Btn 
                    displayContent="Verify OTP" 
                    properties="btn-primary-light full-width" 
                    onClick={handleVerifyOtp}
                    isDisabled={errorInputs.includes('otp')} />
            </div>
        )
    }

    const loginRenderer = () => {
        const isUserAuthenticated = appContext.contextState.isUserAuthenticated;

        if (isUserAuthenticated)
            return <Navigate to="/myinfo" replace/>
        else{
            return(
                <React.Fragment>
                    <div className='login-container'>
                        <GoogleSigninBtn/>
                        {/* {renderSignInWithFb()} */}
                        <hr></hr>
                        {renderCustomSignin()}
                    </div>
                </React.Fragment>
            )
        }
    }

    return loginRenderer();

}
 
export default LoginContainer;