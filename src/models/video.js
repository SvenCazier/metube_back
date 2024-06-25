const thinky = require("thinky")({
	db: "MeTube",
});
const r = thinky.r;
const type = thinky.type;

const Video = thinky.createModel("Video", {
	id: type.string(),
	artist: [type.string()],
	title: type.string(),
	description: type.string(),
	genre: type.string(),
	tags: [type.string()],
	audienceData: [
		{
			likes: type.number().default(0),
			dislikes: type.number().default(0),
			views: type.number().default(0),
		},
	],
	chapters: [
		{
			chapter_name: type.string(),
			start_time: type.number(),
		},
	],
	subtitles: [{ langCode: type.string() }],
	createdAt: type.date().default(r.now()),
	updatedAt: type.date().default(r.now()),
});

module.exports = {
	Video,
};
