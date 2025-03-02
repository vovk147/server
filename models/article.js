import { Schema, model } from 'mongoose';

const articleSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	text: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now,
		required: false,
	},
	author: {
		type: String,
		required: false,
	},
	likes: {
		type: Array,
		default: []
	},
	comments: {
		type: [{
			text: {
				type: String,
				required: false,
				default: ""
			},
			author: {
				login:{
					type: String,
					required: false,
					
				},
				image:{
					type: String,
					required: false,
				}
			},
			createdAt: {
				type: Date,
				required: false,
				default: Date.now
			}
		}],
		default: []
	},
	image: {
		type: String,
		required: true,
	}
})

const Article = model('articles', articleSchema)

export default Article