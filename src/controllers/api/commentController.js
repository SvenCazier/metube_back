const apiQueries = require("../../queries/api/apiQueries");
const jwtHandler = require("../../middleware/jwtHandler");

const getAllComments = (req, res) => {
	const queryParams = req.query;
	switch (Object.keys(queryParams).length) {
		case 1:
			if (!("u" in queryParams) && !("v" in queryParams)) {
				return res.sendStatus(400);
			}
		case 0:
			let searchParams = {};
			if ("u" in queryParams) {
				searchParams = { userID: queryParams.user };
			} else if ("v" in queryParams) {
				searchParams = { videoID: queryParams.video };
			}
			result = apiQueries
				.getAllComments(searchParams)
				.then((result) => {
					result.forEach((item) => {
						item.id = Buffer.from(item.id, "utf-8").toString("base64url");
					});
					return res.status(200).json(result);
				})
				.catch((err) => {
					return res.sendStatus(404);
				});
			break;
		default:
			return res.sendStatus(404);
	}

	console.log(queryParams);
	//const id = Buffer.from(req.params.id, 'base64url').toString('utf-8');
};

const getOneComment = (req, res) => {
	const id = Buffer.from(req.params.id, "base64url").toString("utf-8");
	return res.status(200).json({ comment: "Hello World" });
};

const createComment = (req, res) => {
	console.log(req.body);
	return res.status(500).json({ comment: "Hello World" });
	/*result = apiQueries.createComments()
	.then((result) => {
		result.forEach(item => {
			item.id = Buffer.from(item.id, 'utf-8').toString('base64url');
		});
		return res.status(201).json(result);
	})
	.catch((err) => {
		return res.sendStatus(500);
	});*/
};

const updateComment = (req, res) => {
	return res.status(200);
};

const deleteComment = (req, res) => {
	return res.status(200);
};

module.exports = {
	getAllComments,
	getOneComment,
	createComment,
	updateComment,
	deleteComment,
};
