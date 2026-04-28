export interface LoginResponse {
    "status": number,
    "message": string,
    "data": {
        "accessToken": string;
        "refreshToken": string;
    },
    "error": string,
}