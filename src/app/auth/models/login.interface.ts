export interface LoginResponse {
    "status": number,
    "message": string,
    "data": {
        "accessToken": string;
        "userName": string;
        "refreshToken"?: string;
    },
    "error": string,
}