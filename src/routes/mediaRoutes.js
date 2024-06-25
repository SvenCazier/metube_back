"use strict";

const express = require("express");
const router = express.Router();
const mediaController = require("../controllers/media/mediaController");

router.route("/").get(function (req, res) {
	res.send("<h1>MeTube Media Service</h1><h3>v1.0.0</h3>");
});

router
	.route("/asset/:filename") //
	.get(mediaController.getAsset);

router
	.route("/img/:id") //
	.get(mediaController.getImage);

router
	.route("/subtitle/:id") //
	.get(mediaController.getSubtitle);

router
	.route("/video/:id") //
	.get(mediaController.streamVideo);

router
	.route("/video/:id/manifest/:format/:resolution") //
	.get(mediaController.getManifest);

router
	.route("/video/:id/segment/:resolution") //
	.get(mediaController.getSegment);

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
