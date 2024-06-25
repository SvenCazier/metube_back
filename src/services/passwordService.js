const bcrypt = require("bcrypt");

const saltRounds = 14;

class PasswordService {
	static async hashPassword(password) {
		try {
			return await bcrypt.hash(password, saltRounds);
		} catch (error) {
			throw error;
		}
	}

	static async validatePassword(password, hash) {
		try {
			return await bcrypt.compare(password, hash);
		} catch (error) {
			throw error;
		}
	}
}

module.exports = PasswordService;
