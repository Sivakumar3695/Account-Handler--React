import React, { Component } from 'react';
import '../styles/personal-info-modal.css';

class PersonalInfoModal extends Component {


    handleInputEntryOnChange(event, key){
        let personalInfoObj = this.props.personalInfo;
        console.log(personalInfoObj);
        console.log(key);
        personalInfoObj[key].value = event.target.value;
        return this.props.handleEntryUpdates(personalInfoObj)
    }

    renderModalTextElements(){
        let modalElements = Object.keys(this.props.personalInfo)
            .filter(key => this.props.personalInfo[key].type == 'text-input')
            .map(key => {
                return (
                    <div className='personal-details'>
                        <label className='personal-info-label'>{this.props.personalInfo[key].label}</label><br></br><br></br>
                        <input id={key + "-input"} className='personal-info-input' value={this.props.personalInfo[key].value} 
                            onChange={(event) => {
                                let personalInfoObj = this.props.personalInfo;
                                personalInfoObj[key].value = event.target.value;
                                return this.props.handleEntryUpdates(personalInfoObj)
                            }    
                               }/>
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
                        return this.props.handleEntryUpdates(personalInfoObj)
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

    renderSaveButton(){
        return (
            <button>Save</button>
        )
    }

    render() { 
        var classNames = this.props.show ? "modal modal-show" : "modal modal-hide"
        return (
            <div className={classNames}>
                <div className="modal-content">    
                    {this.renderModalTextElements()}
                    {this.renderGenderOptions()}
                </div>
            </div>
        );
    }
}
 
export default PersonalInfoModal;