"use strict";

const { v4: uuidv4 } = require("uuid");

const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

const logEvents = async (message, logName) => {
	const dateTime = new Date().toUTCString();
	const logItem = `${dateTime}\t${uuidv4()}\t${message}\n`;

	try {
		if (!fs.existsSync(path.resolve(__dirname, "../../logs"))) {
			await fsPromises.mkdir(path.resolve(__dirname, "../../logs"));
		}

		await fsPromises.appendFile(path.resolve(__dirname, "../../logs", logName), logItem);
	} catch (err) {
		console.log(err);
	}
};

const logger = (req, res, next) => {
	logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, "reqLog.log");
	console.log(`${req.method} ${req.path}`);
	next();
};

module.exports = {
	logger,
	logEvents,
};
