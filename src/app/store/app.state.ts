import { authReducer } from "../auth/state/auth.reducer";
import { AUTH_STATE_NAME } from "../auth/state/auth.selector";
import { AuthState } from "../auth/state/auth.state";
import { userReducer } from "../user-detail/state/user.reducer";
import { USER_STATE_NAME } from "../user-detail/state/user.selector";
import { UserDetailState } from "../user-detail/state/user.state";

export interface AppState {
    [AUTH_STATE_NAME]: AuthState;
    [USER_STATE_NAME]: UserDetailState;
}

export const AppReducer = {
    [AUTH_STATE_NAME]: authReducer,
    [USER_STATE_NAME]: userReducer,
}