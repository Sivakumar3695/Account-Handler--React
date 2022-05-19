
/*
Pass response.data to this function
*/

const nullToEmptyStrConverter = function(resp_data){
    Object.keys(resp_data).forEach(key => {
        if (resp_data[key] === null || resp_data[key] === undefined)
            resp_data[key] = ''
        else if (typeof resp_data[key] == 'object'){
            nullToEmptyStrConverter(resp_data[key])
            return;
        }
    })
}

export default nullToEmptyStrConverter;