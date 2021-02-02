import React, {useState, useContext} from 'react'
import at from "../images/at.png"
import Proxy from "../context/Proxy.js"
import { useAlert } from 'react-alert'

export const Register = () => {
    const proxy = useContext(Proxy);
    const alert = useAlert()
    let marginRight = {
        marginRight:'30px'
    }
    let fontSize = {
        fontSize: '24px'
    }

    let [firstNameValidate, setFirstNameValidate] = useState(false);
    let [secondNameValidate, setSecondNameValidate] = useState(false);
    let [emailValidate, setEmailValidate] = useState(false);
    let [passwordValidate, setPasswordValidate] = useState(false);

    async function successRegister() {
        let response = await fetch(proxy+"/register", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                'email': document.getElementsByName("email")[0].value,
                'password': document.getElementsByName("password")[0].value,
                'first_name': document.getElementsByName("name")[0].value,
                'second_name': document.getElementsByName("surname")[0].value,
                
            })
        })
        let result = await response.json()
        if (result.status === "confirm") {
            alert.show("Лист-підтвердження надіслано на Ваш емейл")
            return true;
        } else if (result.status === "email") {
            alert.error("Введений емейл вже зайнятий")
        } else {
            alert.error("'Помилка сервера. Спробуйте пізніше'")
            return false 
        }       
    }

    function register() {
        if (checkForm())
            successRegister()
                .then((value) => {
                    console.log(value)
                });
        else {
            if (!firstNameValidate) {
                document.getElementsByName("name")[0].classList.add(('border_false_check'));
                setTimeout(() => {
                    document.getElementsByName("name")[0].classList.add(('border_false'));
                    document.getElementsByName("name")[0].classList.remove(('border_false_check'));     
                }, 500)
            }
            if (!secondNameValidate) {
                document.getElementsByName("surname")[0].classList.add(('border_false_check'));
                setTimeout(() => {
                    document.getElementsByName("surname")[0].classList.add(('border_false'));
                    document.getElementsByName("surname")[0].classList.remove(('border_false_check'));     
                }, 500)
            }
            if (!emailValidate) {
                document.getElementsByName("email")[0].classList.add(('border_false_check'));
                setTimeout(() => {
                    document.getElementsByName("email")[0].classList.add(('border_false'));
                    document.getElementsByName("email")[0].classList.remove(('border_false_check'));     
                }, 500)
            }
            if (!passwordValidate) {
                document.getElementsByName("password")[0].classList.add(('border_false_check'));
                setTimeout(() => {
                    document.getElementsByName("password")[0].classList.add(('border_false'));
                    document.getElementsByName("password")[0].classList.remove(('border_false_check'));     
                }, 500)
            }
        }
    }

    function checkForm() {
        if (firstNameValidate && secondNameValidate && emailValidate && passwordValidate) {
            return true;
        } else {
            return false
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

    function ValidateEmail(mail) {
        let regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (mail.target.value.length !== 0) {
            if(!regex.test(mail.target.value)) {
                mail.target.classList.add('border_false');
                mail.target.classList.remove('border_true');
                setEmailValidate(false)
            } else {
                mail.target.classList.remove('border_false');
                mail.target.classList.add('border_true');
                setEmailValidate(true)
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


    return (
        <>
            <form className="d-block mx-auto w-100 pb-4 mt-2" >
                <div className="d-flex">
                    <div className="form-group" style={marginRight}> 
                        <label htmlFor="name">
                            <h3>Ім'я</h3>
                        </label>
                        <input type="text" name="name" placeholder="Введіть ім'я" onChange={(e) => {ValidateName(e);}} style={fontSize} className="form-control " />
                    </div>
                    <div className="form-group"> 
                        <label htmlFor="surname">
                            <h3>Фамілія</h3>
                        </label>
                        <input type="text" name="surname" placeholder="Введіть фамілію" onChange={(e) => {ValidateName(e)}}  style={fontSize} className="form-control " />
                    </div>
                </div>
                <div>
                    <div className="form-group"> 
                        <label htmlFor="email">
                                <h3>Емейл</h3>
                        </label> 
                        <div className="input-group"> 
                        <input type="text" name="email" placeholder="Введіть емейл" onChange={(e) => {ValidateEmail(e)}} style={fontSize} className="form-control " required /> 
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
                        <input type="password" name="password" placeholder="Введіть пароль" onChange={(e) => {ValidatePassword(e)}} style={fontSize} className="form-control " />
                    </div>
                <button type="button" onClick={() => {register()}} className="subscribe btn btn-primary btn-block shadow-sm" style={fontSize}>Зареєструватися</button>
                </div>
            </form>
        </>
    )
}
