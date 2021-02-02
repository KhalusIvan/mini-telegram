import React, {useState, useEffect} from 'react'
import userImg from "../../images/userImg.png"
import doubleCheck from "../../images/double-check.png"
import check from "../../images/check.png"
import "../../style/chatItem.css"
import { useDispatch } from 'react-redux';
import $ from 'jquery'


export const ChatItem = (props) => {
    const dispatch = useDispatch();
    const [unreadCounter, setUnreadCounter] = useState(0);
    let titleFontSize = {
        fontSize: "20px"
    }
    let fontSize = {
        fontSize: "18px"
    }
    
    useEffect(() => {
        let w1 = $(".imageChatItem").width()
        let w2 = $(".imageChatItem").height()
        let w3 = w2 / 100 * 75;
        let leftValue = w3*100/w1;
        $(".imageOnline").css("left", leftValue + "%")
        let counter = 0;
        for (let i = chat.messaging.length - 1; i >= 0; i--) {
            if (chat.messaging[i].status === "unread" && chat.messaging[i].from === 'he')
                counter ++
            else 
                break;
        }
        setUnreadCounter(counter)
    }, [])
    window.addEventListener("resize", () => {
        let w1 = $(".imageChatItem").width()
        let w2 = $(".imageChatItem").height()
        let w3 = w2 / 100 * 75;
        let leftValue = w3*100/w1;
        $(".imageOnline").css("left", leftValue + "%")
    });
    let chat = props.chat
    let srcImg = chat.avatar === null ? userImg : URL.createObjectURL(new Blob([new Uint8Array(chat.avatar.data)]))
    let liHeight = window.innerHeight / 8 + 'px';
    let liHeightStyle = {
        height: liHeight,
        overflow:'hidden',
        whiteSpace:'nowrap',
    }
    function checkLast() {
        if(chat.messaging.length === 0) {
            return "null";
        }
        if (chat.messaging[chat.messaging.length - 1].from === "you")
            return true;
        else
            return false
    }
    function getData(dateIn) {
        let now = new Date()
        let date = new Date(dateIn)
        if (now.getFullYear() === date.getFullYear() && now.getMonth() === date.getMonth() && now.getDate() === date.getDate()) {
            let hour = date.getHours() > 9 ? date.getHours() : "0" + date.getHours();
            let min = date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes();
            return hour + ":" + min;
        }
        var daysBetween = Math.ceil(Math.abs(date.getTime() - now.getTime()) / (1000 * 3600 * 24));
        if (daysBetween < 6) {
            let days = ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"]
            return days[date.getDay()];
        }
        return date.getDate() + '.' + date.getMonth() + "." + date.getFullYear();
    }

    function UnreadCounter() {
        if (unreadCounter === 0) {
            return <div></div>
        }
        return <div style={{height:'28px', width:'28px'}} className="border rounded-circle bg-primary text-white d-table-cell text-center mr-2 ">
            {unreadCounter}
        </div>;
    }

    let widthText = unreadCounter === 0 ? '100%' : '85%';

    function choose(){
        dispatch({"type":'SET_DIALOG', dialog: chat, _id: chat._id}); 
        if(window.innerWidth < 576) {
            document.getElementById('leftSidebar').classList.add("d-none")
            document.getElementById('dialog_block').classList.remove("d-none")
        }
        
    }


    return (
        <>
            <li style={liHeightStyle} onClick={() => choose()} className="liElem d-flex p-1 justify-content-around align-items-center">
                
                <div id="imageChatItem" className=' ml-2 imageChatItem h-75 pt-100'>
                    <img id="imageImg" style={{borderRadius:'50%'}} className='h-100 pt-100 imageImg' alt="avatar" src={srcImg} />
                    {
                        chat.isOnline ? (
                            <div id="imageOnline" style={{borderRadius:'50%', width:'12px', height:"12px", backgroundColor:"#3bc229", bottom:"20%"}} 
                            className="position-relative imageOnline"></div>
                        ) : (
                            <div id="imageOnline" style={{borderRadius:'50%', width:'12px', height:"12px", backgroundColor:"#3bc229", bottom:"20%"}} 
                            className="position-relative imageOnline d-none"></div>    
                        )
                        
                    }
                </div>
                <div className="textChatItem h-100 p-1">
                    <div className="my-auto" style={fontSize}>
                        {
                            checkLast() !== 'null'? (
                                <>
                                <div className="d-flex justify-content-between mb-3">
                                    <div style={{overflow:'hidden', textOverflow:'ellipsis', fontSize: "20px", width:"60%"}} className="font-weight-bold">{chat.name}</div>
                                    {
                                        checkLast() ? (
                                            <div>
                                                {
                                                    chat.messaging[chat.messaging.length - 1].status === 'unread' ? (
                                                        <img className="mr-1" style={{height:'16px'}} alt='unread' src={check} />
                                                    ) : (
                                                        <img className="mr-1" style={{height:'16px'}}  alt='read' src={doubleCheck} />
                                                    )
                                                }
                                                {getData(chat.messaging[chat.messaging.length - 1].date)}
                                            </div>
                                        ) : (
                                            <div >
                                                {getData(chat.messaging[chat.messaging.length - 1].date)}
                                            </div>
                                        )
                                    }
                                </div>
                                
                                    {
                                        checkLast() ? (
                                            <div style={{overflow:'hidden', textOverflow:'ellipsis', width:'100%'}}>
                                                <span className="text-primary">Ви:</span>
                                                {
                                                    " " + chat.messaging[chat.messaging.length - 1].text
                                                }
                                            </div>
                                        ) : (                                                                                                                                                                                                                                                                                                                                                                                                                                              
                                            <div className="d-flex justify-content-between" >
                                                <div style={{overflow:'hidden', textOverflow:'ellipsis', width:widthText}}>
                                                {
                                                    chat.messaging[chat.messaging.length - 1].text
                                                }    
                                                </div>
                                                <div>
                                                    <UnreadCounter />
                                                </div>
                                            </div>
                                        )
                                    }
                                </>
                            ) : (
                                <div style={titleFontSize} className="font-weight-bold">{chat.name}</div>
                            )
                        }       
                    </div>
                </div>
            </li>
        </>
    )
}
