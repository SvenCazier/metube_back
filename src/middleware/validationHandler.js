const { body, check, validationResult } = require("express-validator");

const emailValidator = body("email") //
	.trim()
	.escape()
	.notEmpty()
	.withMessage("Email is required")
	.bail()
	.isEmail()
	.withMessage("Invalid email format");

const existingPasswordValidator = body("password") //
	.trim()
	.escape()
	.notEmpty()
	.withMessage("Password is required");

const usernameValidator = body("username") //
	.trim()
	.escape()
	.notEmpty()
	.withMessage("User name is required");

const newPasswordValidator = body("password")
	.trim()
	.escape()
	.notEmpty()
	.withMessage("Password is required")
	.bail()
	.isLength({ min: 14 })
	.withMessage("Password must be at least 14 characters long")
	.matches(/[A-Z]/)
	.withMessage("Password must contain at least one uppercase letter")
	.matches(/[a-z]/)
	.withMessage("Password must contain at least one lowercase letter")
	.matches(/\d/)
	.withMessage("Password must contain at least one number")
	.matches(/[!@#$%^&*()\-_+.]/)
	.withMessage("Password must contain at least one special character")
	.custom((value) => !/\s/.test(value))
	.withMessage("Password cannot contain spaces");

const confirmPasswordValidator = body("confirmPassword")
	.trim()
	.escape()
	.notEmpty()
	.withMessage("Confirm password is required")
	.bail()
	.custom((value, { req }) => {
		if (value !== req.body.password) {
			throw new Error("Passwords do not match");
		}
		return true;
	});

const validateEmailRegistration = [
	//
	emailValidator,
	usernameValidator,
	newPasswordValidator,
	confirmPasswordValidator,
];

const validateEmailLogin = [
	//
	emailValidator,
	existingPasswordValidator,
];

const validateVideoUpload = [
	//
	body("artist").trim().escape().notEmpty().withMessage("Artist is required").toArray(),
	body("title").trim().escape().notEmpty().withMessage("Title is required"),
	body("description").trim().escape().notEmpty().withMessage("Description is required"),
	body("genre").trim().escape().notEmpty().withMessage("Genre is required"),
	body("tags").trim().escape().notEmpty().withMessage("Tags are required").toArray(),
	check("video")
		.custom((value, { req }) => {
			if (!req.files?.video.length) {
				return false;
			}
			return true;
		})
		.withMessage("Video file is required")
		.bail()
		.custom((value, { req }) => {
			const videoFile = req.files?.video;
			if (!videoFile[0].originalname.toLowerCase().endsWith(".mp4") || videoFile[0].mimetype !== "video/mp4") {
				return false;
			}
			return true;
		})
		.withMessage("Invalid video file format"),
	check("thumbnail")
		.custom((value, { req }) => {
			if (!req.files?.thumbnail.length) {
				return false;
			}
			return true;
		})
		.withMessage("Thumbnail file is required")
		.bail()
		.custom((value, { req }) => {
			const thumbnailFile = req.files?.thumbnail;
			if (!thumbnailFile[0].originalname.endsWith(".png") || thumbnailFile[0].mimetype !== "image/png") {
				return false;
			}
			return true;
		})
		.withMessage("Invalid thumbnail file format"),
	check("chapters")
		.custom((value, { req }) => {
			const chapterFiles = req.files?.chapters;
			if (chapterFiles) {
				const invalidFile = chapterFiles.some((chapterFile) => {
					return !chapterFile.originalname.endsWith(".csv") || chapterFile.mimetype !== "text/csv";
				});
				if (invalidFile) {
					return false;
				}
			}
			return true;
		})
		.withMessage("Invalid chapter file format"),
	check("subtitles")
		.custom((value, { req }) => {
			const subtitleFiles = req.files?.subtitles;
			if (subtitleFiles) {
				const invalidFile = subtitleFiles.some((subtitleFile) => {
					console.log(subtitleFile.mimetype);
					return !subtitleFile?.originalname.endsWith(".vtt") || subtitleFile?.mimetype !== "text/vtt";
				});
				if (invalidFile) {
					return false;
				}
			}
			return true;
		})
		.withMessage("Invalid subtitle file format"),
];

const validationHandler = (req, res, next) => {
	const errors = validationResult(req).array();
	if (errors.length) {
		res.status(400).json({ errors: errors });
	} else {
		next();
	}
};

// const validateVideoUpload = (req, res, next) => {
// 	try {
// 		// Check for required fields in body
// 		body("artist").trim().escape().notEmpty().withMessage("Artist is required");
// 		body("title").trim().escape().notEmpty().withMessage("Title is required");
// 		body("description").trim().escape().notEmpty().withMessage("Description is required");
// 		body("genre").trim().escape().notEmpty().withMessage("Genre is required");
// 		body("tags").trim().escape().notEmpty().withMessage("Tags are required");

// 		const errors = validationResult(req).array();
// 		console.error(validationResult(req).array());
// 		// Check for required files
// 		const files = req.files;
// 		if (!files?.video) {
// 			errors.push("Video is required");
// 		}
// 		if (!files?.thumbnail) {
// 			errors.push("Thumbnail is required");
// 		}

// 		// Validate file extensions and mimetypes
// 		files?.chapters.forEach((file) => {
// 			if (!file?.originalname.endsWith(".csv") || file?.mimetype !== "text/csv") {
// 				errors.push("Invalid chapters file");
// 			}
// 		});

// 		files?.subtitles.forEach((file) => {
// 			if (!file?.originalname.endsWith(".vtt") || file?.mimetype !== "application/octet-stream") {
// 				errors.push("Invalid subtitles file");
// 			}
// 		});

// 		files?.video.forEach((file) => {
// 			if (!file?.originalname.endsWith(".mp4") || file?.mimetype !== "video/mp4") {
// 				errors.push("Invalid video file");
// 			}
// 		});

// 		files?.thumbnail.forEach((file) => {
// 			if (!file?.originalname.endsWith(".png") || file?.mimetype !== "image/png") {
// 				errors.push("Invalid thumbnail file");
// 			}
// 		});

// 		// Check for validation errors
// 		if (errors.length) {
// 			req.body.errors = errors;
// 			res.status(400).json({ errors: errors });
// 		} else {
// 			// Pass sanitized body to controller
// 			req.body = {
// 				artist: req.body.artist.split(", ").map((tag) => tag.trim()),
// 				title: req.body.title,
// 				description: req.body.description,
// 				genre: req.body.genre,
// 				tags: req.body.tags.split(", ").map((tag) => tag.trim()),
// 			};
// 			next();
// 		}
// 	} catch (err) {
// 		console.error(err);
// 		return res.status(500);
// 	}
// };

module.exports = { validateEmailRegistration, validateEmailLogin, validateVideoUpload, validationHandler };
