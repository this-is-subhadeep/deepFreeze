export interface LoginUserRequest {
    _id: string,
    password: string
}

export interface LoginUserResponse {
    _id: string,
    email: string,
    access_level: string,
    token: string
}