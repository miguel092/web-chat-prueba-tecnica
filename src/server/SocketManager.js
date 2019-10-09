const io = require('./index.js').io

const { VERIFY_USER, USER_CONNECTED, USER_DISCONNECTED,
	LOGOUT, COMMUNITY_CHAT, MESSAGE_RECIEVED, MESSAGE_SENT,
	TYPING } = require('../Events')

const { createUser, createMessage, createChat } = require('../Factories')

let connectedUsers = {}

let communityChat = createChat({ isComunity: true })

module.exports = function (socket) {
	let sendMessageToChatFromUser;
	let sendTypingFromUser;

	/* Verificar que nombre de usuario no exista */
	socket.on(VERIFY_USER, (nickname, callback) => {
		if (isUser(connectedUsers, nickname)) {
			callback({ isUser: true, user: null })
		} else {
			callback({ isUser: false, user: createUser({ name: nickname }) })
		}
	})

	/* Una vez verificado el usuario, se conecta */
	socket.on(USER_CONNECTED, (user) => {
		connectedUsers = addUser(connectedUsers, user)
		socket.user = user

		sendMessageToChatFromUser = sendMessageToChat(user.name)
		sendTypingFromUser = sendTypingToChat(user.name)

		io.emit(USER_CONNECTED, connectedUsers)
	})

	// Eliminar usuario desconectado
	socket.on('disconnect', () => {
		if ("user" in socket) {
			connectedUsers = removeUser(connectedUsers, socket.user.name)

			io.emit(USER_DISCONNECTED, connectedUsers)
			console.log("Desconectado", connectedUsers);
		}
	})

	// Logout de usuario
	socket.on(LOGOUT, () => {
		connectedUsers = removeUser(connectedUsers, socket.user.name)
		io.emit(USER_DISCONNECTED, connectedUsers)
		console.log("Disconnect", connectedUsers);

	})

	socket.on(COMMUNITY_CHAT, (callback) => {
		callback(communityChat)
	})


	socket.on(MESSAGE_SENT, ({ chatId, message }) => {
		sendMessageToChatFromUser(chatId, message)
	})

	socket.on(TYPING, ({ chatId, isTyping }) => {
		sendTypingFromUser(chatId, isTyping)
	})

}
/*
	Función para indicar que un usuario está escribiendo un mensaje
*/
function sendTypingToChat(user) {
	return (chatId, isTyping) => {
		io.emit(`${TYPING}-${chatId}`, { user, isTyping })
	}
}

/*
	Función que regresa en tiempo real el mensaje enviado, para mostrarlo en la caja de mensajes
*/
function sendMessageToChat(sender) {
	return (chatId, message) => {
		io.emit(`${MESSAGE_RECIEVED}-${chatId}`, createMessage({ message, sender }))
	}
}

/*
	Agrega usuario a la lista
*/
function addUser(userList, user) {
	let newList = Object.assign({}, userList)
	newList[user.name] = user
	return newList
}

/*
	Elimina usuario de la lista
*/
function removeUser(userList, username) {
	let newList = Object.assign({}, userList)
	delete newList[username]
	return newList
}

/*
	Recorre la lista de usuarios, devuelve verdadero su existeo falso si está disponible
*/
function isUser(userList, username) {
	return username in userList
}