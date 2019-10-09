const uuidv4 = require('uuid/v4')

/*
	Crea un usuario con un identificador unico
*/
const createUser = ({ name = "" } = {}) => (
	{
		id: uuidv4(),
		name
	}
)

/*
	Crea el objeto que almacena el mensaje, este tiene un identificador unico
*/
const createMessage = ({ message = "", sender = "" } = {}) => (
	{
		id: uuidv4(),
		time: getTime(new Date(Date.now())),
		message,
		sender
	}

)

/*
	Crea el objeto que almacena los chats
*/
const createChat = ({ messages = [], name = "Grupo", users = [], isCommunity = false } = {}) => (
	{
		id: uuidv4(),
		name: "Usuarios conectados",
		messages,
		users,
		typingUsers: [],
		isCommunity
	}
)

/*
	Regresa la fecha en formato: 24hr
*/
const getTime = (date) => {
	return `${date.getHours()}:${("0" + date.getMinutes()).slice(-2)}`
}

module.exports = {
	createMessage,
	createChat,
	createUser,
}

