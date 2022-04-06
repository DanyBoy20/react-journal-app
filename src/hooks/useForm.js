import { useState } from "react"


export const useForm = ( initialState = {} ) => {
    
    const [values, setValues] = useState(initialState);

    // 02 al parametro le asignmos el initialState
    // si no enviamos parametro, entonces tomara el initialState
    const reset = (newFormState = initialState) => {
        setValues( newFormState );
    }

    const handleInputChange = ({ target }) => {

        setValues({
            ...values,
            [ target.name ]: target.value
        });

    }

    return [ values, handleInputChange, reset ];

}