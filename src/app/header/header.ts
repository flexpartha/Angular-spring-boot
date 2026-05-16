import { Component } from '@angular/core';import { Store } from '@ngrx/store';
import { logout } from '../auth/state/auth.action';
import { AuthState } from '../auth/state/auth.state';

@Component({
    selector: 'app-header',
    standalone: true,
    templateUrl: './header.html',
    styleUrl: './header.css'
})
export class Header {
    constructor(private store: Store<AuthState>) { }

    onLogout() {
        this.store.dispatch(logout());
    }
}
