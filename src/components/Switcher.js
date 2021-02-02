import React from 'react'
import "../style/switcher.css"

export const Switcher = (props) => {
    let styleBlock = { width: '100%'};
    let font = window.innerWidth < 450 ? '22px' : window.innerWidth < 576? '26px' : '30px';
    let fontSize = {
        fontSize:font
    }
    //console.log(document.getElementById("authWindow").clientWidth)
    return (
        <div className="d-block mx-auto col-11" style={styleBlock}>
            <label className="label w-100">
                <div className="toggle w-100">
                    <input className="toggle-state" type="checkbox" onClick={() => {props.setSignIn(!props.signIn)}} name="check" value="check" />
                    <div className="indicator"></div>
                    <div style={fontSize} className="indicatorSignIn">Вхід</div>
                    <div style={fontSize} className="indicatorRegister">Регістрація</div>
                </div>
            </label>         
        </div>
    )
}
