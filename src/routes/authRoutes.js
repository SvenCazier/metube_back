"use strict";

const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth/authController");
const jwtHandler = require("../middleware/jwtHandler");
const { validateEmailRegistration, validateEmailLogin, validationHandler } = require("../middleware/validationHandler");

router.route("/").get(function (req, res) {
	res.send("<h1>MeTube Authentication Service</h1><h3>v1.0.0</h3>");
});

router
	.route("/register") //
	.post(validateEmailRegistration, validationHandler, authController.registerUser);

router
	.route("/login") //
	.post(validateEmailLogin, validationHandler, authController.loginUserWithEmail);

router
	.route("/facebook") //
	.post(authController.facebookLogin);

router
	.route("/password/update") //
	.patch(authController.updatePassword);

router
	.route("/password/reset") //
	.post(authController.requestPasswordReset)
	.patch(authController.resetPassword);

router
	.route("/logout") //
	.get(authController.logoutUser);

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
