import { Routes } from "@angular/router";
import { Login } from "./login/login";
 //import { Authservice } from "./service/authservice";
// import { provideHttpClient, withInterceptors } from "@angular/common/http";
// import { authInterceptorInterceptor } from "./service/auth-interceptor-interceptor";
// import { errorInterceptor } from "./service/error-interceptor";
 import { AuthEffects } from "./state/auth.effects";
 import { provideEffects } from "@ngrx/effects";
import { GoogleCallback } from "./google-callback/google-callback";

export const authRoutes: Routes = [
    {
        path: '', component: Login,
        // providers: [
        //     //Authservice,
        //    // provideHttpClient(withInterceptors([authInterceptorInterceptor, errorInterceptor])),
        //     //provideEffects(AuthEffects),
        // ]
    },
    // {
    //     path: 'auth/callback', component: GoogleCallback
    // }
]
