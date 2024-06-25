"use strict";

require("dotenv").config();
const crypto = require("crypto");
const jwt = require("jose");

const alg = "ES256";

const createJWT = async (userCredentials) => {
	try {
		const accessToken = await generateAccessToken(userCredentials);
		const refreshToken = await generateRefreshToken(userCredentials);
		console.log(await jwt.jwtVerify(accessToken, crypto.createPublicKey(process.env.ACCESS_TOKEN_PUBLIC)));
		console.log(await jwt.jwtVerify(refreshToken, crypto.createPublicKey(process.env.REFRESH_TOKEN_PUBLIC)));
		return { accessToken: accessToken, refreshToken: refreshToken };
	} catch (error) {
		throw error;
	}
};

const refreshJWT = async (req, res) => {
	const refreshToken = req.body.token;
	if (!refreshToken) return res.sendStatus(401);
	//if no such token return res.sendStatus(403);
};

const verifyJWT = async (req, res, next) => {
	const authHeader = req.headers["authorization"];
	if (!authHeader) return res.sendStatus(401);
	const accessToken = authHeader.split(" ")[1];

	const publicKey = crypto.createPublicKey(process.env.ACCESS_TOKEN_PUBLIC);

	const { payload, protectedHeader } = await jwt.jwtVerify(accessToken, publicKey);
};

const generateAccessToken = async (userCredentials) => {
	try {
		const privateKey = crypto.createPrivateKey(process.env.ACCESS_TOKEN_PRIVATE);
		return await new jwt.SignJWT({ "urn:example:claim": true }).setProtectedHeader({ alg }).setIssuedAt().setIssuer("urn:example:issuer").setAudience("urn:example:audience").setExpirationTime("5m").setSubject(userCredentials).sign(privateKey);
	} catch (error) {
		console.error("Error generating access token:", error);
		throw error;
	}
};

const generateRefreshToken = async (userCredentials) => {
	try {
		const privateKey = crypto.createPrivateKey(process.env.REFRESH_TOKEN_PRIVATE);
		return await new jwt.SignJWT({ "urn:example:claim": true }).setProtectedHeader({ alg }).setIssuedAt().setIssuer("urn:example:issuer").setAudience("urn:example:audience").setExpirationTime("30d").setSubject(userCredentials).sign(privateKey);
	} catch (error) {
		console.error("Error generating refresh token:", error);
		throw error;
	}
};

const errorHandler = (err) => {
	switch (err) {
		case "ERR_JOSE_ALG_NOT_ALLOWED":
			return { desc: "Invalid algorithm.", code: 1 };
		case "ERR_JOSE_GENERIC":
			return { desc: "Token validation failed.", code: 2 };
		case "ERR_JOSE_NOT_SUPPORTED":
			return { desc: "Invalid algorithm.", code: 3 };
		case "ERR_JWE_DECRYPTION_FAILED":
			return { desc: "Decryption failed.", code: 4 };
		case "ERR_JWE_INVALID":
			return { desc: "Invalid JWE.", code: 5 };
		case "ERR_JWK_INVALID":
			return { desc: "Invalid JWK.", code: 6 };
		case "ERR_JWKS_INVALID":
			return { desc: "Invalid JWKS.", code: 7 };
		case "ERR_JWKS_MULTIPLE_MATCHING_KEYS":
			return { desc: "Invalid JWKS key.", code: 8 };
		case "ERR_JWKS_NO_MATCHING_KEY":
			return { desc: "Invalid JWKS key.", code: 9 };
		case "ERR_JWKS_TIMEOUT":
			return { desc: "JWKS timeout.", code: 10 };
		case "ERR_JWS_INVALID":
			return { desc: "Invalid JWS.", code: 11 };
		case "ERR_JWS_SIGNATURE_VERIFICATION_FAILED":
			return { desc: "Invalid JWS signature.", code: 12 };
		case "ERR_JWT_CLAIM_VALIDATION_FAILED":
			return { desc: "Invalid JWT claim.", code: 13 };
		case "ERR_JWT_EXPIRED":
			return { desc: "JWT expired.", code: 14 };
		case "ERR_JWT_INVALID":
			return { desc: "Invalid JWT.", code: 15 };
		default:
			return { desc: "Token validation failed.", code: 16 };
	}
};

module.exports = {
	createJWT,
	refreshJWT,
	verifyJWT,
	errorHandler,
};
