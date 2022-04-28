import axios from 'axios';
import React, { Component, useCallback, useEffect, useState } from 'react';
import '../styles/personal-info-modal.css';
import { useAxios } from '../utils/request-utils';
import {PersonalInfoDispMetaData} from '../metadata/personal-info'

const PersonalInfoModal = (props) => {

    const updateErrInputClassList = (event, key) => {
        if (props.errorInputs.includes(key))
            event.target.classList.add('input-error')
        else
            event.target.classList.remove('input-error')
    }

    const modalTextElement = (key, isMandatory) => {
        
        return (
            <div className='personal-details' key={'modal-personal-details-'+key}>
                <label className='personal-info-label'>{PersonalInfoDispMetaData[key].label + (isMandatory ? '*' : '')}</label><br></br><br></br>
                <input 
                    id={key + "-input"} 
                    className='personal-info-modal-input' 
                    value={props.personalInfo[key]} 
                    onChange={(event) => props.updatePersonalInfoStateOnUserInput(key, event.target.value)}
                    onBlur={(event) => updateErrInputClassList(event, key)}
                    disabled={!PersonalInfoDispMetaData[key].canEdit}
                />
            </div>
        );
    }

    const renderModalTextElements = () => {
        let modalElements = Object.keys(props.personalInfo)
            .filter(key => PersonalInfoDispMetaData[key].type == 'text')
            .map(key => {
                let isMandatory = PersonalInfoDispMetaData[key].isMandatory;
                return modalTextElement(key, isMandatory);
        });
        
        return modalElements;
    }

    const renderGenderOptions = () => {
        var genederElements = PersonalInfoDispMetaData.gender.possibleValues.map(obj => {

            return (
                <React.Fragment key={'modal-personal-det-'+obj.value}>
                    <input 
                    id={'gender-' + obj.value}
                    name='gender' 
                    type='radio' 
                    className='personal-info-text' 
                    value={obj.value}
                    checked={props.personalInfo.gender.value === obj.value}
                    onChange={(event) => props.updatePersonalInfoStateOnUserInput('gender', event.target.value, 'value')} 
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

    const RenderSaveButton = () => {

        return (
                <button className='save-btn'
                onClick={props.updatePersonalInfoStateWithServerResp}
                disabled={props.errorInputs.length != 0}
                >
                    Save
                </button>            
        )
    }

    var classNames = props.show ? "modal-sketch modal-show" : "modal-hide"
    return (
        <div id="modal-container" className={classNames}>
            <div className='modal-background'>
                <div className="modal">    
                    <div className='modal-elements'>
                        {renderModalTextElements()}
                        {renderGenderOptions()}
                    </div>
                    <div className='modal-save-btn'>
                        {RenderSaveButton()}
                    </div>
                    <svg className="modal-svg" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" preserveAspectRatio="none">
						<rect x="0" y="0" fill="none" width="100%" height="100%" strokeDasharray='100%' strokeDashoffset='100%' rx="3" ry="3"></rect>
					</svg>
                </div>
            </div>
        </div>
    );
}

export default PersonalInfoModal;