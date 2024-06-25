"use strict";
const { logEvents } = require("./logHandler");

const errorHandler = (err, req, res, next) => {
	logEvents(`${err.name}: ${err.message}`, "errLog.log");
	console.error(err.stack);
	res.status(500).send(err.message);
};

module.exports = errorHandler;
