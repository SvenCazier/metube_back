"use strict";

require("dotenv").config();

const port = process.env.PORT;
const subdomain = require("express-subdomain");
const express = require("express");
const app = express();
const useragent = require("express-useragent");
const bodyParser = require("body-parser");
const multer = require("multer");

const { logger } = require("./middleware/logHandler");
const errorHandler = require("./middleware/errorHandler");

const jose = require("jose");

async function generateKeys() {
	try {
		const alg = "ES256";
		const keyPair = await jose.generateKeyPair(alg);
		const jwk = await jose.exportJWK(keyPair.privateKey);
		console.log(jwk);
		const base64Key = Buffer.from(JSON.stringify(jwk)).toString("base64");
		console.log(base64Key);
		const key = JSON.parse(Buffer.from(base64Key, "base64").toString("utf-8"));
		console.log(key);
		const kid = await jose.calculateJwkThumbprint(jwk);
		const privateKey = await jose.importJWK(jwk, alg);
		const jwt = await new jose.SignJWT({ "urn:example:claim": true }).setProtectedHeader({ alg }).setIssuedAt().setIssuer("urn:example:issuer").setAudience("urn:example:audience").setExpirationTime("2h").sign(privateKey);
		console.log(jwt);
	} catch (error) {
		console.error("Error generating keys:", error);
	}
}

generateKeys();

const { errorResponse, ErrorResponse } = require("./middleware/errorResponseHandler");
app.use((req, res, next) => {
	res.errorResponse = errorResponse.bind(res);
	next();
});

const cors = require("cors");
app.use(
	cors({
		origin: function (origin, callback) {
			if (!origin || origin === "https://localhost:4200") {
				callback(null, true);
			} else {
				callback(new Error("Not allowed by CORS"));
			}
		},
		methods: ["GET", "POST", "PUT", "DELETE"],
		allowedHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	})
);

console.log(`Listening on port ${port}`);

app.use(logger);
app.use(errorHandler);

app.use(useragent.express());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set("subdomain offset", 1); // REMOVE FOR DEPLOYMENT
app.use(subdomain("auth", require("./routes/authRoutes")));
app.use(subdomain("api", require("./routes/apiRoutes")));
app.use(subdomain("media", require("./routes/mediaRoutes")));

app.use((err, req, res, next) => {
	if (err instanceof multer.MulterError) {
		// Multer error occurred
		console.error(err);
		return res.errorResponse(ErrorResponse.FileError);
	}
	// Pass the error to the next middleware
	next(err);
});

// Generic error handling middleware for other errors
app.use((err, req, res, next) => {
	// Handle other errors here
	console.error(err);
	return res.errorResponse(ErrorResponse.InternalServerError);
});

app.use("*", (req, res, next) => {
	res.json = (data) => res.type("json").send(JSON.stringify(data, null, 4));
	next();
});

app.get("/", function (req, res) {
	res.sendStatus(200);
});

app.get("/robots.txt", function (req, res) {
	res.send(__dirname + "robots.txt");
});

app.get("*", function (req, res) {
	res.sendStatus(404);
});
app.post("*", function (req, res) {
	res.sendStatus(501);
});
app.patch("*", function (req, res) {
	res.sendStatus(501);
});
app.put("*", function (req, res) {
	res.sendStatus(501);
});
app.delete("*", function (req, res) {
	res.sendStatus(501);
});

app.listen(port);
