import React, { Suspense, useEffect, useState } from 'react';
import { useAxios } from '../../../hooks/request-hook';
import useInputHandler from '../../../hooks/input-hook';
import {PersonalInfoDispMetaData} from '../../../metadata/personal-info'
import { Btn } from '../../common/button';
import nullToEmptyStrConverter from "../../../hooks/response-utils";

import '../../../styles/personal-info.css';
import Loader from '../../common/loader';

const PersonalInfoModal = React.lazy(() => import('./personal-info-modal'))
const UploadPhoto = React.lazy(() => import('./photoUpload'))


const PersonalInfo = () => {
    const [state, setState] = useState(
        {
            personalInfo:{
                displayName: '',
                phoneNumber: '',
                
                //not mandatory
                nickName: '',
                email: '',
                // photoUrl: process.env.PUBLIC_URL + '/images/default-profile-icon.jpg',
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
    const {getData, processing, processUrl} = useAxios();

    const PROFILE_PIC_URL = process.env.REACT_APP_SERVER_URL_BASE + '/users/me/profile-picture';

    const [photoUrl, setPhotoUrl] = useState(PROFILE_PIC_URL)
    const [uploadPhoto, setUploadPhoto] = useState(false)

    useEffect(() => {
        
        processUrl({
            method: 'GET',
            url:  process.env.REACT_APP_SERVER_URL_BASE + '/users/me',
            withCredentials: true
        })
        
        console.log('processing');
    },[])

    useEffect(() => {
        const response = getData();
        console.log(response);
        if (response && !processing){
            // setPhotoUrl(PROFILE_PIC_URL)
            updatePersonalInfoStateWithServerResp(response);
            setEditEnabledInfo('')
        }
        else if (!processing)
            setEditEnabledInfo('')
    }, [processing])


    const saveDetails = (event) => {
        console.log(event);

        processUrl({
            method: 'PUT',
            url: process.env.REACT_APP_SERVER_URL_BASE +'/users/me',
            withCredentials : true,
            data: {
                'display_name' : editState.displayName,
                'nick_name' : editState.nickName,
                'email_id' : editState.email,
                'gender' : editState.gender.value,
                'phone_number': editState.phoneNumber
            },
            headers: {
                'Content-Type' : 'application/json'
            }
        })

        event.target.classList.remove('btn-ok')
        // setEditEnabledInfo('')
    }

    const imageHolder = () => {
        return (
            <div className='profile-pic-holder'>
                <img className='profile-pic' width="100%" height="100%" src={photoUrl} alt='Not Found'/>
            </div>
        )
    }

    const renderImageContainer = () => {
        return (
            <div className='profile-pic-container'>
                <div className='profile-pic-plus-edit-button'>
                    {imageHolder()}
                    <Btn 
                        displayContent="EDIT"
                        properties='btn-xx-small btn-primary border-curved clear-margin'
                        onClick={() => setUploadPhoto(true)}
                        // properties="btn-xx-small border-curved"
                    />
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
                            <Btn 
                            displayContent="EDIT"
                            onClick={() => updateEditableInfoState(key)}
                            properties="btn-xx-small border-curved"
                            isDisabled={!canEdit}/>
                        )}
                    </div>
                )}

                {editEnabled && (
                    <div className={'editableDetails'}>
                        {renderEditableInput(key)}
                        
                        <Btn 
                            displayContent=''
                            iconBtn={true}
                            onClick={saveDetails}
                            properties={processing ? 'btn-loading' : 'btn-ok'}
                            isDisabled={errorInputs.includes(key)} />

                        <Btn 
                            displayContent=''
                            iconBtn={true}
                            onClick={() => updateEditableInfoState('')}
                            properties='btn-cancel' />

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

    const updatePersonalInfoStateWithServerResp = (response) => {
        if (response.data == null || response.status !== 200)
            return
        const responseData = response.data;
        var resp_user_det = responseData.user_details;

        if (!resp_user_det)
            return
        
        var newState = {...state};
        
        nullToEmptyStrConverter(responseData)        
    
        var personalInfo = newState.personalInfo;
        personalInfo.displayName = resp_user_det.display_name;
        personalInfo.nickName = resp_user_det.nick_name;
        personalInfo.email = resp_user_det.email_id;
        personalInfo.gender.value = resp_user_det.gender_code;
        personalInfo.gender.display = resp_user_det.gender_display_name;
        personalInfo.phoneNumber = resp_user_det.phone_number;

        newState.incompleteDetailsExists = responseData.incomplete_details_exist;

        updateState(newState);

        // setIsPhoneNumVerified(!resp_data.is_phone_number_verification_pending)
        // setIsEmailVerified(!resp_data.is_email_verification_pending)
    }

    const handleInfoEditModalPopup = () => {
        return (
            <Suspense fallback={<Loader/>}>
                <PersonalInfoModal 
                    show={state.incompleteDetailsExists} 
                    personalInfo={editState} 
                    updatePersonalInfoStateOnUserInput={editSpecificElement}
                    saveDetails={saveDetails}
                    errorInputs={errorInputs}
                    loading={processing}
                />
            </Suspense>
        )
    }

    const closePhotoUploadModal = () => {
        setPhotoUrl(PROFILE_PIC_URL);
        setUploadPhoto(false)
    }

    const handlePhotEditModal = () => {
        return (
            <Suspense fallback={<Loader/>}>
                <UploadPhoto 
                show={uploadPhoto}
                photoUrl={photoUrl}
                serverResponse={getData}
                updatePic={setPhotoUrl}
                closeModal={closePhotoUploadModal}
                />
            </Suspense>
        )
    }


    
    return (
        
        <React.Fragment>
            {renderImageContainer()}
            {renderDetailsHolder()}
            {state.incompleteDetailsExists && handleInfoEditModalPopup()}
            {uploadPhoto && handlePhotEditModal()}
        </React.Fragment>
    )
}

export default PersonalInfo;