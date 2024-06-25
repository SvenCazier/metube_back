const thinky = require("thinky")({
	db: "MeTube",
});
const r = thinky.r;
const type = thinky.type;

const User = thinky.createModel("User", {
	id: type.string(),
	email: type.string(),
	facebookId: type.string(),
	password: type.string(),
	admin: type.boolean().default(false),
	emailConfirmed: type.boolean().default(false),
	createdAt: type.date().default(r.now()),
	updatedAt: type.date().default(r.now()),
});

const UserInfo = thinky.createModel("UserInfo", {
	id: type.string(),
	name: type.string(),
	comments: [type.string()],
	createdAt: type.date().default(r.now()),
	updatedAt: type.date().default(r.now()),
});

module.exports = {
	User,
	UserInfo,
};
