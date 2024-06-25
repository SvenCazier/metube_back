function errorResponse(errorCode) {
	let status, error;

	switch (errorCode) {
		case ErrorResponse.InvalidRequest:
			status = 400;
			error = { status, code: 40001, message: "Invalid Request" };
			break;
		case ErrorResponse.MissingAccessToken:
			status = 401;
			error = { status, code: 40101, message: "Missing Access Token" };
			break;
		case ErrorResponse.InvalidAccessToken:
			status = 401;
			error = { status, code: 40102, message: "Invalid Access Token" };
			break;
		case ErrorResponse.ExpiredAccessToken:
			status = 401;
			error = { status, code: 40103, message: "Expired Access Token" };
			break;
		case ErrorResponse.MissingRefreshToken:
			status = 401;
			error = { status, code: 40104, message: "Missing Refresh Token" };
			break;
		case ErrorResponse.InvalidRefreshToken:
			status = 401;
			error = { status, code: 40105, message: "Invalid Refresh Token" };
			break;
		case ErrorResponse.ExpiredRefreshToken:
			status = 401;
			error = { status, code: 40106, message: "Expired Refresh Token" };
			break;
		case ErrorResponse.MissingFacebookAccessToken:
			status = 401;
			error = { status, code: 40107, message: "Missing Facebook Access Token" };
			break;
		case ErrorResponse.InvalidFacebookAccessToken:
			status = 401;
			error = { status, code: 40108, message: "Invalid Facebook Access Token" };
			break;
		case ErrorResponse.InvalidUserCredentials:
			status = 401;
			error = { status, code: 40109, message: "Invalid User Credentials" };
		case ErrorResponse.Forbidden:
			status = 403;
			error = { status, code: 40301, message: "Forbidden" };
			break;
		case ErrorResponse.EmailNotConfirmed:
			status = 403;
			error = { status, code: 40302, message: "Email address has not been confirmed yet" };
			break;
		case ErrorResponse.ResourceNotFound:
			status = 404;
			error = { status, code: 40401, message: "Resource Not Found" };
			break;
		case ErrorResponse.UserExists:
			status = 409;
			error = { status, code: 40901, message: "An account with this email has already been registered" };
			break;
		case ErrorResponse.FileError:
			status = 422;
			error = { status, code: 42201, message: "Unprocessable file" };
			break;
		case ErrorResponse.InternalServerError:
		default:
			status = 500;
			error = { status, code: 50000, message: "Internal Server Error" };
			break;
	}

	this.status(status).json(error);
}

const ErrorResponse = {
	InvalidRequest: "INVALID_REQUEST",
	MissingAccessToken: "MISSING_ACCESS_TOKEN",
	InvalidAccessToken: "INVALID_ACCESS_TOKEN",
	ExpiredAccessToken: "EXPIRED_ACCESS_TOKEN",
	MissingRefreshToken: "MISSING_REFRESH_TOKEN",
	InvalidRefreshToken: "INVALID_REFRESH_TOKEN",
	ExpiredRefreshToken: "EXPIRED_REFRESH_TOKEN",
	MissingFacebookAccessToken: "MISSING_FACEBOOK_ACCESS_TOKEN",
	InvalidFacebookAccessToken: "INVALID_FACEBOOK_ACCESS_TOKEN",
	InvalidUserCredentials: "INVALID_USER_CREDENTIALS",
	Forbidden: "FORBIDDEN",
	EmailNotConfirmed: "EMAIL_NOT_CONFIRMED",
	ResourceNotFound: "RESOURCE_NOT_FOUND",
	UserExists: "USER_EXISTS",
	FileError: "FILE_ERROR",
	InternalServerError: "INTERNAL_SERVER_ERROR",
};

module.exports = { errorResponse, ErrorResponse };
