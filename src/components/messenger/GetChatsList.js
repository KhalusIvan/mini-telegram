import React, { useContext } from 'react'
import { useParams } from 'react-router-dom'
import Proxy from "../../context/Proxy.js"
import { ChatsListState } from './ChatsListState'
import Socket from "../../context/Socket.js"
import { useDispatch } from 'react-redux';

export const GetChatsList = (props) => {
  const proxy = useContext(Proxy);
  const dispatch = useDispatch();
  const socket = useContext(Socket)

  const resource = fetchProfileData();

  function Chats() {
    const chat = resource.chat.read();
    dispatch({"type":'SET_ALL_DIALOGS', allDialogs: chat})
    socket.emit("addEmail", props.user.email)   
    return <ChatsListState />
  }

  function fetchProfileData() {
    let chatPromise = CreateList();
    return {
      chat: wrapPromise(chatPromise),
    };
  }

  function wrapPromise(promise) {
    let status = "pending";
    let result;
    let suspender = promise.then(
      r => {
        status = "success";
        result = r;
      },
      e => {
        status = "error";
        result = e;
      }
    );
    return {
      read() {
        if (status === "pending") {
          throw suspender;
        } else if (status === "error") {
          throw result;
        } else if (status === "success") {
          return result;
        }
      }
    };
  }

  async function CreateList() {
    let chatsList = await Promise.all(props.user.chatList.map(async (chat) => {
      let response = fetch(proxy + "/getChat", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        }, body: JSON.stringify({
          'chatTitle': chat
        })
      })
      let res = (await response).json();
      return await res;
    }))
    return await chatsList;
  }

  return (
    <Chats />
  )
}
