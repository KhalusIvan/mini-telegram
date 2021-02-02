import React, {Suspense, useContext, useEffect, useState} from 'react'
import { LeftSideBar } from './LeftSideBar.js';
import '../../style/authBg.css'
import { Spinner } from '../Spinner.js';
import { DialogState } from './DialogState.js';
import { useHistory } from 'react-router-dom';
import Proxy from "../../context/Proxy.js"
import Socket from "../../context/Socket.js"

export const Messenger = (props) => {
    let history = useHistory();
    const socket = useContext(Socket)
    const proxy = useContext(Proxy);

    async function checkUser() {
        if (localStorage.getItem('token') === null) {
            history.push(`/`)
            return false 
        }
        let response = await fetch(proxy+"/checkUser", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
            body: JSON.stringify({ 
            })
        })
        let result = await response.json()
        if (result.status === "ok") {
            //history.push(`/messenger/${}`)
            return true;
        } else {
            history.push(`/`)
            return false 
        }       
    }
    checkUser()

    return (
        <div className="bgFullScreen row">
            <Suspense fallback={<Spinner />}>
                <LeftSideBar />
                <DialogState />
            </Suspense>
        </div>
    )
}


  
