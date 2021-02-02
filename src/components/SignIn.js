import React, {useState, useContext} from 'react'
import at from "../images/at.png"
import "../style/signIn.css"
import Proxy from "../context/Proxy.js"
import {useHistory} from 'react-router-dom'
import { useAlert } from 'react-alert'

export const SignIn = () => {
    const alert = useAlert()
    let history = useHistory();
    const proxy = useContext(Proxy);
    const [forgetEmail, setForgetEmail] = useState(false);
    let fontSize = {
        fontSize: '24px'
    }

    async function successSignIn() {
        let response = await fetch(proxy+"/signIn", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                'email': document.getElementsByName("email")[0].value,
                'password': document.getElementsByName("password")[0].value 
            })
        })
        let result = await response.json()
        if (result.status === "ok") {
            localStorage.setItem("token", result.token);
            history.push(`/messenger`)
            return true;
        } else if (result.status === "confirm") {
            alert.info('Підтвердіть емейл')
            return false  
        } else if (result.status === "not found" || result.status === "error") {
            alert.error("Невірний емейл або пароль")
            return false  
        } else {
            alert.error('Помилка сервера. Спробуйте пізніше')
            return false
        }    
    }

    async function resetPassword() {
        let response = await fetch(proxy+"/resetPassword", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                'email': document.getElementsByName("email")[0].value,
            })
        })
        let result = await response.json()
        if (result.status === "ok") {
            alert.info("Новий пароль відправлено на Вашу пошту")
            return true;
        } else {
            console.log(result.status.response)
            alert.error('Помилка сервера. Спробуйте пізніше ')
            return false
        }    
    }

    function signIn() {
        successSignIn()
            .then((value) => {
            });
    }

    return (
        <div>
            {forgetEmail === false ? (
                <div>
                    <form className="d-block mx-auto w-100" style={{marginTop:'20px'}}>
                        <div className="form-group"> 
                            <label htmlFor="email">
                                    <h3>Емейл</h3>
                            </label> 
                            <div className="input-group"> 
                            <input type="text" name="email" placeholder="Введіть емейл" style={fontSize} className="form-control " /> 
                                <div className="input-group-append"> 
                                    <span className="input-group-text text-muted"> 
                                        <img src={at} alt="собака" />
                                    </span> 
                                </div>
                            </div>
                        </div>
                        <div className="form-group"> 
                            <label htmlFor="password">
                                <h3>Пароль</h3>
                            </label>
                            <input type="password" name="password" placeholder="Введіть пароль" style={fontSize} className="form-control " />
                        </div>
                        <button type="button" onClick={() => {setForgetEmail(true)}}  className="forgetPassword">Забули пароль?</button>
                        <button type="button" onClick={() => {signIn()}} className="subscribe btn btn-primary btn-block shadow-sm" style={fontSize}>Ввійти</button>
                    </form>
                </div>
            ) : (
                <div className="pb-5">
                    <form className="d-block mx-auto w-100" style={{marginTop:'20px'}}>
                        <div className="form-group mt-5"> 
                            <label htmlFor="email">
                                    <h3>Емейл</h3>
                            </label> 
                            <div className="input-group "> 
                            <input type="text" name="email" placeholder="Введіть емейл" style={fontSize} className="form-control " required /> 
                                <div className="input-group-append"> 
                                    <span className="input-group-text text-muted"> 
                                        <img src={at} alt="собака" />
                                    </span> 
                                </div>
                            </div>
                        </div>
                        <button type="button" onClick={() => {resetPassword()}} className=" mt-5 subscribe btn btn-primary btn-block shadow-sm" style={fontSize}>Відправити новий пароль</button>
                    </form>
                </div>
            )}
        </div>
        
        
    )
}
