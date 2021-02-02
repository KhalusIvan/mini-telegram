import React from 'react'
import { useParams } from "react-router-dom";
import { useHistory } from 'react-router-dom';

export const Confirm = () => {
    let history = useHistory()
    let { token } = useParams();
    console.log(token)
    localStorage.setItem("token", token)
    history.push(`/messenger`)
    return (
        <div>
            
        </div>
    )
}
