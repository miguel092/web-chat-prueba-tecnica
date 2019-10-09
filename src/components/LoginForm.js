import React, { Component } from 'react';
import { VERIFY_USER } from '../Events'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button } from 'react-bootstrap';

export default class LoginForm extends Component {
	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.state = {
			nickname: "",
			error: ""
		};
	}

	/* Función que valida que el nombre de usuario no se repita */
	setUser = ({ user, isUser }) => {
		if (isUser) {
			this.setError("El nombre de usuario ya existe")
		} else {
			this.setError("")
			this.props.setUser(user)
		}
	}

	handleSubmit = (event) => {
		event.preventDefault()
		
		const { socket } = this.props
		const { nickname } = this.state
		
		socket.emit(VERIFY_USER, nickname, this.setUser)	
	}

	handleChange = (e) => {
		this.setState({ nickname: e.target.value })
	}

	setError = (error) => {
		this.setState({ error })
	}

	render() {
		const { error } = this.state
		return (
			<div className="login-container">
				<h2 className="header">Web-Chat: Bienvenido</h2>
				<Form onSubmit={this.handleSubmit} onTouchStart={this.handleSubmit} className="login-form">
					<Form.Group controlId="formLogin">
						<Form.Label>Nombre de usuario</Form.Label>
						<Form.Control type="text"
							size="lg"
							onChange={this.handleChange}
							id="nickname"
							required />
					</Form.Group>
					<div className="error">{error ? error : null}</div>
					
					<Button type="submit" variant="primary" className="btn-login">Ingresar</Button>
				</Form>
			</div>

		);
	}
}
