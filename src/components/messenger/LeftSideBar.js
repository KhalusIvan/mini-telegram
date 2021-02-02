import React, {useContext} from 'react'
import "../../style/leftSideBar.css"
import { GetChatsList } from './GetChatsList';
import {PersonalInfo} from './PersonalInfo'
import Proxy from "../../context/Proxy.js"
import Socket from "../../context/Socket.js"
import { AddChatButton } from './AddChatButton.js';

export const LeftSideBar = () => {
    const proxy = useContext(Proxy);
    const socket = useContext(Socket)
    const resource = fetchProfileData();
    function ProfileDetails() {
        const user = resource.user.read();      
        return <> 
          <GetChatsList user={user} />
          <PersonalInfo user={user} />
          <AddChatButton user={user}/>
        </> ;
    }

    function fetchProfileData() {
        let userPromise = fetchUser();
        return {
          user: wrapPromise(userPromise),
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
    
    async function fetchUser() {
        let response = fetch(proxy+"/getUser", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        })
        let res = (await response).json();
        return await res;
    }
    
    return (
        <div id="leftSidebar" className="col-sm-5 col-md-4 col-lg-4 col-xl-3 h-100 bg-primary p-0 fullField">
            <ProfileDetails />
        </div>
    )
}



