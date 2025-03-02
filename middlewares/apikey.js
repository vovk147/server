
const checkApiKey = (req, res, next) => {
	const apiKey = req.headers["api-key"];
	if (apiKey === process.env.API_KEY) {
		next();
	} else {
		res.status(403).json({ message: "Forbidden" });
	}
};

export default checkApiKey;
