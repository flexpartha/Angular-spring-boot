import { Routes } from '@angular/router';
import { canLoadGuard } from './auth/can-load.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadChildren: () => import('./auth/auth.routes').then(m => m.authRoutes)
        //loadComponent: () => import('./auth/login/login').then(m => m.Login)
    },
    {
        path: 'userlist',
        canMatch: [canLoadGuard],
        loadChildren: () => import('./user-detail/user.routes').then(m => m.userRoutes)
    }
];
