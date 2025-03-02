import multer from "multer";
import sharp from "sharp";

const storage = multer.memoryStorage()

const upload = multer({
	storage: storage,
	fileFilter: (req, file, cb) => {
		if (!file.mimetype.startsWith("image/")) return cb(new Error("You must send only image"), false)
		cb(null, true)
	},
	limits: {
		fileSize: 5 * 1024 * 1024
	}
})


const proccesImage = (type, keyImageName) => {
	return async (req, res, next) => {
		if (!req.file || !req.user) return next()

		try {
			const entryImageName = req.body[keyImageName]

			if (!entryImageName) return res.status(404).json({ status: false, message: "Name image is not defined" })

			const linkImage = `uploads/${type}s/${type}-${req.user.login}-${entryImageName}.webp`

			await sharp(req.file.buffer).webp().resize(600, 600, {
				fit: "inside",
				withoutEnlargement: true,
			}).toFile(linkImage)

			req.file.path = linkImage

			next()
		} catch (error) {
			return res.status(500).json({ status: false, message: error })
		}
	}
}


const uploadUserImage = [
	upload.single("image"),
	proccesImage("user", "userImageName")
]

const uploadArticleImage = [
	upload.single("image"),
	proccesImage("article", "articleImageName")
]

export { uploadUserImage, uploadArticleImage }
