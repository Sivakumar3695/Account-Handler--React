import React, { Component } from 'react';
import PersonalInfoModal from './personal-info-modal';
import '../styles/personal-info.css';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import { AppContext } from '../context/app-context';

const personalInfoDispProp = {
    displayName: {label:'Display Name', type:'text-input', allowedStrPattern: /.+/, canEditInModal:true},
    phoneNumber: {label:'Phone Name', type:'text-input', allowedStrPattern:/[1-9][0-9]{9}/, canEditInModal:false},

    //not mandatory
    nickName: {label:'Nick Name', type:'text-input', allowedStrPattern: /.+/, canEditInModal:true},
    email: {label:'Email', type:'text-input', allowedStrPattern: /[^\s@]+@[^\s@]+\.[^\s@]+/, canEditInModal:true},
    photoUrl: {type: 'upload'},
    gender: {label:'Gender', type:'radio-input', canEditInModal:true,}
}

class PersonalInfo extends Component {
    state = {
        personalInfo:{
            displayName: {value:'', label:'Display Name', type:'text-input', allowedStrPattern: /.+/, canEditInModal:true},
            phoneNumber: {value:'', label:'Phone Name', type:'text-input', allowedStrPattern:/[1-9][0-9]{9}/, canEditInModal:false},

            //not mandatory
            nickName: {value:'', label:'Nick Name', type:'text-input', allowedStrPattern: /.+/, canEditInModal:true},
            email: {value:'', label:'Email', type:'text-input', allowedStrPattern: /[^\s@]+@[^\s@]+\.[^\s@]+/, canEditInModal:true},
            photoUrl: {value:'', type: 'upload'},
            gender: {value: NaN, display: '', label:'Gender', type:'radio-input', canEditInModal:true, 
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

    handleEntryUpdates(personalInfoObj, incompleteDetInfo){
        this.setState({
            personalInfo: personalInfoObj, 
            incompleteDetailsExists: incompleteDetInfo
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
            var resp_user_det = resp_data.user_details;
            personalInfo.displayName.value = resp_user_det.display_name;
            personalInfo.nickName.value = resp_user_det.nick_name;
            personalInfo.email.value = resp_user_det.email_id;
            personalInfo.gender.value = resp_user_det.gender_code;
            personalInfo.gender.display = resp_user_det.gender_display_name;
            personalInfo.phoneNumber.value = resp_user_det.phone_number;

            newState.incompleteDetailsExists = resp_data.incomplete_details_exist;

            this.setState(newState)
            console.log(newState);
        }
        catch(err){
            console.log('Error during /getMyDetails API call');
            var response = err.response;
            if (response.status === 401){
                let appState = this.context
                //unauthorized request. Hence, redirect to /login page.
                appState.toggleAuthentication();
            }
            console.log(err.response);
        }
    }

    handleModalPopup(){
        return (
            <PersonalInfoModal 
            show={this.state.incompleteDetailsExists} 
            personalInfo={this.state.personalInfo} 
            incompleteDetailsExists={this.state.incompleteDetailsExists}
            handleEntryUpdates={this.handleEntryUpdates.bind(this)}
            mandatoryEntries={this.getMandatoryEntries()}/>
        )
    }

    render() { 
        return (
            <div className='main-content'>
                    {this.renderImage()}
                    {this.renderDetails()}
                    {this.handleModalPopup()}
            </div>
        )
    }
}

PersonalInfo.contextType = AppContext;
 
export default PersonalInfo;