import React from 'react';
import {PersonalInfoDispMetaData} from '../../../metadata/personal-info'
import { Btn } from '../../common/button';
import CustomModal from '../../common/modal';

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
                    disabled={!PersonalInfoDispMetaData[key].canEdit && props.personalInfo[key] && !props.errorInputs.includes(key)}
                />
            </div>
        );
    }

    const renderModalTextElements = () => {
        let modalElements = Object.keys(props.personalInfo)
            .filter(key => PersonalInfoDispMetaData[key].type === 'text')
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

    const SaveButton = () => {
        
        console.log(props.loading);
        return (
            <Btn 
                id='personal-info-save'
                displayContent="Save"
                properties='btn-primary border-curved'
                onClick={props.saveDetails} 
                center={true}
                loading={props.loading}
                isDisabled={props.errorInputs.length !== 0} />           
        )
    }

    return (
        <CustomModal id='personal-info' show={props.show} customModalElementClass='modal-disp-flex'>
            {renderModalTextElements()}
            {renderGenderOptions()}
            <SaveButton/>
        </CustomModal>
    );
}

export default PersonalInfoModal;