import React, { Component } from 'react';
import io from 'socket.io-client'
import { USER_CONNECTED, LOGOUT } from '../Events'
import LoginForm from './LoginForm'
import ChatContainer from './chats/ChatContainer'

const socketUrl = "/"
//const socketUrl = "http://localhost:3231"
export default class Layout extends Component {
	
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	socket:null,
	  	user:null
	  };
	}

	componentWillMount() {
		this.initSocket()
	}

	/*
		Conexión que inicializa el socket
	*/
	initSocket = ()=>{
		const socket = io(socketUrl)

		socket.on('connect', ()=>{
			console.log("Conectado");
		})
		
		this.setState({socket})
	}

	/*
		Establece el id del usuario el el socket
	*/	
	setUser = (user)=>{
		const { socket } = this.state
		socket.emit(USER_CONNECTED, user);
		this.setState({user})
	}

	/*
		Limpua el estado del socket cuando el usuario se desconecta
	*/
	logout = ()=>{
		const { socket } = this.state
		socket.emit(LOGOUT)
		this.setState({user:null})

	}


	render() {
		const { socket, user } = this.state
		return (
			<div className="container">
				{
					!user ?	
					<LoginForm socket={socket} setUser={this.setUser} />
					:
					<ChatContainer socket={socket} user={user} logout={this.logout}/>
				}
			</div>
		);
	}
}
