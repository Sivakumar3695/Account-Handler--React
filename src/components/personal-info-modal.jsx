import axios from 'axios';
import React, { Component } from 'react';
import '../styles/personal-info-modal.css';

class PersonalInfoModal extends Component {
    state = {
        errorInputs: []
    }

    handleErrInputs(event, key, incorrectValueProvided){

        var prevState = this.state
        if (incorrectValueProvided){
            event.target.classList.add('input-error')
            prevState.errorInputs = prevState.errorInputs.filter(e => e !== key) //to avoid duplicates
            prevState.errorInputs.push(key)
        }
        else{
            event.target.classList.remove('input-error')
            prevState.errorInputs = prevState.errorInputs.filter(e => e !== key)
        }

        console.log(prevState);
        this.setState(prevState)
        
    }


    // handleInputEntryOnChange(event, key){
    //     let personalInfoObj = this.props.personalInfo;
    //     console.log(personalInfoObj);
    //     console.log(key);
    //     personalInfoObj[key].value = event.target.value;
    //     return this.props.handleEntryUpdates(personalInfoObj)
    // }

    renderModalTextElements(){
        let mandatoryEntries = this.props.mandatoryEntries;
        let modalElements = Object.keys(this.props.personalInfo)
            .filter(key => this.props.personalInfo[key].type == 'text-input')
            .map(key => {
                let isMandatory = mandatoryEntries.includes(key);
                return (
                    <div className='personal-details'>
                        <label className='personal-info-label'>{this.props.personalInfo[key].label + (isMandatory ? '*' : '')}</label><br></br><br></br>
                        <input id={key + "-input"} className='personal-info-input test' value={this.props.personalInfo[key].value} 
                            onChange={(event) => {
                                let personalInfoObj = this.props.personalInfo;
                                personalInfoObj[key].value = event.target.value;
                                return this.props.handleEntryUpdates(personalInfoObj, 
                                    this.props.incompleteDetailsExists)}
                            }   
                            onBlur={(event) => {
                                let userInput = event.target.value;
                                let incorrectValueProvided = 
                                (isMandatory && !Boolean(userInput)) || //mandatory and user input not provided
                                (Boolean(userInput) && !userInput.match(this.props.personalInfo[key].allowedStrPattern)); //user input provided and it does not match with the required format.
                                
                                this.handleErrInputs(event, key, incorrectValueProvided)}
                            }
                            disabled={!this.props.personalInfo[key].canEditInModal}
                        />
                    </div>
                )
        });
        
        return modalElements;
    }

    renderGenderOptions(){
        var genederElements = this.props.personalInfo.gender.possibleValues.map(obj => {

            return (
                <React.Fragment>
                    <input 
                    id={'gender-' + obj.value}
                    name='gender' 
                    type='radio' 
                    className='personal-info-text' 
                    value={obj.value}
                    checked={this.props.personalInfo.gender.value === obj.value}
                    onChange={(event) => {
                        let personalInfoObj = this.props.personalInfo;
                        personalInfoObj['gender'].value = event.currentTarget.value;
                        return this.props.handleEntryUpdates(personalInfoObj, 
                            this.props.incompleteDetailsExists)
                    }} 
                    />
                    <label className='radio-labels'>{obj.label}</label><br></br>
                </React.Fragment>
            )
        })
        return (
            <div className='personal-details'>
                <label className='personal-info-label'>Gender</label><br></br><br></br>
                {genederElements}
            </div>
        );
    }

    async onSave(){
        try{
            var personalInfo = this.props.personalInfo;
            var resp = await axios.put('http://localhost:8080/updateMyDetails', {
                'display_name' : personalInfo.displayName.value,
                'nick_name' : personalInfo.nickName.value,
                'email_id' : personalInfo.email.value,
                'gender' : personalInfo.gender.value
            }, {
                withCredentials : true,
                'Content-Type' : 'application/json'
            })

            if (resp.status === 200){
                var personalInfo = this.props.personalInfo;
                var resp_user_det = resp.data.user_details;
                personalInfo.displayName.value = resp_user_det.display_name;
                personalInfo.nickName.value = resp_user_det.nick_name;
                personalInfo.email.value = resp_user_det.email_id;
                personalInfo.gender.value = resp_user_det.gender_code;
                personalInfo.gender.display = resp_user_det.gender_display_name;
                personalInfo.phoneNumber.value = resp_user_det.phone_number;
                this.props.handleEntryUpdates(
                    personalInfo, 
                    resp.data.incompleteDetailsExists)
            }
        }
        catch(err){
            console.log('Error occurred during update call');
        }
    }

    renderSaveButton(){
        return (
                <button className='save-btn'
                onClick={this.onSave.bind(this)}
                disabled={this.state.errorInputs.length != 0}
                >Save</button>            
        )
    }

    render() { 
        var classNames = this.props.show ? "modal modal-show" : "modal modal-hide"
        return (
            <div className={classNames}>
                <div className="modal-content">    
                    <div className='modal-elements'>
                        {this.renderModalTextElements()}
                        {this.renderGenderOptions()}
                    </div>
                    <div className='modal-save-btn'>
                        {this.renderSaveButton()}
                    </div>
                </div>
            </div>
        );
    }
}
 
export default PersonalInfoModal;