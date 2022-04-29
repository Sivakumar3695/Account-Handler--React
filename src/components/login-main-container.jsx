import React, { Component, useEffect } from 'react';
import axios from 'axios';
import '../styles/login-container.css';
import {Navigate} from 'react-router-dom';
import { AppContext } from '../context/app-context';
import Loader from './loader';
// const navigate = useNavigate();


    //   function renderButton() {
    //   gapi.signin2.render('my-signin2', {
    //     'scope': 'profile email',
    //     'width': 240,
    //     'height': 50,
    //     'longtitle': true,
    //     'theme': 'dark',
    //     'onsuccess': onSuccess,
    //     'onfailure': onFailure
    //   });
    // }

class LoginContainer extends Component {

    state = {
        otpSent: false,
        mobile_number: '',
        otp:'',
    }
    

    renderSignInWithGoogle(){
        return (
            <div className='g-signin-btn'>
                <div className="g-signin2" data-width='230px' data-height='42px' data-theme='dark' data-longtitle="true"/>
            </div>
            
        )
    }

    renderSignInWithFb(){
        return(
            <div className='f-signin-btn'>
                <div className="fb-login-button" data-size="large" data-button-type="continue_with" data-layout="default" data-auto-logout-link="false" data-use-continue-as="false"></div>
            </div>
        )
    }


    renderButtons(){
        return (
            
        <div className='login-singup-button-holder'>

            <div className='btn btn-login active'>
                Login options
            </div>    
        </div>
        )
    }

    handleMobileNumberInput(event){
        this.setState((prevState) => {
            return {...prevState, mobile_number: event.target.value}
        })
    }

    handleOtpInput(event){
        this.setState((prevState) => {
            return {...prevState, otp: event.target.value}
        })
    }

    renderCustomSignin(){
        if (this.state.otpSent){
            return this.loadPostOtpElement();
        }
        else {
            return this.loadPreOtpElement();
        }
    }

    handleSendOtp(){
        axios.post('http://localhost:8080/sendOTP')
        .then(
            this.setState((prevState) => {
                return {...prevState, otpSent: true}
            })
        )
        .catch(
            () => {
                console.log("There is an error in processing /sendOTP API call");
                this.setState((prevState) => {
                    return {...prevState, otpSent: false}
                })
            }    
            
        )
    }

    handleVerifyOtp(){

        let formData = new FormData();
        formData.append('phoneNumber', this.state.mobile_number);
        formData.append('otp', this.state.otp);

        axios.post('http://localhost:8080/verifyOTP', formData,
        {
            withCredentials: true
        })
        .then(
            (response) => {
                console.log(response.headers['set-cookie']);
                if (response.status == 200){
                    console.log(this.context.contextState.isUserAuthenticated);
                    this.context.toggleAuthentication();
                }
            }
        )
        .catch(() => {
            console.log("There is an error in processing /verifyOTP API call");    
        }            
        )
    }

    loadPreOtpElement(){
        return (
            <div className='custom-signin'>
                <label className='login-label'>Your Mobile number:</label><br></br>
                <input className='login-input' value={this.state.mobile_number} onChange={this.handleMobileNumberInput.bind(this)}/>
                <button className='login-btn' onClick={this.handleSendOtp.bind(this)}>Send OTP</button>
            </div>
        )
    }

    loadPostOtpElement(){
        return (
            <div className='custom-signin'>
                <label className='login-label'>Enter the otp sent to your mobile number {this.state.mobile_number}</label><br></br>
                <input className='login-input' value={this.state.otp} onChange={this.handleOtpInput.bind(this)}/>
                <button className='login-btn verify-otp' onClick={this.handleVerifyOtp.bind(this)}>Verify OTP</button>
            </div>
        )
    }

    loginRenderer(){
        const isUserAuthenticated = this.context.contextState.isUserAuthenticated;

        if (isUserAuthenticated)
            return <Navigate to="/myinfo" replace/>
        else{
            return(
                <React.Fragment>
                    {isUserAuthenticated == null && (
                        <Loader/>
                    )}
                    <div className='login-container'>
                        {this.renderSignInWithGoogle()}
                        {this.renderSignInWithFb()}
                        <hr></hr>
                        {this.renderCustomSignin()}
                    </div>
                </React.Fragment>
            )
        }
    }

    render() { 
        return this.loginRenderer();
    }
}

LoginContainer.contextType = AppContext;
 
export default LoginContainer;