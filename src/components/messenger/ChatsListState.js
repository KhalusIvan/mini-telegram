import React from 'react'
import {connect} from 'react-redux'
import { ChatsList } from './ChatsList'

const ChatListState = (props) => {
    return (
        <div className="h-100">
            {
                <ChatsList chats={props.allDialogs} />
            }
        </div>
    )
}

function mapStateToProps(state) {
    return {
        allDialogs: state.allDialogs,
    }
}

export const ChatsListState = connect(mapStateToProps)(ChatListState);