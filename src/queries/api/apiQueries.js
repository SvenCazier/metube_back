const thinky = require("thinky")({
	db: "MeTube",
});
const r = thinky.r;
const Query = thinky.Query;

const commentModels = require("../../models/comment");
const userModels = require("../../models/user");
const videoModels = require("../../models/video");

const getAllVideos = (searchParams) => {
	return new Promise(async (resolve, reject) => {
		try {
			result = await videoModels.Video.filter(searchParams).run();
			resolve(result);
		} catch (err) {
			reject(err);
		}
	});
};

const getVideoById = (id) => {
	return new Promise(async (resolve, reject) => {
		try {
			result = await videoModels.Video.get(id).run();
			resolve(result);
		} catch (err) {
			reject(err);
		}
	});
};

const createVideo = (video) => {
	return new Promise(async (resolve, reject) => {
		try {
			result = await videoModels.Video.save(video);
			resolve(result);
		} catch (err) {
			reject(err);
		}
	});
};

const getAllComments = (searchParams) => {
	return new Promise(async (resolve, reject) => {
		try {
			result = await commentModels.Comment.filter(searchParams).run(); // ADD SUPPORT FOR SUB COMMENTS
			resolve(result);
		} catch (err) {
			reject(err);
		}
	});
};

const getCommentById = (id) => {
	return new Promise(async (resolve, reject) => {
		try {
			result = await commentModels.Comment.get(id).run(); // ADD SUPPORT FOR SUB COMMENTS?
			resolve(result);
		} catch (err) {
			reject(err);
		}
	});
};

const createComment = (type, comment) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (type == "parent") {
				result = await commentModels.Comment.save(comment);
				resolve(result);
			} else if (type == "child") {
				result = await commentModels.ChildComment.save(comment);
			}
		} catch (err) {
			reject(err);
		}
	});
};

module.exports = {
	getAllVideos,
	getVideoById,
	createVideo,
	getAllComments,
	getCommentById,
};
