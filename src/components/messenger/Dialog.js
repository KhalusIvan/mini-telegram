import React, {useContext, useEffect, useState} from 'react'
import userImg from "../../images/userImg.png"
import doubleCheck from "../../images/double-check.png"
import send from "../../images/send.png"
import backArrow from "../../images/back-arrow.png"
import check from "../../images/check.png"
import Socket from "../../context/Socket.js"
import Proxy from "../../context/Proxy.js"
import { useDispatch } from 'react-redux';
import '../../style/dialog.css';
import { useAlert } from 'react-alert'
import $ from "jquery"

export const Dialog = (props) => {
    const alert = useAlert()
    const socket = useContext(Socket)
    const dispatch = useDispatch();
    const proxy = useContext(Proxy);
    let dialog = props.dialog;
    let counter = 0;
    useEffect(() => {
        var element = document.getElementById("messaging_block");
        element.scrollTop = element.scrollHeight;
    })
    useEffect(() => {
        let el = $( "#buttonBack" );
        let elH = el.height();
        el.width(elH);
    }, [])
    function MessagingView() {
        for (let i = dialog.messaging.length - 1; i >= 0; i--) {
            if (dialog.messaging[i].status === "unread" && dialog.messaging[i].from === 'he') 
                counter ++;
            else 
                break;
        }
        if (counter > 0) {
            fetch(proxy+"/readMessage", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
                body: JSON.stringify({ 
                    'dialog': dialog.firstEmail > dialog.secondEmail ? dialog.firstEmail+"To"+dialog.secondEmail : dialog.secondEmail+"To"+dialog.firstEmail,
                    'counter': counter,
                    "length": dialog.messaging.length
                })
            })
            console.log("--------------")
            dispatch({"type":'READ_MESSAGE', _id:dialog._id})  
            socket.emit('readMessage', {to:dialog.secondEmail, _id:dialog._id, dialog:dialog})
            
        }
        let messageView = dialog.messaging.map((message, index) => {
            let date = new Date(message.date)
            let hour = date.getHours() > 9 ? date.getHours() : "0" + date.getHours();
            let min = date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes();
            let dateView = hour + ":" + min;
            if (message.from === 'you') {
                return <div key={message.text + date.getHours() + date.getMinutes() + date.getSeconds()} className="text-right">
                    <div style={{border:"1px solid darkblue", borderRadius:"5px", maxWidth:"60%"}} className="m-1 mr-2 d-inline-block text-left">
                        <div style={{wordWrap: "break-word"}} className="p-2 d-block">
                            {message.text}
                            <span className="float-right">
                                <sub style={{marginLeft:"auto"}} className="pl-2">
                                    {
                                        dateView
                                    }
                                </sub>
                                <sub className="ml-1 mr-0"> 
                                    {
                                        message.status === 'unread' ? (
                                            <img style={{height:'16px'}} alt='unread' src={check} />
                                        ) : (
                                            <img style={{height:'16px'}}  alt='read' src={doubleCheck} />
                                        )
                                    }
                                </sub>
                            </span>
                        </div> 
                    </div>
                </div>
                
            } else {
                return<div key={message.text + date.getHours() + date.getMinutes() + date.getSeconds()} className="text-left">
                    {
                        (index === dialog.messaging.length - counter) ? (
                            <div className="w-100 mt-1 mb-1 bg-light text-center text-primary align-middle" style ={{ height:'40px'}}>
                                <span style={{lineHeight: "40px"}}>Нові Повідомлення</span>
                            </div>
                        ) : (
                            null
                        )
                    }
                    <div style={{border:"1px solid darkblue", borderRadius:"5px", maxWidth:"60%"}} className="m-1 ml-2 d-inline-block">
                        <div style={{wordWrap: "break-word"}} className="p-2 d-inline-block">
                            {message.text}
                            <sub className="ml-2 pt-3 float-right">
                                {
                                    dateView
                                }
                            </sub>
                        </div>  
                    </div>
                </div>
                 
            }
        })
        console.log()
        return <div style={{bottom:'0%', maxHeight:window.innerHeight / 100 * 83}} className="position-absolute col-12">{ messageView}</div>;
    }

    

    async function sendMessage() {
        if(document.getElementsByName("sendMessage")[0].value.length === 0) {
            alert.error("Введіть повідомлення");
            return
        }
        let response = await fetch(proxy+"/sendMessage", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
            body: JSON.stringify({ 
                'dialog': dialog.firstEmail > dialog.secondEmail ? dialog.firstEmail+"To"+dialog.secondEmail : dialog.secondEmail+"To"+dialog.firstEmail,
                'message': {
                    'date': new Date(),
                    'from': dialog.firstEmail,
                    "status": 'unread',
                    'text': document.getElementsByName("sendMessage")[0].value,
                } 
            })
        })
        let result = await response.json()
        if (result.status === "ok") {
            var element = document.getElementById("messaging_block");
            element.scrollTop = element.scrollHeight;
            let messageSended = {
                date: new Date(),
                from: 'you',
                status: 'unread',
                text: document.getElementsByName("sendMessage")[0].value
            }
            dialog.messaging.push(messageSended) 
            socket.emit('writeMessage', {to:dialog.secondEmail, _id:dialog._id, message:messageSended, dialog:dialog})
            document.getElementsByName("sendMessage")[0].value = '';
            //console.log(dialog)
            dispatch({"type":'SET_DIALOG', _id:dialog._id, message:messageSended, dialog:dialog})
            return true;
        } else {
            alert.error('Помилка сервера. Спробуйте пізніше')
            return false 
        }     
    }

    function toSidebar() {
        document.getElementById('leftSidebar').classList.remove("d-none")
        document.getElementById('dialog_block').classList.remove("d-none")
    }

    return (
        <div className="p-0 h-100 d-flex flex-column justify-content-between">
            <div style={{height:"10%"}} className="d-flex w-100 bg-primary align-items-center pl-5">
                <button id="buttonBack" className="d-sm-none h-75 mr-4 buttonBack p-0" onClick={() => toSidebar()}>
                    <img className='h-75 p-2' alt="back" src={backArrow} />
                </button>
                <img style={{borderRadius:'50%'}} className='h-75' alt="avatar" src={dialog.avatar === null ? userImg : URL.createObjectURL(new Blob([new Uint8Array(dialog.avatar.data)]))} />
                <div style={{fontSize:'24px'}} className="ml-3">
                    {dialog.name}
                </div>
            </div>
            <div style={{height:"83%"}} className="pr-2">
                <div style={{overflowY:"scroll"}} id="messaging_block" className="h-100 w-100 position-relative pb-0">
                    <MessagingView />
                </div>
            </div>
            <form style={{height:"5%"}} className="form-group m-0 d-block mb-3">
                <div style={{width: "99%"}} className="input-group mx-auto">
                    <input autoComplete='off' style={{fontSize:'24px', borderRight:'none'}} type="text" name="sendMessage" className="form-control" placeholder='Ваше повідомлення...' require='true' />
                    <div className="input-group-append">
                        <button className="button_send" onClick={(e)=>{e.preventDefault();sendMessage()}}>
                            <img style={{height:'20px'}} alt='unread' src={send} />
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}
