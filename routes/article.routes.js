import express from "express";

import {
	createArticle,
	getAllArticles,
	getArticleById,
	updateArticle,
	deleteArticle,
	likeControll,
	getUserArticles,
	addComent
} from "../controllers/article.controller.js";
import checkToken from "../middlewares/jwtverify.js";
import { uploadArticleImage } from "../middlewares/uploadImage.js";

const article_router = express.Router();

article_router.post("/create", checkToken, uploadArticleImage, createArticle);
article_router.post("/like", checkToken, likeControll);
article_router.post("/add-comment", checkToken, addComent);
article_router.put("/:id", checkToken, updateArticle);
article_router.delete("/:articleId", checkToken, deleteArticle);



article_router.get("/", getAllArticles);
article_router.get("/:id", getArticleById);
article_router.get("/user/:author", getUserArticles);

export default article_router;

