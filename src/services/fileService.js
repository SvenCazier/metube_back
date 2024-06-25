const path = require("path");
const fs = require("fs");

class FileService {
	static getChapters(data) {
		try {
			const lines = data.split("\n").slice(1);
			return lines
				.filter((line) => line.trim().length > 0)
				.map((line) => {
					const [chapter_name, , start_time] = line.split("\t");
					const [hours, minutes, seconds, frames] = start_time.split(":").map(Number);
					const start_time_ms = (hours * 60 * 60 + minutes * 60 + seconds) * 1000 + Math.round((frames / 24) * 1000);
					return { chapter_name: chapter_name, start_time: start_time_ms };
				});
		} catch (err) {
			throw err;
		}
	}
	static getLanguageCodes(subtitles) {
		return subtitles.map((subtitle) => {
			const filename = subtitle.originalname;
			return { langCode: filename.match(/\.([a-z]{2})\.vtt$/i)[1] };
		});
	}
	static storeFiles(dir, files, id) {
		for (const file of files) {
			const extension = getExtension(file.filename);
			const oldPath = file.path;
			const newPath = path.join(dir, `${id}${extension.languageCode ? extension.languageCode : ""}${extension.extension}`);
			fs.renameSync(oldPath, newPath);
		}
	}
}

const getExtension = (filename) => {
	// Regular expression to match the language code and extension
	const regex = /(\.\w{2,3})\.(\w{2,3})$/;
	const match = filename.match(regex);

	if (match) {
		// If there's a match, return the extension along with the language code
		return { languageCode: match[1], extension: `.${match[2]}` };
	} else {
		// If there's no language code, return just the extension
		return { extension: filename.slice(filename.lastIndexOf(".")) };
	}
};

module.exports = FileService;
