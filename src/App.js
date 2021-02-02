import React, {useState} from 'react';
import {Route, Switch, useHistory} from "react-router-dom";
import { Authorization } from './components/Authorization';
import { Confirm } from './components/Confirm';
import { Messenger } from './components/messenger/Messenger';
import Proxy from "./context/Proxy.js"
import Socket from "./context/Socket.js"
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'

function App() { 
  let history = useHistory();
  let token = localStorage.getItem('token')
  if (token) (
    history.push(`/messenger`)
  )
  const options = {
    position: positions.BOTTOM_CENTER,
    timeout: 3000,
    offset: '0px',
    containerStyle: {
      zIndex: 10000000000,
      backgrounColor: "blue"
    },
    transition: transitions.FADE
  }
  const io = require('socket.io-client');
  const socket = io("https://chatapp-backend-telegram.herokuapp.com", { transport : ['websocket'] })
  return (
    <AlertProvider template={AlertTemplate} {...options}>
      <Proxy.Provider value="https://chatapp-backend-telegram.herokuapp.com">
        <Socket.Provider value={socket}>
          <Switch>
            <Route exact path='/' component={Authorization}/>
            <Route path='/messenger' component={Messenger}/>
            <Route path='/confirm/:token' component={Confirm}/>
          </Switch>
        </Socket.Provider>
      </Proxy.Provider>
    </AlertProvider>
  );
}

export default App;
