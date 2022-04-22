import React, { Component } from 'react';
import PersonalInfoModal from './personal-info-modal';
import '../styles/personal-info.css';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

class PersonalInfo extends Component {
    state = {
        personalInfo:{
            displayName: {value:'', label:'Display Name', type:'text-input'},
            phoneNumber: {value:'', label:'Phone Name', type:'text-input'},

            //not mandatory
            nickName: {value:'', label:'Nick Name', type:'text-input'},
            email: {value:'', label:'Email', type:'text-input'},
            photoUrl: {value:'', type: 'upload'},
            gender: {value: NaN, display: '', label:'Gender', type:'radio-input', 
                possibleValues:[
                    {value: 'male', label:'Male'}, 
                    {value: 'female', label:'Female'},
                    {value: 'not_mentioned', label: 'Not willing to provide my gender details'}
                ]}
        },
        incompleteDetailsExists: false
    }

    getMandatoryEntries(){
        return ['displayName', 'phoneNumber']
    }

    // renderGenderOptions(){
    //     var genederElements = this.state.personalInfo.gender.possibleValues.map(obj => {
    //         var isChecked = this.state.personalInfo.gender.value === obj.value;
        
    //         return (
    //             <React.Fragment>
    //                 <input name='gender' type='radio' className='personal-info-text' value={obj.value} checked={isChecked}/>
    //                 <label>{obj.label}</label>
    //             </React.Fragment>
    //         )
    //     })
    //     return genederElements;
    // }

    renderImage(){
        var imgUrl = this.state.personalInfo.photoUrl.value !== '' ? this.state.personalInfo.photoUrl.value : process.env.PUBLIC_URL + '/images/default-profile-icon.jpg';
        return (
            <div className='profile-pic-holder'>
                <img className='profile-pic' width="30%"src={imgUrl} alt='Not Found'/>
            </div>
        )
    }

    renderDetails(){
       return (
        <div className='personal-details-holder'>
            <div className='personal-details'>
                <label className='personal-info-label'>Display Name</label><br></br><br></br>
                <span className='personal-info-text'>{this.state.personalInfo.displayName.value}</span>
            </div>

            <div className='personal-details'>
                <label className='personal-info-label'>Nick Name</label><br></br><br></br>
                <span className='personal-info-text'>{this.state.personalInfo.nickName.value}</span>
            </div>

            <div className='personal-details'>
                <label className='personal-info-label'>Phone Name</label><br></br><br></br>
                <span className='personal-info-text'>{this.state.personalInfo.phoneNumber.value}</span>
            </div>

            <div className='personal-details'>
                <label className='personal-info-label'>Email</label><br></br><br></br>
                <span className='personal-info-text'>{this.state.personalInfo.email.value}</span>
            </div>

            <div className='personal-details'>
                <label className='personal-info-label'>Gender</label><br></br><br></br>
                <span className='personal-info-text'>{this.state.personalInfo.gender.display}</span>
            </div>

    </div>
       )
    }

    handleEntryUpdates(personalInfoObj){
        this.setState({
            personalInfo: personalInfoObj
        })
    }
    
    async componentDidMount(){
        try{
            var resp = await axios.get('http://localhost:8080/getMyDetails',
            {
                withCredentials: true
            });
            var resp_data = resp.data;
            var newState = {...this.state};
            var personalInfo = newState.personalInfo;
            personalInfo.displayName.value = resp_data.dispay_name;
            personalInfo.nickName.value = resp_data.nick_name;
            personalInfo.email.value = resp_data.email_id;
            personalInfo.gender.value = resp_data.gender_code;
            personalInfo.gender.display = resp_data.gender_display_name;
            personalInfo.phoneNumber.value = resp_data.phone_number;

            var incompleDetailsExists = this.getMandatoryEntries().filter(entry => {
                return Boolean(personalInfo[entry].value)
            }).length !== 0 ? true : false;
            newState.incompleteDetailsExists = incompleDetailsExists;

            this.setState(newState)
            console.log(newState);
        }
        catch(err){
            console.log('Error during /getMyDetails API call');
            var response = err.response;
            if (response.status === 401){
                //unauthorized request. Hence, redirect to /login page.
                return <Navigate to='/login' replace />
            }
            console.log(err.response);
        }
    }

    handleModalPopup(){
        return (
            <PersonalInfoModal show={this.state.incompleteDetailsExists} personalInfo={this.state.personalInfo} 
                handleEntryUpdates={this.handleEntryUpdates.bind(this)}/>
        )
    }

    render() { 
        return (
        <div className='main-content'>
            {this.renderImage()}
            {this.renderDetails()}
            {this.handleModalPopup()}
        </div>);
    }
}
 
export default PersonalInfo;