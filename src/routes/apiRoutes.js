"use strict";

const express = require("express");
const router = express.Router();
const commentController = require("../controllers/api/commentController");
const userController = require("../controllers/api/userController");
const videoController = require("../controllers/api/videoController");
const jwtHandler = require("../middleware/jwtHandler");
const multer = require("../middleware/uploadHandler");
const { validateVideoUpload, validationHandler } = require("../middleware/validationHandler");

router.route("/").get(function (req, res) {
	res.send("<h1>MeTube API</h1><h3>v1.0.0</h3>");
});

router
	.route("/comment") //
	.get(commentController.getAllComments)
	.post(commentController.createComment)
	.patch(commentController.updateComment)
	.delete(commentController.deleteComment);

router
	.route("/comment/:id") //
	.get(commentController.getOneComment);

router
	.route("/user") //
	.get(userController.getAllUsers)
	.post(userController.createUser)
	.patch(userController.updateUser)
	.delete(userController.deleteUser);

router
	.route("/user/:id") //
	.get(userController.getOneUser);

router
	.route("/video") //
	.get(videoController.getAllVideos)
	.post(multer.fields([{ name: "chapters", maxCount: 1 }, { name: "subtitles" }, { name: "video", maxCount: 1 }, { name: "thumbnail", maxCount: 1 }]), validateVideoUpload, validationHandler, videoController.createVideo)
	.patch(videoController.updateVideo)
	.delete(videoController.deleteVideo);

router
	.route("/video/:id") //
	.get(videoController.getOneVideo);

router
	.route("*")
	.get(function (req, res) {
		res.sendStatus(404);
	})
	.post(function (req, res) {
		res.sendStatus(501);
	})
	.patch(function (req, res) {
		res.sendStatus(501);
	})
	.put(function (req, res) {
		res.sendStatus(501);
	})
	.delete(function (req, res) {
		res.sendStatus(501);
	});

module.exports = router;
