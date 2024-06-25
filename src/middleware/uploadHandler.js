const multer = require("multer");
const { ErrorResponse } = require("./errorResponseHandler");

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		switch (file.fieldname) {
			case "chapters":
				cb(null, "uploads/chapters/");
				break;
			case "subtitles":
				cb(null, "uploads/subtitles/");
				break;
			case "video":
				cb(null, "uploads/videos/");
				break;
			case "thumbnail":
				cb(null, "uploads/thumbnails/");
				break;
			default:
				cb(null, "uploads/");
				break;
		}
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(null, uniqueSuffix + "-" + file.originalname);
	},
});

const upload = multer({ storage: storage });

module.exports = upload;
