import React, { Component, useEffect, useState } from 'react';
import PersonalInfoModal from './personal-info-modal';
import '../styles/personal-info.css';
import { NullToEmptyStrConverter } from '../utils/response-utils';
import { useAxios } from '../utils/request-utils';


const PersonalInfo = () => {
    const {processUrl} = useAxios()
    const [state, setState] = useState(
        {
            personalInfo:{
                displayName: '',
                phoneNumber: '',
                
                //not mandatory
                nickName: '',
                email: '',
                photoUrl: '',
                gender: {
                    value: 'not_mentioned', 
                    display: '', 
                    }
            },
            incompleteDetailsExists: false
        }
    )

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

    const renderImage = () => {
        var imgUrl = state.personalInfo.photoUrl !== '' ? state.personalInfo.photoUrl : process.env.PUBLIC_URL + '/images/default-profile-icon.jpg';
        return (
            <div className='profile-pic-holder'>
                <img className='profile-pic' width="30%"src={imgUrl} alt='Not Found'/>
            </div>
        )
    }

    const renderPersonalDetails = () => {
        var personDetailsArr = Object.keys(state.personalInfo)
            .filter(key => Object.keys(PersonalInfoDispProp).includes(key) && ['text-input', 'radio-input'].includes(PersonalInfoDispProp[key].type))
            .map(key => {
                var curVal = state.personalInfo[key];
                return (
                    <div className='personal-details' key={'personal-details-' + key}>
                        <label className='personal-info-label'>{PersonalInfoDispProp[key].label}</label><br></br><br></br>
                        <span className='personal-info-text'>{typeof curVal == 'object' ? curVal.display : curVal}</span>
                    </div>
                )
            })
        return personDetailsArr;
    }

    const renderDetailsHolder = () => {
       return (
        <div className='personal-details-holder'>
            {renderPersonalDetails()}            
        </div>
       )
    }

    const updateState = (newState) => {
        //handle gender disp valu;
        let genderPersonalInfo = newState.personalInfo.gender;
        let genderObj = PossibleGenderValues.filter(obj => obj.value === genderPersonalInfo.value).at(0);
        genderPersonalInfo.display = genderObj.display;

        setState(newState);
    }

    const updatePersonalInfoStateOnUserInput = (key, value, subkey) => {
        var prevState = {...state}
        if (subkey)
            prevState.personalInfo[key][subkey] = value;
        else
            prevState.personalInfo[key] = value;

        updateState(prevState);
    }

    const updatePersonalInfoStateWithServerResp = (resp) => {
        if (resp == null || resp.status != 200)
            return
        var resp_data = resp.data;
        var newState = {...state};

        NullToEmptyStrConverter(resp_data)        

        var personalInfo = newState.personalInfo;
        var resp_user_det = resp_data.user_details;
        personalInfo.displayName = resp_user_det.display_name;
        personalInfo.nickName = resp_user_det.nick_name;
        personalInfo.email = resp_user_det.email_id;
        personalInfo.gender.value = resp_user_det.gender_code;
        personalInfo.gender.display = resp_user_det.gender_display_name;
        personalInfo.phoneNumber = resp_user_det.phone_number;

        newState.incompleteDetailsExists = resp_data.incomplete_details_exist;

        updateState(newState);
    }

    const handleModalPopup = () => {
        return (
            <PersonalInfoModal 
            show={state.incompleteDetailsExists} 
            personalInfo={state.personalInfo} 
            incompleteDetailsExists={state.incompleteDetailsExists}
            updatePersonalInfoStateOnUserInput={updatePersonalInfoStateOnUserInput}
            updatePersonalInfoStateWithServerResp={updatePersonalInfoStateWithServerResp}
            />
        )
    }

    useEffect (() => {
        async function getMyDetails(){
            const response = await processUrl({
                method: 'GET',
                url:  'http://localhost:8080/getMyDetails',
                withCredentials: true
            })
            updatePersonalInfoStateWithServerResp(response);
        };

        getMyDetails();

    }, [])

    return (
        
        <div className='main-content'>
                {renderImage()}
                {renderDetailsHolder()}
                {handleModalPopup()}
        </div>
    )
}

export default PersonalInfo;

const PersonalInfoDispProp = {
    displayName: {
        label:'Display Name', 
        type:'text-input', 
        allowedStrPattern: /.+/, 
        canEditInModal:true
    },
    phoneNumber: {
        label:'Phone Name', 
        type:'text-input', 
        allowedStrPattern:/[1-9][0-9]{9}/, 
        canEditInModal:false
    },

    //not mandatory
    nickName: {
        label:'Nick Name', 
        type:'text-input', 
        allowedStrPattern: /.+/, 
        canEditInModal:true
    },
    email: {
        label:'Email', 
        type:'text-input', 
        allowedStrPattern: /[^\s@]+@[^\s@]+\.[^\s@]+/, 
        canEditInModal:true
    },
    gender: {
        label:'Gender', 
        type:'radio-input', 
        canEditInModal:true,
    },
    photoUrl: {type: 'upload'}
}

const PossibleGenderValues = [
    {value: 'male', display:'Male'}, 
    {value: 'female', display:'Female'},
    {value: 'not_mentioned', display: 'Not willing to provide my gender details'}
]

const MandatoryFields = ['displayName', 'phoneNumber']

export {PersonalInfoDispProp, MandatoryFields, PossibleGenderValues}