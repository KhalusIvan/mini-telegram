import React, {useContext, useEffect} from 'react'
import {connect} from 'react-redux'
import { useHistory } from 'react-router-dom';
import Socket from "../../context/Socket.js"
import { useDispatch } from 'react-redux';
import { Dialog } from './Dialog'

const DialogField = (props) => {
    const dispatch = useDispatch();
    let history = useHistory()
    const socket = useContext(Socket)
    let dialogs = props.dialog;
    useEffect(() => {
        socket.on('startOnline', clients => {
            let emailArr = [];
            for(let client of clients.clients) {
                for(let em in client) {
                    if (client[em] !== null)
                        emailArr.push(client[em]);
                }
            }
            dispatch({"type":'START_ONLINE', emails:emailArr})
          }) 
        socket.on('recieveMessage', message => {    
            message.message.from = "he"
            dispatch({"type":'NEW_MESSAGE', _id:message._id, message:message.message, dialog:message.dialog})     
        }) 
        socket.on('recieveReadMessage', message => {   
            dispatch({"type":'READ_MESSAGE', _id:message._id, message:message.message, dialog:message.dialog})     
        }) 
    }, [])
    
        
    let  centering = {
        top: '50%',
        left: '50%',
        transform: "translate(-50%, -50%)",
        fontSize:'24px'
    }
    return (
        <div id="dialog_block" className="col-sm-7 col-md-8 col-lg-8 col-xl-9 h-100 p-0">
            {
                props.dialog ? (
                    <Dialog dialog={dialogs} />
                ): (
                    <div style={centering} className="d-block position-absolute"> Виберіть діалог для розмови </div>
                )
            }
        </div>
    )
}

function mapStateToProps(state) {
    return {
        dialog: state.dialog,
        allDialogs: state.allDialogs,
    }
}

export const DialogState = connect(mapStateToProps)(DialogField);