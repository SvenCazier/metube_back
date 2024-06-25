"use strict";

require("dotenv").config();

const authQueries = require("../../queries/auth/authQueries");
const jwtHandler = require("../../middleware/jwtHandler");
const { ErrorResponse } = require("../../middleware/errorResponseHandler");
const FacebookService = require("../../services/facebookService");
const PasswordService = require("../../services/passwordService");
const { validationResult } = require("express-validator");

const crypto = require("crypto");
//const querystring = require('querystring');

const registerUser = async (req, res) => {
	try {
		const { email, username, password } = req.body;
		const [existingUser] = await authQueries.getUserByEmail(email);
		if (existingUser) {
			console.log("existing user");
			// If the user already exists
			if (existingUser.password) {
				// If the user already has a password
				return res.errorResponse(ErrorResponse.UserExists);
			} else if (existingUser.facebookId) {
				// If the user has a facebookId: update with password and username
				const hashedPassword = await PasswordService.hashPassword(password);
				await authQueries.updateUserCredentials(existingUser.id, null, hashedPassword, null);
				await authQueries.updateUserInfo(existingUser.id, username);
			} else {
				// Somehow there is no password nor facebook id
				return res.errorResponse(ErrorResponse.InternalServerError);
			}
		} else {
			const hashedPassword = await PasswordService.hashPassword(password);
			const newUser = await authQueries.createUserWithEmail(email, hashedPassword);
			await authQueries.createUserInfo(newUser.id, username);
		}
		// // send confirmation email
		return res.status(200).json({});
	} catch (err) {
		// LOG ERROR
		return res.errorResponse(ErrorResponse.InternalServerError);
	}
};

const loginUserWithEmail = async (req, res) => {
	try {
		const { email, password } = req.body;
		const useragent = req.useragent;
		const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || null;
		//CHECK VALID EMAIL AND PASSWORD FIRST
		if (email && password) {
			const [user] = await authQueries.getUserByEmail(email);
			if (user) {
				if (user.emailConfirmed) {
					const passwordHash = user?.password;
					if (passwordHash) {
						if (await PasswordService.validatePassword(password, passwordHash)) {
							const userId = user.id;
							const userInfo = await authQueries.getUserInfo(userId);
							const tokens = {}; //await jwtHandler.createJWT({ id: userId, name: userInfo?.name });
							await authQueries.logUserLogin(user.id, ip, JSON.stringify(useragent), "email");
							return res.status(200).json(tokens);
						}
					}
				} else {
					return res.errorResponse(ErrorResponse.EmailNotConfirmed);
				}
			}
		}
		return res.errorResponse(ErrorResponse.InvalidUserCredentials);
	} catch (err) {
		// LOG ERROR
		console.log("error");
		console.log(err);
		return res.errorResponse(ErrorResponse.InternalServerError);
	}
};

const facebookLogin = async (req, res) => {
	try {
		const accessToken = req.body.accessToken;
		const useragent = req.useragent;
		const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || null;

		if (!accessToken) {
			return res.errorResponse(ErrorResponse.MissingFacebookAccessToken);
		}
		const facebookService = new FacebookService();
		const debugResponse = await facebookService.debugToken(accessToken);
		if (!debugResponse.data.is_valid) {
			return res.errorResponse(ErrorResponse.InvalidFacebookAccessToken);
		}

		const { facebookId, name, email, pictureUrl } = await facebookService.getUserInfo(accessToken);
		// check if user has logged in with facebook before
		const [facebookUser] = await authQueries.getUserByFacebookID(facebookId);
		const userCredentials = {};
		if (facebookUser) {
			userCredentials.id = facebookUser.id;
			const facebookUserInfo = await authQueries.getUserInfo(userCredentials.id);
			userCredentials.name = facebookUserInfo.name;
		} else {
			// if not, check if user has an account
			const [emailUser] = await authQueries.getUserByEmail(email);
			// if they do, update with facebookid
			if (emailUser) {
				userCredentials.id = emailUser.id;
				const emailUserInfo = await authQueries.getUserInfo(emailUser.id);
				userCredentials.name = emailUserInfo.name;
				await authQueries.updateUserCredentials(emailUser.id, null, null, facebookId);
			} else {
				// if not, create new user
				const newUser = await authQueries.createUserWithFacebook(facebookId, email);
				userCredentials.id = newUser.id;
				userCredentials.name = name;
				await authQueries.createUserInfo(newUser.id, name);
				const profilePicture = await facebookService.saveProfilePicture("public/media/profile/", newUser.id, pictureUrl);
				if (!profilePicture) {
					// if null, make default one;
				}
			}
		}
		if (Object.keys(userCredentials).length) {
			//const tokens = await jwtHandler.createJWT(userCredentials);
			const tokens = {};
			await authQueries.logUserLogin(userCredentials.id, ip, JSON.stringify(useragent), "facebook");
			return res.status(200).json(tokens);
		} else {
			return res.errorResponse(ErrorResponse.InternalServerError);
		}
	} catch (err) {
		// LOG ERROR
		console.log("error");
		console.log(err);
		return res.errorResponse(ErrorResponse.InternalServerError);
	}
};

const updatePassword = (req, res) => {
	const oldPassword = req.body.old_password;
	const newPassword = req.body.new_password;
	//get user id from JWT in req
	const id = req.body.id;
	if (!oldPassword) {
		res.status(400).send("Bad old password");
	} else if (!newPassword) {
		res.status(400).send("Bad new password");
	} else {
		authQueries
			.findUserById(["id", "password"], id)
			.then((result) => {
				if (result.length) {
					//USER RETURNED
					const existingUser = result[0];
					if (existingUser.password) {
						if (bcrypt.compareSync(oldPassword, existingUser.password)) {
							bcrypt.hash(newPassword, saltRounds, async function (err, hash) {
								if (err) {
									res.status(500).json({ err: "Failed to hash password." });
								} else {
									const data = {
										password: hash,
										updated: new Date(Date.now()).toISOString(),
									};
									authQueries
										.updateUser(id, data)
										.then(async (result) => {
											res.status(201).json(result);
										})
										.catch((err) => {
											res.status(500).json(err);
										});
								}
							});
						} else {
							//PASSWORDS DO NOT MATCH
						}
					} else {
						//USER DOES NOT HAVE A PASSWORD SET
					}
				} else {
					//NO SUCH USER
					res.status(403).send("Nope");
				}
			})
			.catch((err) => {
				//FAILED TO LOOK UP USER
				res.status(500).json(err);
			});
	}
};

const confirmEmail = (req, res) => {};

const requestPasswordReset = (req, res) => {
	//if email exists with password create code + 24h expiry date and send in email
	const random = crypto.randomBytes(128).toString("hex");
	const expiration = new Date(new Date(Date.now()).getTime() + 60 * 60 * 24 * 1000).valueOf();
	const reset = { id: random, exp: expiration };
};

const resetPassword = (req, res) => {};

const logoutUser = (req, res) => {
	return res.sendStatus(200);
};

module.exports = {
	registerUser,
	loginUserWithEmail,
	facebookLogin,
	updatePassword,
	confirmEmail,
	requestPasswordReset,
	resetPassword,
	logoutUser,
};
