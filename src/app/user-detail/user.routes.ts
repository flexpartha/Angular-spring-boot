import { Routes } from "@angular/router";
import { UserLoad } from "./user-load/user-load";
import { Userlist } from "./userlist/userlist";
import { Adduser } from "./adduser/adduser";
import { Edituser } from "./edituser/edituser";
import { provideState } from "@ngrx/store";
import { USER_LIST_FEATURE_KEY } from "./state/user.state";
import { userReducer } from "./state/user.reducer";
import { provideEffects } from "@ngrx/effects";
import { UserEffects } from "./state/user.effects";

export const userRoutes: Routes = [
    {
        path: '',
        component: UserLoad,
        providers: [
            provideState(USER_LIST_FEATURE_KEY, userReducer),
            provideEffects(UserEffects)
        ],
        children: [
            { path: '', component: Userlist },
            { path: 'add', component: Adduser },
            { path: 'edit/:id', component: Edituser }
        ]
    }
]