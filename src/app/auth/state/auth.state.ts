import { User } from "../models/user.interface";
export interface AuthState {
    user: User | null;
    errorMessage: string | null;
    successMessage: string | null;
    statusCode: number | null;
}

export const initialState: AuthState = {
    user: null,
    errorMessage: null,
    successMessage: null,
    statusCode: null
};