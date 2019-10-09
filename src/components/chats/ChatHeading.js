/* Encabezado del Chat
	Muestra el nombre de usuario del lado Izquiero
	Muestra la opción de abandonar el chat del lado derecho
*/

import React, { Component } from 'react';
import MdEject from 'react-icons/lib/md/eject'
import { Container } from 'react-bootstrap'

export default class chatHeading extends Component {
	render() {
		const { name, logout } = this.props
		return (
			<Container className="chat-header">
				<div className="user-info">
					<div className="user-name">{name}</div>
					<div className="status">
						<div className="indicator"></div>
					</div>
				</div>
				<div className="logout"
					onClick={() => { logout() }}
					title="Cerrar sesión" >
					<span>Salir del chat</span> <MdEject />
				</div>
			</Container>
		);
	}
}
