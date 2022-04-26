
/*
Pass response.data to this function
*/

export const NullToEmptyStrConverter = function(resp_data){
    Object.keys(resp_data).forEach(key => {
        if (resp_data[key] === null || resp_data[key] === undefined)
            resp_data[key] = ''
        else if (typeof resp_data[key] == 'object'){
            NullToEmptyStrConverter(resp_data[key])
            return;
        }
    })
}