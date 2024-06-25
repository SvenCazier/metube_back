const thinky = require("thinky")({
	db: "MeTube",
});
const r = thinky.r;

const apiQueries = require("../../queries/api/apiQueries");
const jwtHandler = require("../../middleware/jwtHandler");
const SearchResultService = require("../../services/searchResultService.js");
const FileService = require("../../services/fileService.js");
const fs = require("fs");

const getAllVideos = async (req, res) => {
	try {
		let limit = null;
		const queryParams = req.query;
		const numParams = Object.keys(queryParams).length;
		if ((numParams === 2 && !("search_query" in queryParams && "limit" in queryParams)) || (numParams === 1 && !("search_query" in queryParams) && !("artist" in queryParams) && !("genre" in queryParams))) {
			return res.sendStatus(400);
		}
		if ("limit" in queryParams) {
			limit = parseInt(queryParams.limit);
			if (isNaN(limit) || limit <= 0) {
				return res.sendStatus(400);
			}
		}

		let searchParams = {};
		if ("artist" in queryParams) {
			searchParams = function (doc) {
				return doc("artist").contains(r.args([queryParams.artist]));
			};
		} else if ("genre" in queryParams) {
			searchParams.genre = queryParams.genre;
		}

		// Call the API to get all videos based on search parameters
		result = await apiQueries.getAllVideos(searchParams);

		// Process the results and send response
		result.forEach((item) => {
			item.id = Buffer.from(item.id, "utf-8").toString("base64url");
		});
		if ("search_query" in queryParams) {
			result = SearchResultService.filterSearchResults(result, queryParams.search_query);
		}
		if (!result.length) {
			return res.sendStatus(204);
		} else {
			return res.status(200).json(result.slice(0, limit || result.length));
		}
	} catch (err) {
		console.log(err);
		return res.sendStatus(500);
	}
};

const getOneVideo = async (req, res) => {
	const id = Buffer.from(req.params.id, "base64url").toString("utf-8");
	apiQueries
		.getVideoById(id)
		.then((result) => {
			result.id = Buffer.from(result.id, "utf-8").toString("base64url");
			return res.status(200).json(result);
		})
		.catch((err) => {
			return res.sendStatus(404);
		});
};

const createVideo = async (req, res) => {
	try {
		const body = req.body;
		const files = req.files;
		const contentType = req.headers["content-type"];

		if (contentType && contentType.includes("multipart/form-data")) {
			const video = {
				artist: body.artist,
				title: body.title,
				description: body.description,
				genre: body.genre,
				tags: body.tags.map((str) => str.toLowerCase()),
			};

			const chaptersFile = files.chapters;
			const subtitleFiles = files.subtitles;
			const thumbnailFile = files.thumbnail;
			const videoFile = files.video;

			if (chaptersFile?.length) {
				video.chapters = FileService.getChapters(fs.readFileSync(chaptersFile[0].path, "utf8"));
			}
			if (subtitleFiles?.length) {
				video.subtitles = FileService.getLanguageCodes(subtitleFiles);
			}

			const result = await apiQueries.createVideo(video);
			const videoId = result.id;

			if (subtitleFiles.length) {
				FileService.storeFiles("public/media/subtitles/", subtitleFiles, videoId);
			}
			FileService.storeFiles("public/media/img/", thumbnailFile, videoId);
			FileService.storeFiles("public/media/video/x1080", videoFile, videoId);

			// SPLIT THE FILE UP USING PYTHON SCRIPT

			return res.status(201).json(result);
		} else {
			return res.sendStatus(400);
		}
	} catch (err) {
		console.log(err);
		return res.sendStatus(500);
	} finally {
		Object.values(files).forEach((fileArray) => {
			fileArray.forEach((file) => {
				if (fs.existsSync(file.path)) {
					fs.unlinkSync(file.path);
				}
			});
		});
	}
};

const updateVideo = (req, res) => {
	console.log(req.body);
	console.log(req);
	return res.status(200);
};

const deleteVideo = (req, res) => {
	return res.status(200);
};

module.exports = {
	getAllVideos,
	getOneVideo,
	createVideo,
	updateVideo,
	deleteVideo,
};
