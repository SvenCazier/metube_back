const thinky = require("thinky")({
	db: "MeTube",
});
const r = thinky.r;
const type = thinky.type;

const Login = thinky.createModel("Login", {
	id: type.string(),
	userId: type.string(),
	ip: type.string(),
	useragent: type.string(),
	loginTpe: type.string(),
	createdAt: type.date().default(r.now()),
});

module.exports = Login;
