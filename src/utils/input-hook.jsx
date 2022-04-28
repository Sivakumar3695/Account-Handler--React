import { useEffect, useState } from "react";

const useInputHandler = (stateValObj, allowedPatternObj) => {

    const [errorInputs, setErrorInputs] = useState([])
    const [editState, setEditState] = useState(stateValObj)
    const [pattentObj, setPatternObj] = useState(allowedPatternObj)


    useEffect(() => {
        var errInputs = new Array()
        errInputs.push(...errInputs)

        Object.keys(editState)
            .filter(key => pattentObj[key].type === 'text')
            .map(key => {
                let isMandatory = pattentObj[key].isMandatory;
                if (isIncorrectValueProvided(isMandatory, key, editState[key])){
                    errInputs.push(key);
                }
                else{
                    errInputs = errInputs.filter(e => e != key);
                }
                
                setErrorInputs(errInputs);
            })
    }, [editState])

    const isIncorrectValueProvided = (isMandatory, key, value) => {
        let isIncorrectVal = (isMandatory && !Boolean(value)) || //mandatory and user input not provided
        (Boolean(value) && !new String(value).match(pattentObj[key].allowedStrPattern)); //user input provided and it does not match with the required format.

        return isIncorrectVal;
    }

    const editSpecificElement = (key, val, subkey) => {
        var newEditState = {...editState}
        if (subkey)
            newEditState[key][subkey] = val;
        else
            newEditState[key] = val

        setEditState(newEditState);
    }

    return {errorInputs, editState, editSpecificElement}
}

export default useInputHandler;