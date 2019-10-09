/* Barra lateral izquierda
	Muestra los usuarios que están conectados
*/
import React, { Component } from 'react';
import { SideBarOption } from './SideBarOption'
import { get, last, differenceBy } from 'lodash'

export default class SideBar extends Component {

	render() {
		const { chats, activeChat, user, setActiveChat, users } = this.props
		return (
			<div id="side-bar">
				<div className="heading">
					<div className="app-name">Web-Chat</div>
				</div>

				<div
					className="users"
					ref='users'
					onClick={(e) => { (e.target === this.refs.user) && setActiveChat(null) }}>

					{
						chats.map((chat) => {
							if (chat.name) {								
								return (
									<SideBarOption
										key={chat.id}
										name={chat.name}
										lastMessage={get(last(chat.messages), 'message', '')}
										active={activeChat.id === chat.id}

									/>
								)
							}

							return null
						})
					}
					{
						differenceBy(users, [user], 'name').map((otherUser) => {
							return (
								<SideBarOption
									key={otherUser.id}
									name={otherUser.name}
									onClick={() => {
										this.addChatForUser(otherUser.name)
									}}
								/>
							)
						})
					}

				</div>
			</div>
		);

	}
}
