const PersonalInfoDispMetaData = {
    displayName: {
        label:'Display Name', 
        type:'text', 
        allowedStrPattern: /.+/, 
        canEdit:true,
        isMandatory: true
    },
    phoneNumber: {
        label:'Phone Name', 
        type:'text', 
        allowedStrPattern:/[1-9][0-9]{9}/, 
        canEdit:false,
        isMandatory: true
    },

    //not mandatory
    nickName: {
        label:'Nick Name', 
        type:'text', 
        allowedStrPattern: /.+/, 
        canEdit:true,
        isMandatory: false
    },
    email: {
        label:'Email', 
        type:'text', 
        allowedStrPattern: /[^\s@]+@[^\s@]+\.[^\s@]+/, 
        canEdit:true,
        isMandatory: false
    },
    gender: {
        label:'Gender', 
        type:'radio', 
        canEdit:true,
        isMandatory: false,
        possibleValues :[
            {value: 'male', display:'Male'}, 
            {value: 'female', display:'Female'},
            {value: 'not_mentioned', display: 'Not willing to provide my gender details'}
        ]
    },
    photoUrl: {type: 'upload'}
}

export {PersonalInfoDispMetaData}