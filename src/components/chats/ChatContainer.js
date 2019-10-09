import React, { Component } from 'react';
import SideBar from '../sidebar/SideBar'
import {
	COMMUNITY_CHAT, MESSAGE_SENT, MESSAGE_RECIEVED, TYPING,
	USER_CONNECTED, USER_DISCONNECTED
} from '../../Events'
import ChatHeading from './ChatHeading'
import Messages from '../messages/Messages'
import MessageInput from '../messages/MessageInput'
import { values } from 'lodash'

export default class ChatContainer extends Component {
	constructor(props) {
		super(props);

		this.state = {
			chats: [],
			users: [],
			activeChat: null
		};
	}

	/* Inicializar el socket al cargar el DOM */
	componentDidMount() {
		const { socket } = this.props
		this.initSocket(socket)
	}

	/* Cerrar el hilo del socket por cada usuario que se desconecte */
	componentWillUnount() {
		const { socket } = this.props
		socket.off(USER_CONNECTED)
		socket.off(USER_DISCONNECTED)
	}

	
	initSocket(socket) {
		socket.emit(COMMUNITY_CHAT, this.resetChat)
		socket.on('connect', () => {
			socket.emit(COMMUNITY_CHAT, this.resetChat)
		})
		socket.on(USER_CONNECTED, (users) => {
			this.setState({ users: values(users) })
		})

		socket.on(USER_DISCONNECTED, (users) => {
			this.setState({ users: values(users) })
		})
	}

	/*
		Reinicia el chat para las nuevas conexiones
	*/
	resetChat = (chat) => {
		return this.addChat(chat, true)
	}

	/*
		Agrega cada chat a la caja de chats, si es nueva conexion entonces reset es verdadero y
		muestra la caja vacía.
		Esta funcion muestra el mensaje o inidca cuando un usuario está escribiendo el mensaje
	*/
	addChat = (chat, reset) => {
		const { socket } = this.props
		const { chats } = this.state

		const newChats = reset ? [chat] : [...chats, chat]
		this.setState({ chats: newChats, activeChat: reset ? chat : this.state.activeChat })

		const messageEvent = `${MESSAGE_RECIEVED}-${chat.id}`
		const typingEvent = `${TYPING}-${chat.id}`

		socket.on(typingEvent, this.updateTypingInChat(chat.id))
		socket.on(messageEvent, this.addMessageToChat(chat.id))
	}

	/*
		Funcion que regresa cada mensaje del chat con el ID de quien lo escribió
	*/
	addMessageToChat = (chatId) => {
		return message => {
			const { chats } = this.state
			let newChats = chats.map((chat) => {
				if (chat.id === chatId)
					chat.messages.push(message)
				return chat
			})

			this.setState({ chats: newChats })
		}
	}

	/*
		Función que indica quien esta escribiendo un mensaje
	*/
	updateTypingInChat = (chatId) => {
		return ({ isTyping, user }) => {
			if (user !== this.props.user.name) {

				const { chats } = this.state

				let newChats = chats.map((chat) => {
					if (chat.id === chatId) {
						if (isTyping && !chat.typingUsers.includes(user)) {
							chat.typingUsers.push(user)
						} else if (!isTyping && chat.typingUsers.includes(user)) {
							chat.typingUsers = chat.typingUsers.filter(u => u !== user)
						}
					}
					return chat
				})
				this.setState({ chats: newChats })
			}
		}
	}

	/*
		Agrega el mensaje al servidor para renderizarlo
	*/
	sendMessage = (chatId, message) => {
		const { socket } = this.props
		socket.emit(MESSAGE_SENT, { chatId, message })
	}

	/*
		Agrega el estado de ecritura al servidor para renderizarlo
	*/
	sendTyping = (chatId, isTyping) => {
		const { socket } = this.props
		socket.emit(TYPING, { chatId, isTyping })
	}

	setActiveChat = (activeChat) => {
		this.setState({ activeChat })
	}
	render() {
		const { user, logout } = this.props
		const { chats, activeChat, users } = this.state
		return (
			<div className="container">
				<SideBar
					logout={logout}
					chats={chats}
					user={user}
					users={users}
					activeChat={activeChat}
					setActiveChat={this.setActiveChat}
				/>
				<div className="chat-room-container">
					{
						activeChat !== null ? (

							<div className="chat-room">
								<ChatHeading name={user.name} logout={logout} />
								<Messages
									messages={activeChat.messages}
									user={user}
									typingUsers={activeChat.typingUsers}
								/>
								<MessageInput
									sendMessage={
										(message) => {
											this.sendMessage(activeChat.id, message)
										}
									}
									sendTyping={
										(isTyping) => {
											this.sendTyping(activeChat.id, isTyping)
										}
									}
								/>

							</div>
						) :
							<div className="chat-room choose">
								<h3>Chat vacío</h3>
							</div>
					}
				</div>

			</div>
		);
	}
}
