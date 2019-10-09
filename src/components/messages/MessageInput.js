import React, { Component } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap'

export default class MessageInput extends Component {

	constructor(props) {
		super(props);

		this.state = {
			message: "",
			isTyping: false
		};

	}

	handleSubmit = (e) => {
		e.preventDefault()
		this.sendMessage()
		this.setState({ message: "" })
	}

	sendMessage = () => {
		this.props.sendMessage(this.state.message)

	}

	componentWillUnmount() {
		this.stopCheckingTyping()
	}

	sendTyping = () => {
		this.lastUpdateTime = Date.now()
		if (!this.state.isTyping) {
			this.setState({ isTyping: true })
			this.props.sendTyping(true)
			this.startCheckingTyping()
		}
	}

	/*
		Listener para revisar cada 3 milesimas desegundo si algún usuario está escribiendo
	*/
	startCheckingTyping = () => {
		console.log("Escribiendo...");
		this.typingInterval = setInterval(() => {
			if ((Date.now() - this.lastUpdateTime) > 300) {
				this.setState({ isTyping: false })
				this.stopCheckingTyping()
			}
		}, 300)
	}

	/*
		Cuando el usuario termina de escribir, limpia el renderizado/mensaje
	*/
	stopCheckingTyping = () => {
		if (this.typingInterval) {
			clearInterval(this.typingInterval)
			this.props.sendTyping(false)
		}
	}


	render() {
		const { message } = this.state
		return (
			<div className="message-input" >
				<Form onSubmit={this.handleSubmit} >
					<Row>
						<Col sm="5" md="10">
							<Form.Control
								id="message"
								ref={"messageinput"}
								type="text"
								size="lg"
								value={message}
								autoComplete={'off'}
								placeholder="Mensaje"
								onKeyUp={e => { e.keyCode !== 13 && this.sendTyping() }}
								onChange={
									({ target }) => {
										this.setState({ message: target.value })
									}
								}
							/>
						</Col>
						<Col sm="5" md="1">
							<Button
								disabled={message.length < 1}
								type="submit"
								variant="success"
								size="lg"
							> Enviar </Button>
						</Col>
					</Row>
				</Form>
			</div>
		);
	}
}
