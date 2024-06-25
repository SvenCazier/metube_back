const thinky = require("thinky")({
	db: "MeTube",
});
const r = thinky.r;
const Query = thinky.Query;

const userModels = require("../../models/user");
const loginModel = require("../../models/login");

/**
 * Get user credentials with email.
 * @param {string} email - The user email.
 * @returns {Promise<string>} - A promise that resolves to an array with matching User objects.
 * @throws {Error} - If an error occurs while retrieving the matching users.
 */
const getUserByEmail = (email) => {
	return new Promise(async (resolve, reject) => {
		try {
			result = await userModels.User.filter({ email: email }).run();
			resolve(result);
		} catch (err) {
			reject(err);
		}
	});
};

/**
 * Get user credentials with facebook id.
 * @param {string} facebookId - The user facebook id.
 * @returns {Promise<string>} - A promise that resolves to an array with matching User objects.
 * @throws {Error} - If an error occurs while retrieving the matching users.
 */
const getUserByFacebookID = (facebookId) => {
	return new Promise(async (resolve, reject) => {
		try {
			result = await userModels.User.filter({ facebookId: facebookId }).run();
			resolve(result);
		} catch (err) {
			reject(err);
		}
	});
};

/**
 * Creates a user with email and password.
 * @param {string} email - The user email.
 * @param {string} password - The hashed user password.
 * @returns {Promise<string>} - A promise that resolves to a User object.
 * @throws {Error} - If an error occurs while creating the user credentials.
 */
const createUserWithEmail = (email, password) => {
	return new Promise(async (resolve, reject) => {
		try {
			result = await userModels.User.save({ email: email, password: password });
			resolve(result);
		} catch (err) {
			reject(err);
		}
	});
};

/**
 * Creates a user with Facebook credentials.
 * @param {string} facebookId - The user facebook id.
 * @param {string} email - The user email.
 * @returns {Promise<string>} - A promise that resolves to a User object.
 * @throws {Error} - If an error occurs while creating the user credentials.
 */
const createUserWithFacebook = (facebookId, email) => {
	return new Promise(async (resolve, reject) => {
		try {
			result = await userModels.User.save({ facebookId: facebookId, email: email });
			resolve(result);
		} catch (err) {
			reject(err);
		}
	});
};

/**
 * Creates user info.
 * @param {string} id - The user id.
 * @param {string} name - The user name.
 * @returns {Promise<string>} - A promise that resolves to a UserInfo object.
 * @throws {Error} - If an error occurs while creating the user info.
 */
const createUserInfo = (id, name) => {
	return new Promise(async (resolve, reject) => {
		try {
			result = await userModels.UserInfo.save({ id: id, name: name });
			resolve(result);
		} catch (err) {
			reject(err);
		}
	});
};

/**
 * Get user info.
 * @param {string} id - The user id.
 * @returns {Promise<string>} - A promise that resolves to a UserInfo object.
 * @throws {Error} - If an error occurs while retrieving the user info.
 */
const getUserInfo = (id) => {
	return new Promise(async (resolve, reject) => {
		try {
			result = await userModels.UserInfo.get(id);
			resolve(result);
		} catch (err) {
			reject(err);
		}
	});
};

/**
 * Updates user credentials.
 * @param {string} id - The user id.
 * @param {string | null} email - The user email.
 * @param {string | null} password - The hashed user password.
 * @param {string | null} facebookId - The user facebook id.
 * @returns {Promise<string>} - A promise that resolves to a User object.
 * @throws {Error} - If an error occurs while updating the user credentials.
 */
const updateUserCredentials = (id, email, password, facebookId) => {
	return new Promise(async (resolve, reject) => {
		try {
			const credentials = {};
			if (email !== null) {
				credentials.email = email;
			}
			if (password !== null) {
				credentials.password = password;
			}
			if (facebookId !== null) {
				credentials.facebookId = facebookId;
			}
			credentials.updatedAt = new Date();
			result = await userModels.User.get(id).update(credentials);
			resolve(result);
		} catch (err) {
			reject(err);
		}
	});
};

/**
 * Updates user info.
 * @param {string} id - The user id.
 * @param {string | null} name - The user email.
 * @returns {Promise<string>} - A promise that resolves to a UserInfo object.
 * @throws {Error} - If an error occurs while updating the user info.
 */
const updateUserInfo = (id, name) => {
	return new Promise(async (resolve, reject) => {
		try {
			const credentials = {};
			if (name !== null) {
				credentials.name = name;
			}
			credentials.updatedAt = new Date();
			result = await userModels.UserInfo.get(id).update(credentials);
			resolve(result);
		} catch (err) {
			reject(err);
		}
	});
};

/**
 * Creates Login record.
 * @param {string} id - The user id.
 * @param {string | null} ip - The user ip.
 * @param {string | null} useragent - The user useragent.
 * @returns {Promise<string>} - A promise that resolves to a Login object.
 * @throws {Error} - If an error occurs while recording the login.
 */
const logUserLogin = (id, ip, useragent, loginType) => {
	return new Promise(async (resolve, reject) => {
		try {
			result = await loginModel.save({ userId: id, ip: ip, useragent: useragent, loginType: loginType });
			resolve(result);
		} catch (err) {
			reject(err);
		}
	});
};

const deleteUser = (id) => {
	// delete everything with USER ID
};

module.exports = {
	getUserByEmail,
	getUserByFacebookID,
	createUserWithEmail,
	createUserWithFacebook,
	createUserInfo,
	getUserInfo,
	updateUserCredentials,
	updateUserInfo,
	logUserLogin,
	deleteUser,
};
