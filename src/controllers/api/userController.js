var thinky = require('thinky')({
	db: "MeTube"
});
var type   = thinky.type;
const authQueries = require("../../queries/api/apiQueries");
const jwtHandler = require("../../middleware/jwtHandler");

const getAllUsers = (req, res) => {
	
	
	
	
    return res.status(200);
};

const getOneUser = (req, res) => {
    return res.status(200);
};

const createUser = (req, res) => {
    return res.status(200);
};

const updateUser = (req, res) => {
    return res.status(200);
};

const deleteUser = (req, res) => {
    return res.status(200);
};

module.exports = {
	getAllUsers,
	getOneUser,
	createUser,
	updateUser,
	deleteUser
}