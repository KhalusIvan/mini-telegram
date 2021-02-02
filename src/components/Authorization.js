import React, {useState} from 'react'
import '../style/authBg.css'
import logo from "../images/logo.png"
import { SignIn } from './SignIn'
import { Switcher } from './Switcher'
import { Register } from './Register'

export const Authorization = () => {
    const [signIn, setSignIn] = useState(true);
    let styleTop={
        marginTop:"3%",
        width:"70%"
    }
    let imgWidth={
        width:'70%'
    }
    let topPercent = signIn ? '50%':'49%';
    return (
        <div className="bgFullScreen bg-primary position-relative">
            <div style={{'height':"90%"}} id="authWindow" className="border-1 border-warning col-11 col-sm-10 col-md-8 col-lg-6 col-xl-5 w-sm-100 m-auto bg-white position-absolute">
                <div style={{top:topPercent,  transform: 'translateY(-50%)'}} className="w-100 position-relative ">
                    <img style={signIn?imgWidth:styleTop} className="d-block mx-auto mb-3" src={logo} alt="logo" />
                    <Switcher signIn={signIn} setSignIn={setSignIn} />
                    {signIn ? <SignIn /> : <Register />}
                </div>
            </div>
        </div>
    )
}
