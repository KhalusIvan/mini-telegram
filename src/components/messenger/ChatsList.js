import React, {useEffect, useContext} from 'react'
import { ChatItem } from './ChatItem'
import Socket from "../../context/Socket.js"
import { useDispatch } from 'react-redux';
import { LeftSideBarView } from './LeftSideBarView'

export const ChatsList = (props) => {
    const socket = useContext(Socket)
    const dispatch = useDispatch();
    let chat = props.chats;
  useEffect(() => {
    socket.on('newOnline', user => {    
      dispatch({"type":'NEW_ONLINE', email:user.email})
    }) 
    socket.on('leaveOnline', user => {    
      dispatch({"type":'LEAVE_ONLINE', email:user.email})
    }) 
    
  }, [])
  function Chats() {
    if (chat.length > 1) {
      chat.sort((a, b) => {
        if (a.messaging[a.messaging.length - 1] === undefined)
          return -1;
        if (b.messaging[b.messaging.length - 1] === undefined)
          return 1;
        let aDate = new Date(a.messaging[a.messaging.length - 1].date);
        let bDate = new Date(b.messaging[b.messaging.length - 1].date);
        if (aDate < bDate)
          return 1;
        else if (aDate > bDate)
          return -1;
        return 0;
      })
    }
    let chatListCreated = chat.map((oneChat) => {
      return <ChatItem key={oneChat.name} chat={oneChat} />
    })
    return <LeftSideBarView chats={chatListCreated} />
  }

  return (
    <Chats />
  )
}
