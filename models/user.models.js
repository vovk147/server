import { Schema, model } from 'mongoose';



const userSchema = new Schema({
	login: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	image: {
		type: String,
		required: false,
		default: ""
	},
	name: {
		type: String,
		required: true,
	},

})

const User = model('users', userSchema)

export default User