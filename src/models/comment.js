const thinky = require('thinky')({
	db: "MeTube"
});
const r = thinky.r;
const type = thinky.type;

const Comment = thinky.createModel("Comment", {
    id: type.string(),
	videoID: type.string(),
    userID: type.string(),
    comment: type.string(),
	children: [type.string()],
	likeCounter: type.number().default(0),
	createdAt: type.date().default(r.now()),
	updatedAt: type.date().default(r.now())
});

const ChildComment = thinky.createModel("ChildComment", {
    id: type.string(),
	videoId: type.string(),
	parentID: type.string(),
    userID: type.string(),
	parentUserID: type.string(),
    comment: type.string(),
	children: [type.string()],
	likeCounter: type.number().default(0),
	createdAt: type.date().default(r.now()),
	updatedAt: type.date().default(r.now())
});

module.exports = {
	Comment,
	ChildComment
};