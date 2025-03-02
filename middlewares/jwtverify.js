import jwt from 'jsonwebtoken';
import User from '../models/user.models.js';

async function checkToken(req, res, next) {
	try {
		const token = req.headers['authorization']?.split(' ')[1];
		const decoded = jwt.verify(token, 'abcd1234')

		if (!decoded._id) return res.status(404).json({ status: false, message: "В доступі відмовленно" })

		const exUser = await User.findById(decoded._id)

		if (!exUser) return res.status(404).json({ status: false, message: "В доступі відмовленно" })

		req.user = exUser

		next()
	}
	catch (error) {
		return res.status(404).json({ status: false, message: 'В доступі відмовленно' });
	}
}

export default checkToken

