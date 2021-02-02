import React, {useContext, useEffect, useState} from 'react'
import "../../style/addChatButton.css"
import add_chat from "../../images/add_chat.png"
import add from "../../images/add.png"
import Proxy from "../../context/Proxy.js"
import $ from "jquery"
import userImg from "../../images/userImg.png"
import '../../style/chatItem.css'
import { useDispatch } from 'react-redux';

export const AddChatButton = (props) => {
    const proxy = useContext(Proxy);
    let [users, setUsers] = useState([])
    const dispatch = useDispatch();

    useEffect(() => {
        $('#exampleModal_addChat').on('shown.bs.modal', function () {
            searchUsers();
        })    
    }, [])

    async function searchUsers() {
        console.log(props.user)
        let names = props.user.chatList.map((el) => {
            let withoutEmail = el.replace(props.user.email, "")
            return(withoutEmail.replace("To", ""))
        })
        console.log(names)
        let response = await fetch(proxy+"/getUsers", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
            body: JSON.stringify({ 
                current: names
            })
        })
        let result = await response.json()
        if (result.status === "ok") {
            setUsers(result.users)
            return result;
        } else {
            return false 
        }  
    }

    async function addChat(email) {
        let response = await fetch(proxy+"/addChat", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
            body: JSON.stringify({ 
                'email': email,
            })
        })
        let result = await response.json()
        if (result.status === "ok") {
            let response1 = await fetch(proxy+"/getChat", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
                body: JSON.stringify({ 
                    'chatTitle': result.dialog,
                })
            })
            let result1 = await response1.json()
            if (result1.chatReturn !== null) {
                dispatch({"type":'ADD_CHAT', allDialogs: result1, dialog: result1})
                $('#exampleModal_addChat').modal('hide')
                return result;
            } else {
                return false 
            }  
        } else {
            return false 
        }  
    }

    function UserList() {
        if (users.length !== 0) {
            let usersLi = users.map((user) => {
                return <li key={user._id} className="liElem d-flex p-1 justify-content-around align-items-center" style={{height:window.innerHeight/10}}>

                    <img style={{borderRadius:'50%'}} className='h-75' alt="avatar" src={user.avatar === null ? userImg : URL.createObjectURL(new Blob([new Uint8Array(user.avatar.data)]))} />
                    <div className="h-100 p-1">
                        <div className="my-auto pl-4" style={{fontSize:"20px"}}>
                            <div style={{fontSize:"20px"}} className="font-weight-bold">{user.first_name + " " + user.second_name}</div>
                            <div style={{fontSize:"16px"}}>{user.email}</div>  
                        </div>
                    </div>
                    <button className='button_add_chat bg-transparent h-75 p-1' onClick={()=>{addChat(user.email)}}>
                        <img className='h-100' alt="avatar" src={add} />
                    </button>

                </li>
            })
            return <>{usersLi}</>
        }
        return <div></div>  
    }

    return (
        <>
            <button className="btn btn-primary btn-circle btn_position" data-toggle="modal" data-target="#exampleModal_addChat">
                <img src={add_chat} alt={add_chat} className="w-75 h-75" />
            </button>
            <div className="modal fade" id="exampleModal_addChat" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel_addChat" aria-hidden="true">
                <div style={{top:"50%", transform:'translateY(-50%)'}} className="modal-dialog my-auto">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel_addChat">Створити чат</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <input autoComplete="off" type="text" name="search" onChange={()=>{}}  style={{'fontSize':'24px'}} className="w-100" />
                            <hr />
                            <ul className="list-unstyled w-auto">
                                <UserList />
                            </ul>     
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрити</button>
                        </div>
                    </div>
                </div>
            </div> 
    </>
    )
}
