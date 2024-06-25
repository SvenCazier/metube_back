const fs = require("fs");
const path = require("path");

const getAsset = (req, res) => {
	const fileName = req.params.filename;
	const filePath = path.join(__dirname, `../../../public/assets/${fileName}`);
	console.log(filePath);
	try {
		if (fs.existsSync(filePath)) {
			return res.sendFile(filePath);
		} else {
			return res.sendStatus(404);
		}
	} catch (err) {
		return res.sendStatus(500);
	}
};

const getImage = (req, res) => {
	const id = Buffer.from(req.params.id, "base64url").toString("utf-8");
	const filePath = path.join(__dirname, `../../../public/media/img/${id}.png`); //change to webp
	try {
		if (fs.existsSync(filePath)) {
			return res.sendFile(filePath);
		} else {
			return res.sendStatus(404);
		}
	} catch (err) {
		return res.sendStatus(500);
	}
};

const getSubtitle = (req, res) => {
	const id = Buffer.from(req.params.id, "base64url").toString("utf-8");
	const queryParams = req.query;
	if (Object.keys(queryParams).length == 1 && "lang" in queryParams) {
		const lang = req.query.lang;
		const filePath = path.join(__dirname, `../../../public/media/subtitles/${id}.${lang}.vtt`);
		try {
			if (fs.existsSync(filePath)) {
				return res.sendFile(filePath);
			} else {
				return res.sendStatus(404);
			}
		} catch (err) {
			return res.sendStatus(500);
		}
	} else {
		return res.sendStatus(404);
	}
};

const streamVideo = (req, res) => {
	const id = Buffer.from(req.params.id, "base64url").toString("utf-8");
	const filePath = path.join(__dirname, `../../../public/media/video/x1080/${id}.mp4`);

	try {
		if (!fs.existsSync(filePath)) {
			return res.sendStatus(404);
		}

		const stat = fs.statSync(filePath);
		const fileSize = stat.size;
		const range = req.headers.range;

		if (range) {
			const parts = range.replace(/bytes=/, "").split("-");
			const start = parseInt(parts[0], 10);
			const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

			if (start >= fileSize) {
				res.status(416).send("Requested range not satisfiable\n" + start + " >= " + fileSize);
				return;
			}

			if (end >= fileSize) {
				res.status(416).send("Requested range not satisfiable\n" + end + " >= " + fileSize);
				return;
			}

			const chunksize = end - start + 1;
			const file = fs.createReadStream(filePath, { start, end });
			const head = {
				"Content-Range": `bytes ${start}-${end}/${fileSize}`,
				"Accept-Ranges": "bytes",
				"Content-Length": chunksize,
				"Content-Type": "video/mp4",
			};

			res.writeHead(206, head);
			file.pipe(res);
		} else {
			const head = {
				"Content-Length": fileSize,
				"Content-Type": "video/mp4",
			};

			res.writeHead(200, head);
			fs.createReadStream(filePath).pipe(res);
		}
	} catch (err) {
		console.error("Error streaming video:", err);
		res.sendStatus(500);
	}
};

const getManifest = (req, res) => {
	const id = Buffer.from(req.params.id, "base64url").toString("utf-8");
	const format = req.params.format;
	const resolution = req.params.resolution;

	try {
		let ext = "";
		if (format.toUpperCase() === "HLS") {
			ext = "m3u8";
		} else if (format.toUpperCase() === "DASH") {
			ext = "mpd";
		} else {
			return res.sendStatus(400); // Bad Request
		}

		if (resolution !== "1080" && resolution !== "720" && resolution !== "480") {
			return res.sendStatus(400); // Bad Request
		}

		const filePath = path.join("M:/MeTube", `${id}_${resolution}p.${ext}`);

		// Let express handle 200 and 404 status codes based on existence of file
		res.sendFile(filePath);
	} catch (err) {
		console.error("Error getting manifest:", err);
		res.sendStatus(500); // Internal Server Error
	}
};

const getSegment = (req, res) => {
	const id = Buffer.from(req.params.id, "base64url").toString("utf-8");
	const resolution = req.params.resolution;

	try {
	} catch (err) {
		console.error("Error streaming video:", err);
		res.sendStatus(500);
	}
};

module.exports = {
	getAsset,
	getImage,
	getSubtitle,
	streamVideo,
	getManifest,
	getSegment,
};
