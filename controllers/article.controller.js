import Article from '../models/article.js';
import User from '../models/user.models.js';

const handleError = (res, error, statusCode = 500) => res.status(statusCode).json({ message: error.message });

async function createArticle(req, res) {

	if (!req.body) return res.status(404).json({ status: false, message: "Ти нічого не передав" });

	try {
		const { text, title } = req.body
		const user = req.user
		const { path } = req.file

		if (!title, !text, !path) return res.status(404).json({ message: 'Title, text, and author are required' });

		if (!path) res.status(404).json({ status: false, message: "Image is required" })

		const newArticle = new Article({
			title,
			text,
			author: user.login,
			image: path
		});

		await newArticle.save()
		return res.status(200).json({ status: true, newArticle })
	} catch (error) {
		return res.status(500).json({ status: false, message: error });

	}


}

async function getUserArticles(req, res) {
	try {
		const { author } = req.params

		const articles = await Article.find({ author }).lean();
		res.status(200).json({ status: true, articles });
	} catch (error) {
		handleError(res, error);
	}
}

async function getAllArticles(req, res) {
	try {
		const articles = await Article.find().lean();
		res.status(200).json({ status: true, articles });
	} catch (error) {
		handleError(res, error);
	}
}

async function getArticleById(req, res) {
	try {
		const article = await Article.findById(req.params.id).lean();
		if (!article) return res.status(404).json({ message: 'Article not found' });
		res.status(200).json(article);
	} catch (error) {
		handleError(res, error);
	}
}

async function updateArticle(req, res) {
	const { title, text } = req.body;
	const { user } = req

	if (!title && !text) {
		return res.status(400).json({ message: 'At least one field (title, text, or author) is required for update' });
	}

	try {
		const existingArticle = await Article.findById(req.params.id);

		if (!existingArticle) return res.status(404).json({ message: 'Article not found' });

		if (existingArticle.author !== user.login) {
			return res.status(403).json({ message: 'You are not allowed to edit this article' });
		}

		const article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

		res.status(200).json({ article });
	} catch (error) {
		handleError(res, error);
	}
}

async function deleteArticle(req, res) {
	try {
		const user = req.user
		const { articleId } = req.params

		if (!user || !articleId) return res.status(404).json({ status: false, message: "Ти передав не всі поля" })

		const result = await Article.findOneAndDelete({ _id: articleId, author: user.login })

		if (!result) return res.status(404).json({ status: false, message: "Стаття не знайдена або ви не є автором" })

		return res.status(200).json({ status: true, message: "Стаття видалена" })
	} catch (error) {
		return res.status(500).json({ status: false, message: error });
	}
}

async function likeControll(req, res) {
    try {
        const { articleId } = req.body;
		const {user} = req

		console.log(articleId,user)

        if (!user || !articleId) {
            return res.status(400).json({ status: false, message: "Missing user or articleId" });
        }

        const article = await Article.findById(articleId);
        if (!article) {
            return res.status(404).json({ status: false, message: "Article not found" });
        }

        let message;
        if (article.likes.includes(user.login)) {
            article.likes = article.likes.filter((login) => login !== user.login);
            message = "Like removed";
        } else {
            article.likes.push(user.login);
            message = "Like added";
        }

        await article.save();

        return res.status(200).json({ status: true, message, likes: article.likes });
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
}





async function addComent(req, res) {
	try {
		const { articleId, commentText } = req.body;
		const { user } = req;

		if (!user || !articleId || !commentText) {
			return res.status(400).json({ statuse: false, message: "All fields are required" });
		}
		const article = await Article.findById(articleId);

		if (!article) {
            return res
			.status(404)
			.json({ status: false, message: "Article not found" })
        }

		const comment = {
			author:{
				login: user.login,
				image: user.image,
			},
			text: commentText,
			date: new Date(),
		}

		article.comments.push(comment);
		await article.save();

		return res.status(200).json({ status: true, message: "Comment added", comments: article.comments });
	}catch (error) {
		return res.status(500).json({ status: false, message: error.message });
	}

}


export { createArticle, getAllArticles, getArticleById, updateArticle, deleteArticle, addComent, likeControll, getUserArticles };
