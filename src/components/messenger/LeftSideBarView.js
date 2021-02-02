import React, {useState,} from 'react'
import user from "../../images/user.png"

export const LeftSideBarView = (props) => {
    const [chats, setChats] = useState(props.chats);
    function newList(inp) {
        let filterChats;
        if (inp !== "") {
            filterChats = props.chats.map(chat => {
                if (chat.props.chat.name.toLowerCase().startsWith(inp.toLowerCase()))
                    return chat;
                return null
            })
        } else {
            filterChats = props.chats;
        }
        filterChats = filterChats.filter(function(x) {
            return x !== undefined && x !== null; 
        });
        if (filterChats.length > 1) {
            filterChats.sort((a,b) => {
                if(a.props.chat.messaging[a.props.chat.messaging.length - 1].date < 
                    b.props.chat.messaging[b.props.chat.messaging.length - 1].date)
                        return 1;
                else if(a.props.chat.messaging[a.props.chat.messaging.length - 1].date >
                    b.props.chat.messaging[b.props.chat.messaging.length - 1].date)
                    return -1;
                return 0;
            })
        }
        setChats(filterChats);
    }

    let width = {
        width: '100%',
        height: "auto",
        maxWidth: "100%"
    }

    let paddingTop = {
        paddingTop: "0%"
    }

    let fontSize = {
        fontSize: "24px",
        height: "70%"
    }
    return (
        <div className="h-100">
            <div className="d-flex justify-content-around align-items-center " style={paddingTop}>
                <button data-toggle="modal" data-target="#exampleModal" className="switchButton col-2 activeButton">
                    <img className="w-100 text-white" src={user} alt="user" style={width} />
                </button>
                <input autoComplete="off" onChange={(e) => newList(e.target.value)} type="text" name='search' placeholder="Пошук" className="col-9" style={fontSize} />
            </div>
            <div className="h-100 bg-white">
                <ul className="list-unstyled">
                    {chats}
                </ul>
            </div>
        </div>
    )
}
