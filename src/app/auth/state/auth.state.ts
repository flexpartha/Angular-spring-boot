import { User } from "../models/user.interface";
export interface AuthState {
    user: User | null;
    errorMessage: string | null;
    successMessage: string | null;
    statusCode: number | null;
    isLoading: boolean;
}

export const initialState: AuthState = {
    user: null,
    errorMessage: null,
    successMessage: null,
    statusCode: null,
    isLoading: false
};