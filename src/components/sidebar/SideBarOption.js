/* Componente para renderizar los usuarios conectados en la barra lateral */

import React, { Component } from 'react'
import PropTypes from 'prop-types'

export class SideBarOption extends Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        lastMessage: PropTypes.string,
        active: PropTypes.bool,
        onClick: PropTypes.func
    }

    static defaultProps = {
        lastMessage: "",
        active: false
    }

    render() {
        const { name, active } = this.props
        return (
            <div className={`user ${active ? 'active' : ''}`}>
                <div className="user-photo">{name[0].toUpperCase()}</div>
                <div className="user-info">
                    <div className="name">{name}</div>                    
                </div>
            </div>
        )
    }
}