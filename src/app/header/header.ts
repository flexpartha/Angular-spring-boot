import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { logout } from '../auth/state/auth.action';
import { AuthState } from '../auth/state/auth.state';

@Component({
    selector: 'app-header',
    standalone: true,
    templateUrl: './header.html',
    styleUrl: './header.css'
})
export class Header {
    constructor(private store: Store<AuthState>, private router: Router) { }

    onLogout() {
        this.store.dispatch(logout());
        localStorage.removeItem('authToken');
        this.router.navigate(['/login']);
    }
}
