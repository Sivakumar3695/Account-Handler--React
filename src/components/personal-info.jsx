import React, { Component, useCallback, useEffect, useState } from 'react';
import PersonalInfoModal from './personal-info-modal';
import '../styles/personal-info.css';
import '../styles/App.css';
import { NullToEmptyStrConverter } from '../utils/response-utils';
import { useAxios } from '../utils/request-utils';
import useInputHandler from '../utils/input-hook';
import {PersonalInfoDispMetaData} from '../metadata/personal-info'


const PersonalInfo = () => {
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

    const [editEnabledInfo, setEditEnabledInfo] = useState('')
    const [showEditFor, setShowEditFor] = useState('')
    const {errorInputs, editState, editSpecificElement} = useInputHandler(state.personalInfo, PersonalInfoDispMetaData);
    const {data, processing, processUrl} = useAxios();


    useEffect(() => {
        processUrl({
            method: 'GET',
            url:  'http://localhost:8080/getMyDetails',
            withCredentials: true
        })  
    },[])

    useEffect(() => {
        // updateStateWithData();
        if (data)
            updatePersonalInfoStateWithServerResp(data);
        if (!processing)
            setEditEnabledInfo('')
    }, [data, processing])


    const saveDetails = (event) => {
        console.log(editState);
        processUrl({
            method: 'PUT',
            url: 'http://localhost:8080/updateMyDetails',
            withCredentials : true,
            data: {
                'display_name' : editState.displayName,
                'nick_name' : editState.nickName,
                'email_id' : editState.email,
                'gender' : editState.gender.value
            },
            headers: {
                'Content-Type' : 'application/json'
            }
        })
        event.target.classList.add('btn-loading')
        event.target.classList.remove('btn-ok')
        // setEditEnabledInfo('')
    }

    const renderImage = () => {
        var imgUrl = state.personalInfo.photoUrl !== '' ? state.personalInfo.photoUrl : process.env.PUBLIC_URL + '/images/default-profile-icon.jpg';
        return (
            <div className='profile-pic-holder'>
                <div className='profile-pic-plus-edit-button'>
                    <img className='profile-pic' width="30%"src={imgUrl} alt='Not Found'/>
                    <button className='info-page-btn btn-edit'
                            // onClick={() => updateEditableInfoState(key)}
                            >
                                    EDIT
                            </button>
                </div>
            </div>
        )
    }

    const updateEditableInfoState = (key) => {

        //set editState
        if (key === '')
            editSpecificElement(editEnabledInfo, state.personalInfo[editEnabledInfo])
        else
            editSpecificElement(key, state.personalInfo[key])

        
        setEditEnabledInfo(key)
    }

    const renderEditableInput = (key) => {
        if (PersonalInfoDispMetaData[key].type === 'text'){
            
            const classNames = processing ? 'personal-info-input info-input-disabled' : 'personal-info-input'
            return (
            <input 
                id={key + "-input"} 
                type={"text"}
                className={classNames} 
                value={editState[key]}
                onChange={(event) => editSpecificElement(key, event.target.value)}
                autoFocus={true}
                disabled={processing}
            />
           )
        }
        else if (PersonalInfoDispMetaData[key].type === 'radio'){
            var genederElements = PersonalInfoDispMetaData[key].possibleValues.map(obj => {
                return (
                    <React.Fragment key={'info-det-'+obj.value}>
                        <input 
                        id={key + '-info-page-' + obj.value}
                        name={key + '-edit'} 
                        type='radio' 
                        value={obj.value}
                        checked={editState[key].value === obj.value}
                        onChange={(event) => editSpecificElement(key, event.target.value, 'value')}
                        disabled={processing} 
                        />
                        <label className='radio-labels'>{obj.display}</label><br></br>
                    </React.Fragment>
                )
            })

            return (
                <div className='radio-inputs'>
                    {genederElements}
                </div>
            )
        }
    }

    const renderEditablePersonalDetails = (elementsVal, key) => {
        const editEnabled = editEnabledInfo === key;
        const canEdit = PersonalInfoDispMetaData[key].canEdit;

        return (
            <React.Fragment>
                {!editEnabled && (
                    <div className={'info-text-container'}
                    onMouseEnter={() => setShowEditFor(canEdit ? key: '')}
                    onMouseLeave={() => setShowEditFor('')}>
                        <span className='personal-info-text'>
                            {typeof elementsVal == 'object' ? elementsVal.display : elementsVal}
                        </span>
                        {showEditFor === key && (
                            <button className='info-page-btn btn-edit'
                            disabled={!canEdit}
                            onClick={() => updateEditableInfoState(key)}
                            >
                                    &#9998;
                            </button>
                        )}
                    </div>
                )}

                {editEnabled && (
                    <div className={'editableDetails'}>
                        {renderEditableInput(key)}
                        <button className={processing ? 'info-page-btn btn-loading' : 'info-page-btn btn-ok'}
                            disabled={errorInputs.includes(key)}
                            onClick={saveDetails}
                            >
                                
                        </button>
                        <button className='info-page-btn btn-cancel'
                            disabled={false} 
                            onClick={() => updateEditableInfoState('')}
                            >
                                &#10005;
                        </button>

                    </div>
                )}      
            </React.Fragment>
        );
    }

    const renderPersonalDetails = () => {
        var personDetailsArr = Object.keys(state.personalInfo)
            .filter(key => Object.keys(PersonalInfoDispMetaData).includes(key) && ['text', 'radio'].includes(PersonalInfoDispMetaData[key].type))
            .map(key => {
                var curVal = state.personalInfo[key];
                return (
                    <div className='personal-details' key={'personal-details-' + key}>
                        <label className='personal-info-label'>{PersonalInfoDispMetaData[key].label}</label><br></br><br></br>
                        {renderEditablePersonalDetails(curVal, key)}
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
        //handle gender disp value;
        let genderPersonalInfo = newState.personalInfo.gender;
        let genderObj = PersonalInfoDispMetaData.gender.possibleValues.filter(obj => obj.value === genderPersonalInfo.value).at(0);
        genderPersonalInfo.display = genderObj.display;

        setState(newState);
        // setStateObjVal({...state.personalInfo});
    }

    const updatePersonalInfoStateWithServerResp = (resp) => {
        console.log('updating state...');
        if (resp == null || resp.status != 200)
            return
        var resp_data = resp.data;
        var newState = {...state};

        console.log(resp_data);
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

        console.log('updated');
        updateState(newState);
    }

    const handleModalPopup = () => {
        return (
            <PersonalInfoModal 
            show={state.incompleteDetailsExists} 
            personalInfo={editState} 
            updatePersonalInfoStateOnUserInput={editSpecificElement}
            updatePersonalInfoStateWithServerResp={saveDetails}
            errorInputs={errorInputs}
            />
        )
    }
    
    return (
        
        <div className='main-content'>
                {renderImage()}
                {renderDetailsHolder()}
                {handleModalPopup()}
        </div>
    )
}

export default PersonalInfo;