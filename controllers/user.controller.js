import User from '../models/user.models.js';
import jwt from 'jsonwebtoken';
import path from 'path'

async function registerUser(req, res) {
	if (!req.body) return res.status(404).json({ status: false, message: 'Ти нічого не передав' })

	try {
		const { login, password, email, name } = req.body
		if (!login || !password || !email || !name) return res.status(404).json({ status: false, message: "Ти передав не всі дані" })

		const exUser = await User.findOne({ login })

		if (exUser) return res.status(404).json({ status: false, message: "Користувач з таким логіном вже існує" })

		const newUser = new User({
			login,
			password,
			email,
			name
		})

		await newUser.save()



		const token = jwt.sign({ _id: newUser._id }, "abcd1234", { expiresIn: '1h' })

		const userToReturn = {
			login: newUser.login,
			email: newUser.email,
			name: newUser.name,
			image: newUser.image
		}

		return res.status(200).json({ status: true, user: userToReturn, token })
	} catch (error) {
		return res.status(500).json({ status: false, error })
	}

}

async function loginUser(req, res) {
	if (!req.body) return res.status(404).json({ status: false, message: 'Ти нічого не передав' })

	try {
		const { login, password } = req.body

		if (!login || !password) return res.status(404).json({ status: false, message: "Ти передав не всі дані" })

		const exUser = await User.findOne({ login, password })

		if (!exUser) return res.status(404).json({ status: false, message: " Не вірний логін або пароль" })

		const token = jwt.sign({ _id: exUser._id }, "abcd1234", { expiresIn: '1d' })


		const userToReturn = {
			login: exUser.login,
			email: exUser.email,
			name: exUser.name,
			image: exUser.image
		}

		return res.status(200).json({ status: true, user: userToReturn, token })
	} catch (error) {
		return res.status(500).json({ status: false, message: error })
	}


}

async function authUser(req, res) {
	const user = req.user

	const userToReturn = {
		login: user.login,
		email: user.email,
		name: user.name,
		image: user.image
	}
	return res.status(200).json({ status: true, user: userToReturn })
}

async function updateUserImage(req, res) {
	try {

		if (!req.file) {
			return res.status(400).json({ status: false, message: 'No file uploaded' });
		}

		// Перевіряємо, чи є користувач в req.user
		const userId = req.user._id;

		if (!userId) {
			return res.status(400).json({ status: false, message: 'User not authenticated' });
		}

		const imagePath = req.file.path;

		const updatedUser = await User.findByIdAndUpdate(userId, { image: imagePath }, { new: true });

		if (!updatedUser) {
			return res.status(404).json({ status: false, message: 'User not found' });
		}
		if (!updatedUser) {
			return res.status(404).json({ status: false, message: 'User not found' });
		}
		console.log(req.file.path)
		return res.status(200).json({ status: true, user: updatedUser })
	} catch (error) {
		return res.status(500).json({ status: false, message: error })
	}


}


export { registerUser, loginUser, authUser, updateUserImage }
