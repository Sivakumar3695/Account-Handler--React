import axios from 'axios';
import React, { Component, useEffect, useState } from 'react';
import '../styles/personal-info-modal.css';
import { useAxios } from '../utils/request-utils';
import { PersonalInfoDispProp, MandatoryFields, PossibleGenderValues } from './personal-info';

const PersonalInfoModal = (props) => {
    const {processUrl} = useAxios()
    const [errorInputs, setErrorInputs] = useState([])


    const getNewErrInputArray = () => {
        //copy old array to new one.
        var newErrInputs = new Array();
        newErrInputs.push(...errorInputs);

        return newErrInputs;
    }

    const updateNewErrInputArrAndClassList = (newErrInputs, event, key, incorrectValueProvided) => {
        
        if (incorrectValueProvided){
            if (event)
                event.target.classList.add('input-error')
            if (!newErrInputs.includes(key))
                newErrInputs.push(key)
        }
        else{
            if (event)
                event.target.classList.remove('input-error')
            newErrInputs = newErrInputs.filter(e => e != key);
        }
        return newErrInputs;
    }

    const handleUserInputErrors = (event, key, incorrectValueProvided) => {
        let newErrInputs = getNewErrInputArray();
        newErrInputs = updateNewErrInputArrAndClassList(newErrInputs, event, key, incorrectValueProvided);
        setErrorInputs(newErrInputs)        
    }


    const handleUserInputOnChange = (event, key, subkey) => {
        return props.updatePersonalInfoStateOnUserInput(key, event.target.value, subkey)
    }

    const isIncorrectValueProvided = (isMandatory, key, value) => {
        console.log(key);
        console.log(value);
        let isIncorrectVal = (isMandatory && !Boolean(value)) || //mandatory and user input not provided
        (Boolean(value) && !new String(value).match(PersonalInfoDispProp[key].allowedStrPattern)); //user input provided and it does not match with the required format.
        console.log(isIncorrectVal);
        return isIncorrectVal;
    }

    const handleUserTextInputOnBlur = (event, key, isMandatory) => {
        let userInput = event.target.value;
        
        let incorrectValueProvided = isIncorrectValueProvided(isMandatory, key, userInput);
        
        handleUserInputErrors(event, key, incorrectValueProvided)
    }

    const modalTextElement = (key, isMandatory) => {
        
        return (
            <div className='personal-details' key={'modal-personal-details-'+key}>
                <label className='personal-info-label'>{PersonalInfoDispProp[key].label + (isMandatory ? '*' : '')}</label><br></br><br></br>
                <input 
                    id={key + "-input"} 
                    className='personal-info-input test' 
                    value={props.personalInfo[key]} 
                    onChange={(event) => handleUserInputOnChange(event, key)}
                    onBlur={(event) => handleUserTextInputOnBlur(event, key, isMandatory)}
                    disabled={!PersonalInfoDispProp[key].canEditInModal}
                />
            </div>
        );
    }

    const renderModalTextElements = () => {
        let modalElements = Object.keys(props.personalInfo)
            .filter(key => PersonalInfoDispProp[key].type == 'text-input')
            .map(key => {
                let isMandatory = MandatoryFields.includes(key);
                return modalTextElement(key, isMandatory);
        });
        
        return modalElements;
    }

    useEffect(() => {
        let newErrInputs = getNewErrInputArray();
        Object.keys(props.personalInfo)
        .map(key => {
            let incorrectValueProvided = isIncorrectValueProvided(MandatoryFields.includes(key), key, props.personalInfo[key])
            newErrInputs = updateNewErrInputArrAndClassList(newErrInputs, null,key, incorrectValueProvided);
            setErrorInputs(newErrInputs);
        })
    },[props.personalInfo['phoneNumber']]) 

    const renderGenderOptions = () => {
        var genederElements = PossibleGenderValues.map(obj => {

            return (
                <React.Fragment key={'modal-personal-det-'+obj.value}>
                    <input 
                    id={'gender-' + obj.value}
                    name='gender' 
                    type='radio' 
                    className='personal-info-text' 
                    value={obj.value}
                    checked={props.personalInfo.gender.value === obj.value}
                    onChange={(event) => handleUserInputOnChange(event, 'gender', 'value')} 
                    />
                    <label className='radio-labels'>{obj.display}</label><br></br>
                </React.Fragment>
            )
        })
        
        return (
            <div className='personal-details' key='modal-personal-details-gender'>
                <label className='personal-info-label'>Gender</label><br></br><br></br>
                {genederElements}
            </div>
        );
    }

    const onSave = async () => {
        var personalInfo = props.personalInfo;
        const response = processUrl({
            method: 'PUT',
            url: 'http://localhost:8080/updateMyDetails',
            withCredentials : true,
            data: {
                'display_name' : personalInfo.displayName,
                'nick_name' : personalInfo.nickName,
                'email_id' : personalInfo.email,
                'gender' : personalInfo.gender
            },
            headers: {
                'Content-Type' : 'application/json'
            }
        })
        props.updatePersonalInfoStateWithServerResp(response);
    }

    const renderSaveButton = () => {
        console.log(errorInputs);
        return (
                <button className='save-btn'
                onClick={onSave}
                disabled={errorInputs.length != 0}
                >
                    Save
                </button>            
        )
    }

    var classNames = props.show ? "modal modal-show" : "modal modal-hide"
    return (
        <div className={classNames}>
            <div className="modal-content">    
                <div className='modal-elements'>
                    {renderModalTextElements()}
                    {renderGenderOptions()}
                </div>
                <div className='modal-save-btn'>
                    {renderSaveButton()}
                </div>
            </div>
        </div>
    );
}

export default PersonalInfoModal;