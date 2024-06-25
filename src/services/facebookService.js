require("dotenv").config();
const axios = require("axios");
const path = require("path");
const fs = require("fs");

class FacebookService {
	/**
	 * Creates an instance of FacebookService.
	 */
	constructor(appId, appSecret) {
		this.appId = process.env.FACEBOOK_APP_ID;
		this.appSecret = process.env.FACEBOOK_SECRET;
	}

	/**
	 * Validates a Facebook access token.
	 * @param {string} accessToken - The Facebook access token to validate.
	 * @returns {Promise<Object>} - A promise that resolves to the token validation response.
	 * @throws {Error} - If an error occurs during the token validation.
	 */
	async debugToken(accessToken) {
		try {
			const response = await axios.get("https://graph.facebook.com/debug_token", {
				params: {
					input_token: accessToken,
					access_token: `${this.appId}|${this.appSecret}`, // Construct app access token
				},
			});
			return response.data;
		} catch (error) {
			console.error("Error validating access token:", error.message);
			throw error;
		}
	}

	/**
	 * Retrieves user information from Facebook using the provided access token.
	 * @param {string} accessToken - The Facebook access token.
	 * @returns {Promise<Object>} - A promise that resolves to the user information.
	 * @throws {Error} - If an error occurs while fetching user information.
	 */
	async getUserInfo(accessToken) {
		try {
			const response = await axios.get("https://graph.facebook.com/me", {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
				params: {
					fields: "id,name,email,picture",
				},
			});
			return transformUserInfo(response.data);
		} catch (error) {
			console.error("Error fetching user info from Facebook:", error.message);
			throw error;
		}
	}

	/**
	 * Saves a profile picture from the given URL to the specified directory.
	 * @param {string} dir - The directory where the profile picture will be saved.
	 * @param {string} id - The unique identifier for the profile picture.
	 * @param {string} url - The URL of the profile picture.
	 * @returns {Promise<string>} - A promise that resolves to the file path of the saved picture.
	 * @throws {Error} - If an error occurs while saving the profile picture.
	 */
	async saveProfilePicture(dir, id, url) {
		try {
			const filePath = path.join(dir, `${id}.png`);
			const response = await axios.get(url, { responseType: "arraybuffer" });
			fs.writeFileSync(filePath, Buffer.from(response.data), "binary");
			return filePath;
		} catch (error) {
			if (error?.response?.status === 404) {
				return null;
			}
			throw error;
		}
	}
}

const transformUserInfo = (userInfo) => {
	return {
		facebookId: userInfo.id,
		name: userInfo.name,
		email: userInfo.email,
		pictureUrl: userInfo.picture.data.url,
	};
};

module.exports = FacebookService;
