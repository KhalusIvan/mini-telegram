import React, {useState, useContext, useEffect} from 'react'
import userImg from "../../images/userImg.png"
import chat from "../../images/chat.png"
import "../../style/personalInfo.css"
import { Cropping } from './Cropping'
import Proxy from "../../context/Proxy.js"
import Socket from "../../context/Socket.js"
import { useAlert } from 'react-alert'
import {useHistory} from 'react-router-dom'

export const PersonalInfo = (props) => {
    const alert = useAlert()
    const socket = useContext(Socket)
    const proxy = useContext(Proxy);
    let [isCropping, setIsCropping] = useState(null);
    let [firstData, setFirstData] = useState(null);
    let [userAva, setUserAva] = useState(props.user.avatar === undefined?props.user.avatar.data : null)
    let history = useHistory();
    const reader = new FileReader();
    let borderImg = {
        borderRadius: "50%",
        border: '2px solid darkblue',
        padding:"3px"
    } 
    useEffect(() => {
        if (document.getElementsByName("name")[0] && document.getElementsByName("name")[0].value.length === 0)
            document.getElementsByName("name")[0].value = props.user.first_name
        if (document.getElementsByName("surname")[0] && document.getElementsByName("surname")[0].value.length === 0)
            document.getElementsByName("surname")[0].value = props.user.second_name
    })
    useEffect(() => {
        if(!(typeof isCropping === 'string' || isCropping instanceof String) && isCropping) {
            changeAvatar()        
        }
    }, [isCropping])
    let fontSize = {
        fontSize: '17px'
    }
    let [firstNameValidate, setFirstNameValidate] = useState(null);
    let [secondNameValidate, setSecondNameValidate] = useState(null);
    let [passwordValidate, setPasswordValidate] = useState(null);

    async function changeAvatar() {
        let formData =  new FormData();
        formData.append("file", isCropping, "image.png");
        let avatar = formData
        let response = await fetch(proxy+"/updateAvatar", {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
            body: avatar
        })
        let result = await response.json()
        if (result.status === "ok") {
            setUserAva(await isCropping.arrayBuffer())
            alert.success("Аватар успішно змінено")
            return true;
        } else {
            alert.error("Помилка сервера. Спробуйте пізніше")
            return false 
        }
    }

    async function changeFirstName() {
        if (firstNameValidate === null) {
            alert.error("Змініть ім\'я")
        } else if (firstNameValidate) {
            let response = await fetch(proxy+"/updateFirstName", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
                body: JSON.stringify({ 
                    'first_name': document.getElementsByName("name")[0].value,                    
                })
            })
            let result = await response.json()
            if (result.status === "ok") {
                document.getElementsByName("name")[0].classList.remove('border_true');
                alert.success('Ім\'я успішно змінено')
                return true;
            } else {
                alert.error('Помилка сервера. Спробуйте пізніше')
                return false 
            }  
        } else {
            alert.error("Введено некоректні дані")
            document.getElementsByName("name")[0].classList.add(('border_false_check'));
                setTimeout(() => {
                    document.getElementsByName("name")[0].classList.add(('border_false'));
                    document.getElementsByName("name")[0].classList.remove(('border_false_check'));     
                }, 500)
        }
    }

    async function changeSecondName() {
        if (secondNameValidate === null) {
            alert.error("Змініть фамілію")
        } else if (secondNameValidate) {
            let response = await fetch(proxy+"/updateSecondName", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
                body: JSON.stringify({ 
                    'second_name': document.getElementsByName("surname")[0].value,                    
                })
            })
            let result = await response.json()
            if (result.status === "ok") {
                document.getElementsByName("surname")[0].classList.remove('border_true');
                alert.success('Фамілію успішно змінено')
                return true;
            } else {
                alert.error('Помилка сервера. Спробуйте пізніше')
                return false 
            }  
        } else {
            alert.error("Введено некоректні дані")
            document.getElementsByName("surname")[0].classList.add(('border_false_check'));
                setTimeout(() => {
                    document.getElementsByName("surname")[0].classList.add(('border_false'));
                    document.getElementsByName("surname")[0].classList.remove(('border_false_check'));     
                }, 500)
        }
    }

    async function changePassword() {
        if (passwordValidate === null) {
            alert.error("Змініть пароль")
        } else if (passwordValidate) {
            let response = await fetch(proxy+"/updatePassword", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
                body: JSON.stringify({ 
                    'old_password': document.getElementsByName("oldPassword")[0].value,                    
                    'new_password': document.getElementsByName("newPassword")[0].value,                    
                })
            })
            let result = await response.json()
            if (result.status === "ok") {
                document.getElementsByName("newPassword")[0].classList.remove('border_true');
                document.getElementsByName("oldPassword")[0].value = "";
                document.getElementsByName("newPassword")[0].value = "";
                alert.success('Пароль успішно змінено')
                return true;
            } else if (result.status === 'password') {
                alert.error('Старий пароль не вірний')
                document.getElementsByName("oldPassword")[0].classList.add(('border_false_check'));
                setTimeout(() => {
                    document.getElementsByName("oldPassword")[0].classList.remove(('border_false_check'));     
                }, 500)
                return true;
            } else {
                alert.error('Помилка сервера. Спробуйте пізніше')
                return false 
            }  
        } else {
            alert.error("Введено некоректні дані")
            document.getElementsByName("newPassword")[0].classList.add(('border_false_check'));
                setTimeout(() => {
                    document.getElementsByName("newPassword")[0].classList.add(('border_false'));
                    document.getElementsByName("newPassword")[0].classList.remove(('border_false_check'));     
                }, 500)
        }
    }

    function ValidateName(name) {
        let regex = /^[A-ZА-Я][a-zа-я]/;;
        if (name.target.value.length !== 0) {
            if(!regex.test(name.target.value) || name.target.value.length < 2 || name.target.value.length > 15) {
                name.target.classList.add('border_false');
                name.target.classList.remove('border_true');
                if (name.target.name === "name")
                    setFirstNameValidate(false);
                else if (name.target.name === "surname")
                    setSecondNameValidate(false)
            } else {
                name.target.classList.remove('border_false');
                name.target.classList.add('border_true');
                if (name.target.name === "name")
                    setFirstNameValidate(true);
                else if (name.target.name === "surname")
                    setSecondNameValidate(true)
            }
        }        
    }

    function ValidatePassword(pass) {
        if (pass.target.value.length !== 0) {
            if(pass.target.value.length < 6 || pass.target.value.length > 12) {
                pass.target.classList.add('border_false');
                pass.target.classList.remove('border_true');
                setPasswordValidate(false)

            } else {
                pass.target.classList.remove('border_false');
                pass.target.classList.add('border_true');
                setPasswordValidate(true)
            }
        }        
    }

    
    function toBase64 (file) {
        reader.onload = function() {
            setIsCropping(reader.result)
            setFirstData(reader.result)
          };
          reader.onerror = function() {
            console.log(reader.error);
          };
        reader.readAsDataURL(file.target.files[0]);
    }
    function logOut() {
        socket.emit("logout")
        localStorage.removeItem("token");
        history.push(`/`)
    }
    console.log(props.user.avatar)
    return (
        <div>
            <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    {
                        (!isCropping || isCropping !== firstData)? (
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="exampleModalLabel">Інформація</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="w-100 d-block">
                                            <img style={borderImg} alt="avatar" id="avatar" className="d-block mx-auto h-25 w-25" src={(props.user.avatar === null) ? userImg : URL.createObjectURL(new Blob([new Uint8Array(props.user.avatar.data)]))} />
                                            <input type="file" name="file" onChange={async (e) => toBase64(e)} id="file" className="inputfile" accept=".jpg, .jpeg, .png"/>
                                            <label htmlFor="file">Завантажити фото</label>
                                            <hr />
                                            <div className="form-group justify-content-around align-items-center "> 
                                                <input type="text" name="name" onChange={(e) => {ValidateName(e)}}  style={fontSize} className="form-control" />
                                                <button onClick={() => changeFirstName()} className="confirmButton">
                                                    Змінити ім'я
                                                </button>
                                            </div>
                                            <hr />
                                            <div className="form-group justify-content-around align-items-center "> 
                                                <input type="text" name="surname" onChange={(e) => {ValidateName(e)}}  style={fontSize} className="form-control" />
                                                <button onClick={() => changeSecondName()} className="confirmButton">
                                                    Змінити фамілію
                                                </button>
                                            </div>
                                            <hr />
                                            <div className="form-group justify-content-around align-items-center mb-0"> 
                                                <div className="d-flex justify-content-between">
                                                    <input type="password" name="oldPassword" style={{width:'47%', fontSize: '17px'}} className="form-control" placeholder="Старий пароль" />
                                                    <input type="password" name="newPassword" style={{width:'47%', fontSize: '17px'}} onChange={(e) => {ValidatePassword(e)}} className="form-control" placeholder="Новий пароль"/>
                                                </div>
                                                <button onClick={() => changePassword()} className="confirmButton">
                                                    Змінити пароль
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                    <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={() => logOut()}>Вийти</button>
                                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрити</button>
                                    </div> 
                                </div>
                            </div>  
                        ) : (
                            <Cropping setIsCropping={setIsCropping} toBase64Result={isCropping}/>
                        )
                    }
                
            </div>  
        </div>
    )
}
